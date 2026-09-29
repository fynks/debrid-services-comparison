// Hash deep-link handler. Reads `?compare=` and `?with=` query params
// and dispatches a custom event that `ServiceComparison` listens for.

export function handleDeepLinks() {
  if (typeof window === 'undefined') return;
  queueMicrotask(() => {
    const params = new URLSearchParams(window.location.search);
    const compare = params.get('compare');
    const withP = params.get('with');
    if (compare || withP) {
      window.dispatchEvent(
        new CustomEvent('deep-link:compare', {
          detail: { compare, with: withP },
        })
      );
    }
  });
  if (window.location.hash) {
    setTimeout(() => {
      const el = document.querySelector(window.location.hash);
      if (el && el.scrollIntoView) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  }
}