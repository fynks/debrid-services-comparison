// Data and utility tests. Run with `bun test`.
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'bun:test';

import {
  extractHostnameFromURL,
  normalizeHostname,
  levenshteinDistance,
} from '../src/lib/fuzzy.js';
import { PRICING_ROWS, PRICING_SERVICES, REFERRAL_LINKS } from '../src/data/pricing';
import { POLICY_ROWS, STATUS_LINKS, USENET_SUPPORT } from '../src/data/policies';
import { SERVICES, SERVICE_ORDER } from '../src/data/services';
import { SERVICE_LIMITS } from '../src/data/limits';
import { RESOURCE_GROUPS } from '../src/data/resources';
import type { OptimizedHostsData } from '../src/types/data';

const ROOT = resolve(import.meta.dirname, '..');
const read = (path: string) => readFileSync(resolve(ROOT, path), 'utf8');
const loadHosts = (name: string): OptimizedHostsData =>
  JSON.parse(read(`src/json/${name}-optimized.json`));

const fileHosts = loadHosts('file-hosts');
const adultHosts = loadHosts('adult-hosts');

describe('Hostname utilities', () => {
  it('extracts hostnames from URLs', () => {
    expect(extractHostnameFromURL('https://www.example.com/path')).toBe('example');
    expect(extractHostnameFromURL('example.com')).toBe('example');
    expect(extractHostnameFromURL('not a url')).toBeNull();
  });

  it('normalizes hostnames', () => {
    expect(normalizeHostname('www.FOO-bar.com').startsWith('foobar')).toBe(true);
  });

  it('computes Levenshtein distance', () => {
    expect(levenshteinDistance('kitten', 'sitting')).toBe(3);
    expect(levenshteinDistance('same', 'same')).toBe(0);
  });
});

describe('Optimized host data', () => {
  it('has a baked hostCount matching the supported map for both lists', () => {
    expect(fileHosts.hostCount).toBe(Object.keys(fileHosts.supported).length);
    expect(adultHosts.hostCount).toBe(Object.keys(adultHosts.supported).length);
  });

  it('shares canonical service order and valid IDs across both lists', () => {
    expect(adultHosts.services).toEqual(fileHosts.services);
    expect(fileHosts.services.every((id) => id in SERVICES)).toBe(true);
  });

  it('renders every file host as a row in README', () => {
    const lines = read('README.md').split('\n');
    const start = lines.findIndex((l) => l.startsWith('| **Service Name** |'));
    const end = lines.findIndex((l, i) => i > start && l.startsWith('| **Total** = '));
    const rows = lines.slice(start, end + 1).filter((l) => l.startsWith('|')).length;
    expect(rows - 3).toBe(fileHosts.hostCount); // header, separator, totals
  });
});

describe('Service references', () => {
  it('uses only known service IDs across all datasets', () => {
    const ids = [
      ...SERVICE_ORDER,
      ...PRICING_SERVICES,
      ...SERVICE_LIMITS.map((r) => r.service),
      ...POLICY_ROWS.map((r) => r.service),
      ...STATUS_LINKS.map((r) => r.service),
      ...USENET_SUPPORT.map((r) => r.service),
      ...REFERRAL_LINKS.map((r) => r.service),
    ];
    for (const id of ids) expect(id in SERVICES).toBe(true);
    for (const row of PRICING_ROWS) {
      for (const id of Object.keys(row.cells)) expect(id in SERVICES).toBe(true);
    }
  });

  it('has complete limit rows', () => {
    const keys = ['slots', 'maxSize', 'caps', 'ipPolicy', 'freeTier', 'apiLimits'] as const;
    for (const row of SERVICE_LIMITS) {
      for (const key of keys) expect(typeof row[key]).toBe('string');
    }
  });

  it('keeps policy, status and limits rows aligned with the roster', () => {
    expect(new Set(POLICY_ROWS.map((r) => r.service))).toEqual(new Set(SERVICE_ORDER));
    expect(new Set(SERVICE_LIMITS.map((r) => r.service))).toEqual(new Set(SERVICE_ORDER));
    expect(STATUS_LINKS.every((r) => r.url.startsWith('http'))).toBe(true);
  });
});

describe('External links', () => {
  it('uses real URLs for referrals, policies and resources', () => {
    for (const link of REFERRAL_LINKS) expect(link.url).toMatch(/^http/);
    for (const row of POLICY_ROWS) {
      if (row.terms) expect(row.terms).toMatch(/^http/);
    }
    for (const group of RESOURCE_GROUPS) {
      expect(group.items.length).toBeGreaterThan(0);
      for (const item of group.items) expect(item.url === '#' || item.url.startsWith('http')).toBe(true);
    }
  });
});

describe('Published counts', () => {
  it('matches the README badge and structured data to the service roster', () => {
    const readme = read('README.md');
    const html = read('index.html');
    const count = SERVICE_ORDER.length;
    expect(readme).toContain(`Services-${count}-4caf50`);
    expect(html).toContain(`Compare ${count} premium debrid services`);
  });
});
