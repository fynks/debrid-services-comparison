/**
 * @fileoverview Enhanced Debrid Services Comparison Application
 * Modern, feature-rich JavaScript with performance optimizations and professional UX
 */

// Modern utility functions
const Utils = {
  // Enhanced debounce with immediate option
  debounce: (func, delay = 300, immediate = false) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        timeout = null;
        if (!immediate) func.apply(this, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, delay);
      if (callNow) func.apply(this, args);
    };
  },

  // Throttle function for scroll events
  throttle: (func, limit) => {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  // Animate elements with Intersection Observer
  animateOnScroll: (elements, options = {}) => {
    const defaultOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    }, { ...defaultOptions, ...options });

    elements.forEach(el => observer.observe(el));
  }
};

// Enhanced notification system
class NotificationManager {
  constructor() {
    this.container = this.createContainer();
    this.notifications = new Set();
  }

  createContainer() {
    const container = document.createElement('div');
    container.className = 'notification-container';
    container.setAttribute('aria-live', 'polite');
    document.body.appendChild(container);
    return container;
  }

  show(message, type = 'info', duration = 4000) {
    const notification = document.createElement('div');
    const id = Date.now().toString();
    
    notification.className = `notification notification--${type}`;
    notification.setAttribute('role', 'alert');
    notification.innerHTML = `
      <div class="notification__content">
        <svg class="notification__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          ${this.getIcon(type)}
        </svg>
        <span class="notification__message">${message}</span>
        <button class="notification__close" aria-label="Close notification">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    `;

    this.container.appendChild(notification);
    this.notifications.add(id);

    // Auto dismiss
    setTimeout(() => this.dismiss(notification, id), duration);

    // Manual dismiss
    notification.querySelector('.notification__close').addEventListener('click', () => {
      this.dismiss(notification, id);
    });

    // Animate in
    requestAnimationFrame(() => {
      notification.classList.add('notification--visible');
    });

    return id;
  }

  getIcon(type) {
    const icons = {
      success: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22,4 12,14.01 9,11.01"></polyline>',
      error: '<circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>',
      warning: '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>',
      info: '<circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path>'
    };
    return icons[type] || icons.info;
  }

  dismiss(notification, id) {
    notification.classList.add('notification--dismissing');
    this.notifications.delete(id);
    
    setTimeout(() => {
      if (notification.parentNode) {
        this.container.removeChild(notification);
      }
    }, 300);
  }
}

// Enhanced loading manager
class LoadingManager {
  constructor() {
    this.activeLoaders = new Set();
  }

  show(target, text = 'Loading...') {
    const loaderId = Date.now().toString();
    const loader = document.createElement('div');
    loader.className = 'loading-overlay';
    loader.setAttribute('data-loader-id', loaderId);
    loader.innerHTML = `
      <div class="loading-content">
        <div class="loading-spinner">
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
        </div>
        <p class="loading-text">${text}</p>
      </div>
    `;

    if (typeof target === 'string') {
      target = document.querySelector(target);
    }

    target.style.position = 'relative';
    target.appendChild(loader);
    this.activeLoaders.add(loaderId);

    requestAnimationFrame(() => {
      loader.classList.add('loading-overlay--visible');
    });

    return loaderId;
  }

  hide(target, loaderId) {
    if (typeof target === 'string') {
      target = document.querySelector(target);
    }

    const loader = target.querySelector(`[data-loader-id="${loaderId}"]`);
    if (loader) {
      loader.classList.add('loading-overlay--hiding');
      this.activeLoaders.delete(loaderId);
      
      setTimeout(() => {
        if (loader.parentNode) {
          target.removeChild(loader);
        }
      }, 300);
    }
  }

  hideAll() {
    this.activeLoaders.forEach(id => {
      const loader = document.querySelector(`[data-loader-id="${id}"]`);
      if (loader) {
        this.hide(loader.parentNode, id);
      }
    });
  }
}

