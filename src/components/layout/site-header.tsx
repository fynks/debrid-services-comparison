import { useEffect, useState } from 'react';
import { Menu, X, Zap } from 'lucide-react';
import { ThemeToggle } from '@/components/common/theme-toggle';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NavItem {
  href: string;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { href: '#what-are-debrid-services', label: 'Intro' },
  { href: '#debrid-pricing-comparison', label: 'Pricing' },
  { href: '#compare-debrid-services', label: 'Compare' },
  { href: '#supported-file-hosts', label: 'Hosts' },
  { href: '#usenet-support', label: 'Usenet' },
  { href: '#adult-content-file-hosts', label: 'Adult' },
  { href: '#debrid-speed-test', label: 'Speed' },
  { href: '#service-status-monitoring', label: 'Status' },
  { href: '#refund-policies-legal', label: 'Policies' },
  { href: '#debrid-resources-tools', label: 'Tools' },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const sections = NAV_ITEMS.map((n) => document.querySelector(n.href)).filter(
      Boolean,
    ) as Element[];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(`#${entry.target.id}`);
          }
        }
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: 0.1 },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // Close mobile menu when a link is clicked.
  const handleLinkClick = () => setOpen(false);

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <header
        className={cn(
          'sticky top-0 z-40 w-full border-b border-transparent bg-background/95 backdrop-blur transition-colors',
          scrolled && 'border-border',
        )}
      >
        <div className="container-page flex h-14 items-center justify-between gap-2">
          <a
            href="/"
            className="flex items-center gap-2 font-semibold tracking-tight"
            aria-label="DebridCompare home"
          >
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Zap className="h-4 w-4" aria-hidden="true" />
            </span>
            <span>DebridCompare</span>
          </a>

          <nav
            aria-label="Primary"
            className="hidden md:flex md:items-center md:gap-1"
          >
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                aria-current={active === item.href ? 'page' : undefined}
                className={cn(
                  'rounded-md px-2.5 py-1.5 text-sm transition-colors',
                  active === item.href
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              type="button"
              className="md:hidden"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="mobile-nav"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? (
                <X className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Menu className="h-4 w-4" aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile drawer */}
        <div
          id="mobile-nav"
          className={cn(
            'md:hidden border-t border-border overflow-hidden transition-[max-height] duration-200',
            open ? 'max-h-[80vh]' : 'max-h-0',
          )}
          aria-hidden={!open}
        >
          <nav
            aria-label="Mobile"
            className="container-page flex flex-col gap-0.5 py-2"
          >
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={handleLinkClick}
                className="rounded-md px-2.5 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </header>
    </>
  );
}
