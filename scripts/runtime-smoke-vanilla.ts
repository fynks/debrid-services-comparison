// Runtime smoke test for the **vanilla** build.
//
// The static markup (header, hero, benefits, footer, section headers,
// alert boxes) now lives in dist/index.html. The dynamic bits
// (host-support-table, service-comparison, pricing-table, etc.) are
// mounted by the JS bundle into `[data-mount="…"]` placeholders.
//
// What this verifies:
//   - dist/index.html is well-formed and contains all required sections.
//   - All bundled JS chunks load and execute without throwing.
//   - The dynamic components mount into their placeholders.
//   - No console errors during boot.

import jsdom, { VirtualConsole } from 'jsdom';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const { JSDOM } = jsdom;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, '..');
const DIST = resolve(ROOT, 'dist');

let failures = 0;
function assert(cond: boolean, msg: string) {
  if (!cond) {
    failures++;
    console.error('  ✗', msg);
  } else {
    console.log('  ✓', msg);
  }
}

const jsDir = resolve(DIST, 'assets/js');
const indexPath = resolve(DIST, 'index.html');
if (!existsSync(jsDir) || !existsSync(indexPath)) {
  console.error('dist missing — run `npm run build` first');
  process.exit(1);
}

const indexHtml = readFileSync(indexPath, 'utf8');

// Find the bundled entry.
const entry = readdirSync(jsDir).find(
  (f) => f.startsWith('index-') && f.endsWith('.js'),
);
assert(!!entry, `entry bundle present (${entry})`);
if (!entry) process.exit(1);

// Strip the inline <script type="module"> tags from the HTML so we
// can drive the page manually via Node-side imports. (jsdom doesn't
// execute ES modules natively; we polyfill globals and import the
// entry bundle ourselves.)
const htmlNoScript = indexHtml.replace(
  /<script[^>]*type="module"[^>]*>[\s\S]*?<\/script>/g,
  ''
);

const errors: string[] = [];
const virtualConsole = new VirtualConsole();
virtualConsole.on('jsdomError', (err) =>
  errors.push(`jsdomError: ${err.message}`),
);
virtualConsole.on('error', (...args) =>
  errors.push(`console.error: ${args.map(String).join(' ')}`),
);

const dom = new JSDOM(htmlNoScript, {
  url: 'http://localhost/',
  pretendToBeVisual: true,
  virtualConsole,
});

const win = dom.window as unknown as Record<string, unknown>;
const G = globalThis as unknown as Record<string, unknown>;
const assign = (k: string, v: unknown) => {
  try {
    G[k] = v;
  } catch {
    /* ignore read-only globals */
  }
};
assign('window', win);
assign('document', win.document);
assign('navigator', win.navigator);
assign('HTMLElement', win.HTMLElement);
assign('Element', win.Element);
assign('Node', win.Node);
assign('NodeList', win.NodeList);
assign('NodeFilter', win.NodeFilter);
assign('Event', win.Event);
assign('CustomEvent', win.CustomEvent);
assign('MouseEvent', win.MouseEvent);
assign('MutationObserver', win.MutationObserver);
assign('HTMLFormElement', win.HTMLFormElement);
assign('HTMLInputElement', win.HTMLInputElement);
assign('HTMLButtonElement', win.HTMLButtonElement);
assign('HTMLDivElement', win.HTMLDivElement);
assign('HTMLSpanElement', win.HTMLSpanElement);
assign('HTMLAnchorElement', win.HTMLAnchorElement);
assign('DocumentFragment', win.DocumentFragment);
assign('ShadowRoot', win.ShadowRoot);
assign('getComputedStyle', win.getComputedStyle.bind(win));
const polyMatchMedia = (q: string) =>
  ({
    matches: false,
    media: q,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }) as unknown as MediaQueryList;
assign('matchMedia', polyMatchMedia);
(win as Record<string, unknown>).matchMedia = polyMatchMedia;
assign('requestAnimationFrame', (cb: FrameRequestCallback) =>
  setTimeout(() => cb(performance.now()), 16) as unknown as number,
);
assign('cancelAnimationFrame', (h: number) => clearTimeout(h));
assign('localStorage', win.localStorage);

// Verify static sections are present in the HTML before JS even runs.
const checkIds = [
  'what-are-debrid-services',
  'debrid-pricing-comparison',
  'supported-file-hosts',
  'compare-debrid-services',
  'usenet-support',
  'service-status-monitoring',
  'refund-policies-legal',
  'debrid-resources-tools',
  'disclaimers',
];
for (const id of checkIds) {
  const el = dom.window.document.getElementById(id);
  assert(!!el, `section #${id} present in static HTML`);
}

// Verify static markup pieces.
const headerEl = dom.window.document.querySelector('header');
assert(!!headerEl, 'site header present');
const footerEl = dom.window.document.querySelector('footer');
assert(!!footerEl, 'site footer present');
const heroTitle = dom.window.document.getElementById('hero-title');
assert(
  !!heroTitle && heroTitle.textContent === 'Compare premium debrid services',
  'hero h1 has correct title'
);
const benefitsCards = dom.window.document.querySelectorAll(
  '#what-are-debrid-services .grid.grid-cols-1.sm\\:grid-cols-4 > div.rounded-lg'
);
assert(benefitsCards.length === 4, `4 benefit cards rendered (got ${benefitsCards.length})`);