// Enhanced table manager with advanced features
class TableManager {
  constructor(containerId, searchInputId, clearIconId, options = {}) {
    this.container = document.querySelector(`#${containerId}`);
    this.searchInput = document.querySelector(`#${searchInputId}`);
    this.clearIcon = document.querySelector(`#${clearIconId}`);
    this.options = {
      sortable: true,
      filterable: true,
      pagination: false,
      itemsPerPage: 50,
      ...options
    };
    
    this.currentData = {};
    this.filteredData = {};
    this.currentSort = { column: null, direction: 'asc' };
    this.currentPage = 1;
    
    this._setupSearchFunctionality();
    this._setupKeyboardNavigation();
  }

  generateTable(data = {}) {
    if (!Object.keys(data).length) {
      this.container.innerHTML = '<div class="empty-state"><p>No data available.</p></div>';
      return;
    }

    this.currentData = data;
    this.filteredData = { ...data };
    
    const providers = Object.keys(data[Object.keys(data)[0]]);
    const tableId = this.container.id.replace('-container', '');
    
    // Create table with enhanced features
    this.container.innerHTML = `
      <div class="table-wrapper">
        <table id="${tableId}" class="enhanced-table" aria-label="Service Comparison Table">
          <thead>
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
          </thead>
          <tbody>
            ${this._generateTableRows(this.filteredData, providers)}
          </tbody>
        </table>
      </div>
      ${this.options.pagination ? this._createPagination() : ''}
    `;

    this._setupTableFeatures();
    this._setupAccessibility();
  }

  _generateTableRows(data, providers) {
    return Object.entries(data).map(([host, providerData]) => `
      <tr data-host="${host.toLowerCase()}" role="row">
        <td class="service-cell" role="gridcell">
          <div class="service-info">
            <span class="service-name">${host}</span>
          </div>
        </td>
        ${providers.map(provider => `
          <td class="status-cell" role="gridcell" data-status="${providerData[provider]}">
            <span class="status-indicator ${providerData[provider] === 'yes' ? 'supported' : 'not-supported'}" 
                  aria-label="${providerData[provider] === 'yes' ? 'Supported' : 'Not supported'}">
              ${providerData[provider] === 'yes' ? 
                '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22,4 12,14.01 9,11.01"></polyline></svg>' : 
                '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>'
              }
            </span>
          </td>
        `).join('')}
      </tr>
    `).join('');
  }

