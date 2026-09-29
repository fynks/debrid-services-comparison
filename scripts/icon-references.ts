// Cross-checks that every icon name referenced from JS / data files
// has a matching <symbol id="i-…"> entry in the page-level sprite.

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
  console.error('dist/index.html missing — run `npm run build` first');
  process.exit(1);
}

const html = readFileSync(INDEX, 'utf8');
const symbols = new Set<string>();
for (const m of html.matchAll(/<symbol\s+id="i-([a-z0-9-]+)"/g)) {
  symbols.add(m[1]);
}

// Pull every PascalCase icon prop from data/resources.ts.
const resources = readFileSync(
  resolve(ROOT, 'src/data/resources.ts'),
  'utf8'
);
const resourceIcons = [
  ...new Set(
    [...resources.matchAll(/icon:\s*'([A-Za-z]+)'/g)].map((m) => m[1])
  ),
];

// Pull every icon key from disclaimer-cards.js.
const disclaimer = readFileSync(
  resolve(ROOT, 'src/components/common/disclaimer-cards.js'),
  'utf8'
);
const disclaimerIcons = [
  ...new Set(
    [...disclaimer.matchAll(/icon:\s*'([a-z-]+)'/g)].map((m) => m[1])
  ),
];

const all = [
  ...resourceIcons.map((s) => ({ source: 'resources.ts', name: s, normalized: s.toLowerCase() })),
  ...disclaimerIcons.map((s) => ({ source: 'disclaimer-cards.js', name: s, normalized: s.toLowerCase() })),
];

const missing = all.filter((e) => !symbols.has(e.normalized));
for (const e of all) {
  check(
    symbols.has(e.normalized),
    `icon "${e.name}" from ${e.source} → sprite has #i-${e.normalized}`
  );
}
check(missing.length === 0, `no missing sprite icons (${missing.length} missing)`);

console.log(`\nIcon references: ${all.length} total, ${missing.length} missing`);
if (failures > 0) {
  console.error('---');
  console.error('✗ Icon reference check failed');
  process.exit(1);
} else {
  console.log('---');
  console.log('✓ Icon references all resolve');
}