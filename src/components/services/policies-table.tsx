import { POLICY_ROWS } from '@/data/policies';
import { SERVICES } from '@/data/services';
import { ExternalLink } from 'lucide-react';

export function PoliciesTable() {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table
        className="w-full min-w-max text-sm"
        aria-label="Policies and legal information"
      >
        <thead>
          <tr className="border-b border-border">
            <th
              scope="col"
              className="sticky left-0 z-20 border-r border-border bg-muted px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"
            >
              Service
            </th>
            <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Terms
            </th>
            <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Privacy
            </th>
            <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Refund
            </th>
            <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Support
            </th>
          </tr>
        </thead>
        <tbody>
          {POLICY_ROWS.map((row) => (
            <tr
              key={row.service}
              className="group border-b border-border/40 last:border-0 transition-colors hover:bg-muted/30"
            >
              <th
                scope="row"
                className="sticky left-0 z-10 border-r border-border bg-background px-3 py-2 text-left font-medium transition-colors group-hover:bg-muted/30"
              >
                {SERVICES[row.service].name}
              </th>
              <td className="px-3 py-2">
                {row.terms ? (
                  <PolicyLink href={row.terms}>TOS</PolicyLink>
                ) : (
                  <Dash />
                )}
              </td>
              <td className="px-3 py-2">
                {row.privacy ? (
                  <PolicyLink href={row.privacy}>Privacy</PolicyLink>
                ) : (
                  <Dash />
                )}
              </td>
              <td className="px-3 py-2">
                {row.refund && row.refund.startsWith('http') ? (
                  <PolicyLink href={row.refund}>Refunds</PolicyLink>
                ) : (
                  <span className="text-muted-foreground">
                    {row.refund ?? '—'}
                  </span>
                )}
              </td>
              <td className="px-3 py-2">
                {row.support ? (
                  <PolicyLink href={row.support}>Contact</PolicyLink>
                ) : (
                  <Dash />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PolicyLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-foreground underline-offset-4 hover:underline"
    >
      {children}
      <ExternalLink className="h-3 w-3" aria-hidden="true" />
    </a>
  );
}

function Dash() {
  return <span className="text-muted-foreground/40">—</span>;
}