  _setupSearchFunctionality() {
    const handleSearch = Utils.debounce(() => {
      const searchTerm = this.searchInput.value.toLowerCase().trim();
      
      if (!searchTerm) {
        this.filteredData = { ...this.currentData };
        this.clearIcon.style.display = 'none';
      } else {
        this.filteredData = {};
        Object.entries(this.currentData).forEach(([host, data]) => {
          if (host.toLowerCase().includes(searchTerm)) {
            this.filteredData[host] = data;
          }
        });
        this.clearIcon.style.display = 'block';
      }
      
      this._updateTableContent();
      this._updateSearchResults(searchTerm);
    }, 300);

    this.searchInput?.addEventListener('input', handleSearch);
    this.searchInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this._clearSearch();
      }
    });

    this.clearIcon?.addEventListener('click', () => {
      this._clearSearch();
    });
  }

  _clearSearch() {
    this.searchInput.value = '';
    this.filteredData = { ...this.currentData };
    this.clearIcon.style.display = 'none';
    this._updateTableContent();
    this._updateSearchResults('');
  }

  _updateSearchResults(searchTerm) {
    const resultCount = Object.keys(this.filteredData).length;
    const totalCount = Object.keys(this.currentData).length;
    
    // Update or create search results indicator
    let indicator = this.container.querySelector('.search-results');
    if (!indicator) {
      indicator = document.createElement('div');
      indicator.className = 'search-results';
      this.container.insertBefore(indicator, this.container.querySelector('.table-wrapper'));
    }
    
    if (searchTerm) {
      indicator.textContent = `Showing ${resultCount} of ${totalCount} services`;
      indicator.style.display = 'block';
    } else {
      indicator.style.display = 'none';
    }
  }

  _setupTableFeatures() {
    // Setup sorting
    if (this.options.sortable) {
      this.container.querySelectorAll('th.sortable').forEach(header => {
        header.addEventListener('click', () => this._handleSort(header));
        header.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this._handleSort(header);
          }
        });
      });
    }
  }

  _handleSort(header) {
    const column = header.getAttribute('data-column');
    const currentDirection = this.currentSort.column === column ? this.currentSort.direction : 'asc';
    const newDirection = currentDirection === 'asc' ? 'desc' : 'asc';
    
    this.currentSort = { column, direction: newDirection };
    
    // Update header states
    this.container.querySelectorAll('th.sortable').forEach(th => {
      th.setAttribute('aria-sort', 'none');
      th.classList.remove('sorted-asc', 'sorted-desc');
    });
    
    header.setAttribute('aria-sort', newDirection === 'asc' ? 'ascending' : 'descending');
    header.classList.add(`sorted-${newDirection}`);
    
    this._sortData();
    this._updateTableContent();
  }

  _sortData() {
    const { column, direction } = this.currentSort;
    const entries = Object.entries(this.filteredData);
    
    entries.sort(([hostA, dataA], [hostB, dataB]) => {
      let valueA, valueB;
      
      if (column === 'service') {
        valueA = hostA.toLowerCase();
        valueB = hostB.toLowerCase();
      } else {
        // Sort by provider support (yes > no)
        valueA = dataA[column] === 'yes' ? 1 : 0;
        valueB = dataB[column] === 'yes' ? 1 : 0;
      }
      
      if (direction === 'asc') {
        return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
      } else {
        return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
      }
    });
    
    this.filteredData = Object.fromEntries(entries);
  }

  _updateTableContent() {
    const tbody = this.container.querySelector('tbody');
    const providers = Object.keys(this.currentData[Object.keys(this.currentData)[0]]);
    
    if (tbody) {
      tbody.innerHTML = this._generateTableRows(this.filteredData, providers);
      this._setupTableFeatures();
    }
  }

  _setupKeyboardNavigation() {
    this.container.addEventListener('keydown', (e) => {
      if (e.target.matches('th.sortable') && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        this._handleSort(e.target);
      }
    });
  }

  _setupAccessibility() {
    // Add ARIA labels and descriptions
    const table = this.container.querySelector('table');
    if (table) {
      table.setAttribute('role', 'grid');
      table.setAttribute('aria-label', 'Debrid services comparison table');
    }
  }

  _createPagination() {
    // Pagination implementation for large datasets
    return `
      <div class="pagination">
        <button class="pagination-btn" data-action="prev" aria-label="Previous page">Previous</button>
        <span class="pagination-info">Page ${this.currentPage}</span>
        <button class="pagination-btn" data-action="next" aria-label="Next page">Next</button>
      </div>
    `;
  }
}

// Enhanced comparison manager
class ComparisonManager {
  constructor(containerId, select1Id, select2Id, data) {
    this.container = document.querySelector(`#${containerId}`);
    this.select1 = document.querySelector(`#${select1Id}`);
    this.select2 = document.querySelector(`#${select2Id}`);
    this.data = data;
    this.isComparing = false;

    this._populateDropdowns();
    this._setupEventListeners();
    this._setupKeyboardShortcuts();
  }

  _populateDropdowns() {
    const providers = Object.keys(this.data[Object.keys(this.data)[0]]);
    
    [this.select1, this.select2].forEach((select, index) => {
      // Add loading state
      select.innerHTML = '<option value="">Loading services...</option>';
      
      // Simulate async loading for better UX
      setTimeout(() => {
        select.innerHTML = '<option value="">Choose a service...</option>';
        providers.forEach(provider => {
          const option = document.createElement('option');
          option.value = provider;
          option.textContent = provider;
          select.appendChild(option);
        });
      }, 100 * (index + 1));
    });
  }

  _generateCompareTable() {
    const provider1 = this.select1.value;
    const provider2 = this.select2.value;

    if (!provider1 || !provider2) {
      this._showEmptyState();
      return;
    }

    if (provider1 === provider2) {
      this._showSameProviderWarning();
      return;
    }

    this.isComparing = true;
    const loaderId = loadingManager.show(this.container, 'Generating comparison...');

    // Simulate processing time for better UX
    setTimeout(() => {
      this._renderComparisonTable(provider1, provider2);
      loadingManager.hide(this.container, loaderId);
      this._trackComparison(provider1, provider2);
    }, 500);
  }

