/**
 * Debrid Services Comparison - Improved App JS
 * - Data loading (file hosts, adult hosts, pricing)
 * - Tables, comparison, pricing interactions
 * - Age verification overlay (focus trap + inert)
 * - Back-to-top, nav highlight, animations, offline detection
 * - Performance-minded DOM updates and event delegation
 */

/* ==============================
   Utils
   ============================== */
const Utils = (() => {
  const debounceCache = new WeakMap();

  return {
    debounce(func, delay = 300, immediate = false) {
      if (debounceCache.has(func)) return debounceCache.get(func);

      let timeoutId;
      const debounced = function(...args) {
        const callNow = immediate && !timeoutId;
        clearTimeout(timeoutId);

        if (callNow) func.apply(this, args);

        timeoutId = setTimeout(() => {
          timeoutId = null;
          if (!immediate) func.apply(this, args);
        }, delay);
      };

      debounceCache.set(func, debounced);
      return debounced;
    },

    throttle(func, limit = 100) {
      let ticking = false;
      return function(...args) {
        if (!ticking) {
          func.apply(this, args);
          ticking = true;
          requestAnimationFrame(() => {
            setTimeout(() => { ticking = false; }, limit);
          });
        }
      };
    },

    animateOnScroll: (() => {
      let observer;
      return (elements, options = {}) => {
        if (!('IntersectionObserver' in window)) return;
        if (!observer) {
          observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
              }
            });
          }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px',
            ...options
          });
        }
        elements.forEach(el => observer.observe(el));
      };
    })()
  };
})();

/* ==============================
   Loading Manager
   ============================== */
class LoadingManager {
  constructor() {
    this.activeLoaders = new Map();
    this.template = this.createTemplate();
  }

  createTemplate() {
    const template = document.createElement('template');
    template.innerHTML = `
      <div class="loading-overlay">
        <div class="loading-content">
          <div class="loading-spinner">
            <div class="spinner-ring"></div>
            <div class="spinner-ring"></div>
            <div class="spinner-ring"></div>
          </div>
          <p class="loading-text"></p>
        </div>
      </div>
    `;
    return template;
  }

