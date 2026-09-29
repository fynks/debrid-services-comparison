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
              className="sticky left-0 z-10 bg-muted/40 px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"
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
                  ? 'border-b border-border/50 bg-info-muted/20 last:border-0'
                  : 'border-b border-border/50 last:border-0'
              }
            >
              <th
                scope="row"
                className="sticky left-0 z-10 bg-background px-3 py-2 text-left font-medium text-foreground"
              >
                {row.plan}
              </th>
              {PRICING_SERVICES.map((s) => {
                const value = row.cells[s];
                return (
                  <td
                    key={s}
                    className="whitespace-nowrap px-3 py-2 text-muted-foreground"
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
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {REFERRAL_LINKS.map((ref) => (
        <a
          key={ref.service}
          href={ref.url}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="group flex flex-col rounded-md border border-border p-3 transition-colors hover:border-foreground/30 hover:bg-muted/40"
          aria-label={`Sign up for ${SERVICES[ref.service].name} (referral)`}
        >
          <div className="flex items-center justify-between">
            <span className="font-medium">
              {SERVICES[ref.service].name}
            </span>
            <Badge variant="muted" className="text-2xs">
              Referral
            </Badge>
          </div>
          <span className="mt-1 text-sm tabular-nums text-muted-foreground">
            {ref.benefit}
          </span>
          <span className="mt-3 inline-flex items-center gap-1 text-xs text-muted-foreground group-hover:text-foreground">
            Get started
            <ExternalLink className="h-3 w-3" aria-hidden="true" />
          </span>
        </a>
      ))}
    </div>
  );
}