  _renderComparisonTable(provider1, provider2) {
    const comparisonData = this._calculateComparisonStats(provider1, provider2);
    
    this.container.innerHTML = `
      <div class="comparison-header">
        <h3>Comparing ${provider1} vs ${provider2}</h3>
        <div class="comparison-stats">
          <div class="stat">
            <span class="stat-label">Shared Support</span>
            <span class="stat-value">${comparisonData.shared}</span>
          </div>
          <div class="stat">
            <span class="stat-label">${provider1} Only</span>
            <span class="stat-value">${comparisonData.provider1Only}</span>
          </div>
          <div class="stat">
            <span class="stat-label">${provider2} Only</span>
            <span class="stat-value">${comparisonData.provider2Only}</span>
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
    
    this.container.style.display = 'block';
    this._setupComparisonFeatures();
    
    // Animate table in
    requestAnimationFrame(() => {
      this.container.classList.add('comparison-visible');
    });
  }

  _generateComparisonRows(provider1, provider2) {
    return Object.entries(this.data).map(([host, providerData]) => {
      const support1 = providerData[provider1] === 'yes';
      const support2 = providerData[provider2] === 'yes';
      
      let statusClass = '';
      let statusText = '';
      
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

      return `
        <tr class="comparison-row ${statusClass}" data-status="${statusClass}">
          <td class="service-name">${host}</td>
          <td class="support-status ${support1 ? 'supported' : 'not-supported'}">
            <span class="status-indicator" aria-label="${support1 ? 'Supported' : 'Not supported'}">
              ${support1 ? 
                '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22,4 12,14.01 9,11.01"></polyline></svg>' : 
                '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>'
              }
            </span>
          </td>
          <td class="support-status ${support2 ? 'supported' : 'not-supported'}">
            <span class="status-indicator" aria-label="${support2 ? 'Supported' : 'Not supported'}">
              ${support2 ? 
                '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22,4 12,14.01 9,11.01"></polyline></svg>' : 
                '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>'
              }
            </span>
          </td>
          <td class="status-text">
            <span class="status-badge ${statusClass}">${statusText}</span>
          </td>
        </tr>
      `;
    }).join('');
  }

  _calculateComparisonStats(provider1, provider2) {
    let shared = 0;
    let provider1Only = 0;
    let provider2Only = 0;

    Object.values(this.data).forEach(providerData => {
      const support1 = providerData[provider1] === 'yes';
      const support2 = providerData[provider2] === 'yes';

      if (support1 && support2) shared++;
      else if (support1) provider1Only++;
      else if (support2) provider2Only++;
    });

    return { shared, provider1Only, provider2Only };
  }

  _setupComparisonFeatures() {
    // Close button
    this.container.querySelector('#close-compare')?.addEventListener('click', () => {
      this._closeComparison();
    });

    // Filter functionality
    this.container.querySelectorAll('input[name="comparison-filter"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        this._filterComparison(e.target.value);
      });
    });
  }

  _filterComparison(filter) {
    const rows = this.container.querySelectorAll('.comparison-row');
    
    rows.forEach(row => {
      const status = row.getAttribute('data-status');
      let show = true;
      
      switch (filter) {
        case 'both':
          show = status === 'both-supported';
          break;
        case 'different':
          show = status === 'provider1-only' || status === 'provider2-only';
          break;
        case 'all':
        default:
          show = true;
      }
      
      row.style.display = show ? '' : 'none';
    });
    
    // Update visible count
    const visibleRows = this.container.querySelectorAll('.comparison-row:not([style*="display: none"])').length;
    let indicator = this.container.querySelector('.filter-results');
    
    if (!indicator) {
      indicator = document.createElement('div');
      indicator.className = 'filter-results';
      this.container.querySelector('.table-wrapper').insertAdjacentElement('beforebegin', indicator);
    }
    
    indicator.textContent = `Showing ${visibleRows} services`;
  }

  _closeComparison() {
    this.container.classList.add('comparison-hiding');
    
    setTimeout(() => {
      this.container.style.display = 'none';
      this.container.classList.remove('comparison-visible', 'comparison-hiding');
      this.isComparing = false;
      this._showEmptyState();
    }, 300);
  }

  _showEmptyState() {
    this.container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">⚖️</div>
        <h3>Ready to Compare</h3>
        <p>Select two services above to see a detailed comparison</p>
      </div>
    `;
    this.container.style.display = 'block';
  }

