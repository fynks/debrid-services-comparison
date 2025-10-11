/**
 * Debrid Services Comparison - Improved App JS
 * - Data loading (file hosts, adult hosts)
 * - Tables, comparison interactions with ✅/❌ format
 * - Back-to-top, nav highlight, animations, offline detection
 * - Performance-minded DOM updates and event delegation
 */

/* ==============================
   Utils
   ============================== */
const Utils = (() => {
    const debounceMap = new WeakMap();
    return {
        debounce(func, wait = 300, immediate = false) {
            if (debounceMap.has(func)) return debounceMap.get(func);
            let timeout;
            const debounced = function (...args) {
                const callNow = immediate && !timeout;
                clearTimeout(timeout);
                if (callNow) func.apply(this, args);
                timeout = setTimeout(() => {
                    timeout = null;
                    if (!immediate) func.apply(this, args);
                }, wait);
            };
            debounceMap.set(func, debounced);
            return debounced;
        },
        throttle(func, limit = 100) {
            let inThrottle = false;
            return function (...args) {
                if (!inThrottle) {
                    func.apply(this, args);
                    inThrottle = true;
                    requestAnimationFrame(() => {
                        setTimeout(() => inThrottle = false, limit);
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
                        entries.forEach((entry) => {
                            if (entry.isIntersecting) {
                                entry.target.classList.add("animate-in");
                                observer.unobserve(entry.target);
                            }
                        });
                    }, {
                        threshold: 0.1,
                        rootMargin: "0px 0px -50px 0px",
                        ...options
                    });
                }
                elements.forEach((element) => observer.observe(element));
            };
        })()
    };
})();

class LoadingManager {
    constructor() {
        this.activeLoaders = new Map();
        this.template = this.createTemplate();
    }

