// Mobile drawer toggle + click-to-close.

export function initMobileNav() {
  const toggle = document.getElementById('mobile-nav-toggle');
  const drawer = document.getElementById('mobile-nav');
  if (!toggle || !drawer) return;

  toggle.addEventListener('click', () => {
    const hidden = drawer.classList.toggle('hidden');
    toggle.setAttribute('aria-expanded', String(!hidden));
  });

  drawer.addEventListener('click', (e) => {
    if (e.target instanceof Element && e.target.closest('a[href^="#"]')) {
      drawer.classList.add('hidden');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}