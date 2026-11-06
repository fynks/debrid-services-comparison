// Hash deep-link handler. Scrolls to the target section after the dynamic
// components have mounted; query-based comparison links are read directly
// by the service-comparison component.

export function handleDeepLinks() {
  if (typeof window === 'undefined') return;
  if (window.location.hash) {
    setTimeout(() => {
      const el = document.querySelector(window.location.hash);
      if (el && el.scrollIntoView) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  }
}