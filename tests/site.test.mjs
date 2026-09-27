import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dist = join(root, 'dist');
const base = '/AaronCIH/';
const routes = ['', 'publications', 'experience', 'awards', 'cv'];
const pages = new Map(routes.map(route => [
  route, readFileSync(join(dist, route, 'index.html'), 'utf8'),
]));

test('all five static pages have unique titles, one h1, navigation, and preview safeguards', () => {
  const titles = new Set();
  for (const [route, html] of pages) {
    assert.equal((html.match(/<h1[\s>]/g) ?? []).length, 1, `${route}: one primary heading`);
    const title = html.match(/<title>(.*?)<\/title>/)?.[1];
    assert.ok(title, `${route}: title`);
    titles.add(title);
    assert.match(html, /aria-label="Main navigation"/);
    assert.match(html, /name="robots" content="noindex, nofollow"/);
    assert.match(html, /Profile and bibliography details pending final review/);
    for (const target of routes) {
      assert.ok(html.includes(`href="${base}${target ? `${target}/` : ''}"`), `${route}: navigation to ${target}`);
    }
  }
  assert.equal(titles.size, 5);
});

test('internal links, assets, and anchors resolve under the project base path', () => {
  for (const [route, html] of pages) {
    for (const match of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
      const value = match[1];
      if (/^(https?:|mailto:|data:)/.test(value)) continue;
      const url = new URL(value, `https://example.test${base}${route ? `${route}/` : ''}`);
      assert.ok(url.pathname.startsWith(base), `${route}: path escapes base: ${value}`);
      const relative = decodeURIComponent(url.pathname.slice(base.length));
      const file = join(dist, relative, url.pathname.endsWith('/') ? 'index.html' : '');
      assert.ok(existsSync(file), `${route}: missing ${value}`);
      if (url.hash) {
        const targetHtml = readFileSync(file, 'utf8');
        assert.ok(targetHtml.includes(`id="${url.hash.slice(1)}"`), `${route}: missing anchor ${value}`);
      }
    }
    assert.doesNotMatch(html, /href="#"/);
    const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]);
    assert.equal(ids.length, new Set(ids).size, `${route}: duplicate element IDs`);
  }
});

test('supplied presentation IDs appear in both home and research page links', () => {
  for (const id of ['Jm1NkDDXN90', 'HQlP0R-xvfI', 'b_ltwfD9dLI']) {
    for (const route of ['', 'publications']) {
      assert.ok(pages.get(route).includes(`data-video="${id}"`), `${route}: missing supplied video ${id}`);
      assert.ok(pages.get(route).includes(`href="https://www.youtube.com/watch?v=${id}"`));
    }
  }
});

