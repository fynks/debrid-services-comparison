// Smoke test for the data and key utilities.
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  extractHostnameFromURL,
  normalizeHostname,
  levenshteinDistance,
} from '../src/lib/fuzzy.js';
import { PRICING_ROWS, PRICING_SERVICES, REFERRAL_LINKS } from '../src/data/pricing';
import { POLICY_ROWS } from '../src/data/policies';
import { SERVICES, SERVICE_ORDER } from '../src/data/services';
import { RESOURCE_GROUPS } from '../src/data/resources';
import type { OptimizedHostsData } from '../src/types/data';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, '..');

let failures = 0;
function assert(cond: boolean, msg: string) {
  if (!cond) {
    failures++;
    console.error('  ✗', msg);
  } else {
    console.log('  ✓', msg);
  }
}

console.log('Hostname utilities');
assert(extractHostnameFromURL('https://www.example.com/path') === 'example', 'extract hostname from full URL');
assert(extractHostnameFromURL('example.com') === 'example', 'extract hostname from bare domain');
assert(extractHostnameFromURL('not a url') === null, 'reject non-URL');
assert(normalizeHostname('www.FOO-bar.com').startsWith('foobar'), 'normalize strips www + case');
assert(levenshteinDistance('kitten', 'sitting') === 3, 'levenshtein distance known value');
assert(levenshteinDistance('same', 'same') === 0, 'levenshtein same string');

console.log('\nFile hosts data');
const fileHosts = JSON.parse(
  readFileSync(resolve(ROOT, 'src/json/file-hosts-optimized.json'), 'utf8'),
) as OptimizedHostsData;
assert(fileHosts.services.length >= 7, `at least 7 services (got ${fileHosts.services.length})`);
assert(Object.keys(fileHosts.supported).length >= 100, '>= 100 hosts supported');
assert(fileHosts.services.includes('AllDebrid'), 'includes AllDebrid');
assert(fileHosts.services.includes('TorBox'), 'includes TorBox');

console.log('\nPricing');
assert(PRICING_ROWS.length >= 5, 'at least 5 pricing rows');
assert(PRICING_SERVICES.length >= 5, 'at least 5 pricing services');

console.log('\nReferrals');
assert(REFERRAL_LINKS.length >= 3, 'at least 3 referral links');
for (const r of REFERRAL_LINKS) {
  assert(typeof r.url === 'string' && r.url.startsWith('http'), `valid URL for ${r.service}`);
}

console.log('\nPolicies');
assert(POLICY_ROWS.length >= 5, 'at least 5 policy rows');
for (const p of POLICY_ROWS) {
  assert(SERVICES[p.service], `valid service for ${p.service}`);
  assert(p.terms?.startsWith('http') || p.terms === undefined, `terms URL for ${p.service}`);
}

console.log('\nServices');
for (const id of SERVICE_ORDER) {
  assert(SERVICES[id].name === id, `service id matches name: ${id}`);
  assert(SERVICES[id].website.startsWith('http'), `website URL for ${id}`);
}

console.log('\nResources');
assert(RESOURCE_GROUPS.length >= 8, `at least 8 resource groups (got ${RESOURCE_GROUPS.length})`);
for (const g of RESOURCE_GROUPS) {
  assert(g.items.length > 0, `${g.title} has items`);
  for (const item of g.items) {
    assert(item.url.startsWith('http') || item.url === '#', `${g.title} - ${item.name} URL valid`);
  }
}

console.log('\nAdult hosts');
const adult = JSON.parse(
  readFileSync(resolve(ROOT, 'src/json/adult-hosts-optimized.json'), 'utf8'),
) as OptimizedHostsData;
assert(adult.services.length === fileHosts.services.length, 'same services count in adult and file hosts');
assert(
  adult.services.every((s, idx) => s === fileHosts.services[idx] && s in SERVICES),
  'adult and file hosts share canonical SERVICE_ORDER and valid ServiceIds',
);
assert(Object.keys(adult.supported).length > 10, 'adult hosts > 10');

console.log('\n---');
if (failures > 0) {
  console.error(`✗ ${failures} test(s) failed`);
  process.exit(1);
} else {
  console.log('✓ All smoke tests passed');
}
