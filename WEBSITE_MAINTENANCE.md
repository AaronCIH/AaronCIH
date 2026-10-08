# Website Maintenance Guide

This document preserves the website's implementation, content-editing, testing, and deployment notes for future maintenance. Read it before changing the site.

[README.md](README.md) is the public GitHub profile and portfolio for `AaronCIH`. Keep installation commands, implementation details, and maintenance notes here rather than in the profile README.

A static, five-page Astro + TypeScript website: Home, Publications, Experience, Awards, and CV. The blue-and-white design pairs a portrait-led homepage with compact experience cards and animated research capability previews.

## Run locally

Requires Node.js 22.12+ (Node 24 LTS recommended) and npm.

```powershell
npm ci
npm run dev
```

Open **http://localhost:4321/AaronCIH/**. The `/AaronCIH/` base path is intentional: it matches the proposed GitHub Pages project site.

For a production preview:

```powershell
npm run check
npm run build
npm test
npm run preview -- --host 127.0.0.1 --port 4321
```

The tests inspect the built output, so run the build before `npm test`. Tests use Node's built-in runner; no test service is required.

## What works

- Five independently addressable static pages and responsive navigation.
- A portrait-led homepage with larger research-focus labels and five experience cards in a horizontal row. Smaller screens can scroll the card strip without scrolling the whole page sideways.
- The Experience page keeps every logo on the left and its corresponding text on the right; mobile rows stack logo above text.
- Separate April 2026 CVPR acceptance news for RAR and RobustVisRAG, each linked to its own project.
- Home's selected-research carousel contains Restore. Assess. Repeat. (RAR), RobustVisRAG, UniRestore, PDAF, and APGCC, in that order. Desktop shows three cards, tablet two, and mobile one; each arrow click advances exactly one card, with boundary states and a visible range indicator. Update `homeOrder` in [research.ts](src/data/research.ts) to change this ordering.
- Home thumbnails reuse the Publications teasers, including the RobustVisRAG Retrieve / Generation pair. Videos autoplay only while visible and pause when horizontally scrolled out of view.
- Five selected research stories with capability teasers on the left and explanations on the right.
- Linear illustrated stories on mobile, short screens, or without JavaScript. Desktop scroll switching remains available when the device requests reduced motion; CSS transitions and smooth scrolling are disabled for that preference.
- A 13-paper index with real project thumbnails, multiple research tags per paper, year / research-area filters, counts, reset, and an empty state.
- Research details, Paper / Project / Code links, and video playback in an accessible native dialog.
- The supplied UniRestore, PDAF, and APGCC videos, plus RAR and RobustVisRAG.
- YouTube players load only after a click, with an external playback alternative; closing a dialog removes the player and restores focus.
- Sticky figure/video/source controls remain mounted outside the changing figure panels. Their targets follow the selected project without moving keyboard focus or freezing scrolling after a video closes.
- Teaser animations play silently only while visible, without an extra start button. Native video controls allow pause/resume; a manual pause is preserved when leaving and returning to the project.
- Home news archive, experience timeline, education cards, awards, and a printable HTML CV.
- Project-base-aware URLs, a custom 404 page, no external fonts, and no tracking.

The abstract concept illustrations have been replaced with actual project material. Full-size figure and source links are available in the research stories. This version does not include a live model-inference service; a `demo` URL can be added when a real hosted demo is available.

### Home carousel navigation

The carousel uses native horizontal scrolling and CSS scroll snap, not automatic slide rotation. Its arrows keep a pending target during smooth scrolling so repeated clicks advance one card per click instead of jumping an entire viewport. The left/right arrow keys work when the carousel region itself is focused, without intercepting native video controls. Reduced-motion preference makes card navigation instant.

Touch/trackpad scrolling, focus navigation, and resizing update the range and boundary buttons. Without JavaScript, all five cards and static media remain accessible in the horizontally scrollable region; nonfunctional buttons stay hidden. Thumbnail videos are not wrapped in links, so their native controls remain usable. Project titles and resource links provide navigation.

## Research categories

Each publication has a non-empty `topics` array, using one or more of:

- Image Generation and Editing
- Multimodal Learning
- Domain Generalization
- Visual Understanding

The research-area selector chooses one category at a time. Papers appear under **every assigned category**, combined with the selected year; each paper is still listed only once. Home research cards, featured stories, and the publication index share the same tags. Formal paper titles are unchanged.

