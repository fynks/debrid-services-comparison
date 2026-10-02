import { icon } from '../../lib/icons.js';
import { POLICY_ROWS } from '../../data/policies.ts';
import { SERVICES } from '../../data/services.ts';

export function initPoliciesTable(slot) {
  if (!slot) return;
  const wrap = document.createElement('div');
  wrap.className = 'overflow-x-auto rounded-lg border border-border';

  const table = document.createElement('table');
  table.className = 'w-full min-w-max text-sm';
  table.setAttribute('aria-label', 'Policies and legal information');

  const thead = document.createElement('thead');
  const trh = document.createElement('tr');
  trh.className = 'border-b border-border';
  trh.appendChild(headerCell('Service', { sticky: true }));
  for (const label of ['Terms', 'Privacy', 'Refund', 'Support']) {
    trh.appendChild(headerCell(label));
  }
  thead.appendChild(trh);
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  for (const row of POLICY_ROWS) {
    const tr = document.createElement('tr');
    tr.className =
      'group border-b border-border/40 last:border-0 transition-colors hover:bg-muted/30';

    const th = document.createElement('th');
    th.scope = 'row';
    th.className =
      'sticky left-0 z-10 border-r border-border bg-background px-3 py-2 text-left font-medium transition-colors group-hover:bg-muted/30';
    th.textContent = SERVICES[row.service].name;
    tr.appendChild(th);

    tr.appendChild(refundCell(row.terms, row.termsLabel ?? 'TOS'));
    tr.appendChild(refundCell(row.privacy, row.privacyLabel ?? 'Privacy'));
    tr.appendChild(refundOrDash(row.refund, row.refundLabel ?? 'Refunds'));
    tr.appendChild(refundCell(row.support, row.supportLabel ?? 'Contact'));

    tbody.appendChild(tr);
  }
  table.appendChild(tbody);
  wrap.appendChild(table);
  slot.replaceChildren(wrap);
}

function headerCell(label, opts = {}) {
  const th = document.createElement('th');
  th.scope = 'col';
  const stickyClass = opts.sticky
    ? ' sticky left-0 z-20 border-r border-border bg-muted'
    : '';
  th.className =
    'px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground' +
    stickyClass;
  th.textContent = label;
  return th;
}

function policyLink(href, text) {
  const a = document.createElement('a');
  a.href = href;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  a.className =
    'inline-flex items-center gap-1 text-foreground underline-offset-4 hover:underline';
  a.textContent = text;
  a.appendChild(icon('external-link', { class: 'h-3 w-3', 'aria-hidden': 'true' }));
  return a;
}

function refundCell(href, text) {
  const td = document.createElement('td');
  td.className = 'px-3 py-2';
  if (href) {
    td.appendChild(policyLink(href, text));
  } else {
    const span = document.createElement('span');
    span.className = 'text-muted-foreground/40';
    span.textContent = '-';
    td.appendChild(span);
  }
  return td;
}

function refundOrDash(value, label) {
  const td = document.createElement('td');
  td.className = 'px-3 py-2';
  if (value && value.startsWith('http')) {
    td.appendChild(policyLink(value, label));
  } else {
    const span = document.createElement('span');
    span.className = 'text-muted-foreground';
    span.textContent = value ?? '-';
    td.appendChild(span);
  }
  return td;
}