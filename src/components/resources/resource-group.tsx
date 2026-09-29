import { ArrowUpRight, type LucideIcon } from 'lucide-react';
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
      <div className="flex items-baseline gap-2">
        {Icon ? (
          <Icon
            className="h-3.5 w-3.5 translate-y-[2px] text-muted-foreground"
            aria-hidden="true"
          />
        ) : null}
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
              className="group relative flex flex-col rounded-lg border border-border bg-card p-4 transition-colors hover:border-foreground/30 hover:bg-muted/40"
            >
              {mainHref ? (
                <a
                  href={mainHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 z-0 rounded-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
                  aria-label={item.name}
                >
                  <span className="sr-only">{item.name}</span>
                </a>
              ) : null}
              <div className="relative z-10 flex items-start justify-between gap-2">
                <span className="font-medium text-foreground">{item.name}</span>
                {hasExtra ? null : (
                  <ArrowUpRight
                    className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
                    aria-hidden="true"
                  />
                )}
              </div>
              <p className="relative z-10 mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
              <div className="relative z-10 mt-4 flex flex-wrap gap-1.5">
                {item.tags.map((t) => (
                  <Badge key={t} variant="muted" className="text-2xs">
                    {t}
                  </Badge>
                ))}
              </div>
              {item.extraLinks?.length ? (
                <div className="relative z-10 mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs">
                  {item.extraLinks.map((link) => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-0.5 font-medium text-primary underline-offset-4 hover:underline"
                    >
                      {link.label}
                      <ArrowUpRight
                        className="h-3 w-3"
                        aria-hidden="true"
                      />
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
