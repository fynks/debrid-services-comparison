// Highlight the nav link for the section currently in view.
// Uses scroll position + an offset threshold - keeps it cheap
// (no IntersectionObserver required).

export function initScrollSpy() {
  const links = document.querySelectorAll('[data-nav-link]');
  if (!links.length) return;

  const ids = [...new Set([...links].map((a) => a.dataset.navLink))];
  const sections = ids
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  function paint() {
    const y = window.scrollY + 120;
    let active = '';
    for (const sec of sections) {
      if (sec.offsetTop <= y) active = sec.id;
    }
    for (const a of links) {
      const isActive = a.dataset.navLink === active;
      a.classList.toggle('text-foreground', isActive);
      a.classList.toggle('text-muted-foreground', !isActive);
      a.classList.toggle('bg-accent', isActive);
      if (isActive) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    }
  }
  window.addEventListener('scroll', paint, { passive: true });
  paint();
}