  show(target, text = 'Loading...') {
    const targetEl = typeof target === 'string' ? document.querySelector(target) : target;
    if (!targetEl) return null;

    const loaderId = `loader-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const loader = this.template.content.cloneNode(true).firstElementChild;

    loader.dataset.loaderId = loaderId;
    loader.querySelector('.loading-text').textContent = text;

    const prevPos = getComputedStyle(targetEl).position;
    if (prevPos === 'static' || !prevPos) targetEl.style.position = 'relative';

    targetEl.appendChild(loader);
    this.activeLoaders.set(loaderId, loader);

    requestAnimationFrame(() => loader.classList.add('loading-overlay--visible'));
    return loaderId;
  }

  hide(target, loaderId) {
    const loader = this.activeLoaders.get(loaderId);
    if (!loader) return;
    loader.classList.add('loading-overlay--hiding');
    this.activeLoaders.delete(loaderId);
    setTimeout(() => loader.remove(), 250);
  }

  hideAll() {
    this.activeLoaders.forEach((_, id) => this.hide(null, id));
  }
}

/* ==============================
   Table Manager (file/adult hosts)
   ============================== */
class TableManager {
  constructor(containerId, searchInputId, clearIconId, options = {}) {
    this.elements = {
      container: document.getElementById(containerId),
      searchInput: document.getElementById(searchInputId),
      clearIcon: document.getElementById(clearIconId)
    };

    this.options = { sortable: true, filterable: true, pagination: false, itemsPerPage: 50, ...options };
    this.state = {
      currentData: {},
      filteredData: {},
      currentSort: { column: null, direction: 'asc' },
      currentPage: 1
    };

    this.handleSearch = Utils.debounce(this._performSearch.bind(this), 250);
    this.handleSort = this._performSort.bind(this);

    this._init();
  }

  _init() {
    if (this.elements.searchInput) {
      this.elements.searchInput.addEventListener('input', this.handleSearch);
      this.elements.searchInput.addEventListener('keydown', e => {
        if (e.key === 'Escape') this._clearSearch();
      });
    }

    if (this.elements.clearIcon) {
      this.elements.clearIcon.addEventListener('click', () => this._clearSearch());
    }
  }

  generateTable(data = {}) {
    if (!this.elements.container) return;
    if (!Object.keys(data).length) {
      this.elements.container.innerHTML = '<div class="empty-state"><p>No data available.</p></div>';
      return;
    }

    this.state.currentData = data;
    this.state.filteredData = { ...data };

    const firstKey = Object.keys(data)[0];
    const providers = firstKey ? Object.keys(data[firstKey]) : [];
    const tableId = this.elements.container.id.replace('-container', '');

    const fragment = document.createDocumentFragment();
    const wrapper = document.createElement('div');
    wrapper.className = 'table-wrapper';

    const table = document.createElement('table');
    table.id = tableId;
    table.className = 'enhanced-table';
    table.setAttribute('aria-label', 'Service Comparison Table');

    const thead = document.createElement('thead');
    thead.innerHTML = this._generateTableHeader(providers);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    tbody.innerHTML = this._generateTableRows(this.state.filteredData, providers);
    table.appendChild(tbody);

    wrapper.appendChild(table);
    fragment.appendChild(wrapper);

    this.elements.container.innerHTML = '';
    this.elements.container.appendChild(fragment);

    this._attachTableEvents();
  }

  _generateTableHeader(providers) {
    return `
      <tr>
        <th class="sortable" data-column="service" tabindex="0" role="columnheader" aria-sort="none">
          <span>Service Name</span>
          <svg class="sort-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M12 5v14M5 12l7-7 7 7"/>
          </svg>
        </th>
        ${providers.map(provider => `
          <th class="sortable" data-column="${provider}" tabindex="0" role="columnheader" aria-sort="none">
            <span>${provider}</span>
            <svg class="sort-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M12 5v14M5 12l7-7 7 7"/>
            </svg>
          </th>
        `).join('')}
      </tr>
    `;
  }

  _generateTableRows(data, providers) {
    const rows = [];
    for (const [host, providerData] of Object.entries(data)) {
      rows.push(`
        <tr data-host="${host.toLowerCase()}" role="row">
          <td class="service-cell" role="gridcell">
            <div class="service-info">
              <span class="service-name">${host}</span>
            </div>
          </td>
          ${providers.map(provider => {
            const isSupported = providerData[provider] === 'yes';
            return `
              <td class="status-cell" role="gridcell" data-status="${providerData[provider]}">
                <span class="status-indicator ${isSupported ? 'supported' : 'not-supported'}" aria-label="${isSupported ? 'Supported' : 'Not supported'}">
                  ${isSupported
                    ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22,4 12,14.01 9,11.01"></polyline></svg>'
                    : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>'
                  }
                </span>
              </td>
            `;
          }).join('')}
        </tr>
      `);
    }
    return rows.join('');
  }

  _attachTableEvents() {
    if (!this.options.sortable) return;
    const thead = this.elements.container.querySelector('thead');
    if (thead) {
      thead.addEventListener('click', this.handleSort);
      thead.addEventListener('keydown', e => {
        const target = e.target.closest('.sortable');
        if (!target) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.handleSort({ target });
        }
      });
    }
  }

  _performSearch() {
    const term = (this.elements.searchInput?.value || '').toLowerCase().trim();

    if (!term) {
      this.state.filteredData = { ...this.state.currentData };
      if (this.elements.clearIcon) this.elements.clearIcon.style.display = 'none';
    } else {
      this.state.filteredData = Object.fromEntries(
        Object.entries(this.state.currentData).filter(([host]) => host.toLowerCase().includes(term))
      );
      if (this.elements.clearIcon) this.elements.clearIcon.style.display = 'block';
    }

    this._updateTableContent();
    this._updateSearchResults(term);
  }

  _clearSearch() {
    if (this.elements.searchInput) this.elements.searchInput.value = '';
    this.state.filteredData = { ...this.state.currentData };
    if (this.elements.clearIcon) this.elements.clearIcon.style.display = 'none';
    this._updateTableContent();
    this._updateSearchResults('');
  }

  _updateSearchResults(searchTerm) {
    if (!this.elements.container) return;
    let indicator = this.elements.container.querySelector('.search-results');

    if (searchTerm) {
      const resultCount = Object.keys(this.state.filteredData).length;
      const totalCount = Object.keys(this.state.currentData).length;

      if (!indicator) {
        indicator = document.createElement('div');
        indicator.className = 'search-results';
        this.elements.container.insertBefore(indicator, this.elements.container.firstChild);
      }
      indicator.textContent = `Showing ${resultCount} of ${totalCount} services`;
  indicator.style.display = 'block';
  indicator.style.textAlign = 'center';
  indicator.style.padding = '0.5em 0';
    } else if (indicator) {
      indicator.style.display = 'none';
    }
  }

  _performSort(event) {
    const header = event.target.closest('.sortable');
    if (!header) return;

    const column = header.dataset.column;
    const { currentSort } = this.state;
    const newDirection = currentSort.column === column && currentSort.direction === 'asc' ? 'desc' : 'asc';

    this.state.currentSort = { column, direction: newDirection };

    this.elements.container.querySelectorAll('th.sortable').forEach(th => {
      th.setAttribute('aria-sort', 'none');
      th.classList.remove('sorted-asc', 'sorted-desc');
    });

    header.setAttribute('aria-sort', newDirection === 'asc' ? 'ascending' : 'descending');
    header.classList.add(`sorted-${newDirection}`);

    this._sortData();
    this._updateTableContent();
  }

  _sortData() {
    const { column, direction } = this.state.currentSort;
    const entries = Object.entries(this.state.filteredData);

    entries.sort(([hostA, dataA], [hostB, dataB]) => {
      const valueA = column === 'service' ? hostA.toLowerCase() : (dataA[column] === 'yes' ? 1 : 0);
      const valueB = column === 'service' ? hostB.toLowerCase() : (dataB[column] === 'yes' ? 1 : 0);

      const comparison = valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
      return direction === 'asc' ? comparison : -comparison;
    });

    this.state.filteredData = Object.fromEntries(entries);
  }

  _updateTableContent() {
    const tbody = this.elements.container.querySelector('tbody');
    if (!tbody) return;
    const firstKey = Object.keys(this.state.currentData)[0];
    const providers = firstKey ? Object.keys(this.state.currentData[firstKey]) : [];
    requestAnimationFrame(() => {
      tbody.innerHTML = this._generateTableRows(this.state.filteredData, providers);
    });
  }
}

/* ==============================
   Comparison Manager
   ============================== */
class ComparisonManager {
  constructor(containerId, select1Id, select2Id, data) {
    this.elements = {
      container: document.getElementById(containerId),
      select1: document.getElementById(select1Id),
      select2: document.getElementById(select2Id)
    };
    this.data = data;
    this.isComparing = false;

    this.handleCompare = this._generateCompareTable.bind(this);
    this._init();
  }

  _init() {
    this._populateDropdowns();

    this.elements.select1?.addEventListener('change', this.handleCompare);
    this.elements.select2?.addEventListener('change', this.handleCompare);

    document.addEventListener('keydown', e => {
      if (this.isComparing && e.key === 'Escape') this._closeComparison();
    });
  }

  _populateDropdowns() {
    const firstKey = Object.keys(this.data)[0];
    const providers = firstKey ? Object.keys(this.data[firstKey]) : [];
    const optionsHTML = '<option value="">Choose a service...</option>' +
      providers.map(p => `<option value="${p}">${p}</option>`).join('');

    [this.elements.select1, this.elements.select2].forEach(select => {
      if (select) select.innerHTML = optionsHTML;
    });
  }

  _generateCompareTable() {
    const provider1 = this.elements.select1?.value;
    const provider2 = this.elements.select2?.value;

    if (!provider1 || !provider2) {
      this._showEmptyState();
      return;
    }
    if (provider1 === provider2) {
      this._showSameProviderWarning();
      return;
    }

    this.isComparing = true;
    const loaderId = loadingManager.show(this.elements.container, 'Generating comparison...');

    requestAnimationFrame(() => {
      this._renderComparisonTable(provider1, provider2);
      loadingManager.hide(this.elements.container, loaderId);
    });
  }

  _renderComparisonTable(provider1, provider2) {
    const stats = this._calculateComparisonStats(provider1, provider2);
    const fragment = document.createDocumentFragment();
    const wrapper = document.createElement('div');

    wrapper.innerHTML = `
      <div class="comparison-header">
        <h3>Comparing ${provider1} vs ${provider2}</h3>
        <div class="comparison-stats">
          <div class="stat"><span class="stat-label">Shared Support</span><span class="stat-value">${stats.shared}</span></div>
          <div class="stat"><span class="stat-label">${provider1} Only</span><span class="stat-value">${stats.provider1Only}</span></div>
          <div class="stat"><span class="stat-label">${provider2} Only</span><span class="stat-value">${stats.provider2Only}</span></div>
        </div>
        <div class="comparison-actions">
          <button id="close-compare" class="btn btn-secondary">
            <span>Close</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>

      <div class="comparison-filters">
        <label class="filter-option">
          <input type="radio" name="comparison-filter" value="all" checked>
          <span>All Services</span>
        </label>
        <label class="filter-option">
          <input type="radio" name="comparison-filter" value="both">
          <span>Supported by Both</span>
        </label>
        <label class="filter-option">
          <input type="radio" name="comparison-filter" value="different">
          <span>Different Support</span>
        </label>
      </div>

      <div class="table-wrapper">
        <table id="compare-table" class="comparison-table" aria-label="Provider Comparison Table">
          <thead>
            <tr>
              <th>Service Name</th>
              <th class="provider-header ${provider1.toLowerCase()}">${provider1}</th>
              <th class="provider-header ${provider2.toLowerCase()}">${provider2}</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${this._generateComparisonRows(provider1, provider2)}
          </tbody>
        </table>
      </div>
    `;

    fragment.appendChild(wrapper);
    this.elements.container.innerHTML = '';
    this.elements.container.appendChild(fragment);
    this.elements.container.style.display = 'block';
    this._attachComparisonEvents();

    requestAnimationFrame(() => {
      this.elements.container.classList.add('comparison-visible');
    });
  }

  _generateComparisonRows(provider1, provider2) {
    const rows = [];
    const checkSvg = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22,4 12,14.01 9,11.01"></polyline></svg>';
    const crossSvg = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';

    for (const [host, providerData] of Object.entries(this.data)) {
      const support1 = providerData[provider1] === 'yes';
      const support2 = providerData[provider2] === 'yes';

      let statusClass = 'neither-supported';
      let statusText = 'Neither';
      if (support1 && support2) { statusClass = 'both-supported'; statusText = 'Both'; }
      else if (support1) { statusClass = 'provider1-only'; statusText = `${provider1} only`; }
      else if (support2) { statusClass = 'provider2-only'; statusText = `${provider2} only`; }

      rows.push(`
        <tr class="comparison-row ${statusClass}" data-status="${statusClass}">
          <td class="service-name">${host}</td>
          <td class="support-status ${support1 ? 'supported' : 'not-supported'}">
            <span class="status-indicator" aria-label="${support1 ? 'Supported' : 'Not supported'}">${support1 ? checkSvg : crossSvg}</span>
          </td>
          <td class="support-status ${support2 ? 'supported' : 'not-supported'}">
            <span class="status-indicator" aria-label="${support2 ? 'Supported' : 'Not supported'}">${support2 ? checkSvg : crossSvg}</span>
          </td>
          <td class="status-text"><span class="status-badge ${statusClass}">${statusText}</span></td>
        </tr>
      `);
    }
    return rows.join('');
  }

  _calculateComparisonStats(provider1, provider2) {
    let shared = 0, provider1Only = 0, provider2Only = 0;
    for (const providerData of Object.values(this.data)) {
      const s1 = providerData[provider1] === 'yes';
      const s2 = providerData[provider2] === 'yes';
      if (s1 && s2) shared++;
      else if (s1) provider1Only++;
      else if (s2) provider2Only++;
    }
    return { shared, provider1Only, provider2Only };
  }

  _attachComparisonEvents() {
    const closeBtn = this.elements.container.querySelector('#close-compare');
    closeBtn?.addEventListener('click', () => this._closeComparison());

    this.elements.container.addEventListener('change', e => {
      if (e.target.name === 'comparison-filter') {
        this._filterComparison(e.target.value);
      }
    });
  }

  _filterComparison(filter) {
    const rows = this.elements.container.querySelectorAll('.comparison-row');
    let visibleCount = 0;

    rows.forEach(row => {
      const status = row.dataset.status;
      const show = filter === 'all' ||
                   (filter === 'both' && status === 'both-supported') ||
                   (filter === 'different' && (status === 'provider1-only' || status === 'provider2-only'));
      row.style.display = show ? '' : 'none';
      if (show) visibleCount++;
    });

    let indicator = this.elements.container.querySelector('.filter-results');
    if (!indicator) {
      indicator = document.createElement('div');
      indicator.className = 'filter-results';
      const tableWrapper = this.elements.container.querySelector('.table-wrapper');
      tableWrapper.parentNode.insertBefore(indicator, tableWrapper);
    }
    indicator.textContent = `Showing ${visibleCount} services`;
  }

  _closeComparison() {
    this.elements.container.classList.add('comparison-hiding');
    setTimeout(() => {
      this.elements.container.style.display = 'none';
      this.elements.container.classList.remove('comparison-visible', 'comparison-hiding');
      this.isComparing = false;
      this._showEmptyState();
    }, 250);
  }

  _showEmptyState() {
    this.elements.container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon" aria-hidden="true">⚖️</div>
        <h3>Ready to Compare</h3>
        <p>Select two services above to see a detailed comparison</p>
      </div>
    `;
    this.elements.container.style.display = 'block';
  }

