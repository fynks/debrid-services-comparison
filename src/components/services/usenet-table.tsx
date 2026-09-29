import { Check, X } from 'lucide-react';
import { SERVICES } from '@/data/services';
import { USENET_SUPPORT } from '@/data/policies';

export function UsenetTable() {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table
        className="w-full min-w-max text-sm"
        aria-label="Usenet support comparison"
      >
        <thead>
          <tr className="border-b border-border bg-muted/40">
            <th
              scope="col"
              className="sticky left-0 z-10 bg-muted/40 px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"
            >
              Service
            </th>
            {USENET_SUPPORT.map(({ service }) => (
              <th
                key={service}
                scope="col"
                className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"
              >
                {SERVICES[service].name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <th
              scope="row"
              className="sticky left-0 z-10 bg-background px-3 py-3 text-left font-medium"
            >
              Usenet
            </th>
            {USENET_SUPPORT.map(({ service, supported }) => (
              <td key={service} className="px-3 py-3">
                {supported ? (
                  <Check
                    className="h-4 w-4 text-success"
                    aria-label={`${SERVICES[service].name} supports Usenet`}
                  />
                ) : (
                  <X
                    className="h-4 w-4 text-muted-foreground/40"
                    aria-label={`${SERVICES[service].name} does not support Usenet`}
                  />
                )}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
