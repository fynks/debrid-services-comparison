import { Activity, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { SPEED_TEST_LINKS, STATUS_LINKS } from '@/data/policies';
import { SERVICES } from '@/data/services';

export function StatusGrid() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {STATUS_LINKS.map(({ service, url, description }) => (
        <a
          key={service}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col rounded-md border border-border p-4 transition-colors hover:border-foreground/30 hover:bg-muted/30"
          aria-label={`Open ${SERVICES[service].name} status page`}
        >
          <div className="flex items-center justify-between">
            <span className="font-medium">{SERVICES[service].name}</span>
            <Badge variant="success" className="text-2xs">
              <Activity className="mr-1 h-3 w-3" aria-hidden="true" />
              Live
            </Badge>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
          <span className="mt-3 inline-flex items-center gap-1 text-xs text-muted-foreground group-hover:text-foreground">
            Open status page
            <ExternalLink className="h-3 w-3" aria-hidden="true" />
          </span>
        </a>
      ))}
    </div>
  );
}

export function SpeedTestGrid() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {SPEED_TEST_LINKS.map(({ service, url, label }) => (
        <a
          key={service}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center justify-between rounded-md border border-border p-4 transition-colors hover:border-foreground/30 hover:bg-muted/30"
        >
          <div>
            <span className="font-medium">{SERVICES[service].name}</span>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {label ?? 'Speed Test'}
            </p>
          </div>
          <ExternalLink
            className="h-4 w-4 text-muted-foreground group-hover:text-foreground"
            aria-hidden="true"
          />
        </a>
      ))}
    </div>
  );
}
