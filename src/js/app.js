/**
 * Debrid Services Comparison - Modern Refactored Version
 * Optimized for performance, maintainability, and modern web standards
 * @version 2.1.0
 */

/* ============================================================================
   DIRECT JSON IMPORTS (bundled at build time, no runtime fetch needed)
   ============================================================================ */
import fileHostsData from '../json/file-hosts-optimized.json' with { type: 'json' };
import adultHostsData from '../json/adult-hosts-optimized.json' with { type: 'json' };
import { ComponentLifecycle } from './core/ComponentLifecycle.js';
import { DataTransformer } from './services/DataTransformer.js';

/* ============================================================================
   CONFIGURATION & CONSTANTS
   ============================================================================ */
const CONFIG = Object.freeze({
  PERFORMANCE: {
    DEBOUNCE_DELAY: 250,
    THROTTLE_DELAY: 100,
    RENDER_CHUNK_SIZE: 40,
    RENDER_IDLE_TIMEOUT: 160,
    SCROLL_THRESHOLD: 300
  },
  INTERSECTION: {
    THRESHOLD: 0.1,
    ROOT_MARGIN: '-40% 0px -50% 0px'
  },
  ANIMATION: {
    DURATION: 250,
    EASING: 'cubic-bezier(0.4, 0, 0.2, 1)'
  }
});

/* ============================================================================
   MEMOIZATION UTILITY
   ============================================================================ */
const memoize = (fn, options = {}) => {
  const cache = new Map();
  const maxSize = options.maxSize || 100;
  const keyGenerator = options.keyGenerator || JSON.stringify;

  const memoized = function (...args) {
    const key = keyGenerator(args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn.apply(this, args);

    // Manage cache size
    if (cache.size >= maxSize) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }

    cache.set(key, result);
    return result;
  };

  memoized.cache = cache;
  memoized.clear = () => cache.clear();

  return memoized;
};

/* ============================================================================
   UTILITIES MODULE
   ============================================================================ */
