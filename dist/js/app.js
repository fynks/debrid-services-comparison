/**
 * @fileoverview Optimized Debrid Services Comparison Application
 * Performance-focused implementation with modern ES6+ features
 */

// Optimized utility module using singleton pattern
const Utils = (() => {
  // WeakMap for caching debounced functions
  const debounceCache = new WeakMap();
  
  return {
    debounce(func, delay = 300, immediate = false) {
      if (debounceCache.has(func)) return debounceCache.get(func);
      
      let timeoutId;
      const debounced = function(...args) {
        const callNow = immediate && !timeoutId;
        clearTimeout(timeoutId);
        
        if (callNow) {
          func.apply(this, args);
        }
        
        timeoutId = setTimeout(() => {
          timeoutId = null;
          if (!immediate) func.apply(this, args);
        }, delay);
      };
      
      debounceCache.set(func, debounced);
      return debounced;
    },

    throttle(func, limit) {
      let inThrottle;
      return function(...args) {
        if (!inThrottle) {
          func.apply(this, args);
          inThrottle = true;
          requestAnimationFrame(() => {
            setTimeout(() => inThrottle = false, limit);
          });
        }
      };
    },

    // Optimized Intersection Observer with single instance
    animateOnScroll: (() => {
      let observer;
      return (elements, options = {}) => {
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

// Optimized LoadingManager with DOM fragment usage
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

    const loaderId = `loader-${Date.now()}`;
    const loader = this.template.content.cloneNode(true).firstElementChild;
    
    loader.dataset.loaderId = loaderId;
    loader.querySelector('.loading-text').textContent = text;
    
    targetEl.style.position = 'relative';
    targetEl.appendChild(loader);
    this.activeLoaders.set(loaderId, loader);
    
    // Use RAF for smoother animation
    requestAnimationFrame(() => loader.classList.add('loading-overlay--visible'));
    
    return loaderId;
  }

  hide(target, loaderId) {
    const loader = this.activeLoaders.get(loaderId);
    if (!loader) return;
    
    loader.classList.add('loading-overlay--hiding');
    this.activeLoaders.delete(loaderId);
    
    setTimeout(() => loader.remove(), 300);
  }

  hideAll() {
    this.activeLoaders.forEach((loader, id) => {
      this.hide(null, id);
    });
  }
}

// Optimized TableManager with virtual scrolling support
class TableManager {
  constructor(containerId, searchInputId, clearIconId, options = {}) {
    // Cache DOM elements
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
    
    // Pre-bind event handlers for better performance
    this.handleSearch = Utils.debounce(this._performSearch.bind(this), 300);
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
    if (!Object.keys(data).length) {
      this.elements.container.innerHTML = '<div class="empty-state"><p>No data available.</p></div>';
      return;
    }

    this.state.currentData = data;
    this.state.filteredData = { ...data };
    
    const providers = Object.keys(data[Object.keys(data)[0]]);
    const tableId = this.elements.container.id.replace('-container', '');
    
    // Use DocumentFragment for better performance
    const fragment = document.createDocumentFragment();
    const wrapper = document.createElement('div');
    wrapper.className = 'table-wrapper';
    
    const table = document.createElement('table');
    table.id = tableId;
    table.className = 'enhanced-table';
    table.setAttribute('aria-label', 'Service Comparison Table');
    
    // Create table header
    const thead = document.createElement('thead');
    thead.innerHTML = this._generateTableHeader(providers);
    table.appendChild(thead);
    
    // Create table body
    const tbody = document.createElement('tbody');
    tbody.innerHTML = this._generateTableRows(this.state.filteredData, providers);
    table.appendChild(tbody);
    
    wrapper.appendChild(table);
    fragment.appendChild(wrapper);
    
    // Clear and append in one operation
    this.elements.container.innerHTML = '';
    this.elements.container.appendChild(fragment);
    
    this._attachTableEvents();
  }

  _generateTableHeader(providers) {
    return `
      <tr>
        <th class="sortable" data-column="service" tabindex="0" role="columnheader" aria-sort="none">
          <span>Service Name</span>
          <svg class="sort-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 5v14M5 12l7-7 7 7"/>
          </svg>
        </th>
        ${providers.map(provider => `
          <th class="sortable" data-column="${provider}" tabindex="0" role="columnheader" aria-sort="none">
            <span>${provider}</span>
            <svg class="sort-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 5v14M5 12l7-7 7 7"/>
            </svg>
          </th>
        `).join('')}
      </tr>
    `;
  }

  _generateTableRows(data, providers) {
    // Use array methods for better performance
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
                <span class="status-indicator ${isSupported ? 'supported' : 'not-supported'}" 
                      aria-label="${isSupported ? 'Supported' : 'Not supported'}">
                  ${isSupported ? 
                    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22,4 12,14.01 9,11.01"></polyline></svg>' : 
                    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>'
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
    
    // Use event delegation for better performance
    const thead = this.elements.container.querySelector('thead');
    if (thead) {
      thead.addEventListener('click', this.handleSort);
      thead.addEventListener('keydown', e => {
        if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('sortable')) {
          e.preventDefault();
          this.handleSort(e);
        }
      });
    }
  }

  _performSearch() {
    const searchTerm = this.elements.searchInput.value.toLowerCase().trim();
    
    if (!searchTerm) {
      this.state.filteredData = { ...this.state.currentData };
      this.elements.clearIcon.style.display = 'none';
    } else {
      // Optimized filtering
      this.state.filteredData = Object.fromEntries(
        Object.entries(this.state.currentData).filter(([host]) => 
          host.toLowerCase().includes(searchTerm)
        )
      );
      this.elements.clearIcon.style.display = 'block';
    }
    
    this._updateTableContent();
    this._updateSearchResults(searchTerm);
  }

  _clearSearch() {
    this.elements.searchInput.value = '';
    this.state.filteredData = { ...this.state.currentData };
    this.elements.clearIcon.style.display = 'none';
    this._updateTableContent();
    this._updateSearchResults('');
  }

  _updateSearchResults(searchTerm) {
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
    
    // Update header states efficiently
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
    
    const providers = Object.keys(this.state.currentData[Object.keys(this.state.currentData)[0]] || {});
    
    // Use requestAnimationFrame for smoother updates
    requestAnimationFrame(() => {
      tbody.innerHTML = this._generateTableRows(this.state.filteredData, providers);
    });
  }
}

// Optimized ComparisonManager
class ComparisonManager {
  constructor(containerId, select1Id, select2Id, data) {
    this.elements = {
      container: document.getElementById(containerId),
      select1: document.getElementById(select1Id),
      select2: document.getElementById(select2Id)
    };
    
    this.data = data;
    this.isComparing = false;
    
    // Pre-bind event handlers
    this.handleCompare = this._generateCompareTable.bind(this);
    
    this._init();
  }

  _init() {
    this._populateDropdowns();
    
    if (this.elements.select1) {
      this.elements.select1.addEventListener('change', this.handleCompare);
    }
    
    if (this.elements.select2) {
      this.elements.select2.addEventListener('change', this.handleCompare);
    }
    
    document.addEventListener('keydown', e => {
      if (this.isComparing && e.key === 'Escape') {
        this._closeComparison();
      }
    });
  }

  _populateDropdowns() {
    const providers = Object.keys(this.data[Object.keys(this.data)[0]]);
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

    // Use RAF for smoother rendering
    requestAnimationFrame(() => {
      this._renderComparisonTable(provider1, provider2);
      loadingManager.hide(this.elements.container, loaderId);
    });
  }

  _renderComparisonTable(provider1, provider2) {
    const stats = this._calculateComparisonStats(provider1, provider2);
    
    // Build DOM efficiently
    const fragment = document.createDocumentFragment();
    const wrapper = document.createElement('div');
    
    wrapper.innerHTML = `
      <div class="comparison-header">
        <h3>Comparing ${provider1} vs ${provider2}</h3>
        <div class="comparison-stats">
          <div class="stat">
            <span class="stat-label">Shared Support</span>
            <span class="stat-value">${stats.shared}</span>
          </div>
          <div class="stat">
            <span class="stat-label">${provider1} Only</span>
            <span class="stat-value">${stats.provider1Only}</span>
          </div>
          <div class="stat">
            <span class="stat-label">${provider2} Only</span>
            <span class="stat-value">${stats.provider2Only}</span>
          </div>
        </div>
        <div class="comparison-actions">
          <button id="close-compare" class="btn btn-secondary">
            <span>Close</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
    
    for (const [host, providerData] of Object.entries(this.data)) {
      const support1 = providerData[provider1] === 'yes';
      const support2 = providerData[provider2] === 'yes';
      
      let statusClass, statusText;
      
      if (support1 && support2) {
        statusClass = 'both-supported';
        statusText = 'Both';
      } else if (support1) {
        statusClass = 'provider1-only';
        statusText = `${provider1} only`;
      } else if (support2) {
        statusClass = 'provider2-only';
        statusText = `${provider2} only`;
      } else {
        statusClass = 'neither-supported';
        statusText = 'Neither';
      }

      const checkSvg = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22,4 12,14.01 9,11.01"></polyline></svg>';
      const crossSvg = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';

      rows.push(`
        <tr class="comparison-row ${statusClass}" data-status="${statusClass}">
          <td class="service-name">${host}</td>
          <td class="support-status ${support1 ? 'supported' : 'not-supported'}">
            <span class="status-indicator" aria-label="${support1 ? 'Supported' : 'Not supported'}">
              ${support1 ? checkSvg : crossSvg}
            </span>
          </td>
          <td class="support-status ${support2 ? 'supported' : 'not-supported'}">
            <span class="status-indicator" aria-label="${support2 ? 'Supported' : 'Not supported'}">
              ${support2 ? checkSvg : crossSvg}
            </span>
          </td>
          <td class="status-text">
            <span class="status-badge ${statusClass}">${statusText}</span>
          </td>
        </tr>
      `);
    }
    
    return rows.join('');
  }

  _calculateComparisonStats(provider1, provider2) {
    let shared = 0, provider1Only = 0, provider2Only = 0;

    for (const providerData of Object.values(this.data)) {
      const support1 = providerData[provider1] === 'yes';
      const support2 = providerData[provider2] === 'yes';

      if (support1 && support2) shared++;
      else if (support1) provider1Only++;
      else if (support2) provider2Only++;
    }

    return { shared, provider1Only, provider2Only };
  }

  _attachComparisonEvents() {
    // Close button
    const closeBtn = this.elements.container.querySelector('#close-compare');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this._closeComparison());
    }

    // Filter functionality with event delegation
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
      let show = filter === 'all' || 
                 (filter === 'both' && status === 'both-supported') ||
                 (filter === 'different' && (status === 'provider1-only' || status === 'provider2-only'));
      
      row.style.display = show ? '' : 'none';
      if (show) visibleCount++;
    });
    
    // Update visible count
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
    }, 300);
  }

  _showEmptyState() {
    this.elements.container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">⚖️</div>
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

// Optimized PricingManager
class PricingManager {
  constructor(containerId) {
    this.container = document.getElementById(`${containerId}-table-container`);
    this.currentData = null;
  }

  generatePricingTable(data = {}) {
    if (!data.plans?.length) {
      this.container.innerHTML = '<div class="error-state"><p>Error: Invalid pricing data structure.</p></div>';
      return;
    }

    this.currentData = data;
    const services = Object.keys(data.plans[0]).filter(key => key !== 'name');
    
    // Build table efficiently
    const fragment = document.createDocumentFragment();
    const wrapper = document.createElement('div');
    wrapper.className = 'table-wrapper';
    
    const table = document.createElement('table');
    table.id = 'pricing-table';
    table.className = 'pricing-table';
    table.setAttribute('aria-label', 'Service Pricing Table');
    
    // Create header
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
    
    // Create body
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
    // Use event delegation for hover effects
    this.container.addEventListener('mouseenter', e => {
      if (e.target.classList.contains('price-cell')) {
        const column = Array.from(e.target.parentNode.children).indexOf(e.target);
        this._highlightColumn(column);
      }
    }, true);
    
    this.container.addEventListener('mouseleave', e => {
      if (e.target.classList.contains('price-cell')) {
        this._removeColumnHighlight();
      }
    }, true);
  }

  _highlightColumn(columnIndex) {
    const cells = this.container.querySelectorAll(`td:nth-child(${columnIndex + 1}), th:nth-child(${columnIndex + 1})`);
    cells.forEach(cell => cell.classList.add('highlighted'));
  }

  _removeColumnHighlight() {
    const highlightedCells = this.container.querySelectorAll('.highlighted');
    highlightedCells.forEach(cell => cell.classList.remove('highlighted'));
  }
}

// Simplified PerformanceMonitor
class PerformanceMonitor {
  constructor() {
    this.marks = new Map();
    this.mark('start');
  }

  mark(name) {
    this.marks.set(name, performance.now());
  }

  measure(name, startMark = 'start') {
    const start = this.marks.get(startMark);
    const end = performance.now();
    return end - start;
  }

  log(name, startMark = 'start') {
    console.log(`${name}: ${this.measure(name, startMark).toFixed(2)}ms`);
  }
}

// Global instances
const loadingManager = new LoadingManager();
const performanceMonitor = new PerformanceMonitor();

// Optimized initialization
document.addEventListener('DOMContentLoaded', async () => {
  performanceMonitor.mark('dom-ready');
  performanceMonitor.log('DOM Ready');

  try {
    // Parallel initialization
    const [fileHostsTable, adultHostsTable, pricingManager] = [
      new TableManager('file-hosts-table-container', 'host-search-input', 'clear-host-search'),
      new TableManager('adult-hosts-table-container', 'adult-host-search-input', 'clear-adult-host-search'),
      new PricingManager('pricing')
    ];

    // Show loading states
    const loaders = [
      loadingManager.show('#file-hosts-table-container', 'Loading file hosts...'),
      loadingManager.show('#adult-hosts-table-container', 'Loading adult hosts...'),
      loadingManager.show('#pricing-table-container', 'Loading pricing data...')
    ];

    // Optimized data loading with Promise.allSettled
    const dataUrls = ['./json/file-hosts.json', './json/adult-hosts.json', './json/pricing.json'];
    const fetchPromises = dataUrls.map(url => 
      fetch(url).then(r => r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`)))
    );
    
    const results = await Promise.allSettled(fetchPromises);

    // Process results
    results.forEach((result, index) => {
      loadingManager.hide(['#file-hosts-table-container', '#adult-hosts-table-container', '#pricing-table-container'][index], loaders[index]);
      
      if (result.status === 'fulfilled') {
        switch(index) {
          case 0:
            fileHostsTable.generateTable(result.value);
            new ComparisonManager('compare-table-container', 'provider1', 'provider2', result.value);
            break;
          case 1:
            adultHostsTable.generateTable(result.value);
            break;
          case 2:
            pricingManager.generatePricingTable(result.value);
            break;
        }
      } else {
        console.error(`Error loading data ${index}:`, result.reason);
      }
    });

    // Setup additional features
    setupURLComparison();
    setupScrollAnimations();
    setupOfflineDetection();
    
    performanceMonitor.mark('fully-loaded');
    performanceMonitor.log('Fully Loaded');

  } catch (error) {
    console.error('Critical error:', error);
    loadingManager.hideAll();
  }
});

// Optimized helper functions
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
  const animatedElements = document.querySelectorAll('.section, .card, .quick-nav-card');
  if (animatedElements.length) {
    Utils.animateOnScroll(animatedElements);
  }
}

function setupOfflineDetection() {
  const updateOnlineStatus = () => {
    console.log(navigator.onLine ? 'Connection restored' : 'You are offline. Some features may not work.');
  };
  
  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
}

// Optimized error handling
window.addEventListener('error', e => console.error('Global error:', e.error), { passive: true });
window.addEventListener('unhandledrejection', e => {
  console.error('Unhandled promise rejection:', e.reason);
  e.preventDefault();
}, { passive: false });