import { icon } from '../../lib/icons.js';
import {
  PRICING_ROWS,
  PRICING_SERVICES,
  REFERRAL_LINKS,
} from '../../data/pricing.ts';
import { SERVICES } from '../../data/services.ts';
import { cn } from '../../lib/dom.js';

export function initPricingTable(slot) {
  if (!slot) return;
  const wrap = document.createElement('div');
  wrap.className = 'overflow-x-auto rounded-lg border border-border';

  const table = document.createElement('table');
  table.className = 'w-full min-w-max text-sm tabular-nums';
  table.setAttribute('aria-label', 'Pricing comparison');

  const thead = document.createElement('thead');
  const trh = document.createElement('tr');
  trh.className = 'border-b border-border bg-muted/40';
  trh.appendChild(th('Plan', 'sticky left-0 z-20 border-r border-border bg-muted'));
  for (const s of PRICING_SERVICES) {
    trh.appendChild(th(SERVICES[s]?.name ?? s, 'whitespace-nowrap'));
  }
  thead.appendChild(trh);
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  for (const row of PRICING_ROWS) {
    const tr = document.createElement('tr');
    if (row.isHighlight) {
      tr.className =
        'group border-b border-border/60 bg-info-muted/30 transition-colors hover:bg-info-muted/50 last:border-0';
    } else {
      tr.className =
        'group border-b border-border/40 transition-colors hover:bg-muted/40 last:border-0';
    }

    const thEl = document.createElement('th');
    thEl.scope = 'row';
    if (row.isHighlight) {
      thEl.className =
        'sticky left-0 z-10 border-r border-border bg-info-muted px-3 py-2.5 text-left font-medium text-foreground transition-colors group-hover:bg-info-muted/50';
    } else {
      thEl.className =
        'sticky left-0 z-10 border-r border-border bg-background px-3 py-2 text-left font-medium text-foreground transition-colors group-hover:bg-muted/40';
    }
    thEl.textContent = row.plan;
    tr.appendChild(thEl);

    for (const s of PRICING_SERVICES) {
      const td = document.createElement('td');
      const value = row.cells[s];
      if (row.isHighlight) {
        td.className = 'whitespace-nowrap px-3 py-2.5 text-foreground';
      } else {
        td.className = 'whitespace-nowrap px-3 py-2 text-muted-foreground';
      }
      if (value == null) {
        const dash = document.createElement('span');
        dash.className = 'text-muted-foreground/40';
        dash.textContent = '-';
        td.appendChild(dash);
      } else {
        td.appendChild(document.createTextNode(String(value)));
      }
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }
  table.appendChild(tbody);

  wrap.appendChild(table);
  slot.replaceChildren(wrap);
}

export function initReferralLinks(slot) {
  if (!slot) return;
  const grid = document.createElement('div');
  grid.className = 'grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4';
  for (const ref of REFERRAL_LINKS) {
    const a = document.createElement('a');
    a.href = ref.url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer sponsored';
    a.className =
      'group flex flex-col justify-between rounded-lg border border-border bg-card p-3.5 transition-colors hover:border-foreground/30 hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:p-4';
    a.setAttribute(
      'aria-label',
      `Sign up for ${SERVICES[ref.service].name} (referral)`
    );

    const top = document.createElement('div');
    top.className = 'flex items-start justify-between gap-2';
    const name = document.createElement('span');
    name.className = 'text-sm font-medium leading-tight';
    name.textContent = SERVICES[ref.service].name;
    top.appendChild(name);

    const badge = document.createElement('span');
    badge.className =
      'inline-flex shrink-0 items-center rounded-md border border-transparent bg-muted px-2 py-0.5 text-2xs font-medium text-muted-foreground';
    badge.textContent = 'Referral';
    top.appendChild(badge);
    a.appendChild(top);

    const bottom = document.createElement('div');
    bottom.className = 'mt-3 flex items-end justify-between gap-2';
    const benefit = document.createElement('span');
    benefit.className =
      'text-xs tabular-nums text-muted-foreground sm:text-sm';
    benefit.textContent = ref.benefit;
    bottom.appendChild(benefit);
    bottom.appendChild(
      icon('external-link', {
        class:
          'h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground',
        'aria-hidden': 'true',
      })
    );
    a.appendChild(bottom);

    grid.appendChild(a);
  }
  slot.replaceChildren(grid);
}

function th(label, extra = '') {
  const t = document.createElement('th');
  t.scope = 'col';
  t.className = cn(
    'px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground',
    extra
  );
  t.textContent = label;
  return t;
}