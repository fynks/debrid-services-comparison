// Runtime smoke test — exercises the real Vite-built bundle inside jsdom
// by importing the bundled modules directly (jsdom doesn't support
// `<script type="module">` natively, so we bypass HTML loading and import
// the bundles as ES modules in a JSDOM-equipped Node process).
//
// What this verifies:
//   - Preact + Radix (Select, Tooltip, Tabs) imports resolve cleanly
//   - Radix Select renders without portal runtime errors
//   - The built app's render() function actually executes without
//     throwing — i.e. Preact compat handles Slot/forwardRef correctly
import jsdom, { VirtualConsole } from 'jsdom';
import { readFileSync, readdirSync } from 'node:fs';
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

// Find the bundled entry.
const jsDir = resolve(DIST, 'assets/js');
const entry = readdirSync(jsDir).find(
  (f) => f.startsWith('index-') && f.endsWith('.js'),
);
assert(!!entry, `entry bundle present (${entry})`);
if (!entry) process.exit(1);

// Set up a jsdom global environment BEFORE importing the entry, because
// the bundle is browser-targeted and uses document/window at module scope.
const errors: string[] = [];
const virtualConsole = new VirtualConsole();
virtualConsole.on('jsdomError', (err) =>
  errors.push(`jsdomError: ${err.message}`),
);
virtualConsole.on('error', (...args) =>
  errors.push(`console.error: ${args.map(String).join(' ')}`),
);

const dom = new JSDOM(
  '<!doctype html><html><head></head><body><div id="root"></div></body></html>',
  {
    url: 'http://localhost/',
    pretendToBeVisual: true,
    virtualConsole,
  },
);

// Polyfill browser globals before importing.
const win = dom.window as unknown as Record<string, unknown>;
const G = globalThis as unknown as Record<string, unknown>;
const assign = (k: string, v: unknown) => {
  try {
    G[k] = v;
  } catch {
    // ignore read-only globals
  }
};
assign('window', win);
assign('document', win.document);
assign('navigator', win.navigator);
assign('HTMLElement', win.HTMLElement);
assign('Element', win.Element);
assign('Node', win.Node);
assign('Event', win.Event);
assign('CustomEvent', win.CustomEvent);
assign('MouseEvent', win.MouseEvent);
assign('MutationObserver', win.MutationObserver);
// Other DOM constructors Radix references:
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
// Also expose on the window object since our bundled code references
// `window.matchMedia` (the real browser shim lives there).
(win as Record<string, unknown>).matchMedia = polyMatchMedia;
const polyIO = class {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
};
assign('IntersectionObserver', polyIO);
(win as Record<string, unknown>).IntersectionObserver = polyIO;
const polyRO = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};
assign('ResizeObserver', polyRO);
(win as Record<string, unknown>).ResizeObserver = polyRO;
assign('requestAnimationFrame', (cb: FrameRequestCallback) =>
  setTimeout(() => cb(performance.now()), 16) as unknown as number,
);
assign('cancelAnimationFrame', (h: number) => clearTimeout(h));

// Now import the bundled entry. We use a dynamic import via file URL.
const entryUrl = pathToFileURL(resolve(jsDir, entry!)).href;
try {
  await import(entryUrl);
} catch (e) {
  errors.push(`import failed: ${(e as Error).message}`);
}

// Wait a tick for render().
await new Promise<void>((r) => setTimeout(r, 500));

const root = dom.window.document.getElementById('root');
assert(
  !!root && (root!.children.length > 0 || (root!.innerHTML ?? '').length > 0),
  `app rendered into #root (children=${root?.children.length}, html=${(root?.innerHTML ?? '').length}b)`,
);

assert(errors.length === 0, `no errors (got ${errors.length})`);

const portalFailures = errors.filter(
  (e) =>
    /portal|items is undefined|Cannot read propert|SelectContentImpl/i.test(
      e,
    ),
);
assert(
  portalFailures.length === 0,
  `no Radix portal errors (${portalFailures.length})`,
);

if (errors.length > 0) {
  console.error('Errors collected:');
  for (const e of errors) console.error('  ', e);
}

console.log(`\nErrors: ${errors.length}`);
if (failures > 0 || errors.length > 0) {
  console.error('---');
  console.error('✗ Runtime smoke failed');
  process.exit(1);
} else {
  console.log('---');
  console.log('✓ Runtime smoke passed');
}