  _showSameProviderWarning() {
    this.elements.container.innerHTML = `
      <div class="warning-state">
        <div class="warning-icon">⚠️</div>
        <h3>Same Service Selected</h3>
        <p>Please select two different services to compare</p>
      </div>
    `;
    this.elements.container.style.display = 'block';
  }
}

/* ==============================
   Pricing Manager
   ============================== */
class PricingManager {
  constructor(containerId) {
    this.container = document.getElementById(`${containerId}-table-container`);
    this.currentData = null;
    this._onMouseOver = this._onMouseOver.bind(this);
    this._onMouseOut = this._onMouseOut.bind(this);
    this._onMouseLeaveContainer = this._onMouseLeaveContainer.bind(this);
  }

  generatePricingTable(data = {}) {
    if (!this.container) return;
    if (!data.plans?.length) {
      this.container.innerHTML = '<div class="error-state"><p>Error: Invalid pricing data structure.</p></div>';
      return;
    }

    this.currentData = data;
    const services = Object.keys(data.plans[0]).filter(key => key !== 'name');

    const fragment = document.createDocumentFragment();
    const wrapper = document.createElement('div');
    wrapper.className = 'table-wrapper';

    const table = document.createElement('table');
    table.id = 'pricing-table';
    table.className = 'pricing-table';
    table.setAttribute('aria-label', 'Service Pricing Table');

    const thead = document.createElement('thead');
    thead.innerHTML = `
      <tr>
        <th>Plans</th>
        ${services.map(service => `
          <th class="service-column">
            <div class="service-header">
              <span class="service-name">${service}</span>
            </div>
          </th>
        `).join('')}
      </tr>
    `;

    const tbody = document.createElement('tbody');
    tbody.innerHTML = data.plans.map((plan, index) => `
      <tr class="pricing-row ${index % 2 === 0 ? 'even' : 'odd'}">
        <td class="plan-name"><strong>${plan.name}</strong></td>
        ${services.map(service => {
          const price = plan[service];
          const isNumeric = !isNaN(parseFloat(price));
          return `
            <td class="price-cell ${isNumeric ? 'numeric-price' : 'text-price'}">
              <div class="price-content">
                <span class="price-value">${price}</span>
                ${isNumeric ? '<span class="price-period">/month</span>' : ''}
              </div>
            </td>
          `;
        }).join('')}
      </tr>
    `).join('');

    table.appendChild(thead);
    table.appendChild(tbody);
    wrapper.appendChild(table);
    fragment.appendChild(wrapper);

    this.container.innerHTML = '';
    this.container.appendChild(fragment);

    this._setupPricingFeatures();
  }

