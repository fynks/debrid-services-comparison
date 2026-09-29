import { useEffect } from 'react';
import {
  ChevronRight,
  Database,
  Download,
  Globe,
  Network,
  Play,
  Smartphone,
  Star,
  Tv,
  Users,
} from 'lucide-react';

import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { SectionHeader } from '@/components/layout/section-header';
import { BenefitsSection } from '@/components/layout/benefits-section';
import { Alert } from '@/components/common/alert';
import { HostSupportTable } from '@/components/hosts/host-support-table';
import { ServiceComparison } from '@/components/comparison/service-comparison';
import { PricingTable, ReferralLinks } from '@/components/pricing/pricing-table';
import { UsenetTable } from '@/components/services/usenet-table';
import { PoliciesTable } from '@/components/services/policies-table';
import { StatusGrid, SpeedTestGrid } from '@/components/services/status-grid';
import { ResourceGroupSection } from '@/components/resources/resource-group';
import { DisclaimerCards } from '@/components/common/disclaimer-cards';

import fileHostsRaw from '@/json/file-hosts-optimized.json';
import adultHostsRaw from '@/json/adult-hosts-optimized.json';

import { RESOURCE_GROUPS } from '@/data/resources';
import type { OptimizedHostsData } from '@/types/data';

const fileHosts = fileHostsRaw as OptimizedHostsData;
const adultHosts = adultHostsRaw as OptimizedHostsData;

const RESOURCE_ICONS: Record<string, typeof Tv> = {
  Tv,
  Database,
  Play,
  Download,
  Globe,
  Smartphone,
  Network,
  Users,
  Star,
};

