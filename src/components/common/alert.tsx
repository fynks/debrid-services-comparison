import { AlertTriangle, Info, Lightbulb, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import * as React from 'react';

type AlertVariant = 'info' | 'warning' | 'tip';

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
}

const VARIANT_ICON: Record<AlertVariant, LucideIcon> = {
  info: Info,
  warning: AlertTriangle,
  tip: Lightbulb,
};

const VARIANT_CLASSES: Record<AlertVariant, string> = {
  info: 'border-info/30 bg-info-muted/70 text-foreground',
  warning: 'border-warning/40 bg-warning-muted/70 text-foreground',
  tip: 'border-primary/25 bg-primary/[0.04] text-foreground',
};

const VARIANT_ICON_COLOR: Record<AlertVariant, string> = {
  info: 'text-info',
  warning: 'text-warning',
  tip: 'text-primary',
};

/**
 * Restrained inline alert — used for context inside a section.
 *
 * Two roles depending on urgency:
 * - `info` and `tip` -> role="status" (polite announcement)
 * - `warning`        -> role="alert" (assertive — assistive tech
 *   interrupts the user)
 */
export function Alert({
  variant = 'info',
  className,
  children,
  ...props
}: AlertProps) {
  const Icon = VARIANT_ICON[variant];
  const isWarning = variant === 'warning';
  return (
    <div
      role={isWarning ? 'alert' : 'status'}
      className={cn(
        'flex items-start gap-3 rounded-md border px-4 py-3 text-sm leading-relaxed',
        VARIANT_CLASSES[variant],
        className,
      )}
      {...props}
    >
      <Icon
        className={cn(
          'mt-0.5 h-4 w-4 shrink-0',
          VARIANT_ICON_COLOR[variant],
        )}
        aria-hidden="true"
      />
      <div className="min-w-0 flex-1 text-foreground/90 [&_a]:font-medium [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:text-primary">
        {children}
      </div>
    </div>
  );
}