  _setupPricingFeatures() {
    // Use mouseover/mouseout for delegation; mouseenter doesn't bubble
    this.container.addEventListener('mouseover', this._onMouseOver);
    this.container.addEventListener('mouseout', this._onMouseOut);
    this.container.addEventListener('mouseleave', this._onMouseLeaveContainer);
  }

  _onMouseOver(e) {
    const cell = e.target.closest('.price-cell');
    if (!cell || !this.container.contains(cell)) return;
    const index = Array.from(cell.parentNode.children).indexOf(cell);
    if (index >= 0) this._highlightColumn(index + 1); // nth-child is 1-based
  }

  _onMouseOut(e) {
    const toElement = e.relatedTarget;
    if (!toElement || !this.container.contains(toElement)) {
      this._removeColumnHighlight();
    }
  }

  _onMouseLeaveContainer() {
    this._removeColumnHighlight();
  }

  _highlightColumn(columnIndex) {
    const table = this.container.querySelector('table');
    if (!table) return;
    // Plans column is 1; services start at 2; columnIndex is the index within row (including plan col)
    const cells = table.querySelectorAll(`tbody td:nth-child(${columnIndex + 1}), thead th:nth-child(${columnIndex + 1})`);
    this._removeColumnHighlight();
    cells.forEach(cell => cell.classList.add('highlighted'));
  }