const Utils = (() => {
  // Performance-optimized debounce with WeakMap cache
  const debounceCache = new WeakMap();

  const debounce = (func, wait = CONFIG.PERFORMANCE.DEBOUNCE_DELAY) => {
    let timeoutId;
    const debounced = function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), wait);
    };
    debounced.cancel = () => clearTimeout(timeoutId);
    return debounced;
  };

  // RAF-based throttle for smooth animations
  const throttle = (func, limit = CONFIG.PERFORMANCE.THROTTLE_DELAY) => {
    let waiting = false;
    let lastArgs = null;

    return function executeThrottledFunction(...args) {
      if (!waiting) {
        func.apply(this, args);
        waiting = true;

        requestAnimationFrame(() => {
          setTimeout(() => {
            waiting = false;
            if (lastArgs) {
              func.apply(this, lastArgs);
              lastArgs = null;
            }
          }, limit);
        });
      } else {
        lastArgs = args;
      }
    };
  };

  // Efficient DOM element creation with attributes
  const createElement = (tag, attributes = {}, children = []) => {
    const element = document.createElement(tag);

    Object.entries(attributes).forEach(([key, value]) => {
      if (key === 'className') {
        element.className = value;
      } else if (key === 'dataset') {
        Object.assign(element.dataset, value);
      } else if (key.startsWith('on') && typeof value === 'function') {
        element.addEventListener(key.slice(2).toLowerCase(), value);
      } else {
        element.setAttribute(key, value);
      }
    });

    children.forEach(child => {
      if (typeof child === 'string') {
        element.appendChild(document.createTextNode(child));
      } else if (child instanceof Node) {
        element.appendChild(child);
      }
    });

    return element;
  };

  // Schedule work during idle time
  const scheduleIdleWork = (callback, options = {}) => {
    if ('requestIdleCallback' in window) {
      return requestIdleCallback(callback, {
        timeout: CONFIG.PERFORMANCE.RENDER_IDLE_TIMEOUT,
        ...options
      });
    }
    return requestAnimationFrame(callback);
  };

  // Cancel scheduled idle work
  const cancelIdleWork = (id) => {
    if ('cancelIdleCallback' in window) {
      cancelIdleCallback(id);
    } else {
      cancelAnimationFrame(id);
    }
  };

  /**
   * Extract hostname from URL or text input
   * Handles various URL patterns and returns normalized hostname
   * @param {string} input - URL or text that might contain a URL
   * @returns {string|null} - Extracted and normalized hostname or null
   */
  const extractHostnameFromURL = (input) => {
    if (!input || typeof input !== 'string') return null;

    let normalized = input.trim();

    // If it doesn't start with a protocol, try to detect if it's a URL
    if (!normalized.match(/^https?:\/\//i)) {
      // Check if it looks like a URL (contains dots and domain-like patterns)
      if (normalized.match(/[a-z0-9-]+\.[a-z]{2,}/i)) {
        // Try to extract domain-like pattern
        const domainMatch = normalized.match(/([a-z0-9-]+\.(?:[a-z]{2,}\.)?[a-z]{2,})/i);
        if (domainMatch) {
          normalized = 'https://' + domainMatch[0];
        }
      } else {
        // Not a URL, return the input as-is for regular search
        return null;
      }
    }

    try {
      // Replace common typos in protocol
      normalized = normalized.replace(/^https?[:;.]+\/*/i, 'https://');

      // Parse the URL
      const url = new URL(normalized);
      let hostname = url.hostname.toLowerCase();

      // Remove 'www.' prefix
      hostname = hostname.replace(/^www\d*\./i, '');

      // Handle subdomains - extract main domain
      const parts = hostname.split('.');

      // If it's a known multi-level TLD (co.uk, com.au, etc.)
      const multiLevelTLDs = ['co.uk', 'com.au', 'co.nz', 'co.za', 'com.br', 'co.jp'];
      const lastTwoParts = parts.slice(-2).join('.');

      if (multiLevelTLDs.includes(lastTwoParts)) {
        // Keep last 3 parts (domain + multi-level TLD)
        if (parts.length >= 3) {
          hostname = parts.slice(-3).join('.');
        }
      } else {
        // Keep last 2 parts (domain + TLD)
        if (parts.length >= 2) {
          hostname = parts.slice(-2).join('.');
        }
      }

      // Extract just the domain name without TLD for searching
      const domainName = hostname.split('.')[0];

      return domainName;

    } catch (error) {
      // If URL parsing fails, try to extract domain manually
      const manualMatch = normalized.match(/\/\/([^/:?#]+)/);
      if (manualMatch) {
        let hostname = manualMatch[1].toLowerCase();
        hostname = hostname.replace(/^www\d*\./i, '');
        const domainName = hostname.split('.')[0];
        return domainName;
      }

      return null;
    }
  };

  /**
   * Normalize hostname for fuzzy matching
   * Removes common variations and patterns
   */
  const normalizeHostname = (hostname) => {
    if (!hostname) return '';

    return hostname
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '') // Remove non-alphanumeric
      .replace(/^(www|ftp|cdn|dl|download|file|files|upload|uploads)\d*/g, '') // Remove common prefixes
      .replace(/\d+$/g, ''); // Remove trailing numbers
  };

  /**
   * Calculate similarity score between two strings - Memoized
   * Uses a combination of exact match, starts-with, and fuzzy matching
   */
  const calculateSimilarity = memoize((str1, str2) => {
    const s1 = normalizeHostname(str1);
    const s2 = normalizeHostname(str2);

    if (!s1 || !s2) return 0;

    // Exact match
    if (s1 === s2) return 100;

    // One contains the other
    if (s1.includes(s2) || s2.includes(s1)) {
      const longer = Math.max(s1.length, s2.length);
      const shorter = Math.min(s1.length, s2.length);
      return Math.round((shorter / longer) * 95);
    }

    // Check if they start similarly
    const minLength = Math.min(s1.length, s2.length);
    let matchingChars = 0;
    for (let i = 0; i < minLength; i++) {
      if (s1[i] === s2[i]) {
        matchingChars++;
      } else {
        break;
      }
    }

    if (matchingChars >= 3) {
      return Math.round((matchingChars / Math.max(s1.length, s2.length)) * 85);
    }

    // Levenshtein-like distance for fuzzy matching
    const maxLength = Math.max(s1.length, s2.length);
    if (maxLength === 0) return 100;

    let distance = levenshteinDistance(s1, s2);
    return Math.max(0, Math.round((1 - distance / maxLength) * 80));
  }, {
    maxSize: 500, // Cache up to 500 similarity calculations
    keyGenerator: (args) => `${args[0]}:${args[1]}`
  });

  /**
   * Levenshtein distance algorithm
   * Calculates the minimum number of edits needed to transform one string into another
   */
  const levenshteinDistance = (str1, str2) => {
    const matrix = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            matrix[i][j - 1] + 1,     // insertion
            matrix[i - 1][j] + 1      // deletion
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  };

  return Object.freeze({
    debounce,
    throttle,
    createElement,
    scheduleIdleWork,
    cancelIdleWork,
    extractHostnameFromURL,
    normalizeHostname,
    calculateSimilarity
  });
})();

/* ============================================================================
   ACCESSIBILITY UTILITIES
   ============================================================================ */
class A11yAnnouncer {
  static #announcer = null;

  /**
   * Initialize the announcer element
   */
  static #init() {
    if (this.#announcer) return;

    this.#announcer = document.createElement('div');
    this.#announcer.id = 'a11y-announcer';
    this.#announcer.setAttribute('role', 'status');
    this.#announcer.setAttribute('aria-live', 'polite');
    this.#announcer.setAttribute('aria-atomic', 'true');
    this.#announcer.className = 'visually-hidden';

    // Ensure element is accessible but hidden
    Object.assign(this.#announcer.style, {
      position: 'absolute',
      left: '-10000px',
      width: '1px',
      height: '1px',
      overflow: 'hidden'
    });

    document.body.appendChild(this.#announcer);
  }

  /**
   * Announce a message to screen readers
   * @param {string} message - Message to announce
   * @param {string} priority - 'polite' or 'assertive'
   */
  static announce(message, priority = 'polite') {
    this.#init();

    this.#announcer.setAttribute('aria-live', priority);

    // Clear and set message with a slight delay for screen readers
    this.#announcer.textContent = '';
    setTimeout(() => {
      this.#announcer.textContent = message;
    }, 100);
  }
}

class FocusManager {
  static #focusStack = [];

  /**
   * Trap focus within a container
   * @param {HTMLElement} container - Container element
   * @returns {Function} - Cleanup function
   */
  static trap(container) {
    const focusable = container.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])'
    );

    if (focusable.length === 0) return () => { };

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    const handleKeyDown = (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);

    // Store previous focus
    this.#focusStack.push(document.activeElement);

    // Focus first element
    first.focus();

    // Return cleanup function
    return () => {
      container.removeEventListener('keydown', handleKeyDown);
      this.release();
    };
  }

  /**
   * Release focus trap and restore previous focus
   */
  static release() {
    const previousFocus = this.#focusStack.pop();
    if (previousFocus && previousFocus.focus) {
      previousFocus.focus();
    }
  }

  /**
   * Save current focus
   */
  static save() {
    this.#focusStack.push(document.activeElement);
  }

  /**
   * Restore last saved focus
   */
  static restore() {
    this.release();
  }
}

