import { icon } from '../../lib/icons.js';
import { Alert } from '../common/alert.js';
import { Select } from '../ui/select.js';
import { Button } from '../common/button.js';
import { Badge } from '../common/badge.js';
import { SERVICES } from '../../data/services.ts';

/**
 * Two-service side-by-side host comparison. Reads `?compare=&with=`
 * query params on mount and dispatches URL updates on change.
 */
export function ServiceComparison({ data } = {}) {
  const services = data.services;

  let a = readInitialSelection(services)[0];
  let b = readInitialSelection(services)[1];

  // Root container
  const root = document.createElement('div');
  root.className = 'space-y-6';

  // Top row: two selects + "vs" divider
  const topRow = document.createElement('div');
  topRow.className =
    'grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-end';

  const aWrap = document.createElement('div');
  const aLabel = document.createElement('label');
  aLabel.htmlFor = 'compare-First service';
  aLabel.className = 'mb-1.5 block text-xs font-medium text-muted-foreground';
  aLabel.textContent = 'First service';
  aWrap.appendChild(aLabel);
  const aSelect = Select({
    id: 'compare-First service',
    'aria-label': 'First service',
    value: a,
    options: services.map((s) => ({ value: s, label: SERVICES[s]?.name ?? s })),
    placeholder: 'Choose a service…',
    onChange: (v) => {
      a = v;
      syncUrl();
      render();
    },
  });
  aWrap.appendChild(aSelect);
  topRow.appendChild(aWrap);

  const vsDiv = document.createElement('div');
  vsDiv.className =
    'hidden text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground sm:block';
  vsDiv.textContent = 'vs';
  topRow.appendChild(vsDiv);

  const bWrap = document.createElement('div');
  const bLabel = document.createElement('label');
  bLabel.htmlFor = 'compare-Second service';
  bLabel.className = 'mb-1.5 block text-xs font-medium text-muted-foreground';
  bLabel.textContent = 'Second service';
  bWrap.appendChild(bLabel);
  const bSelect = Select({
    id: 'compare-Second service',
    'aria-label': 'Second service',
    value: b,
    options: services.map((s) => ({ value: s, label: SERVICES[s]?.name ?? s })),
    placeholder: 'Choose a service…',
    onChange: (v) => {
      b = v;
      syncUrl();
      render();
    },
  });
  bWrap.appendChild(bSelect);
  topRow.appendChild(bWrap);

  root.appendChild(topRow);

  // Status line + reset button row
  const statusRow = document.createElement('div');
  statusRow.className =
    'flex flex-wrap items-center justify-between gap-x-3 gap-y-2';
  const statusText = document.createElement('p');
  statusText.className =
    'min-w-0 flex-1 text-xs text-muted-foreground';
  statusRow.appendChild(statusText);
  const resetBtn = Button({
    variant: 'ghost',
    size: 'sm',
    type: 'button',
    children: (() => {
      const wrap = document.createDocumentFragment();
      wrap.appendChild(
        icon('rotate-ccw', {
          class: 'h-3.5 w-3.5',
          'aria-hidden': 'true',
        })
      );
      wrap.appendChild(document.createTextNode('Reset'));
      return wrap;
    })(),
    onClick: () => {
      a = '';
      b = '';
      syncUrl();
      render();
    },
  });
  resetBtn.classList.add('shrink-0');
  statusRow.appendChild(resetBtn);
  root.appendChild(statusRow);

  // Body (alerts + stats + table)
  const body = document.createElement('div');
  root.appendChild(body);

  function computeRows() {
    if (!a || !b) return [];
    const aIdx = services.indexOf(a);
    const bIdx = services.indexOf(b);
    if (aIdx < 0 || bIdx < 0) return [];
    return Object.entries(data.supported).map(([host, idxs]) => ({
      host,
      a: idxs.includes(aIdx),
      b: idxs.includes(bIdx),
    }));
  }

  function render() {
    const rows = computeRows();
    let shared = 0,
      aOnly = 0,
      bOnly = 0;
    for (const r of rows) {
      if (r.a && r.b) shared++;
      else if (r.a) aOnly++;
      else if (r.b) bOnly++;
    }

    // Status line
    if (a && b) {
      const aName = SERVICES[a]?.name ?? a;
      const bName = SERVICES[b]?.name ?? b;
      statusText.innerHTML =
        `Comparing <span class="font-medium text-foreground">${aName}</span>` +
        ` with <span class="font-medium text-foreground">${bName}</span>` +
        ` · <span class="tabular-nums">${rows.length} hosts analyzed</span>`;
    } else {
      statusText.textContent =
        'Choose two services to see a side-by-side host breakdown.';
    }
    resetBtn.style.display = a || b ? '' : 'none';

    body.innerHTML = '';
    if (a && a === b) {
      body.appendChild(
        Alert({
          variant: 'warning',
          children: 'Please select two different services.',
        })
      );
      return;
    }
    if (!a || !b) {
      const empty = document.createElement('div');
      empty.className =
        'rounded-lg border border-dashed border-border p-12 text-center text-sm text-muted-foreground';
      empty.textContent = 'Pick two services above to start the comparison.';
      body.appendChild(empty);
      return;
    }

    // Stats
    const statsGrid = document.createElement('div');
    statsGrid.className =
      'grid grid-cols-1 gap-3 sm:grid-cols-3';
    statsGrid.appendChild(
      statCard('Both', shared, 'border-success/30 bg-success-muted/40')
    );
    statsGrid.appendChild(
      statCard(
        `${SERVICES[a].name} only`,
        aOnly,
        'border-info/30 bg-info-muted/40'
      )
    );
    statsGrid.appendChild(
      statCard(
        `${SERVICES[b].name} only`,
        bOnly,
        'border-warning/30 bg-warning-muted/40'
      )
    );
    body.appendChild(statsGrid);

    // Table
    const wrap = document.createElement('div');
    wrap.className =
      'overflow-x-auto rounded-lg border border-border';

    const table = document.createElement('table');
    table.className = 'w-full min-w-max text-sm tabular-nums';
    table.setAttribute(
      'aria-label',
      `Comparing ${SERVICES[a].name} and ${SERVICES[b].name}`
    );

    const thead = document.createElement('thead');
    const trh = document.createElement('tr');
    trh.className = 'border-b border-border bg-muted/40';
    trh.appendChild(
      th('Host', 'sticky left-0 z-20 border-r border-border bg-muted')
    );
    trh.appendChild(th(SERVICES[a].name, 'text-center'));
    trh.appendChild(th(SERVICES[b].name, 'text-center'));
    trh.appendChild(th('Status'));
    thead.appendChild(trh);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    for (const r of rows) {
      const tr = document.createElement('tr');
      tr.className =
        'group border-b border-border/50 last:border-0 transition-colors hover:bg-muted/30';
      tr.appendChild(
        (() => {
          const t = document.createElement('th');
          t.scope = 'row';
          t.className =
            'sticky left-0 z-10 border-r border-border bg-background px-3 py-1.5 text-left font-normal transition-colors group-hover:bg-muted/30';
          t.textContent = r.host;
          return t;
        })()
      );
      tr.appendChild(cell(r.a, a, r.host));
      tr.appendChild(cell(r.b, b, r.host));
      const sTd = document.createElement('td');
      sTd.className = 'px-3 py-1.5';
      sTd.appendChild(statusBadge(r, a, b));
      tr.appendChild(sTd);
      tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    wrap.appendChild(table);
    body.appendChild(wrap);
  }

  function syncUrl() {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    if (a) url.searchParams.set('compare', a);
    else url.searchParams.delete('compare');
    if (b) url.searchParams.set('with', b);
    else url.searchParams.delete('with');
    window.history.replaceState(null, '', url);
  }

  // Listen for deep-link events from HashDeepLinks.
  if (typeof window !== 'undefined') {
    window.addEventListener('deep-link:compare', (e) => {
      const { compare, with: withP } = e.detail || {};
      if (compare && services.includes(compare)) a = compare;
      if (withP && services.includes(withP)) b = withP;
      syncUrl();
      render();
    });
  }

  render();
  return root;
}

function readInitialSelection(services) {
  if (typeof window === 'undefined') return ['', ''];
  const params = new URLSearchParams(window.location.search);
  const compare = params.get('compare');
  const withP = params.get('with');
  return [
    services.includes(compare) ? compare : '',
    services.includes(withP) ? withP : '',
  ];
}

function statCard(label, value, classes) {
  const d = document.createElement('div');
  d.className = `rounded-md border p-3 ${classes}`;
  const p = document.createElement('p');
  p.className =
    'text-2xs font-semibold uppercase tracking-wider text-muted-foreground';
  p.textContent = label;
  d.appendChild(p);
  const v = document.createElement('p');
  v.className = 'mt-1 text-2xl font-semibold tabular-nums';
  v.textContent = String(value);
  d.appendChild(v);
  return d;
}

function th(label, extra = '') {
  const t = document.createElement('th');
  t.scope = 'col';
  t.className =
    `px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground ${extra}`;
  t.textContent = label;
  return t;
}

function cell(supported, service, host) {
  const td = document.createElement('td');
  td.className = 'px-3 py-1.5 text-center';
  const name = SERVICES[service].name;
  if (supported) {
    const url = SERVICES[service].statusPage;
    if (url) {
      const a = document.createElement('a');
      a.href = url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.setAttribute(
        'aria-label',
        `${host} supported by ${name} — open status page`
      );
      a.className =
        'inline-flex items-center text-success hover:text-success/80';
      a.appendChild(
        icon('check', { class: 'h-4 w-4', 'aria-hidden': 'true' })
      );
      td.appendChild(a);
    } else {
      td.appendChild(
        icon('check', {
          class: 'mx-auto h-4 w-4 text-success',
          'aria-label': `${host} supported by ${name}`,
        })
      );
    }
  } else {
    td.appendChild(
      icon('x', {
        class: 'mx-auto h-4 w-4 text-muted-foreground/40',
        'aria-label': `${host} not supported by ${name}`,
      })
    );
  }
  return td;
}

function statusBadge(row, a, b) {
  let label, variant;
  const aName = SERVICES[a].name;
  const bName = SERVICES[b].name;
  if (row.a && row.b) {
    label = 'Both';
    variant = 'success';
  } else if (row.a) {
    label = `${aName} only`;
    variant = 'info';
  } else if (row.b) {
    label = `${bName} only`;
    variant = 'warning';
  } else {
    label = 'Neither';
    variant = 'muted';
  }
  return Badge({ variant, children: label });
}