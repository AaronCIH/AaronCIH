import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';

const source = readFileSync(new URL('../src/components/ResearchCarousel.astro', import.meta.url), 'utf8').match(/<script>([\s\S]*?)<\/script>/)[1];
const script = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022 } }).outputText;

function setup({ visible = 3, reduced = false } = {}) {
  let perView = visible;
  let resize;
  const track = new EventTarget();
  const previous = new EventTarget();
  const next = new EventTarget();
  const controls = { hidden: true };
  const status = { textContent: '' };
  const calls = [];
  const cards = Array.from({ length: 5 }, () => ({ getBoundingClientRect: () => ({ width: (track.clientWidth - (perView - 1) * 20) / perView }) }));
  Object.assign(track, {
    clientWidth: 1000, scrollLeft: 0,
    querySelectorAll: () => cards,
    scrollTo: (options) => { calls.push(options); if (options.behavior === 'instant') track.scrollLeft = options.left; },
  });
  const elements = { '#research-carousel-track': track, '.research-carousel-controls': controls, '.carousel-previous': previous, '.carousel-next': next, '#research-carousel-status': status };
  runInNewContext(script, {
    document: { querySelector: selector => elements[selector] },
    matchMedia: () => ({ matches: reduced }),
    getComputedStyle: () => ({ columnGap: '20px' }),
    setTimeout: () => 1, clearTimeout: () => {},
    ResizeObserver: class { constructor(callback) { resize = callback; } observe() {} },
  });
  const endScroll = () => {
    track.scrollLeft = Math.min(calls.at(-1).left, (5 - perView) * (cards[0].getBoundingClientRect().width + 20));
    track.dispatchEvent(new Event('scrollend'));
  };
  return {
    track, previous, next, controls, status, calls, endScroll,
    click: button => button.dispatchEvent(new Event('click')),
    resize(count, width) { perView = count; track.clientWidth = width; resize(); },
  };
}

test('desktop arrows move 1–3 to 2–4 to 3–5, rather than jumping a full page', () => {
  const h = setup();
  assert.equal(h.controls.hidden, false);
  assert.equal(h.status.textContent, '1–3 / 5');
  assert.equal(h.previous.disabled, true);
  h.click(h.next);
  assert.equal(h.calls.at(-1).left, 340);
  h.endScroll();
  assert.equal(h.status.textContent, '2–4 / 5');
  h.click(h.next);
  assert.equal(h.calls.at(-1).left, 680);
  h.endScroll();
  assert.equal(h.status.textContent, '3–5 / 5');
  assert.equal(h.next.disabled, true);
  h.click(h.previous);
  h.endScroll();
  assert.equal(h.status.textContent, '2–4 / 5');
});

test('rapid clicks preserve one-card intent while a smooth scroll is in flight', () => {
  const h = setup();
  h.click(h.next);
  h.track.scrollLeft = 100;
  h.click(h.next);
  assert.equal(h.calls.at(-1).left, 680);
  h.click(h.previous);
  assert.equal(h.calls.at(-1).left, 340);
  h.endScroll();
  assert.equal(h.status.textContent, '2–4 / 5');
});

test('native scroll and responsive resize update position and boundary controls', () => {
  const h = setup({ visible: 1 });
  h.track.scrollLeft = 4080;
  h.track.dispatchEvent(new Event('scrollend'));
  assert.equal(h.status.textContent, '5–5 / 5');
  assert.equal(h.next.disabled, true);
  h.resize(3, 1200);
  assert.equal(h.status.textContent, '3–5 / 5');
  assert.equal(h.next.disabled, true);
  assert.equal(h.calls.at(-1).behavior, 'instant');
});

test('reduced motion uses instant one-card navigation', () => {
  const h = setup({ reduced: true });
  h.click(h.next);
  assert.equal(h.calls.at(-1).behavior, 'instant');
  assert.equal(h.track.scrollLeft, 340);
  h.endScroll();
  assert.equal(h.status.textContent, '2–4 / 5');
});

test('arrow keys navigate only when the carousel itself has focus, not video controls', () => {
  const h = setup();
  const right = new Event('keydown', { cancelable: true });
  Object.defineProperty(right, 'key', { value: 'ArrowRight' });
  h.track.dispatchEvent(right);
  assert.equal(right.defaultPrevented, true);
  assert.equal(h.calls.length, 1);
  const nested = new Event('keydown', { cancelable: true });
  Object.defineProperty(nested, 'key', { value: 'ArrowRight' });
  Object.defineProperty(nested, 'target', { value: {} });
  h.track.dispatchEvent(nested);
  assert.equal(nested.defaultPrevented, false);
  assert.equal(h.calls.length, 1);
});
