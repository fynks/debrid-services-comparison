// Host-support matrix table.
//
// - Search supports substring + URL/hostname fuzzy matching.
// - Sortable by host name or per-service support.
// - Sticky first column for horizontal scroll on narrow screens.
// - "Load all" lazy-loads beyond initialLimit when not searching.
// - Re-renders only the table body when state changes — header and
//   chrome stay mounted.

import { icon } from '../../lib/icons.js';
import { Input } from '../common/input.js';
import { Button } from '../common/button.js';
import { SERVICES, SERVICE_ORDER } from '../../data/services.ts';
import { extractHostnameFromURL, normalizeHostname, levenshteinDistance } from '../../lib/fuzzy.js';

const SERVICE_STATUS_PAGES = Object.fromEntries(
  SERVICE_ORDER.map((id) => [id, SERVICES[id].statusPage])
);

const SEARCH_PLACEHOLDER_DEFAULT = 'Search hosts or paste URL…';
const INITIAL_LIMIT_DEFAULT = 60;

export function HostSupportTable({
  data,
  searchPlaceholder = SEARCH_PLACEHOLDER_DEFAULT,
  initialLimit = INITIAL_LIMIT_DEFAULT,
  resultsLabel,
  id = 'hosts',
} = {}) {
  const services = data.services;
  const hostCount = Object.keys(data.supported).length;

  // Mutable state held in a plain object.
  let state = {
    search: '',
    debounced: '',
    sort: { column: 'service', direction: 'asc' },
    fullyLoaded: false,
  };

  // Root container
  const root = document.createElement('div');
  root.className = 'space-y-4';

  // Search row
  const row = document.createElement('div');
  row.className =
    'flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between';

  const searchWrap = document.createElement('div');
  searchWrap.className = 'relative w-full sm:max-w-sm';
  const sIcon = icon('search', {
    class: 'pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground',
    'aria-hidden': 'true',
  });
  searchWrap.appendChild(sIcon);

  const input = Input({
    type: 'search',
    placeholder: searchPlaceholder,
    class: 'pl-8 pr-8',
    'aria-label': resultsLabel,
    'aria-controls': `${id}-table-region`,
  });
  searchWrap.appendChild(input);

  const clearBtn = document.createElement('button');
  clearBtn.type = 'button';
  clearBtn.className =
    'absolute right-1.5 top-1/2 inline-flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground';
  clearBtn.setAttribute('aria-label', 'Clear search');
  clearBtn.appendChild(
    icon('x', { class: 'h-3.5 w-3.5', 'aria-hidden': 'true' })
  );
  clearBtn.style.display = 'none';
  clearBtn.addEventListener('click', () => {
    input.value = '';
    state.search = '';
    clearBtn.style.display = 'none';
    scheduleDebounce();
  });
  searchWrap.appendChild(clearBtn);

  input.addEventListener('input', (e) => {
    state.search = e.target.value;
    clearBtn.style.display = state.search ? 'inline-flex' : 'none';
    scheduleDebounce();
  });

  row.appendChild(searchWrap);

  const counter = document.createElement('p');
  counter.className =
    'text-xs text-muted-foreground tabular-nums';
  counter.setAttribute('aria-live', 'polite');
  row.appendChild(counter);

  root.appendChild(row);

  // Region wrapper
  const region = document.createElement('div');
  region.id = `${id}-table-region`;
  region.setAttribute('role', 'region');
  region.setAttribute('aria-live', 'polite');
  region.setAttribute('aria-label', resultsLabel);
  region.className =
    'relative overflow-x-auto rounded-lg border border-border bg-card';

  // Mobile fade hint
  const fade = document.createElement('div');
  fade.setAttribute('aria-hidden', 'true');
  fade.className =
    'pointer-events-none absolute inset-y-0 right-0 z-30 w-8 bg-gradient-to-l from-card to-transparent md:hidden';
  region.appendChild(fade);

  // Table
  const table = document.createElement('table');
  table.className = 'w-full min-w-max text-sm tabular-nums';
  table.setAttribute('aria-label', resultsLabel);

  // thead (rebuilt on each render to update sort indicators)
  const thead = document.createElement('thead');
  table.appendChild(thead);

  // tbody (will be replaced on each render)
  const tbody = document.createElement('tbody');
  table.appendChild(tbody);

  region.appendChild(table);
  root.appendChild(region);

  // Load-all button + legend
  const bottom = document.createElement('div');
  bottom.className = 'flex flex-col items-center gap-4';
  root.appendChild(bottom);

  // Legend
  const legend = document.createElement('div');
  legend.className =
    'flex flex-wrap items-center gap-3 text-2xs text-muted-foreground';
  const itemA = document.createElement('span');
  itemA.className = 'inline-flex items-center gap-1.5';
  itemA.appendChild(
    icon('check', { class: 'h-3.5 w-3.5 text-success', 'aria-hidden': 'true' })
  );
  itemA.appendChild(document.createTextNode('supported'));
  legend.appendChild(itemA);

  const itemB = document.createElement('span');
  itemB.className = 'inline-flex items-center gap-1.5';
  const dash = document.createElement('span');
  dash.className = 'text-muted-foreground/60';
  dash.textContent = '—';
  itemB.appendChild(dash);
  itemB.appendChild(document.createTextNode('not supported'));
  legend.appendChild(itemB);

  const itemC = document.createElement('span');
  itemC.className = 'inline-flex items-center gap-1.5';
  itemC.appendChild(
    icon('external-link', {
      class: 'h-3.5 w-3.5',
      'aria-hidden': 'true',
    })
  );
  itemC.appendChild(
    document.createTextNode('click a checkmark to open live status')
  );
  legend.appendChild(itemC);

  root.appendChild(legend);

  // --- sort header helper ---
  function sortHeaderCell(label, column, sticky, extra = '') {
    const th = document.createElement('th');
    th.scope = 'col';
    const isActive = state.sort.column === column;
    th.setAttribute(
      'aria-sort',
      isActive
        ? state.sort.direction === 'asc'
          ? 'ascending'
          : 'descending'
        : 'none'
    );
    th.className =
      'px-3 py-2 text-left text-xs font-medium text-muted-foreground ' +
      extra +
      (sticky
        ? ' sticky left-0 z-20 bg-muted border-r border-border'
        : '');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className =
      'inline-flex items-center gap-1 rounded text-xs uppercase tracking-wider hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ' +
      (isActive ? 'text-foreground' : '');
    btn.appendChild(document.createTextNode(label));
    const ind = document.createElement('span');
    ind.className =
      'select-none ' +
      (isActive ? '' : 'text-muted-foreground/40');
    ind.textContent = isActive
      ? state.sort.direction === 'asc'
        ? '↑'
        : '↓'
      : '↕';
    ind.setAttribute('aria-hidden', 'true');
    btn.appendChild(ind);
    btn.addEventListener('click', () => {
      if (state.sort.column === column) {
        state.sort = {
          column,
          direction: state.sort.direction === 'asc' ? 'desc' : 'asc',
        };
      } else {
        state.sort = { column, direction: 'asc' };
      }
      render();
    });
    th.appendChild(btn);
    return th;
  }

  // --- filtering ---
  function filteredEntries() {
    const entries = Object.entries(data.supported);
    const term = state.debounced.trim();
    entries.sort(([aHost, aSupp], [bHost, bSupp]) => {
      if (state.sort.column === 'service') {
        return state.sort.direction === 'asc'
          ? aHost.localeCompare(bHost)
          : bHost.localeCompare(aHost);
      }
      const idx = services.indexOf(state.sort.column);
      const aHas = idx >= 0 && aSupp.includes(idx) ? 1 : 0;
      const bHas = idx >= 0 && bSupp.includes(idx) ? 1 : 0;
      return state.sort.direction === 'asc' ? aHas - bHas : bHas - aHas;
    });
    if (!term) return entries;
    const extracted = extractHostnameFromURL(term);
    if (extracted) {
      const needle = normalizeHostname(extracted);
      return entries
        .map(([host, supp]) => ({
          host,
          supp,
          score: similarityScore(host, needle),
        }))
        .filter((m) => m.score >= 60)
        .sort((a, b) => b.score - a.score)
        .map(({ host, supp }) => [host, supp]);
    }
    const needle = term.toLowerCase();
    return entries.filter(([host]) => host.toLowerCase().includes(needle));
  }

  function render() {
    const filtered = filteredEntries();
    const limit =
      state.fullyLoaded || state.debounced
        ? filtered.length
        : Math.min(initialLimit, filtered.length);
    const visible = filtered.slice(0, limit);
    const showingAll =
      state.fullyLoaded ||
      state.debounced ||
      filtered.length <= initialLimit;

    counter.textContent = state.debounced
      ? `${filtered.length} of ${hostCount} hosts`
      : `${hostCount} hosts`;

    // Replace tbody contents
    tbody.innerHTML = '';
    if (visible.length === 0) {
      const tr = document.createElement('tr');
      const td = document.createElement('td');
      td.colSpan = services.length + 1;
      td.className =
        'px-4 py-16 text-center text-sm text-muted-foreground';
      td.textContent = 'No hosts match your search.';
      tr.appendChild(td);
      tbody.appendChild(tr);
    } else {
      for (const [host, supportedIndices] of visible) {
        tbody.appendChild(rowFor(host, supportedIndices));
      }
    }

    // Refresh header sort indicators — replace the whole thead row.
    const trh2 = document.createElement('tr');
    trh2.className = 'border-b border-border bg-muted/40';
    trh2.appendChild(sortHeaderCell('Host', 'service', true));
    for (const s of services) {
      trh2.appendChild(
        sortHeaderCell(SERVICES[s]?.name ?? s, s, false, 'text-center')
      );
    }
    thead.replaceChildren(trh2);

    // Load-all button
    bottom.innerHTML = '';
    if (!showingAll && filtered.length > initialLimit) {
      const btn = Button({
        variant: 'outline',
        type: 'button',
        children: `Load all ${filtered.length} hosts`,
        onClick: () => {
          state.fullyLoaded = true;
          render();
        },
      });
      bottom.appendChild(btn);
    }
  }

  function rowFor(host, supportedIndices) {
    const tr = document.createElement('tr');
    tr.className =
      'group border-b border-border/40 last:border-0 transition-colors hover:bg-muted/30';

    const th = document.createElement('th');
    th.scope = 'row';
    th.className =
      'sticky left-0 z-10 bg-card px-3 py-2 text-left font-normal text-foreground border-r border-border transition-colors group-hover:bg-muted/30';
    th.textContent = host;
    tr.appendChild(th);

    services.forEach((service, idx) => {
      const td = document.createElement('td');
      td.className = 'px-2 py-2 text-center';
      td.dataset.supported = String(supportedIndices.includes(idx));
      const supported = supportedIndices.includes(idx);
      if (supported) {
        const url = SERVICE_STATUS_PAGES[service];
        if (url) {
          const a = document.createElement('a');
          a.href = url;
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
          a.className =
            'inline-flex h-7 w-7 items-center justify-center rounded-md text-success transition-colors hover:bg-success-muted hover:text-success focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';
          a.setAttribute(
            'aria-label',
            `${host} supported by ${service} — open status page`
          );
          a.title = `Check live status for ${service}`;
          a.appendChild(
            icon('check', { class: 'h-4 w-4', 'aria-hidden': 'true' })
          );
          td.appendChild(a);
        } else {
          td.appendChild(
            icon('check', {
              class: 'mx-auto h-4 w-4 text-success',
              'aria-label': `${host} supported by ${service}`,
            })
          );
        }
      } else {
        const sp = document.createElement('span');
        sp.className =
          'block text-center text-muted-foreground/30 select-none';
        sp.setAttribute(
          'aria-label',
          `${host} not supported by ${service}`
        );
        sp.textContent = '—';
        td.appendChild(sp);
      }
      tr.appendChild(td);
    });

    return tr;
  }

  // Debounce via rAF
  let rafId = 0;
  function scheduleDebounce() {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      state.debounced = state.search;
      render();
    });
  }

  render();
  return root;
}

function similarityScore(host, needle) {
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