import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, ExternalLink, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SERVICES, SERVICE_ORDER } from '@/data/services';
import type { ServiceId } from '@/types/data';
import {
  extractHostnameFromURL,
  hashString,
  levenshteinDistance,
  normalizeHostname,
} from '@/lib/utils';
import { cn } from '@/lib/utils';

/** Where users can verify a service's live host support. */
const SERVICE_STATUS_PAGES: Record<ServiceId, string | undefined> = Object.fromEntries(
  SERVICE_ORDER.map((id) => [id, SERVICES[id].statusPage]),
) as Record<ServiceId, string | undefined>;

interface HostSupportTableProps {
  /** Title shown above the table. */
  title?: string;
  /** Description shown below the title. */
  description?: string;
  /** Optimized host support data. */
  data: { services: ServiceId[]; supported: Record<string, number[]> };
  /** Placeholder text for the search input. */
  searchPlaceholder?: string;
  /** Optional initial limit before "show all" button. */
  initialLimit?: number;
  /** Aria-label for the search results region. */
  resultsLabel: string;
  /** CSS id for the table container (preserves deep links). */
  id?: string;
}

type SortState = {
  column: 'service' | ServiceId;
  direction: 'asc' | 'desc';
};

/**
 * Core host-support comparison table.
 *
 * - Lazy renders initial N rows, "Load all" button reveals the rest.
 * - Search supports substring + URL/hostname fuzzy matching.
 * - Sort by host name or by per-service support.
 * - Sticky first column on horizontal scroll, sticky header on vertical scroll.
 */
