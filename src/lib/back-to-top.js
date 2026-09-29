// Floating back-to-top button. The button is already in index.html;
// this script just toggles its visibility based on scroll position
// and wires the click handler. Honours prefers-reduced-motion.

export function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

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
}