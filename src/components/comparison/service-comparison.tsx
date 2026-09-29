import { useMemo, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/common/alert';
import { SERVICES } from '@/data/services';
import type { ServiceId } from '@/types/data';
import { Check, RotateCcw, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ServiceComparisonProps {
  /** Optimized host support data. */
  data: { services: ServiceId[]; supported: Record<string, number[]> };
}

interface ComparisonStats {
  shared: number;
  aOnly: number;
  bOnly: number;
  total: number;
}

interface RowData {
  host: string;
  a: boolean;
  b: boolean;
}

/** Read deep-link params on first render. */
function readInitialSelection(
  services: readonly ServiceId[],
): [ServiceId | '', ServiceId | ''] {
  if (typeof window === 'undefined') return ['', ''];
  const params = new URLSearchParams(window.location.search);
  const compare = params.get('compare');
  const withP = params.get('with');
  const aOk =
    compare && (services as readonly string[]).includes(compare)
      ? (compare as ServiceId)
      : '';
  const bOk =
    withP && (services as readonly string[]).includes(withP)
      ? (withP as ServiceId)
      : '';
  return [aOk, bOk];
}

export function ServiceComparison({ data }: ServiceComparisonProps) {
  const services = data.services;
  const [a, setA] = useState<ServiceId | ''>(() =>
    readInitialSelection(services)[0],
  );
  const [b, setB] = useState<ServiceId | ''>(() =>
    readInitialSelection(services)[1],
  );

  const rows = useMemo<RowData[]>(() => {
    if (!a || !b) return [];
    const aIdx = services.indexOf(a);
    const bIdx = services.indexOf(b);
    if (aIdx < 0 || bIdx < 0) return [];
    return Object.entries(data.supported).map(([host, idxs]) => ({
      host,
      a: idxs.includes(aIdx),
      b: idxs.includes(bIdx),
    }));
  }, [a, b, services, data]);

  const stats = useMemo<ComparisonStats>(() => {
    let shared = 0;
    let aOnly = 0;
    let bOnly = 0;
    for (const r of rows) {
      if (r.a && r.b) shared++;
      else if (r.a) aOnly++;
      else if (r.b) bOnly++;
    }
    return { shared, aOnly, bOnly, total: rows.length };
  }, [rows]);

  const reset = () => {
    setA('');
    setB('');
  };

  const sameService = a && b && a === b;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
        <CompareSelect
          label="First service"
          value={a}
          onChange={setA}
          services={services}
        />
        <div className="hidden text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground sm:block">
          vs
        </div>
        <CompareSelect
          label="Second service"
          value={b}
          onChange={setB}
          services={services}
        />
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {a && b ? (
            <>
              Comparing <span className="font-medium text-foreground">{SERVICES[a]?.name}</span>{' '}
              with <span className="font-medium text-foreground">{SERVICES[b]?.name}</span>
              {' · '}
              <span className="tabular-nums">
                {stats.total} hosts analyzed
              </span>
            </>
          ) : (
            <>Choose two services to see a side-by-side host breakdown.</>
          )}
        </p>
        {(a || b) && (
          <Button variant="ghost" size="sm" type="button" onClick={reset}>
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            Reset
          </Button>
        )}
      </div>

      {sameService ? (
        <Alert variant="warning">Please select two different services.</Alert>
      ) : null}

      {!a || !b ? (
        <div className="rounded-lg border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
          Pick two services above to start the comparison.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <StatCard label="Both" value={stats.shared} variant="shared" />
            <StatCard
              label={`${SERVICES[a]?.name ?? a} only`}
              value={stats.aOnly}
              variant="a-only"
            />
            <StatCard
              label={`${SERVICES[b]?.name ?? b} only`}
              value={stats.bOnly}
              variant="b-only"
            />
          </div>

          <div className="overflow-x-auto rounded-lg border border-border">
            <table
              className="w-full min-w-max text-sm tabular-nums"
              aria-label={`Comparing ${SERVICES[a]?.name ?? a} and ${SERVICES[b]?.name ?? b}`}
            >
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th
                    scope="col"
                    className="sticky left-0 z-20 border-r border-border bg-muted px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"
                  >
                    Host
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-2 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground"
                  >
                    {SERVICES[a]?.name ?? a}
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-2 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground"
                  >
                    {SERVICES[b]?.name ?? b}
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr
                    key={r.host}
                    className="group border-b border-border/50 last:border-0 transition-colors hover:bg-muted/30"
                  >
                    <th
                      scope="row"
                      className="sticky left-0 z-10 border-r border-border bg-background px-3 py-1.5 text-left font-normal transition-colors group-hover:bg-muted/30"
                    >
                      {r.host}
                    </th>
                    <Cell supported={r.a} service={a as ServiceId} host={r.host} />
                    <Cell supported={r.b} service={b as ServiceId} host={r.host} />
                    <td className="px-3 py-1.5">
                      <StatusBadge
                        a={r.a}
                        b={r.b}
                        aName={SERVICES[a as ServiceId]?.name ?? String(a)}
                        bName={SERVICES[b as ServiceId]?.name ?? String(b)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

function Cell({
  supported,
  service,
  host,
}: {
  supported: boolean;
  service: ServiceId;
  host: string;
}) {
  const url = SERVICES[service]?.statusPage;
  return (
    <td className="px-3 py-1.5 text-center">
      {supported ? (
        url ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${host} supported by ${SERVICES[service].name} — open status page`}
            className="inline-flex items-center text-success hover:text-success/80"
          >
            <Check className="h-4 w-4" aria-hidden="true" />
          </a>
        ) : (
          <Check
            className="mx-auto h-4 w-4 text-success"
            aria-label={`${host} supported by ${SERVICES[service].name}`}
          />
        )
      ) : (
        <X
          className="mx-auto h-4 w-4 text-muted-foreground/40"
          aria-label={`${host} not supported by ${SERVICES[service].name}`}
        />
      )}
    </td>
  );
}

function StatusBadge({
  a,
  b,
  aName,
  bName,
}: {
  a: boolean;
  b: boolean;
  aName: string;
  bName: string;
}) {
  let label: string;
  let variant: 'success' | 'info' | 'warning' | 'muted';
  if (a && b) {
    label = 'Both';
    variant = 'success';
  } else if (a) {
    label = `${aName} only`;
    variant = 'info';
  } else if (b) {
    label = `${bName} only`;
    variant = 'warning';
  } else {
    label = 'Neither';
    variant = 'muted';
  }
  return <Badge variant={variant}>{label}</Badge>;
}

function StatCard({
  label,
  value,
  variant,
}: {
  label: string;
  value: number;
  variant: 'shared' | 'a-only' | 'b-only';
}) {
  return (
    <div
      className={cn(
        'rounded-md border p-3',
        variant === 'shared' && 'border-success/30 bg-success-muted/40',
        variant === 'a-only' && 'border-info/30 bg-info-muted/40',
        variant === 'b-only' && 'border-warning/30 bg-warning-muted/40',
      )}
    >
      <p className="text-2xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-2xl font-semibold tabular-nums">{value}</p>
    </div>
  );
}

function CompareSelect({
  label,
  value,
  onChange,
  services,
}: {
  label: string;
  value: ServiceId | '';
  onChange: (v: ServiceId) => void;
  services: ServiceId[];
}) {
  return (
    <div>
      <label
        htmlFor={`compare-${label}`}
        className="mb-1.5 block text-xs font-medium text-muted-foreground"
      >
        {label}
      </label>
      <Select
        value={value}
        onValueChange={(v) => onChange(v as ServiceId)}
      >
        <SelectTrigger id={`compare-${label}`} aria-label={label}>
          <SelectValue placeholder="Choose a service…" />
        </SelectTrigger>
        <SelectContent>
          {services.map((s) => (
            <SelectItem key={s} value={s}>
              {SERVICES[s]?.name ?? s}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
