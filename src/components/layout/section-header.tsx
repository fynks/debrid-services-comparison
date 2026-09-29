import * as React from 'react';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
  /**
   * `start` (default) — eyebrow, title and description hug the left edge
   * on larger screens but stay inside the page gutter.
   * `center` — also center-aligns on larger screens (used for hero only).
   */
  align?: 'start' | 'center';
}

/**
 * Restrained section header used throughout the page.
 * No gradients, no oversized glow, no icon — just typographic hierarchy.
 *
 * On mobile (< sm), the header is center-aligned so titles don't crash
 * into the left edge when the section is short. On larger screens it
 * snaps back to left alignment by default.
 */
export function SectionHeader({
  id,
  eyebrow,
  title,
  description,
  children,
  className,
  align = 'start',
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'mb-8 max-w-2xl',
        // Center section titles on mobile for visual balance with the
        // page's narrow gutter; snap back to left alignment on larger
        // screens where the rest of the page is also left-aligned.
        align === 'center'
          ? 'text-center'
          : 'text-center sm:text-left',
        className,
      )}
    >
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
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base sm:text-pretty">
          {description}
        </p>
      ) : null}
      {children}
    </div>
  );
}