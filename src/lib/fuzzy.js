// Fuzzy URL hostname matching — extracted from the React host-support
// table. Used to detect when the user pastes a URL like
// "https://rapidgator.net/file/abc" and resolve it to the matching host
// row in the table.

const MULTI_LEVEL_TLDS = ['co.uk', 'com.au', 'co.nz', 'co.za', 'com.br', 'co.jp'];

/** Extract a bare-domain name (lowercased, no TLD, no `www.`) from a URL
 * or hostname. Returns null if no recognizable domain is present.
 *
 *   extractHostnameFromURL('https://www.rapidgator.net/file/abc')
 *     // → 'rapidgator'
 *   extractHostnameFromURL('rapidgator.net')
 *     // → 'rapidgator'
 */
export function extractHostnameFromURL(input) {
  if (!input || typeof input !== 'string') return null;

  let normalized = input.trim();

  if (!/^https?:\/\//i.test(normalized)) {
    if (/[a-z0-9-]+\.[a-z]{2,}/i.test(normalized)) {
      const m = normalized.match(/([a-z0-9-]+\.(?:[a-z]{2,}\.)?[a-z]{2,})/i);
      if (m) normalized = 'https://' + m[0];
    } else {
      return null;
    }
  }

  try {
    normalized = normalized.replace(/^https?[:;.]+\/*/i, 'https://');
    const url = new URL(normalized);
    let hostname = url.hostname.toLowerCase().replace(/^www\d*\./i, '');

    const parts = hostname.split('.');
    const lastTwo = parts.slice(-2).join('.');
    if (MULTI_LEVEL_TLDS.includes(lastTwo)) {
      if (parts.length >= 3) hostname = parts.slice(-3).join('.');
    } else if (parts.length >= 2) {
      hostname = parts.slice(-2).join('.');
    }
    return hostname.split('.')[0];
  } catch {
    const m = normalized.match(/\/\/([^/:?#]+)/);
    if (m) {
      return m[1].toLowerCase().replace(/^www\d*\./i, '').split('.')[0] || null;
    }
    return null;
  }
}

/** Strip non-alphanumeric, common prefixes, and trailing digits. */
export function normalizeHostname(hostname) {
  if (!hostname) return '';
  return hostname
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .replace(/^(www|ftp|cdn|dl|download|file|files|upload|uploads)\d*/g, '')
    .replace(/\d+$/g, '');
}

/** Iterative Levenshtein distance — O(n) space. */
export function levenshteinDistance(a, b) {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const prev = new Array(b.length + 1);
  const curr = new Array(b.length + 1);
  for (let j = 0; j <= b.length; j++) prev[j] = j;

  for (let i = 1; i <= a.length; i++) {
    curr[0] = i;
    for (let j = 1; j <= b.length; j++) {
      curr[j] =
        a.charCodeAt(i - 1) === b.charCodeAt(j - 1)
          ? prev[j - 1]
          : Math.min(prev[j - 1] + 1, curr[j - 1] + 1, prev[j] + 1);
    }
    for (let j = 0; j <= b.length; j++) prev[j] = curr[j];
  }

  return prev[b.length];
}

/** Score 0–100 — higher means `host` is more likely to match `needle`. */
export function similarityScore(host, needle) {
  if (!needle) return 100;
  const a = normalizeHostname(host);
  const b = needle;
  if (!a || !b) return 0;
  if (a === b) return 100;
  if (a.includes(b) || b.includes(a)) {
    const longer = Math.max(a.length, b.length);
    const shorter = Math.min(a.length, b.length);
    return Math.round((shorter / longer) * 95);
  }
  const min = Math.min(a.length, b.length);
  let matching = 0;
  for (let i = 0; i < min; i++) {
    if (a[i] === b[i]) matching++;
    else break;
  }
  if (matching >= 3) {
    return Math.round((matching / Math.max(a.length, b.length)) * 85);
  }
  const dist = levenshteinDistance(a, b);
  const max = Math.max(a.length, b.length);
  return Math.max(0, Math.round((1 - dist / max) * 80));
}