class KeyboardNavigation {
  /**
   * Setup keyboard navigation for table
   * @param {HTMLElement} table - Table element
   * @returns {Function} - Cleanup function
   */
  static setupTableNavigation(table) {
    let currentRow = -1;
    const tbody = table.querySelector('tbody');
    if (!tbody) return () => { };

    const getRows = () => Array.from(tbody.querySelectorAll('tr:not(.empty-state-row)'));

    const handleKeyDown = (e) => {
      const rows = getRows();
      if (rows.length === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          currentRow = Math.min(currentRow + 1, rows.length - 1);
          rows[currentRow]?.focus();
          break;
        case 'ArrowUp':
          e.preventDefault();
          currentRow = Math.max(currentRow - 1, 0);
          rows[currentRow]?.focus();
          break;
        case 'Home':
          e.preventDefault();
          currentRow = 0;
          rows[0]?.focus();
          break;
        case 'End':
          e.preventDefault();
          currentRow = rows.length - 1;
          rows[currentRow]?.focus();
          break;
      }
    };

    // Make rows focusable
    const updateRowsFocusability = () => {
      getRows().forEach(row => {
        row.setAttribute('tabindex', '0');
      });
    };

    updateRowsFocusability();
    table.addEventListener('keydown', handleKeyDown);

    // Observer to update focusability when rows change
    const observer = new MutationObserver(updateRowsFocusability);
    observer.observe(tbody, { childList: true, subtree: true });

    // Return cleanup function
    return () => {
      table.removeEventListener('keydown', handleKeyDown);
      observer.disconnect();
    };
  }
}

class ResponsiveTable {
  /**
   * Convert table to responsive layout based on viewport
   * @param {HTMLElement} table - Table element
   * @returns {Function} - Cleanup function
   */
  static makeResponsive(table) {
    const wrapper = table.closest('.table-wrapper');
    if (!wrapper) return () => { };

    const checkResponsive = () => {
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        table.classList.add('table-responsive-mobile');
      } else {
        table.classList.remove('table-responsive-mobile');
      }
    };

    checkResponsive();

    const throttledCheck = Utils.throttle(checkResponsive, 150);
    window.addEventListener('resize', throttledCheck, { passive: true });

    // Return cleanup function
    return () => {
      window.removeEventListener('resize', throttledCheck);
    };
  }
}

/* ============================================================================
   STATE MANAGEMENT
   ============================================================================ */
class StateManager {
  #state = {};
  #listeners = new Map();
  #lifecycle = null;

  constructor(initialState = {}) {
    this.#state = { ...initialState };
    this.#lifecycle = new ComponentLifecycle();
  }

  get(key) {
    return key ? this.#state[key] : { ...this.#state };
  }

  set(key, value) {
    const oldValue = this.#state[key];
    this.#state[key] = value;

    if (this.#listeners.has(key)) {
      this.#listeners.get(key).forEach(callback => {
        callback(value, oldValue);
      });
    }

    return this;
  }

  update(updates) {
    Object.entries(updates).forEach(([key, value]) => {
      this.set(key, value);
    });
    return this;
  }

  subscribe(key, callback) {
    if (!this.#listeners.has(key)) {
      this.#listeners.set(key, new Set());
    }
    this.#listeners.get(key).add(callback);

    // Register cleanup
    const unsubscribe = () => this.#listeners.get(key)?.delete(callback);
    this.#lifecycle.onDestroy(unsubscribe);

    return unsubscribe;
  }

  reset() {
    this.#state = {};
    this.#listeners.clear();
  }

  destroy() {
    this.reset();
    this.#lifecycle.destroy();
  }
}

