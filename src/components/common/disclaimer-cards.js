import { icon } from '../../lib/icons.js';

const ITEMS = [
  {
    icon: 'file-text',
    title: 'Services change frequently',
    body: 'Pricing, host support, refund policies, and features may be updated without notice. Always verify details on the official service websites before purchasing.',
  },
  {
    icon: 'banknote',
    title: 'Final cost may vary',
    body: 'Displayed prices are subject to exchange rates, regional taxes, or payment processing fees. Your actual charge may differ slightly.',
  },
  {
    icon: 'check',
    title: 'Data accuracy',
    body: 'While we strive for completeness, this comparison reflects community reports and public information. We do not guarantee uptime, speed, download success, or feature availability.',
  },
  {
    icon: 'heart',
    title: 'No affiliation',
    body: 'This project is independent and not affiliated with any listed service.',
  },
  {
    icon: 'alert-triangle',
    title: 'Use at your own discretion',
    body: 'Choosing a debrid service involves personal judgment. Test short-term plans first and review terms carefully.',
  },
  {
    icon: 'scale',
    title: 'Legal responsibility',
    body: 'Debrid services are tools. You are responsible for complying with copyright laws and terms of use when accessing content.',
  },
];

export function DisclaimerCards() {
  const grid = document.createElement('div');
  grid.className =
    'grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3';
  for (const { icon: name, title, body } of ITEMS) {
    grid.appendChild(card(name, title, body));
  }
  return grid;
}

function card(iconName, title, body) {
  const el = document.createElement('article');
  el.className = 'rounded-lg border border-border bg-card p-4';
  el.appendChild(
    icon(iconName, {
      class: 'h-4 w-4 shrink-0 text-muted-foreground',
      'aria-hidden': 'true',
    })
  );
  const h = document.createElement('h3');
  h.className =
    'mt-3 text-sm font-semibold leading-tight tracking-tight text-foreground';
  h.textContent = title;
  el.appendChild(h);
  const p = document.createElement('p');
  p.className = 'mt-1.5 text-sm leading-relaxed text-muted-foreground';
  p.textContent = body;
  el.appendChild(p);
  return el;
}