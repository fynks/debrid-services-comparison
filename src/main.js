// App entry - wires the static HTML shell (index.html) to the
// dynamic components (tables, search, comparison, mobile nav,
// theme toggle, back-to-top).
//
// Boot order matters for the metrics: the counts and the mounted components are
// the page's content, so they run first. The scroll observer is initialised
// after them so it measures section offsets against the final layout once,
// rather than measuring the empty shell and having to measure again.

import './styles/globals.css';

import fileHosts from './json/file-hosts-optimized.json';
import adultHosts from './json/adult-hosts-optimized.json';

import { mountPoint, mountPointsByHostSource } from './lib/dom.js';
import { setTheme, getTheme, onThemeChange } from './lib/theme.js';
import { initScrollSpy } from './lib/scroll-spy.js';
import { initBackToTop } from './lib/back-to-top.js';
import { initMobileNav } from './lib/mobile-nav.js';
import { handleDeepLinks } from './lib/hash-links.js';
import { registerServiceWorker } from './lib/sw.js';

import { initHostSupportTable } from './components/hosts/host-support-table.js';
import { initServiceComparison } from './components/comparison/service-comparison.js';
import { initPricingTable } from './components/pricing/pricing-table.js';
import { initReferralLinks } from './components/pricing/pricing-table.js';
import { initUsenetTable } from './components/services/usenet-table.js';
import { initPoliciesTable } from './components/services/policies-table.js';
import { initStatusGrid, initSpeedTestGrid } from './components/services/status-grid.js';
import { initResourceGroups } from './components/resources/resource-group.js';
import { initDisclaimerCards } from './components/common/disclaimer-cards.js';

// ---- 1. Fill in the static counts (hero, hosts heading) ----
const fileCount = Object.keys(fileHosts.supported).length;
const adultCount = Object.keys(adultHosts.supported).length;
const servicesCount = fileHosts.services.length;

for (const el of document.querySelectorAll('[data-mount="hero-host-count"]')) {
  el.textContent = String(fileCount);
}
for (const el of document.querySelectorAll('[data-mount="hosts-count"]')) {
  el.textContent = String(servicesCount);
}
const yearEl = document.querySelector('[data-current-year]');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

// ---- 2. Mount the dynamic components into their placeholders ----
// Runs before the scroll observer so section offsets are measured against the
// final layout once, instead of pre-mount and then again.
const fileHostsSlot = document.querySelector(
  '[data-mount="host-support-table"][data-host-source="file"]'
);
initHostSupportTable(fileHostsSlot, {
  source: 'file',
  data: fileHosts,
});
mountPointsByHostSource('adult').forEach((slot) => {
  initHostSupportTable(slot, {
    source: 'adult',
    data: adultHosts,
    initialLimit: adultCount,
  });
});

initServiceComparison(mountPoint('service-comparison'), { data: fileHosts });
initPricingTable(mountPoint('pricing-table'));
initReferralLinks(mountPoint('referral-links'));
initUsenetTable(mountPoint('usenet-table'));
initPoliciesTable(mountPoint('policies-table'));
initStatusGrid(mountPoint('status-grid'));
initSpeedTestGrid(mountPoint('speed-test-grid'));
initResourceGroups(mountPoint('resource-groups'));
initDisclaimerCards(mountPoint('disclaimer-cards'));

// ---- 3. Boot interactive bits ----
initThemeToggle();
initMobileNav();
initScrollSpy();
initBackToTop();

// ---- 4. Hash deep links + SW ----
handleDeepLinks();
registerServiceWorker();

// =================== Theme toggle ===================
function initThemeToggle() {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;
  const icon = btn.querySelector('[data-theme-icon]');
  function paint(theme) {
    const next = theme === 'dark' ? 'light' : 'dark';
    btn.setAttribute('aria-label', `Switch to ${next} mode`);
    if (icon) {
      const href = theme === 'dark' ? '#i-sun' : '#i-moon';
      const use = icon.querySelector('use');
      if (use) use.setAttribute('href', href);
    }
  }
  paint(getTheme());
  onThemeChange(paint);
  btn.addEventListener('click', () => {
    setTheme(getTheme() === 'dark' ? 'light' : 'dark');
  });
}