| Work | Categories |
| --- | --- |
| RAR | Image Generation and Editing; Multimodal Learning |
| UniRestore | Image Generation and Editing; Multimodal Learning; Visual Understanding |
| RobustVisRAG | Multimodal Learning; Visual Understanding |
| PDAF | Domain Generalization; Visual Understanding |
| RVSL / SJDL-Vehicle | Visual Understanding; Domain Generalization |
| APGCC | Visual Understanding |
| Semantic Guidance | Image Generation and Editing; Visual Understanding |
| Other restoration papers | Image Generation and Editing |

## Image sources and optimization

The 19 local assets comprise one portrait, 13 research images, and five organization logos. They were migrated at the user's request from the [previous homepage](https://sites.google.com/view/cihsiang/home), [publications](https://sites.google.com/view/cihsiang/publication-project), and [experience page](https://sites.google.com/view/cihsiang/experience).

- The old Google Sites images were captured through the browser and normalized to the images' intrinsic dimensions. They are rendered copies, not untouched original uploads.
- Cropped thumbnails for PDAF, APGCC, and RobustVisRAG were replaced with complete figures downloaded from their linked project websites.
- [image-sources.json](src/data/image-sources.json) records each source URL, source page, dimensions, and retrieval date. Original research figures and organization marks retain their respective ownership.
- [Local PNG assets](src/assets/legacy) make the build independent of the old site's image URLs and cookies. The site does not hotlink them.
- Astro produces responsive WebP variants with explicit dimensions, descriptive alternative text, lazy-loaded secondary images, and an eager high-priority portrait. The selected sticky figure is explicitly loaded when revealed.
- Research figures use `object-fit: contain`; their labels are not cropped to fill a card. Existing cropping in historical thumbnails cannot be reconstructed.
- The attached reference screenshots informed layout and color only. The other person's portrait and website assets were not reused.

### Capability teasers

The selected-research preview uses result demonstrations rather than architecture diagrams:

