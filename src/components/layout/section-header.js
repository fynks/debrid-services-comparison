import { html } from '../../lib/dom.js';

/**
 * <SectionHeader id="…" eyebrow="…" title="…" description="…">
 *
 * Centers on mobile, left-aligns on `sm+`. Restrained, no decoration.
 */
export function SectionHeader({
  id,
  eyebrow,
  title,
  description,
  align = 'start',
  class: className = '',
} = {}) {
  const alignClass = align === 'center' ? 'text-center' : 'text-center sm:text-left';
  return html`<header class="mb-8 max-w-2xl ${alignClass} ${className}">
    ${eyebrow
      ? html`<p class="mb-2 text-2xs font-semibold uppercase tracking-wider text-muted-foreground">
          ${eyebrow}
        </p>`
      : ''}
    <h2
      id="${id ?? ''}"
      class="text-2xl font-semibold tracking-tight text-balance sm:text-3xl"
    >
      ${title}
    </h2>
    ${description
      ? html`<p class="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base sm:leading-relaxed sm:text-pretty">
          ${description}
        </p>`
      : ''}
  </header>`.firstElementChild;
}