// Verify SVG icon sprite is inlined.
const sprite = dom.window.document.querySelector('svg defs');
assert(!!sprite, 'inline SVG sprite present');
const symbols = dom.window.document.querySelectorAll('svg symbol');
assert(symbols.length >= 15, `at least 15 icon symbols (got ${symbols.length})`);

// Now drive the JS entry.
const entryUrl = pathToFileURL(resolve(jsDir, entry!)).href;
try {
  await import(entryUrl);
} catch (e) {
  errors.push(`import failed: ${(e as Error).message}`);
}

// Allow render to settle (microtask + a tick).
await new Promise<void>((r) => setTimeout(r, 500));

// Verify the dynamic components mounted.
const fileHostsSlot = dom.window.document.querySelector(
  '[data-mount="host-support-table"][data-host-source="file"]'
);
assert(
  !!fileHostsSlot && fileHostsSlot.children.length > 0,
  `host-support-table mounted into #file slot (children=${fileHostsSlot?.children.length})`
);
const adultHostsSlot = dom.window.document.querySelector(
  '[data-mount="host-support-table"][data-host-source="adult"]'
);
assert(
  !!adultHostsSlot && adultHostsSlot.children.length > 0,
  `host-support-table mounted into #adult slot (children=${adultHostsSlot?.children.length})`
);
const cmpSlot = dom.window.document.querySelector(
  '[data-mount="service-comparison"]'
);
assert(
  !!cmpSlot && cmpSlot.children.length > 0,
  `service-comparison mounted (children=${cmpSlot?.children.length})`
);
const pricingSlot = dom.window.document.querySelector(
  '[data-mount="pricing-table"]'
);
assert(
  !!pricingSlot && pricingSlot.querySelector('table'),
  'pricing-table mounted (has <table>)'
);
const referralSlot = dom.window.document.querySelector(
  '[data-mount="referral-links"]'
);
assert(
  !!referralSlot && referralSlot.children.length > 0,
  'referral-links mounted'
);
const usenetSlot = dom.window.document.querySelector(
  '[data-mount="usenet-table"]'
);
assert(
  !!usenetSlot && usenetSlot.querySelector('table'),
  'usenet-table mounted'
);
const policiesSlot = dom.window.document.querySelector(
  '[data-mount="policies-table"]'
);
assert(
  !!policiesSlot && policiesSlot.querySelector('table'),
  'policies-table mounted'
);
const statusSlot = dom.window.document.querySelector(
  '[data-mount="status-grid"]'
);
assert(
  !!statusSlot && statusSlot.children.length > 0,
  'status-grid mounted'
);
const speedSlot = dom.window.document.querySelector(
  '[data-mount="speed-test-grid"]'
);
assert(
  !!speedSlot && speedSlot.children.length > 0,
  'speed-test-grid mounted'
);
const resourceSlot = dom.window.document.querySelector(
  '[data-mount="resource-groups"]'
);
assert(
  !!resourceSlot && resourceSlot.children.length >= 8,
  `resource-groups mounted (groups=${resourceSlot?.children.length})`
);
const disclaimerSlot = dom.window.document.querySelector(
  '[data-mount="disclaimer-cards"]'
);
const disclaimerGrid = disclaimerSlot?.querySelector(':scope > div');
assert(
  !!disclaimerGrid && disclaimerGrid.children.length === 6,
  `disclaimer-cards mounted (cards=${disclaimerGrid?.children.length})`
);

// Verify counts filled in.
const hostCount = dom.window.document.querySelector(
  '[data-mount="hosts-count"]'
);
assert(
  !!hostCount && /^\d+$/.test(hostCount.textContent || ''),
  `hosts count filled (${hostCount?.textContent})`
);
const heroCount = dom.window.document.querySelector(
  '[data-mount="hero-host-count"]'
);
assert(
  !!heroCount && /^\d+$/.test(heroCount.textContent || ''),
  `hero host count filled (${heroCount?.textContent})`
);
const yearEl = dom.window.document.querySelector('[data-current-year]');
assert(
  !!yearEl && yearEl.textContent === String(new Date().getFullYear()),
  `year filled (${yearEl?.textContent})`
);

// morphdom chunk.
const morphdomChunk = readdirSync(jsDir).find(
  (f) => f.startsWith('morphdom') && f.endsWith('.js'),
);
assert(!!morphdomChunk, `morphdom bundle present (${morphdomChunk})`);

assert(errors.length === 0, `no runtime errors (got ${errors.length})`);

if (errors.length > 0) {
  console.error('Errors collected:');
  for (const e of errors) console.error('  ', e);
}

console.log(`\nErrors: ${errors.length}`);
if (failures > 0 || errors.length > 0) {
  console.error('---');
  console.error('✗ Runtime smoke (vanilla) failed');
  process.exit(1);
} else {
  console.log('---');
  console.log('✓ Runtime smoke (vanilla) passed');
}