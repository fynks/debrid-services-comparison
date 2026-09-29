// Inline SVG icon factory for the dynamic components (table sort
// indicators, select dropdown checks, etc.).
//
// Static icons used in index.html come from the <svg><defs> sprite at
// the top of the page and are referenced with <use href="#i-name"/>.
// This module is for cases where we need to create icon Nodes from JS.

const SVG_NS = 'http://www.w3.org/2000/svg';

const PATHS = {
  check: '<polyline points="20 6 9 17 4 12"/>',
  x: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
  'arrow-up-right':
    '<line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>',
  'arrow-up':
    '<line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>',
  'chevron-down': '<polyline points="6 9 12 15 18 9"/>',
  'chevron-up': '<polyline points="18 15 12 9 6 15"/>',
  'chevron-right': '<polyline points="9 18 15 12 9 6"/>',
  search:
    '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
  info: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>',
  'alert-triangle':
    '<path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
  'rotate-ccw':
    '<polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>',
  'external-link':
    '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>',
  activity:
    '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',
  gauge:
    '<path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/>',
};

function svg(path, opts = {}) {
  const el = document.createElementNS(SVG_NS, 'svg');
  el.setAttribute('viewBox', '0 0 24 24');
  el.setAttribute('fill', 'none');
  el.setAttribute('stroke', 'currentColor');
  el.setAttribute('stroke-width', '2');
  el.setAttribute('stroke-linecap', 'round');
  el.setAttribute('stroke-linejoin', 'round');
  el.innerHTML = path;
  if (opts.class) el.setAttribute('class', opts.class);
  if (opts['aria-hidden']) el.setAttribute('aria-hidden', opts['aria-hidden']);
  if (opts['aria-label']) {
    el.setAttribute('aria-label', opts['aria-label']);
    el.setAttribute('role', 'img');
  }
  return el;
}

export function icon(name, opts = {}) {
  const path = PATHS[name];
  if (!path) {
    console.warn(`[icons] Unknown icon: ${name}`);
    return svg('', opts);
  }
  return svg(path, opts);
}