  _removeColumnHighlight() {
    this.container.querySelectorAll('.highlighted').forEach(cell => cell.classList.remove('highlighted'));
  }
}

/* ==============================
   Performance Monitor (light)
   ============================== */
class PerformanceMonitor {
  constructor() { this.marks = new Map(); this.mark('start'); }
  mark(name) { this.marks.set(name, performance.now()); }
  measure(name, startMark = 'start') {
    const start = this.marks.get(startMark) || performance.now();
    const end = performance.now();
    return end - start;
  }
  log(name, startMark = 'start') { console.log(`${name}: ${this.measure(name, startMark).toFixed(2)}ms`); }
}

/* ==============================
   Feature setup
   ============================== */
function setupURLComparison() {
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
}

function setupScrollAnimations() {
  const animatedElements = document.querySelectorAll('.section, .status-card, .referral-card');
  if (animatedElements.length) Utils.animateOnScroll(animatedElements);
}

function setupOfflineDetection() {
  const updateOnlineStatus = () => {
    console.log(navigator.onLine ? 'Connection restored' : 'You are offline. Some features may not work.');
  };
  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
}

function setupBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  const onScroll = Utils.throttle(() => {
    if (window.pageYOffset > 300) btn.classList.add('visible');
    else btn.classList.remove('visible');
  }, 150);

  window.addEventListener('scroll', onScroll, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

function setupNavHighlight() {
  const links = Array.from(document.querySelectorAll('.header-nav .nav-link[href^="#"]'));
  if (!('IntersectionObserver' in window) || !links.length) return;

  const sections = links
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  const map = new Map();
  links.forEach(a => map.set(a.getAttribute('href'), a));

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = `#${entry.target.id}`;
      const link = map.get(id);
      if (!link) return;
      if (entry.isIntersecting) {
        links.forEach(l => l.removeAttribute('aria-current'));
        link.setAttribute('aria-current', 'page');
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px', threshold: 0.1 });

  sections.forEach(sec => io.observe(sec));
}

/* Age verification overlay with focus trap + inert */
function setupAgeVerification() {
  const overlay = document.getElementById('age-verification-overlay');
  const adultContent = document.getElementById('adult-content');
  const confirmBtn = document.getElementById('confirm-age');
  const denyBtn = document.getElementById('deny-age');
  const pageWrapper = document.querySelector('.page-wrapper');
  const adultSection = document.getElementById('adult-hosts');

  if (!overlay || !adultSection) return;

  // Enhance semantics if not present
  const modal = overlay.querySelector('.age-verification-modal');
  const titleEl = overlay.querySelector('.age-verification-content h3');

  if (modal) {
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    if (titleEl) {
      const titleId = 'age-title';
      titleEl.id = titleId;
      modal.setAttribute('aria-labelledby', titleId);
    }
  }

  const setInert = (isInert) => {
    if (!pageWrapper) return;
    if ('inert' in pageWrapper) {
      pageWrapper.inert = isInert;
    } else {
      pageWrapper.setAttribute('aria-hidden', String(isInert));
    }
  };

  const FOCUSABLE = 'a[href], area[href], button, input, select, textarea, details, summary, [tabindex]:not([tabindex="-1"])';
  let removeTrap = null;
  const trapFocus = (container) => {
    const nodes = Array.from(container.querySelectorAll(FOCUSABLE))
      .filter(el => !el.hasAttribute('disabled') && el.getAttribute('aria-hidden') !== 'true');
    const first = nodes[0];
    const last = nodes[nodes.length - 1];

    const onKeydown = (e) => {
      if (e.key === 'Escape') {
        // Allow closing via deny to maintain your original flow
        denyBtn?.click();
      } else if (e.key === 'Tab') {
        if (nodes.length === 0) { e.preventDefault(); return; }
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault(); last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault(); first.focus();
        }
      }
    };
    container.addEventListener('keydown', onKeydown);
    first?.focus();
    return () => container.removeEventListener('keydown', onKeydown);
  };

  const openOverlay = () => {
    overlay.style.display = 'flex';
    overlay.setAttribute('aria-hidden', 'false');
    setInert(true);
    removeTrap = trapFocus(modal || overlay);
  };

  const closeOverlay = () => {
    overlay.style.display = 'none';
    overlay.setAttribute('aria-hidden', 'true');
    setInert(false);
    if (typeof removeTrap === 'function') removeTrap();
  };

  // State
  const ageConfirmed = localStorage.getItem('age-confirmed') === 'true';
  if (ageConfirmed) {
    overlay.style.display = 'none';
    if (adultContent) adultContent.style.display = 'block';
  }

  confirmBtn?.addEventListener('click', () => {
    localStorage.setItem('age-confirmed', 'true');
    if (adultContent) adultContent.style.display = 'block';
    closeOverlay();
  });

  denyBtn?.addEventListener('click', () => {
    document.getElementById('what-are-debrid')?.scrollIntoView({ behavior: 'smooth' });
    closeOverlay();
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && localStorage.getItem('age-confirmed') !== 'true') {
          openOverlay();
        }
      });
    }, { threshold: 0.1 });
    observer.observe(adultSection);
  }
}