- **RAR:** the [provided teaser GIF](https://github.com/saic-fi/RAR/blob/main/assets/teaser.gif).
- **UniRestore:** the [provided teaser GIF](https://github.com/unirestore/UniRestore/blob/main/assets/teaser.gif).
- **PDAF:** a baseline-versus-PDAF segmentation animation from its project page.
- **APGCC:** an animated crowd-localization example from its project page.
- **RobustVisRAG:** two stacked result figures from its project page, labeled **Retrieve** and **Generation**, in both the sticky desktop preview and inline mobile stories.

[teaser-sources.json](src/data/teaser-sources.json) records provenance, durations, and poster timestamps. The original GIFs total over 42 MB; their four silent H.264 MP4 conversions total under 1.8 MB. FFmpeg converts them at 15 fps, at most 960 px wide, with CRF 24, `yuv420p`, no audio, and fast-start metadata. Full animation durations are preserved. Representative WebP posters provide a readable static alternative.

The converted files are committed in [teaser assets](src/assets/teasers); neither FFmpeg nor downloads from the original sites are needed to build or deploy. Videos have no initial `src` and use `preload="none"`. They start muted when visible and pause offscreen, in background tabs, and while a full presentation dialog is open. A visitor's native-control pause is not overridden when visibility changes.

At the owner's request, research demonstration videos autoplay independently of the device's reduced-motion preference; this preference still suppresses decorative CSS transitions and smooth scrolling. Native controls provide an immediate way to pause motion. Browsers may block autoplay despite muting: in that case the player stays available with an explicit explanation and can be started manually. Actual media errors show a static poster and a separate error message. “View full figure” still opens the original research figure, while “Source” points to the teaser source.

## Updating content

| File | Purpose |
| --- | --- |
| [research.ts](src/data/research.ts) | Publications, feature stories, topics, paper links, and YouTube IDs |
| [profile.ts](src/data/profile.ts) | Profile, experience, education, awards, and news |
| [media.ts](src/data/media.ts) | Typed local image imports, alternatives, and source-page links |
| [ProjectImage.astro](src/components/ProjectImage.astro) | Optimized project figures and thumbnails |
| [ExperienceTimeline.astro](src/components/ExperienceTimeline.astro) | Full Experience rows, consistently logo-left and text-right |
| [ExperienceSummary.astro](src/components/ExperienceSummary.astro) | Horizontal Home cards linking to full Experience entries |
| [ResearchCarousel.astro](src/components/ResearchCarousel.astro) | Five animated Home cards, single-card navigation, and responsive range controls |
| [TeaserMedia.astro](src/components/TeaserMedia.astro) | Viewport-aware autoplay, native controls, and user-pause preservation |
| [teasers.ts](src/data/teasers.ts) | Teaser posters, clips, captions, and source links |
| [ResearchTopics.astro](src/components/ResearchTopics.astro) | Shared multi-category tags for cards, stories, and the publication index |
| [ResourceLinks.astro](src/components/ResourceLinks.astro) | Optional resource buttons; absent links are omitted |
| [global.css](src/styles/global.css) | Design tokens, responsive layouts, reduced-motion and print styles |
| [Layout.astro](src/layouts/Layout.astro) | Common navigation, metadata, footer, and preview safeguards |
| [astro.config.mjs](astro.config.mjs) | Site URL and GitHub Pages base path |

Use a YouTube **video ID**, not an embed URL, in `video`. Paper years and award dates should retain their actual precision. Optional links should be omitted rather than filled with `#`.

When replacing media, update both the local asset and its source record. The 32 tests cover routes, images, category membership, stable controls, news, experience links, teaser budgets, deployment configuration, and single-card carousel movement (including rapid clicks, native scrolling, resize, keyboard controls, and reduced motion). Playback tests execute the component's real client script with controlled media events to verify autoplay, automatic versus user pauses, autoplay denial, and media-error fallback. Browser checks additionally verify desktop scroll switching and autoplay with both reduced and normal motion settings, native pause/resume, and post-presentation scrolling.

## Publish to GitHub Pages

Repository: <https://github.com/AaronCIH/AaronCIH>

Expected deployed URL: **https://aaroncih.github.io/AaronCIH/**

[The deployment workflow](.github/workflows/deploy.yml) installs with `npm ci`, checks types, builds, runs tests, and only then uploads/deploys the static artifact. Pull requests run validation without deploying. Node 24 is used in CI; no FFmpeg installation is needed.

Publishing requires authenticated write access to the repository:

```powershell
gh auth login --web --git-protocol https --scopes workflow
git push -u origin main
```

In the repository's **Settings → Pages**, select **GitHub Actions** as the source. Then run or rerun **Build and deploy website** in Actions:

```powershell
gh workflow run deploy.yml --repo AaronCIH/AaronCIH --ref main
gh run list --repo AaronCIH/AaronCIH --workflow deploy.yml
```

If the first push starts a deployment before Pages is enabled, rerun the workflow after changing that setting. Confirm the deploy job succeeds and test the root page plus `/publications/`, `/experience/`, `/awards/`, and `/cv/` under the `/AaronCIH/` prefix. Direct loads, images, clips, and refreshes must work; a successful Git push alone is not a verified deployment.

## Preview limitations and publishing checklist

This is a profile preview, not a finalized academic CV. The workflow and URL above describe the deployment configuration; GitHub authentication and successful deployment must be verified separately.

- The latest official CV PDF has not been supplied. “Print / Save as PDF” prints the clearly labeled web preview, not an official CV.
- Current affiliation, degree timeline, several historical dates, and complete author lists still require review. The demo avoids asserting an unverified current role and labels abbreviated citations.
- The local project has been initialized on `main` with the supplied repository as `origin`. Never force-push over remote work.
- Indexing is deliberately blocked by `noindex, nofollow` and [robots.txt](public/robots.txt). Remove these only after content review and intentional publication.
- The SVG social artwork is retained as a design source; the generated PNG is used in Open Graph metadata.
- Confirm the repository name before deploying. `AaronCIH/AaronCIH` maps to `https://aaroncih.github.io/AaronCIH/`; a user-root site requires `AaronCIH.github.io`.
- Check all external papers, datasets, project links, and videos before release. They are outside this site's control.
- Browser checks should cover 360 / 768 / 1440 px, normal and reduced motion, keyboard navigation, filtering, video close / Escape, no-JavaScript reading, and CV print layout.

Original profile source: [previous personal website](https://sites.google.com/view/cihsiang/home). Research descriptions were rewritten from the linked project abstracts. No paid MotionSites assets or templates are used.
