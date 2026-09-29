import { ExternalLink, type LucideIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { ResourceGroup } from '@/types/data';

interface ResourceGroupSectionProps {
  group: ResourceGroup;
  iconMap: Record<string, LucideIcon>;
}

export function ResourceGroupSection({ group, iconMap }: ResourceGroupSectionProps) {
  const Icon = iconMap[group.icon];
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        {Icon ? <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" /> : null}
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          {group.title}
        </h3>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {group.items.map((item) => {
          const hasExtra = !!item.extraLinks?.length;
          const mainHref = hasExtra ? undefined : item.url;
          return (
            <div
              key={item.name}
              className="group relative flex flex-col rounded-md border border-border p-4 transition-colors hover:border-foreground/30 hover:bg-muted/30"
            >
              {mainHref ? (
                <a
                  href={mainHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 z-0 rounded-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  aria-label={item.name}
                >
                  <span className="sr-only">{item.name}</span>
                </a>
              ) : null}
              <div className="relative z-10 flex items-start justify-between gap-2">
                <span className="font-medium text-foreground">{item.name}</span>
                {hasExtra ? null : (
                  <ExternalLink
                    className="h-3.5 w-3.5 shrink-0 text-muted-foreground group-hover:text-foreground"
                    aria-hidden="true"
                  />
                )}
              </div>
              <p className="relative z-10 mt-2 text-sm text-muted-foreground">{item.description}</p>
              <div className="relative z-10 mt-3 flex flex-wrap gap-1.5">
                {item.tags.map((t) => (
                  <Badge key={t} variant="muted">
                    {t}
                  </Badge>
                ))}
              </div>
              {item.extraLinks?.length ? (
                <div className="relative z-10 mt-3 flex flex-wrap gap-3 text-xs">
                  {item.extraLinks.map((link) => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-primary underline-offset-4 hover:underline"
                    >
                      {link.label} →
                    </a>
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
