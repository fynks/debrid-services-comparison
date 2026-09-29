// Tiny DOM utilities: html`` template tag, event delegation, class helpers.
// No dependencies. Works in any modern browser.

let __nodeId = 0;
const __nodeMap = new Map();

/**
 * Tagged template that returns a DocumentFragment.
 * - String interpolations are HTML-escaped.
 * - Array interpolations are joined (each item escaped).
 * - null/undefined/false interpolations become empty.
 * - Node/Fragment interpolations are inserted into the parsed tree at
 *   the position of their marker (`__node_N__`).
 *
 *   const f = html`<div class="foo">${text}<button>${iconNode}</button></div>`
 */
export function html(strings, ...values) {
  let s = '';
  for (let i = 0; i < strings.length; i++) {
    s += strings[i];
    if (i < values.length) {
      s += stringifyValue(values[i]);
    }
  }
  const tpl = document.createElement('template');
  tpl.innerHTML = s;
  const frag = tpl.content.cloneNode(true);

  // Replace attribute-value markers first (used when an interpolated
  // Node must fill an attribute slot — rare).
  if (__nodeMap.size) {
    const walker = document.createTreeWalker(frag, NodeFilter.SHOW_ELEMENT);
    const elements = [];
    let n = walker.nextNode();
    while (n) {
      elements.push(n);
      n = walker.nextNode();
    }
    for (const el of elements) {
      const attrs = Array.from(el.attributes);
      for (const attr of attrs) {
        if (/(?:^|[^\d])__node_(\d+)__/.test(attr.value)) {
          // Replace marker(s) inside attribute with empty string.
          el.setAttribute(attr.name, attr.value.replace(/__node_\d+__/g, ''));
        }
      }
    }
    // Also walk text nodes for markers that ended up as element content
    const textWalker = document.createTreeWalker(frag, NodeFilter.SHOW_TEXT);
    let t = textWalker.nextNode();
    while (t) {
      if (t.nodeValue && /__node_\d+__/.test(t.nodeValue)) {
        // Split text into segments, replace markers with Nodes.
        const frag2 = document.createDocumentFragment();
        let last = 0;
        const re = /__node_(\d+)__/g;
        let m;
        while ((m = re.exec(t.nodeValue)) !== null) {
          if (m.index > last) {
            frag2.appendChild(
              document.createTextNode(t.nodeValue.slice(last, m.index))
            );
          }
          const real = __nodeMap.get(Number(m[1]));
          if (real) frag2.appendChild(real);
          last = m.index + m[0].length;
        }
        if (last < t.nodeValue.length) {
          frag2.appendChild(document.createTextNode(t.nodeValue.slice(last)));
        }
        const parent = t.parentNode;
        if (parent) parent.replaceChild(frag2, t);
      }
      t = textWalker.nextNode();
    }
  }
  return frag;
}

function stringifyValue(v) {
  if (v == null || v === false) return '';
  if (Array.isArray(v)) return v.map(stringifyValue).join('');
  if (v instanceof Node || v instanceof NodeList) {
    if (v instanceof Node) {
      const id = ++__nodeId;
      __nodeMap.set(id, v);
      return `__node_${id}__`;
    }
    // NodeList
    const ids = [];
    v.forEach((n) => {
      const id = ++__nodeId;
      __nodeMap.set(id, n);
      ids.push(`__node_${id}__`);
    });
    return ids.join('');
  }
  return escapeHtml(String(v));
}

const ESCAPE_MAP = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => ESCAPE_MAP[c]);
}

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
 * Render an object as HTML attributes. Boolean attributes are added
 * bare when true, dropped when false. Falsy values become empty.
 */
export function attrs(map) {
  const out = [];
  for (const k of Object.keys(map || {})) {
    if (map[k] === false || map[k] == null) continue;
    if (map[k] === true) {
      out.push(k);
    } else {
      out.push(`${k}="${escapeHtml(String(map[k]))}"`);
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