  _showSameProviderWarning() {
    this.container.innerHTML = `
      <div class="warning-state">
        <div class="warning-icon">⚠️</div>
        <h3>Same Service Selected</h3>
        <p>Please select two different services to compare</p>
      </div>
    `;
    this.container.style.display = 'block';
  }

  _setupEventListeners() {
    [this.select1, this.select2].forEach(select => {
      select?.addEventListener('change', () => {
        this._generateCompareTable();
      });
    });
  }

  _setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      if (this.isComparing && e.key === 'Escape') {
        this._closeComparison();
      }
    });
  }

  _trackComparison(provider1, provider2) {
    // Analytics tracking for popular comparisons
    if (typeof gtag !== 'undefined') {
      gtag('event', 'comparison_generated', {
        provider_1: provider1,
        provider_2: provider2
      });
    }
  }
}

// Enhanced pricing manager
class PricingManager {
  constructor(containerId) {
    this.container = document.querySelector(`#${containerId}-table-container`);
    this.currentData = null;
  }

  generatePricingTable(data = {}) {
    if (!data.plans?.length) {
      this.container.innerHTML = '<div class="error-state"><p>Error: Invalid pricing data structure.</p></div>';
      return;
    }

    this.currentData = data;
    const services = Object.keys(data.plans[0]).filter(key => key !== 'name');
    
    this.container.innerHTML = `
      <div class="table-wrapper">
        <table id="pricing-table" class="pricing-table" aria-label="Service Pricing Table">
          <thead>
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
          </thead>
          <tbody>
            ${data.plans.map((plan, index) => `
              <tr class="pricing-row ${index % 2 === 0 ? 'even' : 'odd'}">
                <td class="plan-name">
                  <strong>${plan.name}</strong>
                </td>
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
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    this._setupPricingFeatures();
  }

  _setupPricingFeatures() {
    // Add hover effects for better UX
    const priceCells = this.container.querySelectorAll('.price-cell');
    priceCells.forEach(cell => {
      cell.addEventListener('mouseenter', () => {
        const column = Array.from(cell.parentNode.children).indexOf(cell);
        this._highlightColumn(column);
      });
      
      cell.addEventListener('mouseleave', () => {
        this._removeColumnHighlight();
      });
    });
  }

  _highlightColumn(columnIndex) {
    const table = this.container.querySelector('table');
    const cells = table.querySelectorAll(`td:nth-child(${columnIndex + 1}), th:nth-child(${columnIndex + 1})`);
    cells.forEach(cell => cell.classList.add('highlighted'));
  }

  _removeColumnHighlight() {
    const highlightedCells = this.container.querySelectorAll('.highlighted');
    highlightedCells.forEach(cell => cell.classList.remove('highlighted'));
  }
}

// Performance monitor
class PerformanceMonitor {
  constructor() {
    this.metrics = {
      loadStart: performance.now(),
      domReady: null,
      fullyLoaded: null
    };
  }

  markDOMReady() {
    this.metrics.domReady = performance.now();
    console.log(`DOM Ready: ${(this.metrics.domReady - this.metrics.loadStart).toFixed(2)}ms`);
  }

  markFullyLoaded() {
    this.metrics.fullyLoaded = performance.now();
    console.log(`Fully Loaded: ${(this.metrics.fullyLoaded - this.metrics.loadStart).toFixed(2)}ms`);
  }

  getMetrics() {
    return {
      ...this.metrics,
      totalLoadTime: this.metrics.fullyLoaded - this.metrics.loadStart,
      domLoadTime: this.metrics.domReady - this.metrics.loadStart
    };
  }
}

// Global instances
const notificationManager = new NotificationManager();
const loadingManager = new LoadingManager();
const performanceMonitor = new PerformanceMonitor();

