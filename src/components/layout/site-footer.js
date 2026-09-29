import { icon } from '../../lib/icons.js';

const COLUMNS = [
  {
    title: 'Sections',
    links: [
      { href: '#services', label: 'Services' },
      { href: '#pricing', label: 'Pricing' },
      { href: '#hosts', label: 'Hosts' },
      { href: '#comparison', label: 'Compare' },
      { href: '#resources', label: 'Resources' },
    ],
  },
  {
    title: 'Live status',
    links: [
      { href: 'https://status.real-debrid.com', label: 'Real-Debrid' },
      { href: 'https://status.alldebrid.org', label: 'AllDebrid' },
      { href: 'https://torbox.app/status', label: 'TorBox' },
      { href: 'https://www.premiumize.me/status', label: 'Premiumize' },
    ],
  },
  {
    title: 'About',
    links: [
      { href: '#disclaimers', label: 'Disclaimers' },
      { href: 'https://github.com/fynks/debrid-services-comparison', label: 'Source' },
      { href: '#faq', label: 'FAQ' },
    ],
  },
];

export function SiteFooter() {
  const f = document.createElement('footer');
  f.className = 'border-t border-border/70 bg-background';

  const inner = document.createElement('div');
  inner.className =
    'mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 sm:grid-cols-4';

  // Brand block
  const brand = document.createElement('div');
  brand.className = 'flex flex-col gap-2';
  const brandTitle = document.createElement('p');
  brandTitle.className =
    'flex items-center gap-2 font-semibold text-foreground';
  brandTitle.appendChild(
    icon('gauge', { class: 'h-4 w-4 text-primary', 'aria-hidden': 'true' })
  );
  brandTitle.appendChild(document.createTextNode('DebridCompare'));
  brand.appendChild(brandTitle);
  const tagline = document.createElement('p');
  tagline.className = 'text-sm text-muted-foreground';
  tagline.textContent =
    'Independent comparison of paid debrid services. Not affiliated with any provider.';
  brand.appendChild(tagline);
  inner.appendChild(brand);

  for (const col of COLUMNS) {
    const c = document.createElement('div');
    const h = document.createElement('h3');
    h.className =
      'mb-3 text-2xs font-semibold uppercase tracking-wider text-muted-foreground';
    h.textContent = col.title;
    c.appendChild(h);
    const ul = document.createElement('ul');
    ul.className = 'flex flex-col gap-1.5';
    col.links.forEach((l) => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = l.href;
      a.className =
        'text-sm text-foreground/80 hover:text-foreground';
      a.textContent = l.label;
      if (l.href.startsWith('http')) {
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
      }
      li.appendChild(a);
      ul.appendChild(li);
    });
    c.appendChild(ul);
    inner.appendChild(c);
  }

  f.appendChild(inner);

  const bottom = document.createElement('div');
  bottom.className =
    'border-t border-border/70 px-4 py-4 text-center text-xs text-muted-foreground sm:px-6';
  bottom.textContent = `© ${new Date().getFullYear()} DebridCompare. Information current as of the date shown above each section.`;
  f.appendChild(bottom);

  return f;
}