/* ============================================================================
   TABLE MANAGER
   ============================================================================ */
class TableManager {
  #elements = {};
  #state = null;
  #renderToken = null;
  #idleCallbackId = null;
  #lifecycle = null;
  #keyboardNavigationCleanup = null;
  #responsiveCleanup = null;

  constructor(containerId, searchInputId, clearIconId, options = {}) {
    this.#lifecycle = new ComponentLifecycle();

    this.#elements = {
      container: document.getElementById(containerId),
      searchInput: document.getElementById(searchInputId),
      clearIcon: document.getElementById(clearIconId),
      loadAllBtn: null
    };

    this.options = {
      sortable: true,
      chunkSize: CONFIG.PERFORMANCE.RENDER_CHUNK_SIZE,
      initialLimit: 30, // Show only first 30 entries initially
      enableLazyLoad: true, // Enable lazy loading feature
      ...options
    };

    this.#state = new StateManager({
      currentData: {},
      filteredData: {},
      sort: { column: null, direction: 'asc' },
      services: [],
      columns: [],
      isFullyLoaded: false,
      isSearchActive: false
    });

    this.#init();

    // Register cleanup
    this.#lifecycle.onDestroy(() => this.#cleanup());
  }

  #init() {
    if (!this.#elements.container) return;

    // Bind event handlers
    if (this.#elements.searchInput) {
      const debouncedSearch = Utils.debounce(() => this.#performSearch());
      this.#elements.searchInput.addEventListener('input', debouncedSearch);
      this.#lifecycle.onDestroy(() => {
        this.#elements.searchInput.removeEventListener('input', debouncedSearch);
      });

      const handleKeydown = (e) => {
        if (e.key === 'Escape') this.#clearSearch();
      };
      this.#elements.searchInput.addEventListener('keydown', handleKeydown);
      this.#lifecycle.onDestroy(() => {
        this.#elements.searchInput.removeEventListener('keydown', handleKeydown);
      });
    }

    if (this.#elements.clearIcon) {
      const handleClick = () => this.#clearSearch();
      this.#elements.clearIcon.addEventListener('click', handleClick);
      this.#lifecycle.onDestroy(() => {
        this.#elements.clearIcon.removeEventListener('click', handleClick);
      });
    }

  }

  #cleanup() {
    // Cancel any pending renders
    if (this.#idleCallbackId) {
      Utils.cancelIdleWork(this.#idleCallbackId);
    }

    // Cleanup keyboard navigation
    if (this.#keyboardNavigationCleanup) {
      this.#keyboardNavigationCleanup();
    }

    // Cleanup responsive handler
    if (this.#responsiveCleanup) {
      this.#responsiveCleanup();
    }

    // Destroy state
    this.#state?.destroy();
  }

  destroy() {
    this.#lifecycle.destroy();
  }

  generateTable(rawData) {
    if (!this.#elements.container || !rawData) {
      this.#showEmptyState('No data available');
      return;
    }

    // Transform data if needed
    const { data, services } = DataTransformer.transformIndexedData(rawData);

    if (!Object.keys(data).length) {
      this.#showEmptyState('No data available');
      return;
    }

    // Update state
    this.#state.update({
      currentData: data,
      filteredData: { ...data },
      services: services || DataTransformer.extractServices(data),
      columns: DataTransformer.extractServices(data),
      isFullyLoaded: false,
      isSearchActive: false
    });

    this.#renderTable();
  }

  #renderTable() {
    const { columns } = this.#state.get();
    const tableId = this.#elements.container.id.replace('-container', '');

    // Create table structure
    const table = Utils.createElement('table', {
      id: tableId,
      className: 'enhanced-table',
      role: 'table',
      'aria-label': 'Service Comparison Table'
    });

    // Create header

    const thead = Utils.createElement('thead');
    thead.appendChild(this.#generateHeaderRow(columns));
    table.appendChild(thead);

    // Create body
    const tbody = Utils.createElement('tbody');
    table.appendChild(tbody);

    // Create wrapper
    const wrapper = Utils.createElement('div', { className: 'table-wrapper' }, [table]);

    // Replace container content
    this.#elements.container.innerHTML = '';
    this.#elements.container.appendChild(wrapper);

    // Attach event handlers
    this.#attachTableEvents();

    // Setup accessibility features
    this.#keyboardNavigationCleanup = KeyboardNavigation.setupTableNavigation(table);
    this.#responsiveCleanup = ResponsiveTable.makeResponsive(table);

    // Render rows
    this.#renderTableBody();
  }

  #generateHeaderRow(columns) {
    const row = Utils.createElement('tr');

    const makeHeaderCell = (label, dataColumn) => {
      const th = Utils.createElement('th', {
        className: 'sortable',
        tabindex: '0',
        role: 'columnheader',
        'aria-sort': 'none',
        dataset: { column: dataColumn }
      });
      const span = Utils.createElement('span', {}, [label]); // text node - safe
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', '12'); svg.setAttribute('height', '12');
      svg.setAttribute('viewBox', '0 0 24 24'); svg.setAttribute('fill', 'none');
      svg.setAttribute('stroke', 'currentColor'); svg.setAttribute('stroke-width', '2');
      svg.setAttribute('aria-hidden', 'true');
      svg.classList.add('sort-icon');
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', 'M12 5v14M5 12l7-7 7 7');
      svg.appendChild(path);
      th.appendChild(span);
      th.appendChild(svg);
      return th;
    };

    row.appendChild(makeHeaderCell('Service Name', 'service'));
    columns.forEach(col => row.appendChild(makeHeaderCell(col, col)));
    return row;
  }

  #renderTableBody() {
    const table = this.#elements.container?.querySelector('table');
    const tbody = table?.querySelector('tbody');
    if (!tbody) return;

    const { filteredData, columns, isFullyLoaded, isSearchActive } = this.#state.get();
    let entries = Object.entries(filteredData);

    // Cancel any pending render
    if (this.#idleCallbackId) {
      Utils.cancelIdleWork(this.#idleCallbackId);
    }

    // Generate unique render token
    const token = Symbol('render');
    this.#renderToken = token;

    // Clear tbody
    tbody.textContent = '';

    if (!entries.length) {
      this.#renderEmptyRow(tbody, columns.length + 1);
      return;
    }

    // Limit entries if not fully loaded and not searching
    const shouldLimit = this.options.enableLazyLoad && !isFullyLoaded && !isSearchActive;
    const displayLimit = shouldLimit ? this.options.initialLimit : entries.length;

    // If limiting, only show first N entries
    if (shouldLimit && entries.length > displayLimit) {
      entries = entries.slice(0, displayLimit);
      // Render in chunks
      this.#renderChunked(tbody, entries, columns, token, true);
    } else {
      // Render in chunks
      this.#renderChunked(tbody, entries, columns, token, false);
    }
  }

  #renderChunked(tbody, entries, columns, token, showLoadMore) {
    let index = 0;
    const chunkSize = this.options.chunkSize;

    const renderNextChunk = () => {
      // Check if render was cancelled
      if (this.#renderToken !== token) return;

      const fragment = document.createDocumentFragment();
      const limit = Math.min(entries.length, index + chunkSize);

      for (; index < limit; index++) {
        const [host, hostData] = entries[index];
        const row = this.#createTableRow(host, hostData, columns);
        fragment.appendChild(row);
      }

      tbody.appendChild(fragment);

      // Continue rendering if more entries exist
      if (index < entries.length) {
        this.#idleCallbackId = Utils.scheduleIdleWork(renderNextChunk);
      } else if (showLoadMore) {
        // After rendering limited entries, show the "Load All" button
        this.#showLoadAllButton();
      }
    };

    this.#idleCallbackId = Utils.scheduleIdleWork(renderNextChunk);
  }

  #showLoadAllButton() {
    // Remove existing button if any
    this.#removeLoadAllButton();

    const { filteredData } = this.#state.get();
    const totalEntries = Object.keys(filteredData).length;
    const displayedEntries = this.options.initialLimit;
    const remainingEntries = totalEntries - displayedEntries;

    // Create button container
    const buttonContainer = Utils.createElement('div', {
      className: 'load-all-container',
      style: 'text-align: center; padding: var(--space-2xl) 0; margin-top: var(--space-xl);'
    });

    // Create button
    const loadAllBtn = Utils.createElement('button', {
      className: 'btn load-all-btn',
      type: 'button'
    });

    loadAllBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px;">
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
      Load All ${totalEntries} Hosts (${remainingEntries} more)
    `;

    loadAllBtn.addEventListener('click', () => this.#loadAllEntries(), { once: true });

    buttonContainer.appendChild(loadAllBtn);

    // Store reference
    this.#elements.loadAllBtn = buttonContainer;

    // Insert after table wrapper
    const wrapper = this.#elements.container.querySelector('.table-wrapper');
    if (wrapper && wrapper.nextSibling) {
      this.#elements.container.insertBefore(buttonContainer, wrapper.nextSibling);
    } else {
      this.#elements.container.appendChild(buttonContainer);
    }
  }

  #removeLoadAllButton() {
    if (this.#elements.loadAllBtn) {
      this.#elements.loadAllBtn.remove();
      this.#elements.loadAllBtn = null;
    }
  }

  #loadAllEntries() {
    this.#state.update({ isFullyLoaded: true });

    const btn = this.#elements.loadAllBtn?.querySelector('.load-all-btn');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = `<div class="loading-spinner" style="width:20px;height:20px;margin-right:8px;"></div>Loading...`;
    }

    setTimeout(() => {
      this.#removeLoadAllButton();
      this.#renderTableBody();
    }, 100);
  }

  #createTableRow(host, hostData, columns) {
    const row = Utils.createElement('tr', {
      role: 'row',
      dataset: { host: host.toLowerCase() }
    });

    // Service name cell
    const serviceCell = this.#createServiceCell(host);
    row.appendChild(serviceCell);

    // Status cells
    columns.forEach(column => {
      const statusCell = this.#createStatusCell(hostData[column]);
      row.appendChild(statusCell);
    });

    return row;
  }

  #createServiceCell(serviceName) {
    const cell = Utils.createElement('td', {
      className: 'service-cell',
      role: 'gridcell'
    });

    const serviceInfo = Utils.createElement('div', { className: 'service-info' });
    const nameSpan = Utils.createElement('span', { className: 'service-name' }, [serviceName]);

    serviceInfo.appendChild(nameSpan);
    cell.appendChild(serviceInfo);

    return cell;
  }

  #createStatusCell(status) {
    const isSupported = status === '✅';
    const cell = Utils.createElement('td', {
      className: 'status-cell',
      role: 'gridcell',
      dataset: {
        status: status || '',
        supported: isSupported ? 'true' : 'false'
      }
    });

    const indicator = Utils.createElement('span', {
      className: 'status-indicator',
      'aria-hidden': 'true',
      dataset: { supported: isSupported ? 'true' : 'false' }
    }, [isSupported ? '✅' : '❌']);

    const srText = Utils.createElement('span', {
      className: 'visually-hidden'
    }, [isSupported ? 'Supported' : 'Not supported']);

    cell.appendChild(indicator);
    cell.appendChild(srText);

    return cell;
  }

  #renderEmptyRow(tbody, colSpan) {
    const row = Utils.createElement('tr');
    const cell = Utils.createElement('td', {
      className: 'empty-state-row',
      colSpan
    }, ['No services match your current filters.']);

    row.appendChild(cell);
    tbody.appendChild(row);
  }

  #attachTableEvents() {
    if (!this.options.sortable) return;

    const thead = this.#elements.container.querySelector('thead');
    if (!thead) return;

    thead.addEventListener('click', (e) => this.#handleSort(e));
    thead.addEventListener('keydown', (e) => {
      const sortableHeader = e.target.closest('.sortable');
      if (sortableHeader && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        this.#handleSort({ target: sortableHeader });
      }
    });
  }

  #handleSort(event) {
    const header = event.target.closest('.sortable');
    if (!header) return;

    const column = header.dataset.column;
    const { sort, currentData } = this.#state.get();

    // Determine sort direction
    const direction = sort.column === column && sort.direction === 'asc'
      ? 'desc'
      : 'asc';

    // Update state
    this.#state.set('sort', { column, direction });

    // Update ARIA attributes
    const allHeaders = this.#elements.container.querySelectorAll('[role="columnheader"]');
    allHeaders.forEach(h => h.setAttribute('aria-sort', 'none'));
    header.setAttribute('aria-sort', direction === 'asc' ? 'ascending' : 'descending');

    // Sort data
    const sortedData = this.#sortData(currentData, column, direction);
    this.#state.set('filteredData', sortedData);

    // Re-render
    this.#renderTableBody();
  }

  #sortData(data, column, direction) {
    const entries = Object.entries(data);

    entries.sort(([hostA, dataA], [hostB, dataB]) => {
      let valueA, valueB;

      if (column === 'service') {
        valueA = hostA.toLowerCase();
        valueB = hostB.toLowerCase();
      } else {
        valueA = dataA[column] === '✅' ? 1 : 0;
        valueB = dataB[column] === '✅' ? 1 : 0;
      }

      if (valueA < valueB) return direction === 'asc' ? -1 : 1;
      if (valueA > valueB) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    return Object.fromEntries(entries);
  }

  #performSearch() {
    const rawSearchTerm = (this.#elements.searchInput?.value || '').trim();
    const { currentData } = this.#state.get();

    if (rawSearchTerm) {
      let searchTerm = rawSearchTerm.toLowerCase();
      let extractedHostname = null;
      let isURLSearch = false;

      // Try to extract hostname from URL
      extractedHostname = Utils.extractHostnameFromURL(rawSearchTerm);

      if (extractedHostname) {
        searchTerm = extractedHostname.toLowerCase();
        isURLSearch = true;
      }

      // Perform search with fuzzy matching
      let filtered;

      if (isURLSearch) {
        // Use fuzzy matching for URL-based searches
        const matches = [];

        Object.entries(currentData).forEach(([host, hostData]) => {
          const similarity = Utils.calculateSimilarity(host, searchTerm);

          // Include if similarity is above threshold (60%)
          if (similarity >= 60) {
            matches.push({
              host,
              hostData,
              similarity
            });
          }
        });

        // Sort by similarity score (highest first)
        matches.sort((a, b) => b.similarity - a.similarity);

        // Convert back to object
        filtered = Object.fromEntries(
          matches.map(({ host, hostData }) => [host, hostData])
        );
      } else {
        // Regular text search (exact substring matching)
        filtered = Object.fromEntries(
          Object.entries(currentData).filter(([host]) =>
            host.toLowerCase().includes(searchTerm)
          )
        );
      }

      // When searching, mark as search active and load all
      this.#state.update({
        filteredData: filtered,
        isSearchActive: true,
        isFullyLoaded: true // Auto-load all when searching
      });

      // Remove load all button if present
      this.#removeLoadAllButton();

      if (this.#elements.clearIcon) {
        this.#elements.clearIcon.style.display = 'block';
      }

      // Update search results message
      const resultMessage = isURLSearch
        ? `Found ${Object.keys(filtered).length} host(s) matching "${extractedHostname}"`
        : `Showing ${Object.keys(filtered).length} of ${Object.keys(currentData).length} services`;

      this.#updateSearchResults(resultMessage, Object.keys(filtered).length, Object.keys(currentData).length, isURLSearch);
    } else {
      this.#clearSearch();
    }

    this.#renderTableBody();
  }

  #clearSearch() {
    if (this.#elements.searchInput) {
      this.#elements.searchInput.value = '';
    }

    const { currentData } = this.#state.get();

    // When clearing search, reset to limited view if was initially limited
    const shouldResetToLimited = this.options.enableLazyLoad;

    this.#state.update({
      filteredData: { ...currentData },
      isSearchActive: false,
      isFullyLoaded: shouldResetToLimited ? false : true
    });

    if (this.#elements.clearIcon) {
      this.#elements.clearIcon.style.display = 'none';
    }

    this.#updateSearchResults('', 0, 0);
    this.#renderTableBody();
  }

  #updateSearchResults(message, filteredCount, totalCount, isURLSearch = false) {
    if (!this.#elements.container) return;

    let resultsElement = this.#elements.container.querySelector('.search-results');

    if (message) {
      if (!resultsElement) {
        resultsElement = Utils.createElement('div', {
          className: 'search-results',
          role: 'status',
          'aria-live': 'polite'
        });
        this.#elements.container.insertBefore(resultsElement, this.#elements.container.firstChild);
      }

      // Add URL indicator if it's a URL search
      if (isURLSearch) {
        resultsElement.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-right: 6px;">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
          </svg>
          <span>${message}</span>
        `;
      } else {
        resultsElement.textContent = message;
      }

      resultsElement.style.display = 'block';

      // Announce to screen readers
      A11yAnnouncer.announce(message);
    } else if (resultsElement) {
      resultsElement.style.display = 'none';
    }
  }

  #showEmptyState(message) {
    if (!this.#elements.container) return;

    const emptyState = Utils.createElement('div', {
      className: 'empty-state'
    });

    const emptyMessage = Utils.createElement('p', {}, [message]);
    emptyState.appendChild(emptyMessage);

    this.#elements.container.innerHTML = '';
    this.#elements.container.appendChild(emptyState);
  }
}

