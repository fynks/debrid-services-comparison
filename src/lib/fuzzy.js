// Fuzzy URL hostname matching - extracted from the React host-support
// table. Used to detect when the user pastes a URL like
// "https://rapidgator.net/file/abc" and resolve it to the matching host
// row in the table.

const MULTI_LEVEL_TLDS = new Set([
  'co.uk',
  'com.au',
  'co.nz',
  'co.za',
  'com.br',
  'co.jp',
]);

const HTTP_PREFIX_RE = /^https?:\/\//i;
const DOMAIN_MATCH_RE = /([a-z0-9-]+\.(?:[a-z]{2,}\.)?[a-z]{2,})/i;
const SCHEME_FIX_RE = /^https?[:;.]+\/*/i;
const AUTHORITY_RE = /^[a-z][a-z0-9+.-]*:\/{2,}([^/?#]*)/i;
const FALLBACK_HOST_RE = /\/\/([^/:?#]+)/;
const WWW_PREFIX_RE = /^www\d*\./i;
const NON_ALNUM_RE = /[^a-z0-9]/g;
const HOST_PREFIX_RE = /^(www|ftp|cdn|dl|download|file|files|upload|uploads)\d*/g;
const TRAILING_DIGITS_RE = /\d+$/g;

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

  if (!HTTP_PREFIX_RE.test(normalized)) {
    const match = normalized.match(DOMAIN_MATCH_RE);
    if (!match) return null;
    normalized = 'https://' + match[0];
  }

  normalized = normalized.replace(SCHEME_FIX_RE, 'https://');

  const authority = normalized.match(AUTHORITY_RE)?.[1] ?? normalized.match(FALLBACK_HOST_RE)?.[1];
  if (!authority) return null;

  const at = authority.lastIndexOf('@');
  let hostname = (at === -1 ? authority : authority.slice(at + 1))
    .toLowerCase()
    .replace(WWW_PREFIX_RE, '');

  if (hostname.startsWith('[')) {
    const close = hostname.indexOf(']');
    if (close !== -1) hostname = hostname.slice(0, close + 1);
  } else {
    const colon = hostname.indexOf(':');
    if (colon !== -1) hostname = hostname.slice(0, colon);
  }

  if (!hostname) return null;

  const parts = hostname.split('.');
  if (parts.length < 2) return parts[0];

  const lastTwo = parts.slice(-2).join('.');
  if (MULTI_LEVEL_TLDS.has(lastTwo)) {
    return parts.length >= 3 ? parts[parts.length - 3] : parts[0];
  }
  return parts[parts.length - 2];
}

/** Strip non-alphanumeric, common prefixes, and trailing digits. */
export function normalizeHostname(hostname) {
  if (!hostname) return '';
  return hostname
    .toLowerCase()
    .replace(NON_ALNUM_RE, '')
    .replace(HOST_PREFIX_RE, '')
    .replace(TRAILING_DIGITS_RE, '');
}

/** Iterative Levenshtein distance - O(n) space. */
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

/** Score 0–100 - higher means `host` is more likely to match `needle`. */
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