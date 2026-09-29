// Service worker registration (PWA). Silent on failure - SW is a
// progressive enhancement and shouldn't break the page.

export function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  if (
    typeof navigator.userAgent === 'string' &&
    /jsdom/i.test(navigator.userAgent)
  ) {
    return;
  }
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .catch((err) => console.warn('SW registration failed:', err));
  });
}