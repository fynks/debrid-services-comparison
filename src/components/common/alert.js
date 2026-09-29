import { html, attrs } from '../../lib/dom.js';
import { icon } from '../../lib/icons.js';

/**
 * <Alert variant="info|warning|tip">…</Alert>
 *
 *   const el = Alert({ variant: 'warning', children: html`<strong>…</strong>` })
 *   el.appendChild(moreContent) // if you need multiple children, wrap in array.
 *
 * `children` may be a Node, an array of Nodes, or a string.
 */
const VARIANT_CLASSES = {
  info: 'border-info/30 bg-info-muted/70 text-foreground',
  warning: 'border-warning/40 bg-warning-muted/70 text-foreground',
  tip: 'border-primary/25 bg-primary/[0.04] text-foreground',
};

const VARIANT_ICON_NAME = {
  info: 'info',
  warning: 'alert-triangle',
  tip: 'lightbulb',
};

const VARIANT_ICON_COLOR = {
  info: 'text-info',
  warning: 'text-warning',
  tip: 'text-primary',
};

export function Alert({
  variant = 'info',
  class: className = '',
  children,
  ...rest
} = {}) {
  const Icon = icon(VARIANT_ICON_NAME[variant], {
    class: `mt-0.5 h-4 w-4 shrink-0 ${VARIANT_ICON_COLOR[variant]}`,
    'aria-hidden': 'true',
  });
  const isWarning = variant === 'warning';
  const role = isWarning ? 'alert' : 'status';

  // Build body container first
  const body = document.createElement('div');
  body.className =
    'min-w-0 flex-1 text-foreground/90 [&_a]:font-medium [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:text-primary';
  if (children != null) {
    if (Array.isArray(children)) {
      for (const c of children) {
        if (c == null) continue;
        body.appendChild(
          c instanceof Node ? c : document.createTextNode(String(c))
        );
      }
    } else if (children instanceof Node) {
      body.appendChild(children);
    } else {
      body.appendChild(document.createTextNode(String(children)));
    }
  }

  // Build wrapper via template literal; only Icon (Node) is interpolated
  const wrapper = html`<div
    role="${role}"
    class="flex items-start gap-3 rounded-md border px-4 py-3 text-sm leading-relaxed ${VARIANT_CLASSES[variant]} ${className}"
    ${attrs(rest)}
  >
    ${Icon}
    ${body}
  </div>`;

  return wrapper.firstElementChild;
}