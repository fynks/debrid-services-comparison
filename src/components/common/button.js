import { html, cn, attrs } from '../../lib/dom.js';

const VARIANTS = {
  default:
    'bg-primary text-primary-foreground hover:bg-primary/90',
  secondary:
    'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  outline:
    'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
  ghost: 'hover:bg-accent hover:text-accent-foreground',
  link: 'text-primary underline-offset-4 hover:underline',
  destructive:
    'bg-destructive text-destructive-foreground hover:bg-destructive/90',
};

const SIZES = {
  default: 'h-9 px-4 py-2',
  sm: 'h-8 px-3 text-xs',
  lg: 'h-10 px-6',
  icon: 'h-9 w-9',
};

const BASE =
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';

/**
 * Renders a `<button>` (or `<a>` if `href` is provided) styled to match
 * the rest of the design system.
 */
export function Button({
  variant = 'default',
  size = 'default',
  class: className = '',
  href,
  type = 'button',
  children,
  ...rest
} = {}) {
  const classes = cn(BASE, VARIANTS[variant], SIZES[size], className);
  if (href) {
    return html`<a
      href="${href}"
      class="${classes}"
      ${attrs(rest)}
      >${children}</a
    >`.firstElementChild;
  }
  return html`<button
    type="${type}"
    class="${classes}"
    ${attrs(rest)}
  >
    ${children}
  </button>`.firstElementChild;
}