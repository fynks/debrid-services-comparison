import { icon } from '../../lib/icons.js';

const BENEFITS = [
  {
    title: 'Save money',
    icon: 'banknote',
    body: 'Compare plan prices across providers before you commit. Most offer a free trial or money-back window.',
  },
  {
    title: 'One account, many hosts',
    icon: 'network',
    body: 'Every service here supports hundreds of file hosts, so a single subscription covers most of what you download.',
  },
  {
    title: 'Predictable speeds',
    icon: 'gauge',
    body: 'Premium networks route around throttled or congested paths, delivering consistent gigabit-class throughput.',
  },
  {
    title: 'Privacy & safety',
    icon: 'lock',
    body: 'Your home IP stays private — file hosts never see it. Encrypted downloads reduce ISP-level inspection.',
  },
];

/**
 * Benefits band: single-column on mobile, 4-up on `sm+`. No decoration,
 * just an icon, title, and one-line body per cell.
 */
export function BenefitsSection() {
  const section = document.createElement('section');
  section.id = 'benefits';
  section.className = 'border-b border-border/70 bg-muted/40';

  const inner = document.createElement('div');
  inner.className =
    'mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 sm:py-14';

  const head = document.createElement('div');
  head.className = 'max-w-2xl';
  head.innerHTML = `
    <p class="mb-2 text-2xs font-semibold uppercase tracking-wider text-muted-foreground">Why pay for debrid</p>
    <h2 class="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">Premium debrid in plain English</h2>
    <p class="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base sm:text-pretty">A paid debrid subscription replaces the free accounts, captchas, and wait timers that plague direct downloads. The four points below cover what every provider here offers.</p>
  `;
  inner.appendChild(head);

  const grid = document.createElement('ul');
  grid.className =
    'grid grid-cols-1 gap-6 sm:grid-cols-4 sm:gap-4';
  BENEFITS.forEach((b) => {
    const li = document.createElement('li');
    li.className = 'flex items-start gap-3';
    const wrap = icon(b.icon, {
      class: 'mt-0.5 h-5 w-5 shrink-0 text-primary',
      'aria-hidden': 'true',
    });
    li.appendChild(wrap);
    const txt = document.createElement('div');
    const t = document.createElement('h3');
    t.className = 'text-sm font-semibold text-foreground';
    t.textContent = b.title;
    txt.appendChild(t);
    const p = document.createElement('p');
    p.className =
      'mt-1 text-sm leading-relaxed text-muted-foreground';
    p.textContent = b.body;
    txt.appendChild(p);
    li.appendChild(txt);
    grid.appendChild(li);
  });
  inner.appendChild(grid);
  section.appendChild(inner);
  return section;
}