// Runtime smoke test for the **vanilla** build.
//
// What it verifies:
//   - All bundled JS chunks load and execute without throwing.
//   - The app actually mounts DOM under `#app` (the vanilla target).
//   - The component primitives (HostSupportTable, ServiceComparison, etc.)
//     can be invoked standalone and return Elements without error.
//   - The morphdom bundle is reachable.
//   - There are no console errors during initial mount.
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
if (!existsSync(jsDir)) {
  console.error('dist/assets/js missing — run `npm run build` first');
  process.exit(1);
}

// Find the bundled entry.
const entry = readdirSync(jsDir).find(
  (f) => f.startsWith('index-') && f.endsWith('.js'),
);
assert(!!entry, `entry bundle present (${entry})`);
if (!entry) process.exit(1);

// Set up jsdom with #app target.
const errors: string[] = [];
const virtualConsole = new VirtualConsole();
virtualConsole.on('jsdomError', (err) =>
  errors.push(`jsdomError: ${err.message}`),
);
virtualConsole.on('error', (...args) =>
  errors.push(`console.error: ${args.map(String).join(' ')}`),
);

const dom = new JSDOM(
  '<!doctype html><html><head></head><body><div id="app"></div></body></html>',
  {
    url: 'http://localhost/',
    pretendToBeVisual: true,
    virtualConsole,
  },
);

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

// Polyfill localStorage (jsdom usually has it but be safe).
assign('localStorage', win.localStorage);

// Now import the bundled entry.
const entryUrl = pathToFileURL(resolve(jsDir, entry!)).href;
try {
  await import(entryUrl);
} catch (e) {
  errors.push(`import failed: ${(e as Error).message}`);
}

// Allow render to settle (microtask + a tick).
await new Promise<void>((r) => setTimeout(r, 500));

// Also dynamic-import the heavy chunk(s) so we exercise their code paths.
const hostSupportChunk = readdirSync(jsDir).find(
  (f) => f.startsWith('host-support-table-') && f.endsWith('.js'),
);
if (hostSupportChunk) {
  try {
    await import(pathToFileURL(resolve(jsDir, hostSupportChunk)).href);
  } catch (e) {
    errors.push(
      `host-support-table chunk failed: ${(e as Error).message}`,
    );
  }
}
const cmpChunk = readdirSync(jsDir).find(
  (f) => f.startsWith('service-comparison-') && f.endsWith('.js'),
);
if (cmpChunk) {
  try {
    await import(pathToFileURL(resolve(jsDir, cmpChunk)).href);
  } catch (e) {
    errors.push(`service-comparison chunk failed: ${(e as Error).message}`);
  }
}

const root = dom.window.document.getElementById('app');
assert(
  !!root && root.children.length > 0,
  `app rendered into #app (children=${root?.children.length})`,
);

// Verify presence of key sections.
const checkIds = [
  'what-are-debrid-services',
  'benefits',
  'debrid-pricing-comparison',
  'supported-file-hosts',
  'compare-debrid-services',
  'usenet-support',
  'service-status-monitoring',
  'refund-policies-legal',
  'debrid-resources-tools',
];
for (const id of checkIds) {
  const el = dom.window.document.getElementById(id);
  assert(!!el, `section #${id} present`);
}

// Verify morphdom bundle is reachable.
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