export default function App() {
  // Register service worker (PWA).
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .catch((err) => console.warn('SW registration failed:', err));
      });
    }
  }, []);

  return (
    <>
      <SiteHeader />
      <main id="main-content" className="pb-16 pt-6 sm:pt-8">
        {/* Hero / Intro */}
        <section
          id="what-are-debrid-services"
          aria-labelledby="hero-title"
          className="container-page pb-12 pt-4 sm:pb-16 sm:pt-8"
        >
          <div className="mx-auto max-w-3xl text-center sm:text-left">
            <p className="mb-2 text-2xs font-medium uppercase tracking-wider text-muted-foreground">
              2026 · Live reference
            </p>
            <h1
              id="hero-title"
              className="text-3xl font-semibold tracking-tight sm:text-4xl"
            >
              Compare premium debrid services
            </h1>
            <p className="mt-3 text-base text-muted-foreground sm:text-lg">
              A side-by-side reference of pricing, supported hosts, features,
              and policies for the most-used debrid services.
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-2 sm:justify-start">
              <a
                href="#debrid-pricing-comparison"
                className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                View pricing
                <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
              <a
                href="#compare-debrid-services"
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3.5 py-2 text-sm font-medium text-foreground hover:bg-muted"
              >
                Compare two services
              </a>
              <a
                href="#supported-file-hosts"
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3.5 py-2 text-sm font-medium text-foreground hover:bg-muted"
              >
                Browse {Object.keys(fileHosts.supported).length} hosts
              </a>
            </div>
          </div>

          <div className="mt-10">
            <h2 className="sr-only">Key benefits</h2>
            <BenefitsSection />
          </div>

          <div className="mt-6">
            <Alert variant="info">
              Debrid services fetch files from any supported host and serve
              you fast, ad-free direct links for streaming or downloading —
              think of them as a premium proxy between you and hosts like
              Rapidgator, Mega, or Uptobox.
            </Alert>
          </div>
        </section>

        {/* Pricing */}
        <section
          id="debrid-pricing-comparison"
          aria-labelledby="pricing-title"
          className="container-page border-t border-border py-12 sm:py-16"
        >
          <SectionHeader
            id="pricing-title"
            eyebrow="Pricing"
            title="Pricing comparison"
            description="Subscription costs across all major debrid services. Highlighted row is the most-popular monthly plan."
          />
          <PricingTable />
          <div className="mt-4">
            <Alert variant="info">
              <strong>Important:</strong> Pricing can change frequently.
              Always verify current pricing on official websites before
              purchasing.
            </Alert>
          </div>

          <div className="mt-12">
            <SectionHeader
              eyebrow="Support this project"
              title="Help keep this resource free"
              description="Use these referral links to sign up — it helps maintain this free resource at no extra cost to you."
            />
            <ReferralLinks />
          </div>
        </section>

        {/* File hosts */}
        <section
          id="supported-file-hosts"
          aria-labelledby="hosts-title"
          className="container-page border-t border-border py-12 sm:py-16"
        >
          <SectionHeader
            id="hosts-title"
            eyebrow="Hosts"
            title={`Supported file hosts · ${Object.keys(fileHosts.supported).length} services`}
            description="Search any host or paste a URL to find which services support it. Click a checkmark to open the service's live status page."
          />
          <HostSupportTable
            id="file"
            data={fileHosts}
            resultsLabel="File hosts table"
            searchPlaceholder="Search 300+ hosts or paste a URL…"
          />
        </section>

        {/* Compare */}
        <section
          id="compare-debrid-services"
          aria-labelledby="compare-title"
          className="container-page border-t border-border py-12 sm:py-16"
        >
          <SectionHeader
            id="compare-title"
            eyebrow="Side-by-side"
            title="Compare any two services"
            description="See the exact host overlap, exclusive coverage, and shared support between two services."
          />
          <ServiceComparison data={fileHosts} />
          <div className="mt-6 space-y-3">
            <Alert variant="warning">
              <strong>Real-Debrid</strong> has started returning
              copyright-infringement errors on many cached torrents. Read
              more on{' '}
              <a
                href="https://torrentfreak.com/real-debrids-renewed-piracy-crackdown-follows-corporate-restructuring/"
                target="_blank"
                rel="noopener noreferrer"
              >
                TorrentFreak
              </a>
              .
            </Alert>
            <Alert variant="warning">
              <strong>Rapidgator</strong> is listed as a supported file hoster
              for <strong>TorBox</strong>, but it is constantly “Offline”. See{' '}
              <a
                href="https://github.com/debridcompare/debridcompare/issues/34"
                target="_blank"
                rel="noopener noreferrer"
              >
                this issue
              </a>
              .
            </Alert>
            <Alert variant="warning">
              <strong>TorBox advisory (August 2026):</strong> TorBox overhauled
              its Terms of Service — introducing expanded telemetry collection
              (IP / geolocation / session-replay), broad data-disclosure
              clauses, and indefinite retention of “deleted” data. Verify{' '}
              <a
                href="https://torbox.app/policies"
                target="_blank"
                rel="noopener noreferrer"
              >
                current policies
              </a>{' '}
              before subscribing or renewing.
            </Alert>
          </div>
        </section>

        {/* Usenet */}
        <section
          id="usenet-support"
          aria-labelledby="usenet-title"
          className="container-page border-t border-border py-12 sm:py-16"
        >
          <SectionHeader
            id="usenet-title"
            eyebrow="Usenet"
            title="Usenet support"
            description="Which debrid services support Usenet newsgroups in addition to torrents and hosters."
          />
          <Alert variant="info">
            <div className="space-y-1">
              <strong>What is Usenet?</strong>
              <p className="text-muted-foreground">
                Usenet is a massive, decentralized message-sharing system built
                around topic-based newsgroups. These function like forums or
                discussion boards, with each group focused on a specific
                subject. Some host plain-text conversations, while others serve
                as archives for large sets of articles.
              </p>
            </div>
          </Alert>
          <div className="mt-6">
            <UsenetTable />
          </div>
        </section>

        {/* Adult hosts */}
        <section
          id="adult-content-file-hosts"
          aria-labelledby="adult-hosts-title"
          className="container-page border-t border-border py-12 sm:py-16"
        >
          <SectionHeader
            id="adult-hosts-title"
            eyebrow="Adult hosts"
            title="Adult content file hosts"
            description="Which services support major adult file hosts."
          />
          <HostSupportTable
            id="adult"
            data={adultHosts}
            initialLimit={adultHosts.services.length}
            resultsLabel="Adult hosts table"
            searchPlaceholder="Search adult hosts or paste a URL…"
          />
        </section>

        {/* Speed test */}
        <section
          id="debrid-speed-test"
          aria-labelledby="speed-title"
          className="container-page border-t border-border py-12 sm:py-16"
        >
          <SectionHeader
            id="speed-title"
            eyebrow="Speed test"
            title="Speed test & performance"
            description="Run download speed tests directly from each provider's own network."
          />
          <SpeedTestGrid />
          <div className="mt-4">
            <Alert variant="info">
              These tests are best-case scenarios from the provider's own
              network — your results will vary.
            </Alert>
          </div>
        </section>

        {/* Status */}
        <section
          id="service-status-monitoring"
          aria-labelledby="status-title"
          className="container-page border-t border-border py-12 sm:py-16"
        >
          <SectionHeader
            id="status-title"
            eyebrow="Status"
            title="Live service status"
            description="Check real-time status, uptime, and official supported-host lists for all services."
          />
          <StatusGrid />
          <div className="mt-4">
            <Alert variant="tip">
              <strong>Tip:</strong> Bookmark these pages to verify whether a
              failed link is due to a temporary host outage rather than a
              service limitation.
            </Alert>
          </div>
        </section>

        {/* Policies */}
        <section
          id="refund-policies-legal"
          aria-labelledby="policies-title"
          className="container-page border-t border-border py-12 sm:py-16"
        >
          <SectionHeader
            id="policies-title"
            eyebrow="Policies"
            title="Refund policies, terms, & legal information"
            description="Review terms, privacy policies, and refund options for each service."
          />
          <PoliciesTable />
          <div className="mt-4">
            <Alert variant="info">
              If a link returns 404, try the site's footer “Legal/Help” links
              or contact support directly.
            </Alert>
          </div>
        </section>

        {/* Resources */}
        <section
          id="debrid-resources-tools"
          aria-labelledby="resources-title"
          className="container-page border-t border-border py-12 sm:py-16"
        >
          <SectionHeader
            id="resources-title"
            eyebrow="Tools & community"
            title="Tools, apps, & community resources"
            description="Media managers, streaming add-ons, download managers, browser extensions, mobile apps, and community resources that work with debrid services."
          />
          <div className="space-y-10">
            {RESOURCE_GROUPS.map((group) => (
              <ResourceGroupSection
                key={group.id}
                group={group}
                iconMap={RESOURCE_ICONS}
              />
            ))}
          </div>
          <div className="mt-8">
            <Alert variant="tip">
              <strong>Pro tip:</strong> Combine your debrid service with
              tools like <strong>Stremio + Comet/AIOStreams</strong>,{' '}
              <strong>Riven</strong> for Plex automation, or{' '}
              <strong>DUMB</strong> for an all-in-one Docker media stack.
            </Alert>
          </div>
        </section>

        {/* Disclaimers */}
        <section
          aria-labelledby="disclaimers-title"
          className="container-page border-t border-border py-12 sm:py-16"
        >
          <SectionHeader
            id="disclaimers-title"
            eyebrow="Disclaimers"
            title="Important information"
            description="Information is updated regularly but debrid services change frequently. Verify details on official sites."
          />
          <DisclaimerCards />
          <div className="mt-6">
            <Alert variant="warning">
              <strong>This is an open-source, community-maintained guide.</strong>{' '}
              It does not endorse or promote unauthorized file sharing.
            </Alert>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
