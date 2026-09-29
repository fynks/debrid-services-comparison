// Root app composition. All sections are mounted into #app.
//
// Why a function rather than a render loop?
//   - This app is essentially static content (loaded once from JSON).
//   - The handful of interactive bits (theme, back-to-top, hash-deep-link,
//     mobile nav, comparison search) attach listeners directly to the
//     elements they own.
//   - A reactive store would add ~0.5 KB of runtime for no real benefit.

import { SiteHeader } from './components/layout/site-header.js';
import { SiteFooter } from './components/layout/site-footer.js';
import { SectionHeader } from './components/layout/section-header.js';
import { BenefitsSection } from './components/layout/benefits-section.js';
import { BackToTop } from './components/common/back-to-top.js';
import { Alert } from './components/common/alert.js';
import { icon } from './lib/icons.js';
import { HashDeepLinks } from './lib/hash-links.js';

export function renderApp(root, { fileHosts }) {
  const wrap = document.createElement('div');
  wrap.id = 'app-root';
  wrap.className = 'min-h-screen bg-background text-foreground antialiased';

  // Skip link target
  const main = document.createElement('main');
  main.id = 'main-content';
  main.className = 'pb-16 pt-6 sm:pt-8';

  // Hero
  main.appendChild(renderHero(fileHosts));
  // Benefits band
  main.appendChild(BenefitsSection());
  // Info alert
  main.appendChild(renderHeroAlert());

  // Pricing placeholder (real table to come)
  main.appendChild(renderPricingSection());
  // Hosts
  main.appendChild(renderHostsSection(fileHosts));
  // Compare
  main.appendChild(renderCompareSection(fileHosts));
  // Usenet
  main.appendChild(renderUsenetSection());
  // Speed test
  main.appendChild(renderSpeedSection());
  // Status
  main.appendChild(renderStatusSection());
  // Policies
  main.appendChild(renderPoliciesSection());
  // Resources (placeholder)
  main.appendChild(renderResourcesSection());
  // Disclaimers
  main.appendChild(renderDisclaimersSection());

  wrap.appendChild(SiteHeader());
  wrap.appendChild(main);
  wrap.appendChild(SiteFooter());
  wrap.appendChild(BackToTop());

  // Clear any existing children (Vite HMR safety) and mount.
  root.replaceChildren(wrap);

  // Wire up hash deep-links for ?compare=&with=
  HashDeepLinks();
}

function renderHero(fileHosts) {
  const section = document.createElement('section');
  section.id = 'what-are-debrid-services';
  section.setAttribute('aria-labelledby', 'hero-title');
  section.className = 'container-page pb-12 pt-4 sm:pb-16 sm:pt-8';

  const inner = document.createElement('div');
  inner.className = 'mx-auto max-w-3xl text-center sm:text-left';

  const eyebrow = document.createElement('p');
  eyebrow.className =
    'mb-2 text-2xs font-medium uppercase tracking-wider text-muted-foreground';
  eyebrow.textContent = '2026 · Live reference';
  inner.appendChild(eyebrow);

  const h1 = document.createElement('h1');
  h1.id = 'hero-title';
  h1.className = 'text-3xl font-semibold tracking-tight sm:text-4xl';
  h1.textContent = 'Compare premium debrid services';
  inner.appendChild(h1);

  const lead = document.createElement('p');
  lead.className = 'mt-3 text-base text-muted-foreground sm:text-lg';
  lead.textContent =
    'A side-by-side reference of pricing, supported hosts, features, and policies for the most-used debrid services.';
  inner.appendChild(lead);

  const ctas = document.createElement('div');
  ctas.className =
    'mt-6 flex flex-wrap justify-center gap-2 sm:justify-start';
  const primary = document.createElement('a');
  primary.href = '#debrid-pricing-comparison';
  primary.className =
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';
  primary.textContent = 'View pricing';
  primary.appendChild(
    icon('chevron-right', { class: 'h-3.5 w-3.5', 'aria-hidden': 'true' })
  );
  ctas.appendChild(primary);

  const ghost1 = document.createElement('a');
  ghost1.href = '#compare-debrid-services';
  ghost1.className =
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';
  ghost1.textContent = 'Compare two services';
  ctas.appendChild(ghost1);

  const ghost2 = document.createElement('a');
  ghost2.href = '#supported-file-hosts';
  ghost2.className =
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';
  const hostCount = Object.keys(fileHosts.supported).length;
  ghost2.textContent = `Browse ${hostCount} hosts`;
  ctas.appendChild(ghost2);

  inner.appendChild(ctas);
  section.appendChild(inner);
  return section;
}