/* ============================================================================
   UI FEATURES
   ============================================================================ */
const UIFeatures = (() => {
  // Intersection Observer for scroll animations
  const setupScrollAnimations = () => {
    if (!('IntersectionObserver' in window)) return;

    const elements = document.querySelectorAll('.section, .status-card, .referral-card');
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: CONFIG.INTERSECTION.THRESHOLD,
      rootMargin: '0px 0px -50px 0px'
    });

    elements.forEach(el => observer.observe(el));
  };

  // Header elevation on scroll
  const setupHeaderElevation = () => {
    const header = document.querySelector('.site-header');
    if (!header) return;

    const updateHeader = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    };

    updateHeader();

    const throttledUpdate = Utils.throttle(updateHeader);
    window.addEventListener('scroll', throttledUpdate, { passive: true });
  };

  // Back-to-top button behavior
  const setupBackToTop = () => {
    const backToTop = document.getElementById('backToTop');
    if (!backToTop) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const updateVisibility = () => {
      backToTop.classList.toggle('visible', window.pageYOffset > 300);
    };

    updateVisibility();
    window.addEventListener('scroll', Utils.throttle(updateVisibility), { passive: true });

    backToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: prefersReduced ? 'auto' : 'smooth'
      });
    });
  };

  // Navigation highlight
  const setupNavHighlight = () => {
    if (!('IntersectionObserver' in window)) return;

    const links = Array.from(document.querySelectorAll('.header-nav .nav-link[href^="#"]'));
    if (!links.length) return;

    const sections = links
      .map(link => document.querySelector(link.getAttribute('href')))
      .filter(Boolean);

    const linkMap = new Map(
      links.map(link => [link.getAttribute('href'), link])
    );

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const id = `#${entry.target.id}`;
        const link = linkMap.get(id);

        if (link && entry.isIntersecting) {
          links.forEach(l => l.removeAttribute('aria-current'));
          link.setAttribute('aria-current', 'page');
        }
      });
    }, {
      threshold: CONFIG.INTERSECTION.THRESHOLD,
      rootMargin: CONFIG.INTERSECTION.ROOT_MARGIN
    });

    sections.forEach(section => observer.observe(section));
  };

  // URL-based comparison
  const setupURLComparison = () => {
    const params = new URLSearchParams(window.location.search);
    const provider1 = params.get('compare');
    const provider2 = params.get('with');

    if (provider1 && provider2) {
      requestAnimationFrame(() => {
        const select1 = document.getElementById('provider1');
        const select2 = document.getElementById('provider2');

        if (select1 && select2) {
          select1.value = provider1;
          select2.value = provider2;
          select1.dispatchEvent(new Event('change'));
        }
      });
    }
  };

  // Online/offline detection
  const setupOfflineDetection = () => {
    const showStatus = (isOnline) => {
      console.log(isOnline ? '✅ Connection restored' : '⚠️ You are offline');
    };

    window.addEventListener('online', () => showStatus(true));
    window.addEventListener('offline', () => showStatus(false));
  };

  return Object.freeze({
    setupScrollAnimations,
    setupHeaderElevation,
    setupBackToTop,
    setupNavHighlight,
    setupURLComparison,
    setupOfflineDetection
  });
})();

