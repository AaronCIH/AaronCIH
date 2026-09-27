import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';

const component = readFileSync(new URL('../src/components/TeaserMedia.astro', import.meta.url), 'utf8');
const source = component.match(/<script>([\s\S]*?)<\/script>/)[1];
const script = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022 } }).outputText;
const flush = () => new Promise(resolve => setImmediate(resolve));

function setup({ blocked = false } = {}) {
  const poster = { hidden: false };
  const error = { hidden: true, textContent: '' };
  const dialog = { open: false };
  const notices = [];
  const document = new EventTarget();
  document.hidden = false;
  let intersection;
  let dialogChanged;
  let visible = false;
  const container = {
    querySelector: selector => selector === '[data-teaser-poster]' ? poster : error,
    getClientRects: () => visible ? [{}] : [],
  };
  const video = new EventTarget();
  Object.assign(video, {
    dataset: { src: '/AaronCIH/_astro/teaser.mp4' },
    paused: true, hidden: true, muted: false, calls: 0, blocked,
    closest: () => container,
    getAttribute: () => video.src ?? null,
    pause() {
      if (video.paused) return;
      video.paused = true;
      queueMicrotask(() => video.dispatchEvent(new Event('pause')));
    },
    play() {
      video.calls++;
      if (video.blocked) return Promise.reject(new DOMException('Autoplay denied', 'NotAllowedError'));
      if (video.paused) {
        video.paused = false;
        queueMicrotask(() => video.dispatchEvent(new Event('play')));
      }
      return Promise.resolve();
    },
  });
  document.querySelector = () => dialog;
  document.querySelectorAll = () => [video];
  runInNewContext(script, {
    document, DOMException,
    console: { warn: (...message) => notices.push(message), error: (...message) => notices.push(message) },
    IntersectionObserver: class {
      constructor(callback) { intersection = callback; }
      observe() {}
    },
    MutationObserver: class {
      constructor(callback) { dialogChanged = callback; }
      observe() {}
    },
  });
  return {
    video, poster, error, notices,
    show(value) {
      visible = value;
      intersection([{ target: container, isIntersecting: value }]);
    },
    setDialog(open) { dialog.open = open; dialogChanged(); },
    setBackground(hidden) { document.hidden = hidden; document.dispatchEvent(new Event('visibilitychange')); },
  };
}

test('teasers do not download offscreen, and autoplay muted on entry without a start button', async () => {
  const h = setup();
  assert.equal(h.video.src, undefined);
  h.show(true);
  await flush();
  assert.equal(h.video.src, '/AaronCIH/_astro/teaser.mp4');
  assert.equal(h.video.paused, false);
  assert.equal(h.video.muted, true);
  assert.equal(h.video.hidden, false);
  assert.equal(h.poster.hidden, true);
});

test('automatic pauses resume when returning onscreen or closing a presentation', async () => {
  const h = setup();
  h.show(true);
  await flush();
  for (const [pause, resume] of [
    [() => h.show(false), () => h.show(true)],
    [() => h.setDialog(true), () => h.setDialog(false)],
    [() => h.setBackground(true), () => h.setBackground(false)],
  ]) {
    pause();
    await flush();
    assert.equal(h.video.paused, true);
    resume();
    await flush();
    assert.equal(h.video.paused, false);
  }
});

test('a native user pause is preserved across scroll, dialog, and visibility changes', async () => {
  const h = setup();
  h.show(true);
  await flush();
  h.video.pause();
  await flush();
  h.show(false);
  h.show(true);
  h.setDialog(true);
  h.setDialog(false);
  h.setBackground(true);
  h.setBackground(false);
  await flush();
  assert.equal(h.video.paused, true);
  assert.equal(h.video.calls, 1);
  await h.video.play();
  await flush();
  assert.equal(h.video.paused, false);
});

test('blocked autoplay keeps usable native controls and explains how to start manually', async () => {
  const h = setup({ blocked: true });
  h.show(true);
  await flush();
  assert.equal(h.video.hidden, false);
  assert.equal(h.video.paused, true);
  assert.equal(h.error.hidden, false);
  assert.match(h.error.textContent, /browser blocked autoplay/);
  assert.equal(h.notices.length, 1);
  h.show(false);
  h.show(true);
  assert.equal(h.video.calls, 1, 'do not repeatedly retry blocked autoplay');
  h.video.blocked = false;
  await h.video.play();
  await flush();
  assert.equal(h.error.hidden, true);
  assert.equal(h.video.paused, false);
});

test('media errors surface explicitly and restore the static poster', async () => {
  const h = setup();
  h.show(true);
  await flush();
  h.video.error = { code: 3 };
  h.video.dispatchEvent(new Event('error'));
  await flush();
  assert.equal(h.video.paused, true);
  assert.equal(h.video.hidden, true);
  assert.equal(h.poster.hidden, false);
  assert.equal(h.error.hidden, false);
  assert.equal(h.notices.length, 1);
});
