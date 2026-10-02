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
    title: 'Legal information',
    body: 'The legal status of a service or a particular use depends on jurisdiction, content, authorization, and other facts. This guide is not legal advice; review local law and provider terms.',
  },
];

export function initDisclaimerCards(slot) {
  if (!slot) return;
  const grid = document.createElement('div');
  grid.className = 'grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3';
  for (const { icon: name, title, body } of ITEMS) {
    grid.appendChild(card(name, title, body));
  }
  slot.replaceChildren(grid);
}

function card(iconName, title, body) {
  const el = document.createElement('article');
  el.className = 'rounded-lg border border-border bg-card p-4';
  const SVG_NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('class', 'h-4 w-4 shrink-0 text-muted-foreground');
  svg.setAttribute('aria-hidden', 'true');
  const use = document.createElementNS(SVG_NS, 'use');
  use.setAttribute('href', `#i-${iconName}`);
  svg.appendChild(use);
  el.appendChild(svg);

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