/* ============================================================================
   PERFORMANCE MONITOR
   ============================================================================ */
class PerformanceMonitor {
  #marks = new Map();

  constructor() {
    this.mark('start');
  }

  mark(name) {
    this.#marks.set(name, performance.now());
  }

  measure(name, startMark = 'start') {
    const start = this.#marks.get(startMark) || 0;
    const end = performance.now();
    return end - start;
  }

  log(name, startMark = 'start') {
    const duration = this.measure(name, startMark);
    console.log(`⏱️ ${name}: ${duration.toFixed(2)}ms`);
  }
}

/* ============================================================================
   APPLICATION BOOTSTRAP
   ============================================================================ */
class App {
  #performanceMonitor = null;
  #lifecycle = null;
  #tableManagers = [];

  constructor() {
    this.#performanceMonitor = new PerformanceMonitor();
    this.#lifecycle = new ComponentLifecycle();
  }

  async init() {
    try {
      this.#performanceMonitor.mark('dom-ready');

      // Initialize tables with directly imported data
      const fileHostsTable = new TableManager(
        'file-hosts-table-container',
        'host-search-input',
        'clear-host-search'
      );
      this.#tableManagers.push(fileHostsTable);

      const adultHostsTable = new TableManager(
        'adult-hosts-table-container',
        'adult-host-search-input',
        'clear-adult-host-search'
      );
      this.#tableManagers.push(adultHostsTable);

      // Data is imported directly at module scope — no fetch needed
      fileHostsTable.generateTable(fileHostsData);
      adultHostsTable.generateTable(adultHostsData);

      // Lazy-load ComparisonManager on first user interaction
      this.#setupComparisonLazyLoad(fileHostsData);

      // Setup UI features
      UIFeatures.setupScrollAnimations();
      UIFeatures.setupHeaderElevation();
      UIFeatures.setupBackToTop();
      UIFeatures.setupNavHighlight();
      UIFeatures.setupURLComparison();
      UIFeatures.setupOfflineDetection();

      this.#performanceMonitor.mark('fully-loaded');
      this.#performanceMonitor.log('Application initialized', 'dom-ready');

    } catch (error) {
      console.error('❌ Critical application error:', error);
    }
  }