// Enhanced application initialization
document.addEventListener('DOMContentLoaded', async () => {
  performanceMonitor.markDOMReady();

  try {
    // Initialize managers with enhanced options
    const fileHostsTable = new TableManager(
      'file-hosts-table-container', 
      'host-search-input', 
      'clear-host-search',
      { sortable: true }
    );
    
    const adultHostsTable = new TableManager(
      'adult-hosts-table-container', 
      'adult-host-search-input', 
      'clear-adult-host-search',
      { sortable: true }
    );
    
    const pricingManager = new PricingManager('pricing');

    // Show loading states
    const loaderId1 = loadingManager.show('#file-hosts-table-container', 'Loading file hosts...');
    const loaderId2 = loadingManager.show('#adult-hosts-table-container', 'Loading adult hosts...');
    const loaderId3 = loadingManager.show('#pricing-table-container', 'Loading pricing data...');

    // Enhanced data loading with retry logic
    const loadDataWithRetry = async (url, retries = 3) => {
      for (let i = 0; i < retries; i++) {
        try {
          const response = await fetch(url);
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          return await response.json();
        } catch (error) {
          if (i === retries - 1) throw error;
          await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        }
      }
    };

    // Load data with enhanced error handling
    const [fileHostsData, adultHostsData, pricingData] = await Promise.allSettled([
      loadDataWithRetry('./json/file-hosts.json'),
      loadDataWithRetry('./json/adult-hosts.json'),
      loadDataWithRetry('./json/pricing.json')
    ]);

    // Process results
    if (fileHostsData.status === 'fulfilled') {
      loadingManager.hide('#file-hosts-table-container', loaderId1);
      fileHostsTable.generateTable(fileHostsData.value);
      new ComparisonManager('compare-table-container', 'provider1', 'provider2', fileHostsData.value);
    } else {
      loadingManager.hide('#file-hosts-table-container', loaderId1);
      notificationManager.show('Failed to load file hosts data', 'error');
      console.error('File hosts error:', fileHostsData.reason);
    }

    if (adultHostsData.status === 'fulfilled') {
      loadingManager.hide('#adult-hosts-table-container', loaderId2);
      adultHostsTable.generateTable(adultHostsData.value);
    } else {
      loadingManager.hide('#adult-hosts-table-container', loaderId2);
      notificationManager.show('Failed to load adult hosts data', 'error');
      console.error('Adult hosts error:', adultHostsData.reason);
    }

    if (pricingData.status === 'fulfilled') {
      loadingManager.hide('#pricing-table-container', loaderId3);
      pricingManager.generatePricingTable(pricingData.value);
    } else {
      loadingManager.hide('#pricing-table-container', loaderId3);
      notificationManager.show('Failed to load pricing data', 'error');
      console.error('Pricing error:', pricingData.reason);
    }

    // Setup URL-based comparison
    setupURLComparison();
    
    // Setup scroll animations
    setupScrollAnimations();
    
    // Setup offline detection
    setupOfflineDetection();
    
    performanceMonitor.markFullyLoaded();
    notificationManager.show('Application loaded successfully', 'success', 2000);

  } catch (error) {
    console.error('Critical error initializing application:', error);
    notificationManager.show('Failed to initialize application', 'error');
    loadingManager.hideAll();
  }
});

// URL-based comparison feature
function setupURLComparison() {
  const urlParams = new URLSearchParams(window.location.search);
  const provider1 = urlParams.get('compare');
  const provider2 = urlParams.get('with');
  
  if (provider1 && provider2) {
    setTimeout(() => {
      const select1 = document.querySelector('#provider1');
      const select2 = document.querySelector('#provider2');
      
      if (select1 && select2) {
        select1.value = provider1;
        select2.value = provider2;
        select1.dispatchEvent(new Event('change'));
      }
    }, 1000);
  }
}

// Scroll animations setup
function setupScrollAnimations() {
  const animatedElements = document.querySelectorAll('.section, .card, .quick-nav-card');
  Utils.animateOnScroll(animatedElements);
}

// Offline detection
function setupOfflineDetection() {
  window.addEventListener('online', () => {
    notificationManager.show('Connection restored', 'success', 3000);
  });

  window.addEventListener('offline', () => {
    notificationManager.show('You are offline. Some features may not work.', 'warning', 5000);
  });
}

// Enhanced error boundary
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  notificationManager.show('An unexpected error occurred', 'error');
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  notificationManager.show('A network error occurred', 'error');
  event.preventDefault();
});