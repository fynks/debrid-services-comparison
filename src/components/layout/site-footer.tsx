import { Heart } from 'lucide-react';

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border bg-background">
      <div className="container-page py-10">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <p className="font-semibold tracking-tight text-foreground">
              DebridCompare
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              An independent reference for debrid services. Pricing, hosts, and
              policies in one place.
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
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="#compare-debrid-services"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Side-by-side
                </a>
              </li>
              <li>
                <a
                  href="#supported-file-hosts"
                  className="text-muted-foreground transition-colors hover:text-foreground"
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
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Tools & Apps
                </a>
              </li>
              <li>
                <a
                  href="#debrid-speed-test"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Speed Test
                </a>
              </li>
              <li>
                <a
                  href="#service-status-monitoring"
                  className="text-muted-foreground transition-colors hover:text-foreground"
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
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Discussions
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/fynks/debrid-services-comparison"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 sm:flex-row sm:items-center">
          <p className="text-xs leading-relaxed text-muted-foreground">
            © {year}{' '}
            <span className="font-medium text-foreground">DebridCompare</span>
            . Open-source, community-maintained, independent project. Not
            affiliated with any debrid service.
          </p>
          <a
            href="https://github.com/fynks/debrid-services-comparison"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
            aria-label="View source on GitHub"
          >
            <GitHubIcon className="h-3.5 w-3.5" />
            Source
          </a>
        </div>

        <p className="mt-3 inline-flex items-center gap-1 text-xs text-muted-foreground">
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
            className="transition-colors hover:text-foreground"
          >
            Fynks
          </a>
        </p>
      </div>
    </footer>
  );
}