  /**
   * Lazily initializes the ComparisonManager via dynamic import
   * Only loads the module when the user interacts with the comparison section
   */
  #setupComparisonLazyLoad(hostsData) {
    let comparisonManager = null;

    const initComparison = async () => {
      if (comparisonManager) return;
      try {
        const { ComparisonManager } = await import('./components/ComparisonManager.js');
        comparisonManager = new ComparisonManager(
          'compare-table-container',
          'provider1',
          'provider2',
          hostsData
        );
      } catch (error) {
        console.error('Failed to load ComparisonManager:', error);
      }
    };

    // Init on first focus/click on either select
    const select1 = document.getElementById('provider1');
    const select2 = document.getElementById('provider2');

    if (select1) {
      select1.addEventListener('focus', initComparison, { once: true });
      select1.addEventListener('click', initComparison, { once: true });
    }
    if (select2) {
      select2.addEventListener('focus', initComparison, { once: true });
      select2.addEventListener('click', initComparison, { once: true });
    }

    // Also eager-load if URL has comparison params
    if (window.location.search.includes('compare=')) {
      initComparison();
    }
  }

  destroy() {
    this.#tableManagers.forEach(manager => manager.destroy());
    this.#lifecycle.destroy();
  }
}

/* ============================================================================
   GLOBAL ERROR HANDLING
   ============================================================================ */
window.addEventListener('error', (event) => {
  console.error('❌ Global error:', event.error || event.message);
}, { passive: true });

window.addEventListener('unhandledrejection', (event) => {
  console.error('❌ Unhandled promise rejection:', event.reason);
});

/* ============================================================================
   SERVICE WORKER REGISTRATION
   ============================================================================ */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then(() => console.log('✅ Service worker registered'))
      .catch((error) => console.warn('⚠️ Service worker registration failed:', error));
  });
}

/* ============================================================================
   INITIALIZE APPLICATION
   ============================================================================ */
document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});