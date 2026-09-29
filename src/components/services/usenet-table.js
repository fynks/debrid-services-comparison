import { icon } from '../../lib/icons.js';
import { SERVICES } from '../../data/services.ts';
import { USENET_SUPPORT } from '../../data/policies.ts';

/**
 * <UsenetTable /> — which debrid services support Usenet.
 * Static, server-rendered: no search, no sort, just a 1-row truth table.
 */
export function UsenetTable() {
  const wrap = document.createElement('div');
  wrap.className = 'overflow-x-auto rounded-lg border border-border';

  const table = document.createElement('table');
  table.className = 'w-full min-w-max text-sm';
  table.setAttribute('aria-label', 'Usenet support comparison');

  // Header
  const thead = document.createElement('thead');
  const trh = document.createElement('tr');
  trh.className = 'border-b border-border';
  const thService = document.createElement('th');
  thService.scope = 'col';
  thService.className =
    'sticky left-0 z-20 border-r border-border bg-muted px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground';
  thService.textContent = 'Service';
  trh.appendChild(thService);
  for (const { service } of USENET_SUPPORT) {
    const th = document.createElement('th');
    th.scope = 'col';
    th.className =
      'px-3 py-2 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground';
    th.textContent = SERVICES[service].name;
    trh.appendChild(th);
  }
  thead.appendChild(trh);
  table.appendChild(thead);

  // Body
  const tbody = document.createElement('tbody');
  const trb = document.createElement('tr');
  const thRow = document.createElement('th');
  thRow.scope = 'row';
  thRow.className =
    'sticky left-0 z-10 border-r border-border bg-background px-3 py-3 text-left font-medium';
  thRow.textContent = 'Usenet';
  trb.appendChild(thRow);
  for (const { service, supported } of USENET_SUPPORT) {
    const td = document.createElement('td');
    td.className = 'px-3 py-3 text-center';
    const name = SERVICES[service].name;
    if (supported) {
      const c = icon('check', {
        class: 'mx-auto h-4 w-4 text-success',
        'aria-label': `${name} supports Usenet`,
      });
      td.appendChild(c);
    } else {
      const c = icon('x', {
        class: 'mx-auto h-4 w-4 text-muted-foreground/40',
        'aria-label': `${name} does not support Usenet`,
      });
      td.appendChild(c);
    }
    trb.appendChild(td);
  }
  tbody.appendChild(trb);
  table.appendChild(tbody);

  wrap.appendChild(table);
  return wrap;
}