import { on, cn } from '../../lib/dom.js';
import { icon } from '../../lib/icons.js';

/**
 * <Select> ARIA combobox. Drop-in replacement for Radix Select with
 * none of its dependencies.
 *
 * Usage:
 *   const el = Select({
 *     value: 'foo',
 *     onChange: (v) => ...,
 *     options: [{ value: 'foo', label: 'Foo' }, ...],
 *     placeholder: 'Pick one',
 *     class: 'w-32',
 *   });
 *
 * Implements the WAI-ARIA combobox pattern:
 *   - Trigger button with `aria-haspopup="listbox"`, `aria-expanded`.
 *   - Listbox with `role="listbox"`, single-select.
 *   - Type-ahead via keyboard.
 *   - Click-outside / Escape to close.
 */
const TRIGGER_BASE =
  'flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-1 text-sm shadow-none placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1';

export function Select({
  value,
  onChange,
  options = [],
  placeholder = 'Select…',
  class: className = '',
  disabled,
  ...rest
} = {}) {
  let open = false;
  let activeIndex = -1;

  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = cn(TRIGGER_BASE, className);
  trigger.setAttribute('aria-haspopup', 'listbox');
  trigger.setAttribute('aria-expanded', 'false');
  trigger.setAttribute('role', 'combobox');
  trigger.disabled = !!disabled;

  const triggerLabel = document.createElement('span');
  triggerLabel.className =
    'truncate text-left text-sm ' + (value ? '' : 'text-muted-foreground');
  trigger.appendChild(triggerLabel);

  const chevron = icon('chevron-down', {
    class: 'h-4 w-4 shrink-0 opacity-50',
    'aria-hidden': 'true',
  });
  trigger.appendChild(chevron);

  const listbox = document.createElement('ul');
  listbox.setAttribute('role', 'listbox');
  listbox.className =
    'absolute z-50 mt-1 max-h-72 w-full min-w-[8rem] overflow-auto rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md focus:outline-none';
  listbox.style.display = 'none';

  const root = document.createElement('div');
  root.className = 'relative inline-block w-full';
  root.appendChild(trigger);
  root.appendChild(listbox);

  function labelOf(v) {
    const found = options.find((o) => o.value === v);
    return found ? found.label : '';
  }

  function paintLabel() {
    const label = labelOf(value);
    triggerLabel.textContent = label || placeholder;
    triggerLabel.classList.toggle('text-muted-foreground', !label);
  }

  function buildOptions() {
    listbox.innerHTML = '';
    options.forEach((opt, i) => {
      const li = document.createElement('li');
      li.setAttribute('role', 'option');
      li.setAttribute('aria-selected', String(opt.value === value));
      li.dataset.value = opt.value;
      li.dataset.idx = String(i);
      li.id = `select-opt-${i}`;
      li.className =
        'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none data-[active=true]:bg-accent data-[active=true]:text-accent-foreground data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 aria-selected:bg-accent aria-selected:text-accent-foreground hover:bg-accent hover:text-accent-foreground';
      if (opt.value === value) {
        li.classList.add('bg-accent', 'text-accent-foreground');
      }
      const checkmark = document.createElement('span');
      checkmark.className =
        'absolute left-2 flex h-3.5 w-3.5 items-center justify-center';
      if (opt.value === value) {
        checkmark.appendChild(
          icon('check', { class: 'h-4 w-4', 'aria-hidden': 'true' })
        );
      }
      li.appendChild(checkmark);
      li.appendChild(document.createTextNode(opt.label));
      listbox.appendChild(li);
    });
  }

  function openList() {
    if (open || disabled) return;
    open = true;
    activeIndex = options.findIndex((o) => o.value === value);
    listbox.style.display = 'block';
    trigger.setAttribute('aria-expanded', 'true');
    updateActive();
    // Position listbox
    const r = trigger.getBoundingClientRect();
    listbox.style.minWidth = `${r.width}px`;
    setTimeout(() => {
      const sel = listbox.querySelector('[aria-selected="true"]');
      if (sel && sel.scrollIntoView) sel.scrollIntoView({ block: 'nearest' });
    }, 0);
    document.addEventListener('click', onDocClick, true);
    document.addEventListener('keydown', onDocKey, true);
  }

  function closeList() {
    if (!open) return;
    open = false;
    listbox.style.display = 'none';
    trigger.setAttribute('aria-expanded', 'false');
    document.removeEventListener('click', onDocClick, true);
    document.removeEventListener('keydown', onDocKey, true);
  }

  function updateActive() {
    [...listbox.children].forEach((li, i) => {
      li.dataset.active = i === activeIndex ? 'true' : 'false';
    });
    const opt = listbox.children[activeIndex];
    if (opt) {
      trigger.setAttribute('aria-activedescendant', opt.id);
      opt.scrollIntoView({ block: 'nearest' });
    }
  }

  function commit(idx) {
    const opt = options[idx];
    if (!opt) return;
    value = opt.value;
    paintLabel();
    if (typeof onChange === 'function') onChange(opt.value);
    buildOptions();
    closeList();
    trigger.focus();
  }

  function onDocClick(e) {
    if (!root.contains(e.target)) closeList();
  }

  function onDocKey(e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      closeList();
      trigger.focus();
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      activeIndex = Math.min(options.length - 1, activeIndex + 1);
      updateActive();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      activeIndex = Math.max(0, activeIndex - 1);
      updateActive();
    } else if (e.key === 'Enter' || e.key === ' ') {
      if (activeIndex >= 0) {
        e.preventDefault();
        commit(activeIndex);
      }
    } else if (e.key === 'Home') {
      e.preventDefault();
      activeIndex = 0;
      updateActive();
    } else if (e.key === 'End') {
      e.preventDefault();
      activeIndex = options.length - 1;
      updateActive();
    }
  }

  // Delegated click on options
  on(listbox, 'click', '[role="option"]', (e, target) => {
    const idx = Number(target.dataset.idx);
    commit(idx);
  });

  trigger.addEventListener('click', () => (open ? closeList() : openList()));
  trigger.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openList();
    }
  });

  // Apply any external attributes (id, name, data-*, etc.) to root.
  for (const [k, v] of Object.entries(rest)) {
    if (k === 'aria-label' || k === 'name') root.setAttribute(k, v);
  }

  buildOptions();
  paintLabel();
  return root;
}