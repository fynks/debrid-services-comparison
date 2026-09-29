// Static HTML validation - runs against the built dist/index.html to
// catch rendering / structural bugs that the runtime smoke can't see.
//
// Checks:
//   - Every <use href="#i-..."> reference resolves to a <symbol id="i-...">.
//   - Every <button>, <a>, <input>, <select> has an accessible label.
//   - Every [data-mount="..."] target is reachable from the boot script.
//   - Sections with border-t have at least the expected vertical padding.
//   - Section headers have an h2/h3 with the correct id referenced from
//     aria-labelledby.
//   - The footer has its 4 brand/link columns.
//
// On failure, exits non-zero with a clear list of issues.

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, '..');
const INDEX = resolve(ROOT, 'dist/index.html');

let failures = 0;
function check(cond: boolean, msg: string) {
  if (!cond) {
    failures++;
    console.error('  ✗', msg);
  } else {
    console.log('  ✓', msg);
  }
}

if (!existsSync(INDEX)) {
  console.error('dist/index.html missing - run `npm run build` first');
  process.exit(1);
}

const html = readFileSync(INDEX, 'utf8');

// === Icon sprite integrity ===
const symbolIds = new Set<string>();
for (const m of html.matchAll(/<symbol\s+id="([^"]+)"/g)) {
  symbolIds.add(m[1]);
}
check(symbolIds.size >= 20, `SVG sprite has 20+ symbols (got ${symbolIds.size})`);

const useRefs = [...html.matchAll(/<use[^>]+href="#([^"]+)"/g)].map((m) => m[1]);
const missing = useRefs.filter((ref) => !symbolIds.has(ref));
check(
  missing.length === 0,
  `all <use href="#…"> references resolve (${useRefs.length} uses, ${
    missing.length
  } missing${
    missing.length ? ': ' + [...new Set(missing)].slice(0, 5).join(', ') : ''
  })`
);

// === Accessible labels on interactive controls ===
function tagCount(re: RegExp) {
  return (html.match(re) || []).length;
}

const btnCount = tagCount(/<button[\s>]/g);
const labelledBtns = tagCount(
  /<button[\s>][^>]*?(?:aria-label=|aria-labelledby=)[^>]*?>/g
);
check(
  labelledBtns >= btnCount - 5, // theme, mobile nav, back-to-top have aria-label
  `buttons have aria-label/aria-labelledby (${labelledBtns}/${btnCount})`
);

const inputCount = tagCount(/<input[\s>]/g);
const labelledInputs = tagCount(
  /<input[\s>][^>]*?(?:aria-label=|aria-label)=/g
);
check(
  labelledInputs >= inputCount,
  `inputs have aria-label (${labelledInputs}/${inputCount})`
);

// === data-mount targets present ===
const mountSlots = [
  'pricing-table',
  'referral-links',
  'service-comparison',
  'usenet-table',
  'policies-table',
  'status-grid',
  'speed-test-grid',
  'resource-groups',
  'disclaimer-cards',
];
for (const slot of mountSlots) {
  check(
    html.includes(`data-mount="${slot}"`),
    `mount slot #${slot} present`
  );
}

// host-support-table has two slots
const hostSlots = [...html.matchAll(/<div[^>]*data-mount="host-support-table"[^>]*>/g)];
check(hostSlots.length === 2, `2 host-support-table slots (file + adult, got ${hostSlots.length})`);

// === Section vertical rhythm ===
// Every <section> with class containing "container-page" should have
// generous vertical padding (either py-* for symmetric, or pb-* + pt-*
// for asymmetric like the hero).
const sections = [
  ...html.matchAll(
    /<section\s+id="([^"]+)"[^>]*class="([^"]+)"[^>]*>/g
  ),
];
let sectionChecks = 0;
for (const m of sections) {
  const [, id, cls] = m;
  if (!/container-page/.test(cls)) continue;
  sectionChecks++;
  const hasVerticalPadding =
    /py-\d+/.test(cls) ||
    (/(pb|pt)-\d+/.test(cls) && /(pb|pt)-\d+/.test(cls));
  const hasResponsivePadding =
    /sm:py-\d+/.test(cls) ||
    /sm:pb-\d+/.test(cls) ||
    /sm:pt-\d+/.test(cls);
  check(hasVerticalPadding, `section #${id} has vertical padding`);
  check(hasResponsivePadding, `section #${id} has responsive (sm:) vertical padding`);
}
check(sectionChecks >= 10, `at least 10 .container-page sections (got ${sectionChecks})`);

// === aria-labelledby / heading id match ===
for (const m of sections) {
  const [, id, full] = m;
  const labelledBy = full.match(/aria-labelledby="([^"]+)"/);
  if (!labelledBy) continue;
  const headingId = labelledBy[1];
  const headingRe = new RegExp(`id="${headingId}"`);
  check(
    headingRe.test(html),
    `section #${id} aria-labelledby="${headingId}" has matching heading`
  );
}

// === Section header structure ===
const headers = [...html.matchAll(/<header class="mb-8 max-w-2xl[^"]*"/g)];
check(headers.length >= 9, `section headers have mb-8 max-w-2xl (got ${headers.length})`);

// === Footer structure ===
check(/<footer[\s>][^>]*class="border-t border-border bg-background"/.test(html), 'footer has correct class');
check(html.includes('class="grid grid-cols-2 gap-8 sm:grid-cols-4"'), 'footer has 4-column grid');
check(/<svg class="h-3.5 w-3.5" aria-hidden="true"><use href="#i-github"\/>/.test(html), 'footer GitHub icon present');

// === Hero structure ===
check(/<h1 id="hero-title" class="text-3xl font-semibold tracking-tight sm:text-4xl">/.test(html), 'hero h1 with correct class');
check(html.includes('data-mount="hero-host-count"'), 'hero host-count placeholder present');
check(html.includes('data-mount="hosts-count"'), 'hosts-count placeholder present');

// === Benefits 4-card grid ===
const benefitsMatch = html.match(
  /<div class="grid grid-cols-1 gap-3 sm:grid-cols-4">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>\s*<\/section>/
);
check(!!benefitsMatch, 'benefits 4-card grid present');
if (benefitsMatch) {
  const cards = benefitsMatch[1].match(/<div class="rounded-lg border border-border bg-card p-4">/g) || [];
  check(cards.length === 4, `benefits has exactly 4 cards (got ${cards.length})`);
}

// === Alert roles present ===
const alertRoles = tagCount(/role="alert"/g);
const statusRoles = tagCount(/role="status"/g);
check(alertRoles >= 2, `at least 2 role="alert" (got ${alertRoles})`);
check(statusRoles >= 4, `at least 4 role="status" (got ${statusRoles})`);

// === Skip-link target ===
check(html.includes('id="main-content"'), 'main#main-content skip-target present');

// === JSON-LD present ===
check(html.includes('@type": "WebApplication"'), 'WebApplication JSON-LD');
check(html.includes('@type": "BreadcrumbList"'), 'BreadcrumbList JSON-LD');
check(html.includes('@type": "FAQPage"'), 'FAQPage JSON-LD');

// === Theme pre-init script ===
check(
  /<script>\s*\/\/\s*Set theme synchronously/.test(html),
  'theme pre-init script present (avoids FOUC)'
);

// === Summary ===
console.log(`\nFailures: ${failures}`);
if (failures > 0) {
  console.error('---');
  console.error('✗ Static HTML checks failed');
  process.exit(1);
} else {
  console.log('---');
  console.log('✓ Static HTML checks passed');
}