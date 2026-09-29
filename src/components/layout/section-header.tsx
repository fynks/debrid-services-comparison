import * as React from 'react';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

/**
 * Restrained section header used throughout the page.
 * No gradients, no oversized glow, no icon — just typographic hierarchy.
 */
export function SectionHeader({
  id,
  eyebrow,
  title,
  description,
  children,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn('mb-8 max-w-2xl', className)}>
      {eyebrow ? (
        <p className="mb-2 text-2xs font-semibold uppercase tracking-wider text-muted-foreground">
          {eyebrow}
        </p>
      ) : null}
      <h2
        id={id}
        className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl"
      >
        {title}
      </h2>
      {description ? (
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
          {description}
        </p>
      ) : null}
      {children}
    </div>
  );
}
