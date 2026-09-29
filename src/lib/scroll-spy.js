// Highlight the nav link for the section currently in view.
//
// Uses an IntersectionObserver rather than reading geometry. The previous
// implementation read `offsetTop` for every section, which forces a synchronous
// layout of the whole document — Lighthouse reported that as a forced reflow,
// and because it runs after the components have mounted it had to lay out the
// full ~3,200-element tree (~85 ms on a Moto G Power).
//
// The observer hands us `boundingClientRect` for free, so no layout is ever
// forced from script. A section counts as "reached" once its top edge is at or
// above the 120px line under the sticky header, which is exactly the condition
// the old `offsetTop <= scrollY + 120` test expressed.

/** Offset of the highlight line from the top of the viewport, matching the
 * sticky header height plus a little breathing room. */
const LINE_OFFSET = 120;

export function initScrollSpy() {
  const links = document.querySelectorAll('[data-nav-link]');
  if (!links.length) return;

  const ids = [...new Set([...links].map((a) => a.dataset.navLink))];
  const sections = ids.map((id) => document.getElementById(id)).filter(Boolean);
  if (!sections.length) return;

  /** section id -> has its top edge passed the highlight line? */
  const reached = new Map();

  function paint() {
    let active = '';
    for (const sec of sections) {
      if (reached.get(sec.id)) active = sec.id;
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

  // Shrink the root so it starts at the highlight line; sections above it are
  // reported as not intersecting, but their (negative) top still marks them as
  // reached — which is what keeps the last-passed section highlighted once it
  // has scrolled out of view.
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        reached.set(entry.target.id, entry.boundingClientRect.top <= LINE_OFFSET);
      }
      paint();
    },
    { rootMargin: `-${LINE_OFFSET}px 0px 0px 0px`, threshold: 0 }
  );

  for (const sec of sections) observer.observe(sec);
}