    createTemplate() {
        const template = document.createElement("template");
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

    show(target, text = "Loading...") {
        const element = typeof target === "string" ? document.querySelector(target) : target;
        if (!element) return null;

        const loaderId = `loader-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        const loaderElement = this.template.content.cloneNode(true).firstElementChild;
        loaderElement.dataset.loaderId = loaderId;
        loaderElement.querySelector(".loading-text").textContent = text;

        const computedStyle = getComputedStyle(element);
        if (computedStyle.position === "static") {
            element.style.position = "relative";
        }

        element.appendChild(loaderElement);
        this.activeLoaders.set(loaderId, loaderElement);

        requestAnimationFrame(() => loaderElement.classList.add("loading-overlay--visible"));
        return loaderId;
    }

    hide(target, loaderId) {
        const loaderElement = this.activeLoaders.get(loaderId);
        if (loaderElement) {
            loaderElement.classList.add("loading-overlay--hiding");
            this.activeLoaders.delete(loaderId);
            setTimeout(() => loaderElement.remove(), 250);
        }
    }

    hideAll() {
        this.activeLoaders.forEach((_, loaderId) => this.hide(null, loaderId));
    }
}

class TableManager {
    constructor(containerId, searchInputId, clearIconId, options = {}) {
        this.elements = {
            container: document.getElementById(containerId),
            searchInput: document.getElementById(searchInputId),
            clearIcon: document.getElementById(clearIconId)
        };

        this.options = {
            sortable: true,
            filterable: true,
            pagination: false,
            itemsPerPage: 50,
            ...options
        };

        this.state = {
            currentData: {},
            filteredData: {},
            currentSort: { column: null, direction: "asc" },
            currentPage: 1,
            services: [], // Store services array for indexed format
            columns: [],
            isIndexedFormat: false // Flag to track data format
        };

        this.handleSearch = Utils.debounce(this._performSearch.bind(this), 250);
        this.handleSort = this._performSort.bind(this);
        this.renderToken = null;
        this._init();
    }

    _init() {
        if (this.elements.searchInput) {
            this.elements.searchInput.addEventListener("input", this.handleSearch);
            this.elements.searchInput.addEventListener("keydown", (e) => {
                if (e.key === "Escape") this._clearSearch();
            });
        }

        if (this.elements.clearIcon) {
            this.elements.clearIcon.addEventListener("click", () => this._clearSearch());
        }
    }

    // New method to transform indexed data to regular format
    _transformIndexedData(indexedData) {
        // Check if data is in indexed format (has services and supported properties)
        if (indexedData.services && indexedData.supported) {
            // Handle indexed format
            const { services, supported } = indexedData;
            const transformed = {};
            
            for (const [host, supportedIndices] of Object.entries(supported)) {
                transformed[host] = {};
                services.forEach((service, index) => {
                    transformed[host][service] = supportedIndices.includes(index) ? "✅" : "❌";
                });
            }
            
            // Store services for later use
            this.state.services = services;
            this.state.isIndexedFormat = true;
            
            return transformed;
        } else {
            // Data is already in the direct format (host -> service -> ✅/❌)
            this.state.isIndexedFormat = false;
            return indexedData;
        }
    }

    // Modified method to handle both formats
    generateTable(data = {}) {
        if (!this.elements.container) return;

        // Handle both indexed and direct formats
        let processedData;
        if (data.services && data.supported) {
            // Indexed format
            processedData = this._transformIndexedData(data);
        } else {
            // Direct format
            processedData = data;
            this.state.isIndexedFormat = false;
            // Try to extract services from first entry
            const firstHost = Object.values(processedData)[0];
            this.state.services = firstHost ? Object.keys(firstHost) : [];
        }

        if (!Object.keys(processedData).length) {
            this.elements.container.innerHTML = '<div class="empty-state"><p>No data available.</p></div>';
            return;
        }

        this.state.currentData = processedData;
        this.state.filteredData = { ...processedData };

        const firstHostKey = Object.keys(processedData)[0];
        const columns = firstHostKey ? Object.keys(processedData[firstHostKey]) : [];
        this.state.columns = columns;
        const tableId = this.elements.container.id.replace("-container", "");

        const fragment = document.createDocumentFragment();
        const wrapper = document.createElement("div");
        wrapper.className = "table-wrapper";

        const table = document.createElement("table");
        table.id = tableId;
        table.className = "enhanced-table";
        table.setAttribute("aria-label", "Service Comparison Table");

        const thead = document.createElement("thead");
        thead.innerHTML = this._generateTableHeader(columns);
        table.appendChild(thead);

        const tbody = document.createElement("tbody");
        table.appendChild(tbody);

        wrapper.appendChild(table);
        fragment.appendChild(wrapper);

        this.elements.container.innerHTML = "";
        this.elements.container.appendChild(fragment);

        this._attachTableEvents();
        this._renderTableBody(this.state.filteredData, columns);
    }

    _generateTableHeader(columns) {
        return `
            <tr>
                <th class="sortable" data-column="service" tabindex="0" role="columnheader" aria-sort="none">
                    <span>Service Name</span>
                    <svg class="sort-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                        <path d="M12 5v14M5 12l7-7 7 7"/>
                    </svg>
                </th>
                ${columns.map(column => `
                    <th class="sortable" data-column="${column}" tabindex="0" role="columnheader" aria-sort="none">
                        <span>${column}</span>
                        <svg class="sort-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                            <path d="M12 5v14M5 12l7-7 7 7"/>
                        </svg>
                    </th>
                `).join("")}
            </tr>
        `;
    }

    _renderTableBody(data, columns = this.state.columns) {
        const table = this.elements.container.querySelector("table");
        const tbody = table?.querySelector("tbody");
        if (!tbody) return;

        const effectiveColumns = Array.isArray(columns) && columns.length ? columns : this.state.columns;
        const entries = Object.entries(data);
        const token = Symbol("render");
        this.renderToken = token;

        tbody.textContent = "";

        if (!entries.length) {
            const emptyRow = document.createElement("tr");
            const emptyCell = document.createElement("td");
            emptyCell.colSpan = (effectiveColumns?.length || 0) + 1;
            emptyCell.className = "empty-state-row";
            emptyCell.textContent = "No services match your current filters.";
            emptyRow.appendChild(emptyCell);
            tbody.appendChild(emptyRow);
            return;
        }

        let index = 0;
        const baseChunk = Math.max(20, 60 - Math.max(0, effectiveColumns.length - 4) * 5);
        const isCompact = typeof window !== "undefined" && typeof window.matchMedia === "function"
            ? window.matchMedia("(max-width: 640px)").matches
            : false;
        const chunkSize = isCompact ? Math.max(10, Math.floor(baseChunk / 1.5)) : baseChunk;
        const schedule = (cb) => {
            if (typeof requestIdleCallback === "function") {
                requestIdleCallback(cb, { timeout: 160 });
            } else {
                requestAnimationFrame(cb);
            }
        };

        const renderChunk = () => {
            if (this.renderToken !== token) return;

            const fragment = document.createDocumentFragment();
            const limit = Math.min(entries.length, index + chunkSize);
            for (; index < limit; index++) {
                const [host, hostData] = entries[index];
                fragment.appendChild(this._createTableRow(host, hostData, effectiveColumns));
            }
            tbody.appendChild(fragment);

            if (index < entries.length) {
                schedule(renderChunk);
            }
        };

        schedule(renderChunk);
    }

    _createTableRow(host, hostData, columns) {
        const row = document.createElement("tr");
        row.dataset.host = host.toLowerCase();
        row.setAttribute("role", "row");

        const serviceCell = document.createElement("td");
        serviceCell.className = "service-cell";
        serviceCell.setAttribute("role", "gridcell");

        const serviceInfo = document.createElement("div");
        serviceInfo.className = "service-info";

        const serviceName = document.createElement("span");
        serviceName.className = "service-name";
        serviceName.textContent = host;

        serviceInfo.appendChild(serviceName);
        serviceCell.appendChild(serviceInfo);
        row.appendChild(serviceCell);

        columns.forEach((column) => {
            const statusCell = document.createElement("td");
            statusCell.className = "status-cell";
            statusCell.dataset.status = hostData[column] || "";
            const isSupported = hostData[column] === "✅";
            statusCell.dataset.supported = isSupported ? "true" : "false";
            statusCell.setAttribute("role", "gridcell");
            const indicator = document.createElement("span");
            indicator.className = "status-indicator";
            indicator.dataset.supported = isSupported ? "true" : "false";
            indicator.textContent = isSupported ? "✅" : "❌";
            indicator.setAttribute("aria-hidden", "true");

            const srText = document.createElement("span");
            srText.className = "visually-hidden";
            srText.textContent = isSupported ? "Supported" : "Not supported";

            statusCell.appendChild(indicator);
            statusCell.appendChild(srText);
            row.appendChild(statusCell);
        });

        return row;
    }

    _attachTableEvents() {
        if (!this.options.sortable) return;

        const thead = this.elements.container.querySelector("thead");
        if (thead) {
            thead.addEventListener("click", this.handleSort);
            thead.addEventListener("keydown", (e) => {
                const sortableHeader = e.target.closest(".sortable");
                if (sortableHeader && (e.key === "Enter" || e.key === " ")) {
                    e.preventDefault();
                    this.handleSort({ target: sortableHeader });
                }
            });
        }
    }

    _performSearch() {
        const searchTerm = (this.elements.searchInput?.value || "").toLowerCase().trim();
        
        if (searchTerm) {
            this.state.filteredData = Object.fromEntries(
                Object.entries(this.state.currentData).filter(([host]) => 
                    host.toLowerCase().includes(searchTerm)
                )
            );
            if (this.elements.clearIcon) {
                this.elements.clearIcon.style.display = "block";
            }
        } else {
            this.state.filteredData = { ...this.state.currentData };
            if (this.elements.clearIcon) {
                this.elements.clearIcon.style.display = "none";
            }
        }

        this._updateTableContent();
        this._updateSearchResults(searchTerm);
    }

    _clearSearch() {
        if (this.elements.searchInput) {
            this.elements.searchInput.value = "";
        }
        this.state.filteredData = { ...this.state.currentData };
        if (this.elements.clearIcon) {
            this.elements.clearIcon.style.display = "none";
        }
        this._updateTableContent();
        this._updateSearchResults("");
    }

    _updateSearchResults(searchTerm) {
        if (!this.elements.container) return;

        let resultsElement = this.elements.container.querySelector(".search-results");
        
        if (searchTerm) {
            const filteredCount = Object.keys(this.state.filteredData).length;
            const totalCount = Object.keys(this.state.currentData).length;
            
            if (!resultsElement) {
                resultsElement = document.createElement("div");
                resultsElement.className = "search-results";
                this.elements.container.insertBefore(resultsElement, this.elements.container.firstChild);
            }
            
            resultsElement.textContent = `Showing ${filteredCount} of ${totalCount} services`;
            resultsElement.style.display = "block";
            resultsElement.style.textAlign = "center";
            resultsElement.style.padding = "0.5em 0";
        } else if (resultsElement) {
            resultsElement.style.display = "none";
        }
    }

    _performSort(event) {
        const sortableHeader = event.target.closest(".sortable");
        if (!sortableHeader) return;

        const column = sortableHeader.dataset.column;
        const { currentSort } = this.state;
        const direction = currentSort.column === column && currentSort.direction === "asc" ? "desc" : "asc";

        this.state.currentSort = { column, direction };

        // Update UI
        this.elements.container.querySelectorAll("th.sortable").forEach(header => {
            header.setAttribute("aria-sort", "none");
            header.classList.remove("sorted-asc", "sorted-desc");
        });

        sortableHeader.setAttribute("aria-sort", direction === "asc" ? "ascending" : "descending");
        sortableHeader.classList.add(`sorted-${direction}`);

        this._sortData();
        this._updateTableContent();
    }

    _sortData() {
        const { column, direction } = this.state.currentSort;
        const entries = Object.entries(this.state.filteredData);

        entries.sort(([hostA, dataA], [hostB, dataB]) => {
            let valueA, valueB;

            if (column === "service") {
                valueA = hostA.toLowerCase();
                valueB = hostB.toLowerCase();
            } else {
                // Convert "✅"/"❌" to numeric values for sorting
                valueA = dataA[column] === "✅" ? 1 : 0;
                valueB = dataB[column] === "✅" ? 1 : 0;
            }

            let comparison = 0;
            if (valueA > valueB) comparison = 1;
            else if (valueA < valueB) comparison = -1;

            return direction === "asc" ? comparison : -comparison;
        });

        this.state.filteredData = Object.fromEntries(entries);
    }

    _updateTableContent() {
        this._renderTableBody(this.state.filteredData, this.state.columns);
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
        this.services = []; // Store services array for indexed format
        
        // Check if data is in indexed format
        if (data.services && data.supported) {
            this.services = data.services;
            this.isIndexedFormat = true;
        } else {
            // Extract services from regular format
            const firstHost = Object.values(data)[0];
            this.services = firstHost ? Object.keys(firstHost) : [];
            this.isIndexedFormat = false;
        }
        
        this._init();
    }

    _init() {
        this._populateDropdowns();
        
        if (this.elements.select1) {
            this.elements.select1.addEventListener("change", this.handleCompare);
        }
        
        if (this.elements.select2) {
            this.elements.select2.addEventListener("change", this.handleCompare);
        }
        
        document.addEventListener("keydown", (e) => {
            if (this.isComparing && e.key === "Escape") {
                this._closeComparison();
            }
        });
    }

    _populateDropdowns() {
        // Use the stored services array
        const optionsHtml = '<option value="">Choose a service...</option>' +
            this.services.map(service => 
                `<option value="${service}">${service}</option>`
            ).join("");
        
        [this.elements.select1, this.elements.select2].forEach(select => {
            if (select) {
                select.innerHTML = optionsHtml;
            }
        });
    }

    // Transform indexed data to regular format for comparison
    _getHostData(hostName) {
        if (this.isIndexedFormat) {
            // Convert indexed format to regular format
            const supportedIndices = this.data.supported[hostName] || [];
            const hostData = {};
            this.services.forEach((service, index) => {
                hostData[service] = supportedIndices.includes(index) ? "✅" : "❌";
            });
            return hostData;
        } else {
            // Return data as-is for regular format (already using ✅/❌)
            return this.data[hostName] || {};
        }
    }

    _generateCompareTable() {
        const service1 = this.elements.select1?.value;
        const service2 = this.elements.select2?.value;
        
        if (!service1 || !service2) {
            this._showEmptyState();
            return;
        }
        
        if (service1 === service2) {
            this._showSameProviderWarning();
            return;
        }
        
        this.isComparing = true;
        const loaderId = loadingManager.show(this.elements.container, "Generating comparison...");
        
        requestAnimationFrame(() => {
            this._renderComparisonTable(service1, service2);
            loadingManager.hide(this.elements.container, loaderId);
        });
    }

    _renderComparisonTable(service1, service2) {
        const stats = this._calculateComparisonStats(service1, service2);
        
        const fragment = document.createDocumentFragment();
        const wrapper = document.createElement("div");
        wrapper.innerHTML = `
            <div class="comparison-header">
                <h3>Comparing ${service1} vs ${service2}</h3>
                <div class="comparison-stats">
                    <div class="stat"><span class="stat-label">Shared Support</span><span class="stat-value">${stats.shared}</span></div>
                    <div class="stat"><span class="stat-label">${service1} Only</span><span class="stat-value">${stats.service1Only}</span></div>
                    <div class="stat"><span class="stat-label">${service2} Only</span><span class="stat-value">${stats.service2Only}</span></div>
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
                            <th class="provider-header ${service1.toLowerCase().replace(/\s+/g, '-')}">${service1}</th>
                            <th class="provider-header ${service2.toLowerCase().replace(/\s+/g, '-')}">${service2}</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this._generateComparisonRows(service1, service2)}
                    </tbody>
                </table>
            </div>
        `;
        
        fragment.appendChild(wrapper);
        this.elements.container.innerHTML = "";
        this.elements.container.appendChild(fragment);
        this.elements.container.style.display = "block";
        
        this._attachComparisonEvents();
        
        requestAnimationFrame(() => {
            this.elements.container.classList.add("comparison-visible");
        });
    }

    _generateComparisonRows(service1, service2) {
        const rows = [];
        const hosts = this.isIndexedFormat ? Object.keys(this.data.supported) : Object.keys(this.data);
        const getStatusCell = (supported) => {
            const supportedClass = supported ? "supported" : "not-supported";
            const supportedFlag = supported ? "true" : "false";
            const emoji = supported ? "✅" : "❌";
            return `
                <td class="support-status ${supportedClass}" data-supported="${supportedFlag}">
                    <span class="status-indicator" data-supported="${supportedFlag}" aria-hidden="true">${emoji}</span>
                    <span class="visually-hidden">${supported ? "Supported" : "Not supported"}</span>
                </td>
            `;
        };

        for (const host of hosts) {
            const hostData = this._getHostData(host);
            const supported1 = hostData[service1] === "✅";
            const supported2 = hostData[service2] === "✅";

            let statusClass = "neither-supported";
            let statusText = "Neither";

            if (supported1 && supported2) {
                statusClass = "both-supported";
                statusText = "Both";
            } else if (supported1) {
                statusClass = "service1-only";
                statusText = `${service1} only`;
            } else if (supported2) {
                statusClass = "service2-only";
                statusText = `${service2} only`;
            }

            rows.push(`
                <tr class="comparison-row ${statusClass}" data-status="${statusClass}">
                    <td class="service-name">${host}</td>
                    ${getStatusCell(supported1)}
                    ${getStatusCell(supported2)}
                    <td class="status-text"><span class="status-badge ${statusClass}">${statusText}</span></td>
                </tr>
            `);
        }

        return rows.join("");
    }

    _calculateComparisonStats(service1, service2) {
        let shared = 0;
        let service1Only = 0;
        let service2Only = 0;
        
        // Get all hosts
        const hosts = this.isIndexedFormat ? Object.keys(this.data.supported) : Object.keys(this.data);
        
        for (const host of hosts) {
            const hostData = this._getHostData(host);
            const supported1 = hostData[service1] === "✅";
            const supported2 = hostData[service2] === "✅";
            
            if (supported1 && supported2) {
                shared++;
            } else if (supported1) {
                service1Only++;
            } else if (supported2) {
                service2Only++;
            }
        }
        
        return { shared, service1Only, service2Only };
    }

    _attachComparisonEvents() {
        const closeBtn = this.elements.container.querySelector("#close-compare");
        if (closeBtn) {
            closeBtn.addEventListener("click", () => this._closeComparison());
        }
        
        this.elements.container.addEventListener("change", (e) => {
            if (e.target.name === "comparison-filter") {
                this._filterComparison(e.target.value);
            }
        });
    }

    _filterComparison(filterValue) {
        const rows = this.elements.container.querySelectorAll(".comparison-row");
        let visibleCount = 0;
        
        rows.forEach(row => {
            const status = row.dataset.status;
            const shouldShow = 
                filterValue === "all" ||
                (filterValue === "both" && status === "both-supported") ||
                (filterValue === "different" && (status === "service1-only" || status === "service2-only"));
            
            row.style.display = shouldShow ? "" : "none";
            if (shouldShow) visibleCount++;
        });
        
        let resultsElement = this.elements.container.querySelector(".filter-results");
        if (!resultsElement) {
            resultsElement = document.createElement("div");
            resultsElement.className = "filter-results";
            const tableWrapper = this.elements.container.querySelector(".table-wrapper");
            tableWrapper.parentNode.insertBefore(resultsElement, tableWrapper);
        }
        
        resultsElement.textContent = `Showing ${visibleCount} services`;
    }

    _closeComparison() {
        this.elements.container.classList.add("comparison-hiding");
        setTimeout(() => {
            this.elements.container.style.display = "none";
            this.elements.container.classList.remove("comparison-visible", "comparison-hiding");
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
        this.elements.container.style.display = "block";
    }

    _showSameProviderWarning() {
        this.elements.container.innerHTML = `
            <div class="warning-state">
                <div class="warning-icon">⚠️</div>
                <h3>Same Service Selected</h3>
                <p>Please select two different services to compare</p>
            </div>
        `;
        this.elements.container.style.display = "block";
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

// Adds/removes a subtle shadow on the fixed header when the page is scrolled
function setupHeaderElevate() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    const update = () => {
        if (window.scrollY > 8) header.classList.add('is-scrolled');
        else header.classList.remove('is-scrolled');
    };
    update();
    const onScroll = Utils.throttle(update, 100);
    window.addEventListener('scroll', onScroll, { passive: true });
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

    const loaders = [
      loadingManager.show('#file-hosts-table-container', 'Loading file hosts...'),
      loadingManager.show('#adult-hosts-table-container', 'Loading adult hosts...')
    ];

        // Helper: fetch with timeout and graceful fallbacks
        const fetchWithTimeout = (url, { timeout = 8000 } = {}) => {
            const controller = new AbortController();
            const id = setTimeout(() => controller.abort(), timeout);
            return fetch(url, { signal: controller.signal })
                .finally(() => clearTimeout(id));
        };

        const fetchJsonFallback = async (urls, timeout = 8000) => {
            let lastErr;
            for (const url of urls) {
                try {
                    const res = await fetchWithTimeout(url, { timeout });
                    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
                    return await res.json();
                } catch (err) {
                    lastErr = err;
                    continue;
                }
            }
            throw lastErr || new Error('All fetch fallbacks failed');
        };

        // Prefer optimized JSON, fall back to original if missing
        const datasets = [
            ['./json/file-hosts-optimized.json', './json/file-hosts.json'],
            ['./json/adult-hosts-optimized.json', './json/adult-hosts.json']
        ];

        const fetchPromises = datasets.map(list => fetchJsonFallback(list, 8000));
        const results = await Promise.allSettled(fetchPromises);

    results.forEach((result, index) => {
      const containers = ['#file-hosts-table-container', '#adult-hosts-table-container'];
      
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
        }
      } else {
                console.error('Error loading data set:', result.reason);
        const el = document.querySelector(containers[index]);
                if (el) el.innerHTML = `<div class="error-state"><p>Failed to load data. Please check your connection and refresh.</p></div>`;
      }
    });

    // UI features
    setupURLComparison();
    setupScrollAnimations();
    setupOfflineDetection();
    setupBackToTop();
    setupNavHighlight();
    setupHeaderElevate();

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
        // Use relative path to work under subdirectories too
        navigator.serviceWorker.register('sw.js').catch(err => {
      console.warn('Service worker registration failed:', err);
    });
  });
}