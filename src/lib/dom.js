// Tiny DOM utilities used by the dynamic components.
// Static markup lives in index.html - these helpers are for the bits
// that must change in response to user interaction (search, sort,
// select, table re-render, scroll-spy, etc.).

/** Compose class names, dropping falsy. */
export function cn(...args) {
  const out = [];
  for (const a of args) {
    if (!a) continue;
    if (typeof a === 'string' || typeof a === 'number') {
      out.push(a);
    } else if (Array.isArray(a)) {
      const sub = cn(...a);
      if (sub) out.push(sub);
    } else if (typeof a === 'object') {
      for (const k of Object.keys(a)) {
        if (a[k]) out.push(k);
      }
    }
  }
  return out.join(' ');
}

/**
 * Delegate an event listener. The handler fires only when the event
 * originates (or bubbles through) an element matching `selector`.
 */
export function on(root, type, selector, handler) {
  const listener = (e) => {
    const path = e.composedPath ? e.composedPath() : [];
    let target = null;
    for (const node of path) {
      if (!(node instanceof Element)) continue;
      if (node === root) break;
      if (node.matches && node.matches(selector)) {
        target = node;
        break;
      }
    }
    if (target) handler(e, target);
  };
  root.addEventListener(type, listener);
  return () => root.removeEventListener(type, listener);
}

/** Find first ancestor (or self) matching `selector`. */
export function findAncestor(el, selector) {
  let cur = el;
  while (cur && cur instanceof Element) {
    if (cur.matches(selector)) return cur;
    cur = cur.parentElement;
  }
  return null;
}

/**
 * Find the first mount point whose `data-mount` attribute matches
 * `name`. Used as the bridge between static HTML and dynamic
 * components - every dynamic component lives in a `data-mount="…"`
 * placeholder in index.html.
 */
export function mountPoint(name) {
  return document.querySelector(`[data-mount="${name}"]`);
}

/** Same as mountPoint but for `data-mount` with an additional
 * `data-host-source` attribute (used to share a single component
 * across file/adult hosts). */
export function mountPointsByHostSource(source) {
  return [
    ...document.querySelectorAll(`[data-mount][data-host-source="${source}"]`),
  ];
}

/**
 * Patch `node` to match `nextNode` in place using morphdom when
 * available; falls back to a wholesale replacement.
 */
let _morphdom = null;
let _morphdomReady = false;
async function loadMorphdom() {
  if (_morphdomReady) return _morphdom;
  try {
    _morphdom = (await import('morphdom')).default;
  } catch {
    _morphdom = false;
  }
  _morphdomReady = true;
  return _morphdom;
}

export function patch(node, nextNode) {
  if (_morphdom) {
    return _morphdom(node, nextNode);
  }
  const parent = node.parentNode;
  if (!parent) return node;
  parent.replaceChild(nextNode, node);
  return nextNode;
}

// Initialize morphdom eagerly so the first patch isn't async.
loadMorphdom();

/** Stable numeric hash. */
export function hashString(input) {
  let hash = 5381;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 33) ^ input.charCodeAt(i);
  }
  return hash >>> 0;
}