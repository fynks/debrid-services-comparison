import { Github, Heart } from 'lucide-react';

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border bg-background">
      <div className="container-page py-10">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <p className="font-semibold tracking-tight">Debrid Compare</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Your independent reference for debrid services. Pricing, hosts,
              and policies in one place.
            </p>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Compare
            </h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a
                  href="#debrid-pricing-comparison"
                  className="hover:text-foreground text-muted-foreground"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="#compare-debrid-services"
                  className="hover:text-foreground text-muted-foreground"
                >
                  Side-by-side
                </a>
              </li>
              <li>
                <a
                  href="#supported-file-hosts"
                  className="hover:text-foreground text-muted-foreground"
                >
                  File Hosts
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Resources
            </h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a
                  href="#debrid-resources-tools"
                  className="hover:text-foreground text-muted-foreground"
                >
                  Tools & Apps
                </a>
              </li>
              <li>
                <a
                  href="#debrid-speed-test"
                  className="hover:text-foreground text-muted-foreground"
                >
                  Speed Test
                </a>
              </li>
              <li>
                <a
                  href="#service-status-monitoring"
                  className="hover:text-foreground text-muted-foreground"
                >
                  Status Monitor
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Community
            </h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a
                  href="https://github.com/fynks/debrid-services-comparison/discussions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground text-muted-foreground"
                >
                  Discussions
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/fynks/debrid-services-comparison"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground text-muted-foreground"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-muted-foreground">
            © {year}{' '}
            <span className="text-foreground font-medium">Debrid Compare</span>
            . Open-source, community-maintained, independent project. Not
            affiliated with any debrid service.
          </p>
          <a
            href="https://github.com/fynks/debrid-services-comparison"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"
            aria-label="View source on GitHub"
          >
            <Github className="h-4 w-4" aria-hidden="true" />
            Source
          </a>
        </div>

        <p className="mt-2 inline-flex items-center gap-1 text-2xs text-muted-foreground">
          Made with{' '}
          <Heart
            className="h-3 w-3 fill-current text-muted-foreground"
            aria-hidden="true"
          />{' '}
          by{' '}
          <a
            href="https://github.com/fynks"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground"
          >
            Fynks
          </a>
        </p>
      </div>
    </footer>
  );
}
