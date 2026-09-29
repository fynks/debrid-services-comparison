// Hash deep-link handler. Reads `?compare=` and `?with=` query params
// on load and dispatches a custom event that `ServiceComparison` can
// listen for. Also exposes a small helper to scroll to a hash once the
// DOM has settled.

export function HashDeepLinks() {
  if (typeof window === 'undefined') return;

  // Dispatch after first paint so listeners are attached.
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

  // Honor `#hash` anchors after layout settles.
  if (window.location.hash) {
    setTimeout(() => {
      const el = document.querySelector(window.location.hash);
      if (el && el.scrollIntoView) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  }
}