// Status + speed-test grids. The static HTML provides the section
// headers; these scripts populate the dynamic card grids.

import { icon } from '../../lib/icons.js';
import { SPEED_TEST_LINKS, STATUS_LINKS } from '../../data/policies.ts';
import { SERVICES } from '../../data/services.ts';

export function initStatusGrid(slot) {
  if (!slot) return;
  const grid = document.createElement('div');
  grid.className = 'grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3';
  for (const { service, url, description } of STATUS_LINKS) {
    grid.appendChild(statusCard(service, url, description));
  }
  slot.replaceChildren(grid);
}

export function initSpeedTestGrid(slot) {
  if (!slot) return;
  const grid = document.createElement('div');
  grid.className = 'grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3';
  for (const { service, url, label } of SPEED_TEST_LINKS) {
    grid.appendChild(speedCard(service, url, label));
  }
  slot.replaceChildren(grid);
}

function statusCard(service, url, description) {
  const a = document.createElement('a');
  a.href = url;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  a.className =
    'group flex flex-col rounded-lg border border-border bg-card p-4 transition-colors hover:border-foreground/30 hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';
  a.setAttribute('aria-label', `Open ${SERVICES[service].name} status page`);

  const head = document.createElement('div');
  head.className = 'flex items-center justify-between gap-2';
  const name = document.createElement('span');
  name.className = 'text-sm font-semibold leading-tight text-foreground';
  name.textContent = SERVICES[service].name;
  head.appendChild(name);

  const live = document.createElement('span');
  live.className =
    'inline-flex items-center gap-1 rounded-md border border-transparent bg-success-muted px-2 py-0.5 text-2xs font-medium text-success';
  live.appendChild(
    icon('activity', { class: 'h-3 w-3', 'aria-hidden': 'true' })
  );
  live.appendChild(document.createTextNode('Live'));
  head.appendChild(live);
  a.appendChild(head);

  const desc = document.createElement('p');
  desc.className = 'mt-2 text-sm leading-relaxed text-muted-foreground';
  desc.textContent = description;
  a.appendChild(desc);

  const open = document.createElement('span');
  open.className =
    'mt-3 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors group-hover:text-foreground';
  open.textContent = 'Open status page';
  open.appendChild(
    icon('arrow-up-right', {
      class:
        'h-3 w-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5',
      'aria-hidden': 'true',
    })
  );
  a.appendChild(open);
  return a;
}

function speedCard(service, url, label) {
  const a = document.createElement('a');
  a.href = url;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  a.className =
    'group flex items-center justify-between gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:border-foreground/30 hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';

  const left = document.createElement('div');
  left.className = 'flex items-center gap-3';
  left.appendChild(
    icon('gauge', {
      class:
        'h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground',
      'aria-hidden': 'true',
    })
  );
  const text = document.createElement('div');
  const name = document.createElement('span');
  name.className = 'text-sm font-semibold leading-tight text-foreground';
  name.textContent = SERVICES[service].name;
  text.appendChild(name);
  const sub = document.createElement('p');
  sub.className = 'mt-0.5 text-xs text-muted-foreground';
  sub.textContent = label ?? 'Speed Test';
  text.appendChild(sub);
  left.appendChild(text);
  a.appendChild(left);

  a.appendChild(
    icon('arrow-up-right', {
      class:
        'h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground',
      'aria-hidden': 'true',
    })
  );
  return a;
}