function renderHeroAlert() {
  const alertWrap = document.createElement('div');
  alertWrap.className = 'container-page mt-6';
  const a = Alert({
    variant: 'info',
    children:
      'Debrid services fetch files from any supported host and serve you fast, ad-free direct links for streaming or downloading — think of them as a premium proxy between you and hosts like Rapidgator, Mega, or Uptobox.',
  });
  alertWrap.appendChild(a);
  return alertWrap;
}

function renderPricingSection() {
  const s = document.createElement('section');
  s.id = 'debrid-pricing-comparison';
  s.setAttribute('aria-labelledby', 'pricing-title');
  s.className = 'container-page border-t border-border py-12 sm:py-16';

  s.appendChild(
    SectionHeader({
      id: 'pricing-title',
      eyebrow: 'Pricing',
      title: 'Pricing comparison',
      description:
        'Subscription costs across all major debrid services. Highlighted row is the most-popular monthly plan.',
    })
  );

  const placeholder = document.createElement('div');
  placeholder.id = 'pricing-mount';
  placeholder.className =
    'rounded-md border border-dashed border-border bg-muted/30 px-4 py-8 text-center text-sm text-muted-foreground';
  placeholder.textContent = 'Loading pricing table…';
  s.appendChild(placeholder);

  import('./components/pricing/pricing-table.js').then(({ PricingTable, ReferralLinks }) => {
    placeholder.replaceWith(PricingTable());
    const referralWrap = document.createElement('div');
    referralWrap.className = 'mt-12';
    referralWrap.id = 'referral-mount';
    const refHead = SectionHeader({
      eyebrow: 'Support this project',
      title: 'Help keep this resource free',
      description:
        'Use these referral links to sign up — it helps maintain this free resource at no extra cost to you.',
    });
    const refBody = document.createElement('div');
    refBody.appendChild(ReferralLinks());
    referralWrap.appendChild(refHead);
    referralWrap.appendChild(refBody);
    const alertWrap = document.createElement('div');
    alertWrap.className = 'mt-4';
    const importantP = document.createElement('p');
    importantP.innerHTML =
      '<strong>Important:</strong> Pricing can change frequently. Always verify current pricing on official websites before purchasing.';
    alertWrap.appendChild(Alert({ variant: 'info', children: importantP }));
    s.appendChild(referralWrap);
    s.appendChild(alertWrap);
  });

  return s;
}

function renderHostsSection(fileHosts) {
  const s = document.createElement('section');
  s.id = 'supported-file-hosts';
  s.setAttribute('aria-labelledby', 'hosts-title');
  s.className = 'container-page border-t border-border py-12 sm:py-16';

  s.appendChild(
    SectionHeader({
      id: 'hosts-title',
      eyebrow: 'Hosts',
      title: `Supported file hosts · ${Object.keys(fileHosts.supported).length} services`,
      description:
        'Search any host or paste a URL to find which services support it. Click a checkmark to open the service’s live status page.',
    })
  );

  // Use the real vanilla host support table (ported).
  import('./components/hosts/host-support-table.js').then(({ HostSupportTable }) => {
    const hostCount = Object.keys(fileHosts.supported).length;
    const search = document.createElement('div');
    search.className = 'space-y-4';
    const tbl = HostSupportTable({
      id: 'file',
      data: fileHosts,
      resultsLabel: `File hosts table — ${hostCount} hosts`,
      searchPlaceholder: `Search ${hostCount}+ hosts or paste a URL…`,
    });
    search.appendChild(tbl);
    // Replace placeholder
    placeholder.replaceWith(search);
  }).catch((err) => {
    console.error('Failed to load HostSupportTable:', err);
  });

  const placeholder = document.createElement('div');
  placeholder.className =
    'rounded-md border border-dashed border-border bg-muted/30 px-4 py-12 text-center text-sm text-muted-foreground';
  placeholder.textContent = 'Loading host support table…';
  s.appendChild(placeholder);

  return s;
}