test('complete publication list and five story chapters are available without JavaScript', () => {
  const html = pages.get('publications');
  assert.equal((html.match(/\sdata-publication(?:\s|>)/g) ?? []).length, 13);
  assert.equal((html.match(/\sdata-chapter="/g) ?? []).length, 5);
  assert.equal((html.match(/class="inline-media /g) ?? []).length, 5);
  assert.match(html, /id="no-publications" hidden/);
  assert.match(html, /class="publication-filters" hidden/);
});

test('third-party players are not loaded before visitor interaction', () => {
  for (const html of pages.values()) {
    assert.doesNotMatch(html, /<iframe[\s>]/);
    assert.doesNotMatch(html, /<script[^>]+src="https?:\/\//);
    assert.doesNotMatch(html, /<img[^>]+src="https?:\/\//);
    assert.match(html, /<dialog id="video-dialog" aria-labelledby="video-title"/);
  }
});

test('CV is printable HTML with an honest missing-PDF state', () => {
  const html = pages.get('cv');
  assert.match(html, /Print \/ Save as PDF/);
  assert.match(html, /official CV PDF has not been supplied/);
  assert.doesNotMatch(html, /href="[^"]+\.pdf"/);
  for (const section of ['profile', 'education', 'experience', 'publications', 'awards']) {
    assert.ok(html.includes(`id="cv-${section}"`));
  }
});

test('external resources use HTTPS and full local figures use the base path', () => {
  for (const html of pages.values()) {
    for (const [anchor] of html.matchAll(/<a\s[^>]*>/g)) {
      if (anchor.includes('target="_blank"')) {
        assert.match(anchor, /rel="noopener noreferrer"/);
        assert.match(anchor, /href="(?:https:\/\/|\/AaronCIH\/_astro\/)/);
      }
    }
  }
});

test('all 19 original-site images are local PNGs with recorded dimensions and provenance', () => {
  const manifest = JSON.parse(readFileSync(join(root, 'src', 'data', 'image-sources.json'), 'utf8'));
  assert.equal(manifest.images.length, 19);
  assert.equal(new Set(manifest.images.map(image => image.id)).size, 19);
  for (const image of manifest.images) {
    const bytes = readFileSync(join(root, 'src', 'assets', 'legacy', `${image.id}.png`));
    assert.equal(bytes.subarray(0, 8).toString('hex'), '89504e470d0a1a0a', `${image.id}: PNG signature`);
    assert.deepEqual([bytes.readUInt32BE(16), bytes.readUInt32BE(20)], image.size, `${image.id}: preserved source dimensions`);
    assert.ok(image.page);
    assert.match(image.url, /^https:\/\/sites\.google\.com\//);
  }
});

test('portrait, real project figures, and organization logos replace placeholder artwork', () => {
  const home = pages.get('');
  const portrait = [...home.matchAll(/<img\s[^>]*>/g)].map(match => match[0]).find(tag => tag.includes('Portrait of I-Hsiang'));
  assert.ok(portrait);
  assert.match(portrait, /loading="eager"/);
  assert.match(portrait, /fetchpriority="high"/);
  assert.equal((home.match(/class="summary-logo"/g) ?? []).length, 5);
  assert.equal((pages.get('experience').match(/class="journey-logo"/g) ?? []).length, 5);
  assert.equal((pages.get('publications').match(/class="publication-thumbnail"/g) ?? []).length, 13);
  for (const html of pages.values()) {
    assert.doesNotMatch(html, /Concept illustration|research-art|A STUDY IN PERCEPTION/);
  }
});

test('responsive images have accessible alternatives, explicit dimensions, and valid local variants', () => {
  let images = 0;
  for (const html of pages.values()) {
    for (const [tag] of html.matchAll(/<img\s[^>]*>/g)) {
      images++;
      assert.match(tag, /alt="[^"]+"/);
      assert.match(tag, /width="[1-9]\d*"/);
      assert.match(tag, /height="[1-9]\d*"/);
      const srcset = tag.match(/srcset="([^"]+)"/)?.[1];
      if (!srcset) continue;
      for (const variant of srcset.split(',')) {
        const [url] = variant.trim().split(/\s+/);
        assert.ok(url.startsWith(base), `Image variant escapes base: ${url}`);
        assert.ok(existsSync(join(dist, decodeURIComponent(url.slice(base.length)))), `Missing image variant: ${url}`);
      }
    }
  }
  assert.ok(images >= 32, 'Portrait, logos, featured figures, and all publication thumbnails are rendered');
});

test('production HTML has a small, self-contained initial payload', () => {
  for (const [route, html] of pages) {
    assert.ok(Buffer.byteLength(html) < 220_000, `${route}: uncompressed HTML must stay under 220 KB`);
  }
  assert.ok(existsSync(join(dist, '404.html')));
  assert.match(readFileSync(join(dist, 'robots.txt'), 'utf8'), /Disallow: \//);
});

test('every publication exposes non-empty, unique tags from the new research areas', () => {
  const html = pages.get('publications');
  const areas = ['Image Generation and Editing', 'Multimodal Learning', 'Domain Generalization', 'Visual Understanding'];
  const rows = [...html.matchAll(/<article\b[^>]*\sdata-publication(?=\s|>)[^>]*>[\s\S]*?<\/article>/g)].map(match => match[0]);
  const membership = new Map();
  for (const row of rows) {
    const id = row.match(/data-publication-id="([^"]+)"/)?.[1];
    const tags = [...row.matchAll(/\sdata-topic="([^"]+)"/g)].map(match => match[1]);
    assert.ok(id);
    assert.ok(tags.length > 0, `${id}: needs a research area`);
    assert.equal(new Set(tags).size, tags.length, `${id}: duplicate tags`);
    assert.ok(tags.every(tag => areas.includes(tag)), `${id}: unknown research area`);
    membership.set(id, tags);
  }
  assert.equal(membership.size, 13);
  const expected = {
    'restore-assess-repeat': ['Image Generation and Editing', 'Multimodal Learning'],
    unirestore: ['Image Generation and Editing', 'Multimodal Learning', 'Visual Understanding'],
    robustvisrag: ['Multimodal Learning', 'Visual Understanding'],
    pdaf: ['Domain Generalization', 'Visual Understanding'],
    apgcc: ['Visual Understanding'],
    'semantic-dehazing': ['Image Generation and Editing', 'Visual Understanding'],
    rvsl: ['Visual Understanding', 'Domain Generalization'],
    sjdl: ['Visual Understanding', 'Domain Generalization'],
  };
  for (const [id, tags] of Object.entries(expected)) assert.deepEqual(membership.get(id), tags, id);
  const selector = html.match(/<select[^>]*id="filter-topic"[^>]*>([\s\S]*?)<\/select>/)?.[1];
  assert.ok(selector);
  const options = [...selector.matchAll(/<option value="([^"]+)"/g)].map(match => match[1]);
  assert.deepEqual(options, ['all', ...areas.toSorted()]);
  assert.doesNotMatch(selector, /Image restoration|Crowd understanding|Re-identification/);
});

test('home research cards show the same multiple categories as the publication index', () => {
  const cards = [...pages.get('').matchAll(/<article class="research-card">[\s\S]*?<\/article>/g)].map(match => match[0]);
  const tags = cards.map(card => [...card.matchAll(/\sdata-topic="([^"]+)"/g)].map(match => match[1]));
  assert.deepEqual(tags, [
    ['Image Generation and Editing', 'Multimodal Learning', 'Visual Understanding'],
    ['Domain Generalization', 'Visual Understanding'],
    ['Visual Understanding'],
  ]);
});

test('sticky preview controls stay outside changing panels so restored focus cannot freeze scrolling', () => {
  const stage = pages.get('publications').match(/<aside class="sticky-stage"[\s\S]*?<\/aside>/)?.[0];
  assert.ok(stage);
  for (const control of ['figure', 'video', 'source']) {
    assert.equal((stage.match(new RegExp(String.raw`\sdata-stage-${control}(?=\s|>)`, 'g')) ?? []).length, 1);
  }
  assert.equal((stage.match(/\sdata-panel="/g) ?? []).length, 5);
  const panels = [];
  for (const [tag] of stage.matchAll(/<\/?div\b[^>]*>|<(?:a|button)\b[^>]*>/g)) {
    if (tag.startsWith('</div')) panels.pop();
    else if (tag.startsWith('<div')) panels.push(/\bclass="stage-panel"/.test(tag));
    else assert.ok(!panels.includes(true), 'Interactive links must not be hidden with figure panels');
  }
});

test('April 2026 acceptances are distinct news items with the correct project links', () => {
  const items = [...pages.get('').matchAll(/<a class="news-item"[\s\S]*?<\/a>/g)].map(match => match[0]);
  assert.match(items[0], /Apr 2026/);
  assert.match(items[0], /Restore, Assess, Repeat has been accepted to CVPR 2026\./);
  assert.match(items[0], /href="\/AaronCIH\/publications\/#restore-assess-repeat"/);
  assert.match(items[1], /Apr 2026/);
  assert.match(items[1], /RobustVisRAG has been accepted to CVPR 2026\./);
  assert.match(items[1], /href="\/AaronCIH\/publications\/#robustvisrag"/);
  assert.doesNotMatch(pages.get(''), /join the research collection/);
});

test('Home uses a five-card summary linked to full Experience entries', () => {
  const home = pages.get('');
  assert.match(home, /class="experience-summary"/);
  assert.doesNotMatch(home, /class="journey-timeline"/);
  assert.equal((home.match(/class="experience-summary-card"/g) ?? []).length, 5);
  for (const id of ['samsung', 'mediatek', 'asml', 'capacura', 'itri']) {
    assert.ok(home.includes(`href="${base}experience/#${id}"`));
    assert.ok(pages.get('experience').includes(`id="${id}"`));
  }
});

test('all capability teaser assets are local and source GIF conversions stay under the media budget', () => {
  const { sources } = JSON.parse(readFileSync(join(root, 'src', 'data', 'teaser-sources.json'), 'utf8'));
  assert.equal(sources.length, 6);
  assert.equal(sources.filter(source => source.animated).length, 4);
  assert.equal(sources.find(source => source.id === 'rar').page, 'https://github.com/saic-fi/RAR/blob/main/assets/teaser.gif');
  assert.equal(sources.find(source => source.id === 'unirestore').page, 'https://github.com/unirestore/UniRestore/blob/main/assets/teaser.gif');
  let total = 0;
  for (const source of sources) {
    const poster = readFileSync(join(root, 'src', 'assets', 'teasers', `${source.id}.webp`));
    assert.equal(poster.toString('ascii', 8, 12), 'WEBP');
    if (!source.animated) continue;
    const video = readFileSync(join(root, 'src', 'assets', 'teasers', `${source.id}.mp4`));
    assert.equal(video.toString('ascii', 4, 8), 'ftyp');
    assert.ok(video.length < 1_000_000, `${source.id}: clip exceeds 1 MB`);
    assert.ok(source.durationSeconds > 0);
    total += video.length;
  }
  assert.ok(total < 2_000_000, 'Combined animated previews exceed 2 MB');
});

test('RobustVisRAG shows both labeled results in sticky and inline previews', () => {
  const html = pages.get('publications');
  const galleries = [...html.matchAll(/<div class="teaser-gallery">[\s\S]*?<\/div>/g)].map(match => match[0]);
  assert.equal(galleries.length, 2);
  for (const gallery of galleries) {
    const labels = [...gallery.matchAll(/<figcaption>([^<]+)<\/figcaption>/g)].map(match => match[1]);
    assert.deepEqual(labels, ['Retrieve', 'Generation']);
    assert.equal((gallery.match(/<img\b/g) ?? []).length, 2);
    assert.match(gallery, /robustvisrag\./);
    assert.match(gallery, /robustvisrag-generation\./);
    assert.match(gallery, /alt="Retrieving the relevant visual document/);
    assert.match(gallery, /alt="Comparing generated answers/);
  }
  const { sources } = JSON.parse(readFileSync(join(root, 'src', 'data', 'teaser-sources.json'), 'utf8'));
  const generation = sources.find(source => source.id === 'robustvisrag-generation');
  assert.equal(generation.url, 'https://robustvisrag.github.io/robustvisrag_files/gen/gen_sample2_.png');
  assert.equal(generation.animated, false);
});

test('teasers start with accessible posters and no unconditional video downloads', () => {
  const html = pages.get('publications');
  const videos = [...html.matchAll(/<video\b[^>]*>/g)].map(match => match[0]);
  assert.equal(videos.length, 8, 'Four animated teasers in desktop and linear layouts');
  for (const tag of videos) {
    assert.match(tag, /\spreload="none"/);
    assert.match(tag, /\smuted(?:\s|>)/);
    assert.match(tag, /\scontrols(?:\s|>)/);
    assert.match(tag, /\sloop(?:\s|>)/);
    assert.match(tag, /\splaysinline(?:\s|>)/);
    assert.match(tag, /\shidden(?:\s|>)/);
    assert.match(tag, /aria-label="[^"]+"/);
    assert.doesNotMatch(tag, /\ssrc="/);
    const src = tag.match(/data-src="([^"]+)"/)?.[1];
    assert.ok(src?.startsWith(base));
    assert.ok(existsSync(join(dist, src.slice(base.length))));
  }
  assert.doesNotMatch(html, /data-(?:teaser|motion)-toggle/);
  assert.match(html, /Previews play silently while visible/);
  assert.equal((html.match(/class="teaser-caption"/g) ?? []).length, 8);
});

test('desktop scroll switching is independent of reduced-motion preference', () => {
  const source = readFileSync(join(root, 'src', 'pages', 'publications.astro'), 'utf8');
  assert.match(source, /matchMedia\('\(min-width: 960px\) and \(min-height: 700px\)'\)/);
  assert.doesNotMatch(source, /prefers-reduced-motion/);
  const styles = readFileSync(join(root, 'src', 'styles', 'global.css'), 'utf8');
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /animation: none !important; transition: none !important/);
});

test('Pages deployment builds and tests before uploading a base-path-safe static site', () => {
  const workflow = readFileSync(join(root, '.github', 'workflows', 'deploy.yml'), 'utf8');
  assert.match(workflow, /branches: \[main\]/);
  assert.match(workflow, /node-version: '24'/);
  assert.ok(workflow.indexOf('npm run build') < workflow.indexOf('npm test'));
  assert.ok(workflow.indexOf('npm test') < workflow.indexOf('actions/upload-pages-artifact'));
  assert.match(workflow, /deploy:\s+if: github\.event_name != 'pull_request'/);
  assert.match(workflow, /pages: write/);
  assert.match(workflow, /id-token: write/);
  assert.ok(existsSync(join(dist, '.nojekyll')));
  assert.ok(existsSync(join(dist, 'social.png')));
});
