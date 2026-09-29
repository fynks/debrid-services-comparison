import { html, cn, attrs } from '../../lib/dom.js';

const BASE =
  'flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-none transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50';

export function Input({
  class: className = '',
  type = 'text',
  ...rest
} = {}) {
  return html`<input
    type="${type}"
    class="${cn(BASE, className)}"
    ${attrs(rest)}
  />`.firstElementChild;
}