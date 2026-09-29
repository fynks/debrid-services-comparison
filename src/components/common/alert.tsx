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
  info: 'border-info/30 bg-info-muted/40 text-info-foreground',
  warning: 'border-warning/30 bg-warning-muted/40 text-warning-foreground',
  tip: 'border-primary/20 bg-primary/5 text-foreground',
};

export function Alert({
  variant = 'info',
  className,
  children,
  ...props
}: AlertProps) {
  const Icon = VARIANT_ICON[variant];
  return (
    <div
      role="status"
      className={cn(
        'flex items-start gap-3 rounded-md border p-4 text-sm',
        VARIANT_CLASSES[variant],
        className,
      )}
      {...props}
    >
      <Icon
        className={cn(
          'mt-0.5 h-4 w-4 shrink-0',
          variant === 'info' && 'text-info',
          variant === 'warning' && 'text-warning',
          variant === 'tip' && 'text-primary',
        )}
        aria-hidden="true"
      />
      <div className="text-foreground/90 [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:text-foreground">
        {children}
      </div>
    </div>
  );
}