/* ==============================
   Global singletons
   ============================== */
const loadingManager = new LoadingManager();
const performanceMonitor = new PerformanceMonitor();

/* ==============================
   App bootstrap
   ============================== */
document.addEventListener('DOMContentLoaded', async () => {
  performanceMonitor.mark('dom-ready');
  performanceMonitor.log('DOM Ready');

  try {
    const fileHostsTable = new TableManager('file-hosts-table-container', 'host-search-input', 'clear-host-search');
    const adultHostsTable = new TableManager('adult-hosts-table-container', 'adult-host-search-input', 'clear-adult-host-search');
    const pricingManager = new PricingManager('pricing');

    const loaders = [
      loadingManager.show('#file-hosts-table-container', 'Loading file hosts...'),
      loadingManager.show('#adult-hosts-table-container', 'Loading adult hosts...'),
      loadingManager.show('#pricing-table-container', 'Loading pricing data...')
    ];

    const dataUrls = ['./json/file-hosts.json', './json/adult-hosts.json', './json/pricing.json'];
    const fetchPromises = dataUrls.map(url =>
      fetch(url).then(r => r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status} for ${url}`)))
    );

    const results = await Promise.allSettled(fetchPromises);

    results.forEach((result, index) => {
      const containers = ['#file-hosts-table-container', '#adult-hosts-table-container', '#pricing-table-container'];
      loadingManager.hide(containers[index], loaders[index]);

      if (result.status === 'fulfilled') {
        switch (index) {
          case 0: {
            fileHostsTable.generateTable(result.value);
            new ComparisonManager('compare-table-container', 'provider1', 'provider2', result.value);
            break;
          }
          case 1: {
            adultHostsTable.generateTable(result.value);
            break;
          }
          case 2: {
            pricingManager.generatePricingTable(result.value);
            break;
          }
        }
      } else {
        console.error(`Error loading data (${dataUrls[index]}):`, result.reason);
        const el = document.querySelector(containers[index]);
        if (el) el.innerHTML = `<div class="error-state"><p>Failed to load data: ${dataUrls[index]}</p></div>`;
      }
    });

    // UI features
    setupURLComparison();
    setupScrollAnimations();
    setupOfflineDetection();
    setupBackToTop();
    setupNavHighlight();
    setupAgeVerification();

    performanceMonitor.mark('fully-loaded');
    performanceMonitor.log('Fully Loaded');

  } catch (error) {
    console.error('Critical error:', error);
    loadingManager.hideAll();
  }
});

/* ==============================
   Global error handling & SW
   ============================== */
window.addEventListener('error', e => {
  console.error('Global error:', e.error || e.message || e);
}, { passive: true });

window.addEventListener('unhandledrejection', e => {
  console.error('Unhandled promise rejection:', e.reason);
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(err => {
      console.warn('Service worker registration failed:', err);
    });
  });
}