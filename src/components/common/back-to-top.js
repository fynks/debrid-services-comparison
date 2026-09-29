import { icon } from '../../lib/icons.js';

/**
 * Floating circular back-to-top button. Appears once the page has
 * been scrolled past a threshold. Honours prefers-reduced-motion.
 */
export function BackToTop() {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className =
    'group fixed bottom-5 right-5 z-40 inline-flex h-11 w-11 items-center justify-center rounded-full border border-input bg-background/85 text-foreground opacity-0 shadow-sm ring-1 ring-foreground/5 backdrop-blur transition-all duration-300 ease-out translate-y-2 pointer-events-none sm:bottom-6 sm:right-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';
  btn.setAttribute('aria-label', 'Back to top');
  btn.tabIndex = -1; // become focusable when visible

  const svg = icon('arrow-up', {
    class: 'h-5 w-5 transition-transform group-hover:-translate-y-0.5',
    'aria-hidden': 'true',
  });
  btn.appendChild(svg);

  let visible = false;
  function paint() {
    const next = window.scrollY > 600;
    if (next === visible) return;
    visible = next;
    btn.classList.toggle('opacity-100', next);
    btn.classList.toggle('translate-y-0', next);
    btn.classList.toggle('pointer-events-auto', next);
    btn.classList.toggle('opacity-0', !next);
    btn.classList.toggle('translate-y-2', !next);
    btn.classList.toggle('pointer-events-none', !next);
    btn.tabIndex = next ? 0 : -1;
  }

  btn.addEventListener('click', () => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  });

  window.addEventListener('scroll', paint, { passive: true });
  paint();
  return btn;
}