function renderCompareSection(fileHosts) {
  const s = document.createElement('section');
  s.id = 'compare-debrid-services';
  s.setAttribute('aria-labelledby', 'compare-title');
  s.className = 'container-page border-t border-border py-12 sm:py-16';

  s.appendChild(
    SectionHeader({
      id: 'compare-title',
      eyebrow: 'Side-by-side',
      title: 'Compare any two services',
      description:
        'See the exact host overlap, exclusive coverage, and shared support between two services.',
    })
  );

  const placeholder = document.createElement('div');
  placeholder.id = 'compare-mount';
  placeholder.className =
    'rounded-md border border-dashed border-border bg-muted/30 px-4 py-12 text-center text-sm text-muted-foreground';
  placeholder.textContent = 'Loading side-by-side comparison…';
  s.appendChild(placeholder);

  // Real comparison loads on next tick so DOM is in place.
  import('./components/comparison/service-comparison.js')
    .then(({ ServiceComparison }) => {
      const cmp = ServiceComparison({ data: fileHosts });
      placeholder.replaceWith(cmp);
    })
    .catch((err) => console.error('Failed to load ServiceComparison:', err));

  // Alerts (consolidated TorBox warning + Real-Debrid warning).
  const alertWrap = document.createElement('div');
  alertWrap.className = 'mt-6 space-y-3';

  const rdP = document.createElement('p');
  rdP.innerHTML =
    '<strong>Real-Debrid</strong> has started returning copyright-infringement errors on many cached torrents. Read more on <a href="https://torrentfreak.com/real-debrids-renewed-piracy-crackdown-follows-corporate-restructuring/" target="_blank" rel="noopener noreferrer">TorrentFreak</a>.';
  alertWrap.appendChild(Alert({ variant: 'warning', children: rdP }));

  const tbP = document.createElement('p');
  tbP.innerHTML =
    '<strong>TorBox advisory:</strong> TorBox’s August 2026 ToS overhaul expanded telemetry collection (IP, geolocation, session-replay) and indefinite data retention. Rapidgator is listed as supported but is frequently offline — <a href="https://torbox.app/policies" target="_blank" rel="noopener noreferrer">review policies</a> and <a href="https://github.com/debridcompare/debridcompare/issues/34" target="_blank" rel="noopener noreferrer">tracked issues</a> before subscribing.';
  alertWrap.appendChild(Alert({ variant: 'warning', children: tbP }));

  s.appendChild(alertWrap);
  return s;
}

function renderUsenetSection() {
  const s = document.createElement('section');
  s.id = 'usenet-support';
  s.setAttribute('aria-labelledby', 'usenet-title');
  s.className = 'container-page border-t border-border py-12 sm:py-16';

  s.appendChild(
    SectionHeader({
      id: 'usenet-title',
      eyebrow: 'Usenet',
      title: 'Usenet support',
      description:
        'Which debrid services support Usenet newsgroups in addition to torrents and hosters.',
    })
  );

  const usenetInfo = document.createElement('div');
  const usenetP = document.createElement('div');
  usenetP.className = 'space-y-1';
  usenetP.innerHTML =
    '<strong>What is Usenet?</strong><p class="text-muted-foreground">Usenet is a massive, decentralized message-sharing system built around topic-based newsgroups. These function like forums or discussion boards, with each group focused on a specific subject. Some host plain-text conversations, while others serve as archives for large sets of articles.</p>';
  usenetInfo.appendChild(Alert({ variant: 'info', children: usenetP }));
  s.appendChild(usenetInfo);

  const mount = document.createElement('div');
  mount.id = 'usenet-mount';
  mount.className = 'mt-6';
  s.appendChild(mount);

  import('./components/services/usenet-table.js').then(({ UsenetTable }) => {
    mount.appendChild(UsenetTable());
  });

  return s;
}

function renderSpeedSection() {
  const s = document.createElement('section');
  s.id = 'debrid-speed-test';
  s.setAttribute('aria-labelledby', 'speed-title');
  s.className = 'container-page border-t border-border py-12 sm:py-16';

  s.appendChild(
    SectionHeader({
      id: 'speed-title',
      eyebrow: 'Speed test',
      title: 'Speed test & performance',
      description:
        'Run download speed tests directly from each provider’s own network.',
    })
  );

  const mount = document.createElement('div');
  mount.id = 'speed-mount';
  s.appendChild(mount);

  import('./components/services/status-grid.js').then(({ SpeedTestGrid }) => {
    mount.appendChild(SpeedTestGrid());
  });

  const infoWrap = document.createElement('div');
  infoWrap.className = 'mt-4';
  infoWrap.appendChild(
    Alert({
      variant: 'info',
      children:
        'These tests are best-case scenarios from the provider’s own network — your results will vary.',
    })
  );
  s.appendChild(infoWrap);
  return s;
}

