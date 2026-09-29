import { on } from '../../lib/dom.js';
import { icon } from '../../lib/icons.js';
import { ThemeToggle } from '../common/theme-toggle.js';

/**
 * Site nav. Single, semantic `<header>` containing a sticky nav bar
 * with brand, primary links, theme toggle, and a mobile menu.
 */
const NAV_LINKS = [
  { href: '#services', label: 'Services' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#hosts', label: 'Hosts' },
  { href: '#comparison', label: 'Compare' },
  { href: '#resources', label: 'Resources' },
];

export function SiteHeader() {
  const header = document.createElement('header');
  header.className =
    'sticky top-0 z-30 w-full border-b border-border/70 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70';

  const inner = document.createElement('nav');
  inner.className =
    'mx-auto flex h-14 w-full max-w-6xl items-center gap-2 px-4 sm:px-6';
  inner.setAttribute('aria-label', 'Primary');

  // Brand
  const brand = document.createElement('a');
  brand.href = '#top';
  brand.className =
    'flex items-center gap-2 font-semibold tracking-tight text-foreground';
  const brandIcon = icon('gauge', {
    class: 'h-4 w-4 text-primary',
    'aria-hidden': 'true',
  });
  brand.appendChild(brandIcon);
  brand.appendChild(document.createTextNode('DebridCompare'));
  inner.appendChild(brand);

  // Primary links (desktop)
  const links = document.createElement('ul');
  links.className = 'hidden items-center gap-1 sm:flex';
  NAV_LINKS.forEach((l) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = l.href;
    a.className =
      'rounded-md px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground';
    a.dataset.navLink = l.href.slice(1);
    a.textContent = l.label;
    li.appendChild(a);
    links.appendChild(li);
  });
  inner.appendChild(links);

  // Spacer
  const spacer = document.createElement('div');
  spacer.className = 'flex-1';
  inner.appendChild(spacer);

  // Theme toggle
  inner.appendChild(ThemeToggle());

  // Mobile menu button
  const menuBtn = document.createElement('button');
  menuBtn.type = 'button';
  menuBtn.className =
    'inline-flex h-9 w-9 items-center justify-center rounded-md border border-input sm:hidden';
  menuBtn.setAttribute('aria-label', 'Toggle navigation menu');
  menuBtn.setAttribute('aria-expanded', 'false');
  const menuIcon = icon('menu', { class: 'h-4 w-4', 'aria-hidden': 'true' });
  menuBtn.appendChild(menuIcon);
  inner.appendChild(menuBtn);

  header.appendChild(inner);

  // Mobile drawer
  const drawer = document.createElement('div');
  drawer.className =
    'hidden border-t border-border/70 bg-background sm:hidden';
  drawer.id = 'mobile-nav';
  const drawerList = document.createElement('ul');
  drawerList.className = 'mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3';
  NAV_LINKS.forEach((l) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = l.href;
    a.className =
      'rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground';
    a.textContent = l.label;
    a.dataset.navLink = l.href.slice(1);
    li.appendChild(a);
    drawerList.appendChild(li);
  });
  drawer.appendChild(drawerList);
  header.appendChild(drawer);

  // Mobile toggle
  menuBtn.addEventListener('click', () => {
    const open = drawer.classList.toggle('hidden');
    menuBtn.setAttribute('aria-expanded', String(!open));
  });

  // Highlight active link on scroll
  const linkEls = [...links.querySelectorAll('a'), ...drawer.querySelectorAll('a')];
  function paintActive() {
    let active = '';
    const y = window.scrollY + 120;
    for (const link of NAV_LINKS) {
      const target = document.getElementById(link.href.slice(1));
      if (target && target.offsetTop <= y) active = link.href.slice(1);
    }
    for (const a of linkEls) {
      const isActive = a.dataset.navLink === active;
      a.classList.toggle('text-foreground', isActive);
      a.classList.toggle('text-muted-foreground', !isActive);
      if (isActive) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    }
  }
  window.addEventListener('scroll', paintActive, { passive: true });
  paintActive();

  // Close mobile drawer when a link is tapped
  on(drawer, 'click', 'a[href^="#"]', () => {
    drawer.classList.add('hidden');
    menuBtn.setAttribute('aria-expanded', 'false');
  });

  return header;
}