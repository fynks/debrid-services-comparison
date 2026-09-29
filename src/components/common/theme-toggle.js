import { on } from '../../lib/dom.js';
import { icon } from '../../lib/icons.js';
import { toggleTheme, getTheme } from '../../lib/theme.js';

/**
 * Floating theme toggle. Re-uses the same widget used in the site
 * header. Both instances stay in sync via the theme module's listener
 * API.
 */
export function ThemeToggle({ class: className = '' } = {}) {
  const root = document.createElement('button');
  root.type = 'button';
  root.className =
    `inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 ${className}`;
  root.setAttribute('aria-label', 'Toggle dark mode');

  let currentIcon;
  function paint(theme) {
    const next = theme === 'dark' ? 'light' : 'dark';
    root.dataset.next = next;
    root.setAttribute('aria-label', `Switch to ${next} mode`);
    if (currentIcon) root.removeChild(currentIcon);
    currentIcon = icon(theme === 'dark' ? 'sun' : 'moon', {
      class: 'h-4 w-4',
      'aria-hidden': 'true',
    });
    root.appendChild(currentIcon);
  }
  paint(getTheme());

  on(root, 'click', 'button', () => toggleTheme());
  return root;
}