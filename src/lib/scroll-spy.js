// Highlight the nav link for the section currently in view.
//
// Section offsets are measured once and cached instead of being read on every
// scroll event. Reading `offsetTop` forces a synchronous layout of the whole
// document (Lighthouse reports this as a "forced reflow", ~52 ms of it during
// boot on a Moto G Power), and doing it per scroll event also stalls input.
//
// The cache is invalidated by a ResizeObserver, so it stays correct when
// components mount, a host table expands via "Load all", or a new two-service
// comparison re-renders and shifts everything below it.

export function initScrollSpy() {
  const links = document.querySelectorAll('[data-nav-link]');
  if (!links.length) return;

  const ids = [...new Set([...links].map((a) => a.dataset.navLink))];
  const sections = ids.map((id) => document.getElementById(id)).filter(Boolean);
  if (!sections.length) return;

  /** @type {{id: string, top: number}[] | null} */
  let offsets = null;
  let rafId = 0;

  /** Single batched layout read covering every observed section. */
  function measure() {
    offsets = sections.map((sec) => ({ id: sec.id, top: sec.offsetTop }));
  }

  function paint() {
    if (!offsets) measure();
    const y = window.scrollY + 120;
    let active = '';
    for (const sec of offsets) {
      if (sec.top <= y) active = sec.id;
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

  /** Coalesce scroll/resize bursts into one paint per frame. */
  function schedulePaint() {
    if (rafId) return;
    rafId = requestAnimationFrame(() => {
      rafId = 0;
      paint();
    });
  }

  function invalidate() {
    offsets = null;
  }

  window.addEventListener('scroll', schedulePaint, { passive: true });
  window.addEventListener(
    'resize',
    () => {
      invalidate();
      schedulePaint();
    },
    { passive: true }
  );

  if (typeof ResizeObserver !== 'undefined') {
    const observer = new ResizeObserver(() => {
      invalidate();
      schedulePaint();
    });
    observer.observe(document.body);
  }

  schedulePaint();
}
