import { ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { PRICING_ROWS, PRICING_SERVICES, REFERRAL_LINKS } from '@/data/pricing';
import { SERVICES } from '@/data/services';

export function PricingTable() {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table
        className="w-full min-w-max text-sm tabular-nums"
        aria-label="Pricing comparison"
      >
        <thead>
          <tr className="border-b border-border bg-muted/40">
            <th
              scope="col"
              className="sticky left-0 z-20 border-r border-border bg-muted px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"
            >
              Plan
            </th>
            {PRICING_SERVICES.map((s) => (
              <th
                key={s}
                scope="col"
                className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"
              >
                {SERVICES[s]?.name ?? s}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {PRICING_ROWS.map((row) => (
            <tr
              key={row.plan}
              className={
                row.isHighlight
                  ? 'group border-b border-border/60 bg-info-muted/30 transition-colors hover:bg-info-muted/50 last:border-0'
                  : 'group border-b border-border/40 transition-colors hover:bg-muted/40 last:border-0'
              }
            >
              <th
                scope="row"
                className={
                  row.isHighlight
                    ? 'sticky left-0 z-10 border-r border-border bg-info-muted px-3 py-2.5 text-left font-medium text-foreground transition-colors group-hover:bg-info-muted/50'
                    : 'sticky left-0 z-10 border-r border-border bg-background px-3 py-2 text-left font-medium text-foreground transition-colors group-hover:bg-muted/40'
                }
              >
                {row.plan}
              </th>
              {PRICING_SERVICES.map((s) => {
                const value = row.cells[s];
                return (
                  <td
                    key={s}
                    className={
                      row.isHighlight
                        ? 'whitespace-nowrap px-3 py-2.5 text-foreground'
                        : 'whitespace-nowrap px-3 py-2 text-muted-foreground'
                    }
                  >
                    {value ?? <span className="text-muted-foreground/40">—</span>}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ReferralLinks() {
  return (
    // Mobile: 1 column — full-width cards are easier to scan and tap.
    // sm: 2 columns. lg: 4. The card layout is always the same:
    // service name + badge on top, benefit + arrow at the bottom.
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {REFERRAL_LINKS.map((ref) => (
        <a
          key={ref.service}
          href={ref.url}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="group flex flex-col justify-between rounded-lg border border-border bg-card p-3.5 transition-colors hover:border-foreground/30 hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:p-4"
          aria-label={`Sign up for ${SERVICES[ref.service].name} (referral)`}
        >
          <div className="flex items-start justify-between gap-2">
            <span className="text-sm font-medium leading-tight">
              {SERVICES[ref.service].name}
            </span>
            <Badge variant="muted" className="shrink-0 text-2xs">
              Referral
            </Badge>
          </div>
          <div className="mt-3 flex items-end justify-between gap-2">
            <span className="text-xs tabular-nums text-muted-foreground sm:text-sm">
              {ref.benefit}
            </span>
            <ExternalLink
              className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
              aria-hidden="true"
            />
          </div>
        </a>
      ))}
    </div>
  );
}
