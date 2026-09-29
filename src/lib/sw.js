// Service worker registration (PWA). Silent on failure — SW is a
// progressive enhancement and shouldn't break the page.

export function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  // Skip when running under jsdom (its fetch implementation can't
  // resolve /sw.js, so we'd get a runtime exception from undici).
  if (typeof navigator.userAgent === 'string' && /jsdom/i.test(navigator.userAgent)) {
    return;
  }
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .catch((err) => console.warn('SW registration failed:', err));
  });
}