export function HostSupportTable({
  data,
  searchPlaceholder = 'Search hosts or paste URL…',
  initialLimit = 60,
  resultsLabel,
  id,
}: HostSupportTableProps) {
  const [search, setSearch] = useState('');
  const debounced = useDeferredValue(search);
  const [sort, setSort] = useState<SortState>({
    column: 'service',
    direction: 'asc',
  });
  const [fullyLoaded, setFullyLoaded] = useState(false);

  const services = data.services;
  const hostCount = useMemo(() => Object.keys(data.supported).length, [data]);

  // Flatten + sort.
  const sortedEntries = useMemo(() => {
    const entries = Object.entries(data.supported);
    entries.sort(([aHost, aSupp], [bHost, bSupp]) => {
      if (sort.column === 'service') {
        return sort.direction === 'asc'
          ? aHost.localeCompare(bHost)
          : bHost.localeCompare(aHost);
      }
      const idx = services.indexOf(sort.column);
      const aHas = idx >= 0 && aSupp.includes(idx) ? 1 : 0;
      const bHas = idx >= 0 && bSupp.includes(idx) ? 1 : 0;
      return sort.direction === 'asc' ? aHas - bHas : bHas - aHas;
    });
    return entries;
  }, [data, sort, services]);

  // Apply search filter.
  const filteredEntries = useMemo(() => {
    const term = debounced.trim();
    if (!term) return sortedEntries;

    const extractedHostname = extractHostnameFromURL(term);
    if (extractedHostname) {
      // Fuzzy URL match.
      const needle = normalizeHostname(extractedHostname);
      return sortedEntries
        .map(([host, supp]) => {
          const score = similarityScore(host, needle);
          return { host, supp, score };
        })
        .filter((m) => m.score >= 60)
        .sort((a, b) => b.score - a.score)
        .map(({ host, supp }) => [host, supp] as const);
    }
    const needle = term.toLowerCase();
    return sortedEntries.filter(([host]) =>
      host.toLowerCase().includes(needle),
    );
  }, [debounced, sortedEntries]);

  // Determine visible rows.
  const limit = fullyLoaded || debounced ? filteredEntries.length : Math.min(initialLimit, filteredEntries.length);
  const visibleEntries = filteredEntries.slice(0, limit);
  const showingAll =
    fullyLoaded || debounced || filteredEntries.length <= initialLimit;

  const handleSort = (column: SortState['column']) => {
    setSort((prev) => {
      if (prev.column === column) {
        return {
          column,
          direction: prev.direction === 'asc' ? 'desc' : 'asc',
        };
      }
      return { column, direction: 'asc' };
    });
  };

  const resultMessage = debounced
    ? `${filteredEntries.length} of ${hostCount} hosts`
    : `${hostCount} hosts`;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search
            className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className="pl-8 pr-8"
            aria-label={resultsLabel}
            aria-controls={`${id ?? 'hosts'}-table-region`}
          />
          {search ? (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-1.5 top-1/2 inline-flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          ) : null}
        </div>
        <p
          className="text-xs text-muted-foreground tabular-nums"
          aria-live="polite"
        >
          {resultMessage}
        </p>
      </div>

      <div
        id={`${id ?? 'hosts'}-table-region`}
        role="region"
        aria-live="polite"
        aria-label={resultsLabel}
        className="relative overflow-x-auto rounded-lg border border-border bg-card"
      >
        {/* Subtle fade-out hint at the right edge on mobile, signaling
            horizontal scroll. Pointer-events-none so it never intercepts
            taps. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 z-30 w-8 bg-gradient-to-l from-card to-transparent md:hidden"
        />
        <table
          className="w-full min-w-max text-sm tabular-nums"
          aria-label={resultsLabel}
        >
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <SortHeader
                label="Host"
                column="service"
                sort={sort}
                onSort={handleSort}
                sticky
              />
              {services.map((s) => (
                <SortHeader
                  key={s}
                  label={SERVICES[s]?.name ?? s}
                  column={s}
                  sort={sort}
                  onSort={handleSort}
                  className="text-center"
                />
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleEntries.length === 0 ? (
              <tr>
                <td
                  colSpan={services.length + 1}
                  className="px-4 py-16 text-center text-sm text-muted-foreground"
                >
                  No hosts match your search.
                </td>
              </tr>
            ) : (
              visibleEntries.map(([host, supportedIndices]) => (
                <tr
                  key={host}
                  className="group border-b border-border/40 last:border-0 transition-colors hover:bg-muted/30"
                >
                  <th
                    scope="row"
                    className="sticky left-0 z-10 bg-card px-3 py-2 text-left font-normal text-foreground border-r border-border transition-colors group-hover:bg-muted/30"
                  >
                    {host}
                  </th>
                  {services.map((service, idx) => {
                    const supported = supportedIndices.includes(idx);
                    const url = SERVICE_STATUS_PAGES[service];
                    return (
                      <td
                        key={service}
                        className="px-2 py-2 text-center"
                        data-supported={supported}
                      >
                        {supported ? (
                          url ? (
                            <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex h-7 w-7 items-center justify-center rounded-md text-success transition-colors hover:bg-success-muted hover:text-success focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                              aria-label={`${host} supported by ${service} — open status page`}
                              title={`Check live status for ${service}`}
                            >
                              <Check
                                className="h-4 w-4"
                                aria-hidden="true"
                              />
                            </a>
                          ) : (
                            <Check
                              className="mx-auto h-4 w-4 text-success"
                              aria-label={`${host} supported by ${service}`}
                            />
                          )
                        ) : (
                          <span
                            className="block text-center text-muted-foreground/30 select-none"
                            aria-label={`${host} not supported by ${service}`}
                          >
                            —
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!showingAll && filteredEntries.length > initialLimit ? (
        <div className="flex justify-center">
          <Button
            variant="outline"
            type="button"
            onClick={() => setFullyLoaded(true)}
          >
            Load all {filteredEntries.length} hosts
          </Button>
        </div>
      ) : null}

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-3 text-2xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <Check className="h-3.5 w-3.5 text-success" aria-hidden="true" />
          supported
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="text-muted-foreground/60">—</span>
          not supported
        </span>
        <span className="inline-flex items-center gap-1.5">
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          click a checkmark to open live status
        </span>
      </div>
    </div>
  );
}

interface SortHeaderProps {
  label: string;
  column: SortState['column'];
  sort: SortState;
  onSort: (column: SortState['column']) => void;
  className?: string;
  sticky?: boolean;
}

function SortHeader({
  label,
  column,
  sort,
  onSort,
  className,
  sticky,
}: SortHeaderProps) {
  const isActive = sort.column === column;
  return (
    <th
      scope="col"
      aria-sort={
        isActive
          ? sort.direction === 'asc'
            ? 'ascending'
            : 'descending'
          : 'none'
      }
      className={cn(
        'px-3 py-2 text-left text-xs font-medium text-muted-foreground',
        className,
        // Solid background + right-edge divider so the sticky cell
        // never bleeds through when the table is scrolled horizontally
        // on narrow screens.
        sticky && 'sticky left-0 z-20 bg-muted border-r border-border',
      )}
    >
      <button
        type="button"
        onClick={() => onSort(column)}
        className={cn(
          'inline-flex items-center gap-1 rounded text-xs uppercase tracking-wider hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
          isActive && 'text-foreground',
        )}
      >
        <span>{label}</span>
        <SortIndicator active={isActive} direction={sort.direction} />
      </button>
    </th>
  );
}

function SortIndicator({
  active,
  direction,
}: {
  active: boolean;
  direction: 'asc' | 'desc';
}) {
  if (!active) {
    return (
      <span
        aria-hidden="true"
        className="text-muted-foreground/40 select-none"
      >
        ↕
      </span>
    );
  }
  return (
    <span aria-hidden="true" className="select-none">
      {direction === 'asc' ? '↑' : '↓'}
    </span>
  );
}

/** Lightweight similarity score 0–100 used for hostname fuzzy match. */
function similarityScore(host: string, needle: string): number {
  if (!needle) return 100;
  const a = normalizeHostname(host);
  const b = needle;
  if (!a || !b) return 0;
  if (a === b) return 100;
  if (a.includes(b) || b.includes(a)) {
    const longer = Math.max(a.length, b.length);
    const shorter = Math.min(a.length, b.length);
    return Math.round((shorter / longer) * 95);
  }
  const min = Math.min(a.length, b.length);
  let matching = 0;
  for (let i = 0; i < min; i++) {
    if (a[i] === b[i]) matching++;
    else break;
  }
  if (matching >= 3) {
    return Math.round((matching / Math.max(a.length, b.length)) * 85);
  }
  const dist = levenshteinDistance(a, b);
  const max = Math.max(a.length, b.length);
  return Math.max(0, Math.round((1 - dist / max) * 80));
}

/**
 * Tiny `useDeferredValue`-style hook that defers value updates
 * to idle time. Avoids extra React imports.
 */
function useDeferredValue<T>(value: T): T {
  const [deferred, setDeferred] = useState(value);
  const rafRef = useRef<number | undefined>(undefined);
  useEffect(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => setDeferred(value));
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [value]);
  return deferred;
}

// Re-export for tests / debug.
export { hashString };