function renderStatusSection() {
  const s = document.createElement('section');
  s.id = 'service-status-monitoring';
  s.setAttribute('aria-labelledby', 'status-title');
  s.className = 'container-page border-t border-border py-12 sm:py-16';

  s.appendChild(
    SectionHeader({
      id: 'status-title',
      eyebrow: 'Status',
      title: 'Live service status',
      description:
        'Check real-time status, uptime, and official supported-host lists for all services.',
    })
  );

  const mount = document.createElement('div');
  mount.id = 'status-mount';
  s.appendChild(mount);

  import('./components/services/status-grid.js').then(({ StatusGrid }) => {
    mount.appendChild(StatusGrid());
  });

  const tip = document.createElement('div');
  tip.className = 'mt-4';
  const tipP = document.createElement('p');
  tipP.innerHTML =
    '<strong>Tip:</strong> Bookmark these pages to verify whether a failed link is due to a temporary host outage rather than a service limitation.';
  tip.appendChild(Alert({ variant: 'tip', children: tipP }));
  s.appendChild(tip);
  return s;
}

function renderPoliciesSection() {
  const s = document.createElement('section');
  s.id = 'refund-policies-legal';
  s.setAttribute('aria-labelledby', 'policies-title');
  s.className = 'container-page border-t border-border py-12 sm:py-16';

  s.appendChild(
    SectionHeader({
      id: 'policies-title',
      eyebrow: 'Policies',
      title: 'Refund policies, terms, & legal information',
      description:
        'Review terms, privacy policies, and refund options for each service.',
    })
  );

  const mount = document.createElement('div');
  mount.id = 'policies-mount';
  s.appendChild(mount);

  import('./components/services/policies-table.js').then(({ PoliciesTable }) => {
    mount.appendChild(PoliciesTable());
  });

  const info = document.createElement('div');
  info.className = 'mt-4';
  info.appendChild(
    Alert({
      variant: 'info',
      children:
        'If a link returns 404, try the site’s footer “Legal/Help” links or contact support directly.',
    })
  );
  s.appendChild(info);
  return s;
}

function renderResourcesSection() {
  const s = document.createElement('section');
  s.id = 'debrid-resources-tools';
  s.setAttribute('aria-labelledby', 'resources-title');
  s.className = 'container-page border-t border-border py-12 sm:py-16';

  s.appendChild(
    SectionHeader({
      id: 'resources-title',
      eyebrow: 'Tools & community',
      title: 'Tools, apps, & community resources',
      description:
        'Media managers, streaming add-ons, download managers, browser extensions, mobile apps, and community resources that work with debrid services.',
    })
  );

  const mount = document.createElement('div');
  mount.id = 'resources-mount';
  s.appendChild(mount);

  import('./components/resources/resource-group.js').then(({ ResourceGroupSection }) => {
    import('./data/resources.ts').then(({ RESOURCE_GROUPS }) => {
      const list = document.createElement('div');
      list.className = 'space-y-2';
      RESOURCE_GROUPS.forEach((group, idx) => {
        list.appendChild(
          ResourceGroupSection({
            group,
            initialOpen: idx === 0,
          })
        );
      });
      mount.replaceChildren(list);
    });
  });

  const tip = document.createElement('div');
  tip.className = 'mt-8';
  const tipP = document.createElement('p');
  tipP.innerHTML =
    '<strong>Pro tip:</strong> Combine your debrid service with tools like <strong>Stremio + Comet/AIOStreams</strong>, <strong>Riven</strong> for Plex automation, or <strong>DUMB</strong> for an all-in-one Docker media stack.';
  tip.appendChild(Alert({ variant: 'tip', children: tipP }));
  s.appendChild(tip);

  return s;
}

function renderDisclaimersSection() {
  const s = document.createElement('section');
  s.setAttribute('aria-labelledby', 'disclaimers-title');
  s.className = 'container-page border-t border-border py-12 sm:py-16';

  s.appendChild(
    SectionHeader({
      id: 'disclaimers-title',
      eyebrow: 'Disclaimers',
      title: 'Important information',
      description:
        'Information is updated regularly but debrid services change frequently. Verify details on official sites.',
    })
  );

  const mount = document.createElement('div');
  mount.id = 'disclaimers-mount';
  s.appendChild(mount);

  import('./components/common/disclaimer-cards.js').then(({ DisclaimerCards }) => {
    mount.appendChild(DisclaimerCards());
  });

  const warn = document.createElement('div');
  warn.className = 'mt-6';
  const warnP = document.createElement('p');
  warnP.innerHTML =
    '<strong>This is an open-source, community-maintained guide.</strong> It does not endorse or promote unauthorized file sharing.';
  warn.appendChild(Alert({ variant: 'warning', children: warnP }));
  s.appendChild(warn);

  return s;
}

// (no local helpers — components build their own DOM trees)