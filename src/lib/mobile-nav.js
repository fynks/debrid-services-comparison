// Mobile drawer toggle + click-to-close + Escape-to-close.

export function initMobileNav() {
  const toggle = document.getElementById('mobile-nav-toggle');
  const drawer = document.getElementById('mobile-nav');
  if (!toggle || !drawer) return;

  toggle.setAttribute('aria-controls', 'mobile-nav');

  function setOpen(open) {
    drawer.classList.toggle('hidden', !open);
    toggle.setAttribute('aria-expanded', String(open));
  }

  toggle.addEventListener('click', () => {
    setOpen(drawer.classList.contains('hidden'));
  });

  drawer.addEventListener('click', (e) => {
    if (e.target instanceof Element && e.target.closest('a[href^="#"]')) {
      setOpen(false);
    }
  });

  // Escape closes the drawer and returns focus to the toggle so keyboard
  // users are not stranded after dismissing it.
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !drawer.classList.contains('hidden')) {
      setOpen(false);
      toggle.focus();
    }
  });
}
