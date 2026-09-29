import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Stable numeric hash so React keys derived from strings stay deterministic.
 * Avoids relying on object iteration order for keying.
 */
export function hashString(input: string): number {
  let hash = 5381;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 33) ^ input.charCodeAt(i);
  }
  return hash >>> 0;
}

/**
 * Extract a normalized domain (lowercased, no `www.`, last 2 segments — or
 * last 3 for known multi-level TLDs) from a URL or hostname string.
 * Returns the bare domain (no TLD) for fuzzy searching.
 */
export function extractHostnameFromURL(input: string): string | null {
  if (!input || typeof input !== 'string') return null;

  let normalized = input.trim();

  if (!/^https?:\/\//i.test(normalized)) {
    // Looks like a domain but no protocol
    if (/[a-z0-9-]+\.[a-z]{2,}/i.test(normalized)) {
      const domainMatch = normalized.match(/([a-z0-9-]+\.(?:[a-z]{2,}\.)?[a-z]{2,})/i);
      if (domainMatch) {
        normalized = 'https://' + domainMatch[0];
      }
    } else {
      return null;
    }
  }

  try {
    normalized = normalized.replace(/^https?[:;.]+\/*/i, 'https://');
    const url = new URL(normalized);
    let hostname = url.hostname.toLowerCase().replace(/^www\d*\./i, '');

    const parts = hostname.split('.');
    const multiLevelTLDs = ['co.uk', 'com.au', 'co.nz', 'co.za', 'com.br', 'co.jp'];
    const lastTwoParts = parts.slice(-2).join('.');

    if (multiLevelTLDs.includes(lastTwoParts)) {
      if (parts.length >= 3) hostname = parts.slice(-3).join('.');
    } else {
      if (parts.length >= 2) hostname = parts.slice(-2).join('.');
    }

    return hostname.split('.')[0];
  } catch {
    const manualMatch = normalized.match(/\/\/([^/:?#]+)/);
    if (manualMatch) {
      const domainName = manualMatch[1].toLowerCase().replace(/^www\d*\./i, '').split('.')[0];
      return domainName || null;
    }
    return null;
  }
}

/** Strip non-alphanumeric, common prefixes, and trailing numbers. */
export function normalizeHostname(hostname: string | null | undefined): string {
  if (!hostname) return '';
  return hostname
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .replace(/^(www|ftp|cdn|dl|download|file|files|upload|uploads)\d*/g, '')
    .replace(/\d+$/g, '');
}

/** Levenshtein distance. */
export function levenshteinDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const prev = new Array(b.length + 1);
  const curr = new Array(b.length + 1);
  for (let j = 0; j <= b.length; j++) prev[j] = j;

  for (let i = 1; i <= a.length; i++) {
    curr[0] = i;
    for (let j = 1; j <= b.length; j++) {
      curr[j] = a.charCodeAt(i - 1) === b.charCodeAt(j - 1)
        ? prev[j - 1]
        : Math.min(prev[j - 1] + 1, curr[j - 1] + 1, prev[j] + 1);
    }
    for (let j = 0; j <= b.length; j++) prev[j] = curr[j];
  }

  return prev[b.length];
}
