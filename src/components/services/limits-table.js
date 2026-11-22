import { SERVICES } from '../../data/services.ts';
import { SERVICE_LIMITS } from '../../data/limits.ts';

const COLUMNS = [
  { key: 'slots', label: 'Active slots' },
  { key: 'maxSize', label: 'Max size' },
  { key: 'caps', label: 'Traffic caps' },
  { key: 'ipPolicy', label: 'IP / VPN' },
  { key: 'freeTier', label: 'Free tier' },
  { key: 'apiLimits', label: 'API limits' },
];

export function initLimitsTable(slot) {
  if (!slot) return;
  const wrap = document.createElement('div');
  wrap.className = 'overflow-x-auto rounded-lg border border-border';

  const table = document.createElement('table');
  table.className = 'w-full min-w-max text-sm';
  table.setAttribute('aria-label', 'Debrid service limits and restrictions comparison');

  const thead = document.createElement('thead');
  const trh = document.createElement('tr');
  trh.className = 'border-b border-border';
  const thService = document.createElement('th');
  thService.scope = 'col';
  thService.className =
    'sticky left-0 z-20 border-r border-border bg-muted px-3 py-2 text-left text-xs font-medium text-muted-foreground';
  thService.textContent = 'Service';
  trh.appendChild(thService);
  for (const { label } of COLUMNS) {
    const th = document.createElement('th');
    th.scope = 'col';
    th.className =
      'px-3 py-2 text-left text-xs font-medium text-muted-foreground';
    th.textContent = label;
    trh.appendChild(th);
  }
  thead.appendChild(trh);
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  for (const row of SERVICE_LIMITS) {
    const tr = document.createElement('tr');
    tr.className = 'border-b border-border/70 last:border-b-0';
    const th = document.createElement('th');
    th.scope = 'row';
    th.className =
      'sticky left-0 z-10 border-r border-border bg-background px-3 py-3 text-left font-medium';
    th.textContent = SERVICES[row.service].name;
    tr.appendChild(th);
    for (const { key } of COLUMNS) {
      const td = document.createElement('td');
      td.className = 'px-3 py-3 text-left align-top text-muted-foreground';
      td.textContent = row[key];
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }
  table.appendChild(tbody);

  wrap.appendChild(table);
  slot.replaceChildren(wrap);
}
