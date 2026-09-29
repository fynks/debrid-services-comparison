import { html, cn, attrs } from '../../lib/dom.js';

const VARIANTS = {
  default: 'border-transparent bg-primary text-primary-foreground',
  secondary: 'border-transparent bg-secondary text-secondary-foreground',
  destructive: 'border-transparent bg-destructive text-destructive-foreground',
  outline: 'text-foreground',
  success: 'border-transparent bg-success-muted text-success',
  warning: 'border-transparent bg-warning-muted text-warning',
  info: 'border-transparent bg-info-muted text-info',
  muted: 'border-transparent bg-muted text-muted-foreground',
};

const BASE =
  'inline-flex items-center rounded-md border px-2 py-0.5 text-2xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1';

export function Badge({
  variant = 'default',
  class: className = '',
  children,
  ...rest
} = {}) {
  return html`<span
    class="${cn(BASE, VARIANTS[variant], className)}"
    ${attrs(rest)}
    >${children}</span
  >`.firstElementChild;
}