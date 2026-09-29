import { icon } from '../../lib/icons.js';
import { Badge } from '../common/badge.js';

/**
 * <ResourceGroupSection group={…} initialOpen={true} />
 *
 * One collapsible group. Built on native `<details>`/`<summary>` for
 * keyboard support and reduced-motion-friendly transitions. Open by
 * default for the first group so users see content immediately.
 */
export function ResourceGroupSection({ group, initialOpen = false } = {}) {
  const details = document.createElement('details');
  details.className =
    'group rounded-lg border border-border bg-card open:bg-card';
  if (initialOpen) details.open = true;

  // Summary
  const summary = document.createElement('summary');
  summary.className =
    'flex cursor-pointer list-none items-center gap-2 px-4 py-3 transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [&::-webkit-details-marker]:hidden';

  if (group.icon) {
    const I = icon(group.icon, {
      class: 'h-3.5 w-3.5 shrink-0 text-muted-foreground',
      'aria-hidden': 'true',
    });
    summary.appendChild(I);
  }
  const h = document.createElement('h3');
  h.className =
    'flex-1 text-2xs font-semibold uppercase tracking-wider text-muted-foreground sm:text-xs';
  h.textContent = group.title;
  summary.appendChild(h);

  const count = document.createElement('span');
  count.className =
    'text-2xs tabular-nums text-muted-foreground sm:text-xs';
  count.textContent = String(group.items.length);
  summary.appendChild(count);

  const chevron = icon('chevron-down', {
    class:
      'h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180',
    'aria-hidden': 'true',
  });
  summary.appendChild(chevron);

  details.appendChild(summary);

  // Body
  const body = document.createElement('div');
  body.className = 'border-t border-border p-3 sm:p-4';
  const grid = document.createElement('div');
  grid.className = 'grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3';
  for (const item of group.items) {
    grid.appendChild(resourceCard(item));
  }
  body.appendChild(grid);
  details.appendChild(body);

  return details;
}

function resourceCard(item) {
  const hasExtra = !!item.extraLinks?.length;
  const mainHref = hasExtra ? undefined : item.url;
  const card = document.createElement('div');
  card.className =
    'group/card relative flex flex-col rounded-lg border border-border bg-background p-4 transition-colors hover:border-foreground/30 hover:bg-muted/40';

  if (mainHref) {
    const link = document.createElement('a');
    link.href = mainHref;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.className =
      'absolute inset-0 z-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';
    link.setAttribute('aria-label', item.name);
    const sr = document.createElement('span');
    sr.className = 'sr-only';
    sr.textContent = item.name;
    link.appendChild(sr);
    card.appendChild(link);
  }

  const head = document.createElement('div');
  head.className =
    'relative z-10 flex items-start justify-between gap-2';
  const name = document.createElement('span');
  name.className =
    'text-sm font-semibold leading-tight text-foreground';
  name.textContent = item.name;
  head.appendChild(name);
  if (!hasExtra) {
    const arrow = icon('arrow-up-right', {
      class:
        'h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform group-hover/card:-translate-y-0.5 group-hover/card:translate-x-0.5 group-hover/card:text-foreground',
      'aria-hidden': 'true',
    });
    head.appendChild(arrow);
  }
  card.appendChild(head);

  const desc = document.createElement('p');
  desc.className =
    'relative z-10 mt-2 text-sm leading-relaxed text-muted-foreground';
  desc.textContent = item.description;
  card.appendChild(desc);

  const tags = document.createElement('div');
  tags.className = 'relative z-10 mt-4 flex flex-wrap gap-1.5';
  for (const t of item.tags ?? []) {
    tags.appendChild(Badge({ variant: 'muted', children: t, class: 'text-2xs' }));
  }
  card.appendChild(tags);

  if (item.extraLinks?.length) {
    const extras = document.createElement('div');
    extras.className =
      'relative z-10 mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs';
    for (const link of item.extraLinks) {
      const a = document.createElement('a');
      a.href = link.url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.className =
        'inline-flex items-center gap-0.5 rounded font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';
      a.textContent = link.label;
      const arrow = icon('arrow-up-right', {
        class: 'h-3 w-3',
        'aria-hidden': 'true',
      });
      a.appendChild(arrow);
      extras.appendChild(a);
    }
    card.appendChild(extras);
  }
  return card;
}