/**
 * Comparison Manager - Side-by-side service comparison tool
 * Dynamically imported when user interacts with comparison UI
 */
import { ComponentLifecycle } from '../core/ComponentLifecycle.js';
import { DataTransformer } from '../services/DataTransformer.js';
import { createElement } from '../utils/dom.js';

export class ComparisonManager {
  #elements = {};
  #data = null;
  #services = [];
  #lifecycle = null;

  constructor(containerId, select1Id, select2Id, data) {
    this.#lifecycle = new ComponentLifecycle();

    this.#elements = {
      container: document.getElementById(containerId),
      select1: document.getElementById(select1Id),
      select2: document.getElementById(select2Id)
    };

    const transformed = DataTransformer.transformIndexedData(data);
    this.#data = transformed.data;
    this.#services = transformed.services || DataTransformer.extractServices(transformed.data);

    this.#init();
  }

  #init() {
    if (!this.#elements.select1 || !this.#elements.select2) return;

    // Clear existing options except the first placeholder option
    while (this.#elements.select1.options.length > 1) {
      this.#elements.select1.remove(1);
    }
    while (this.#elements.select2.options.length > 1) {
      this.#elements.select2.remove(1);
    }

    // Populate select dropdowns with service options
    this.#services.forEach(service => {
      const option1 = document.createElement('option');
      option1.value = service;
      option1.textContent = service;
      this.#elements.select1.appendChild(option1);

      const option2 = document.createElement('option');
      option2.value = service;
      option2.textContent = service;
      this.#elements.select2.appendChild(option2);
    });

    const handleChange1 = () => this.#handleCompare();
    const handleChange2 = () => this.#handleCompare();

    this.#elements.select1.addEventListener('change', handleChange1);
    this.#elements.select2.addEventListener('change', handleChange2);

    // Register cleanup
    this.#lifecycle.onDestroy(() => {
      this.#elements.select1.removeEventListener('change', handleChange1);
      this.#elements.select2.removeEventListener('change', handleChange2);
    });
  }

  destroy() {
    this.#lifecycle.destroy();
  }

  #handleCompare() {
    const service1 = this.#elements.select1.value;
    const service2 = this.#elements.select2.value;

    console.log('Comparing services:', { service1, service2 });

    if (!service1 || !service2) {
      this.#showEmptyState();
      return;
    }

    if (service1 === service2) {
      this.#showSameProviderWarning();
      return;
    }

    this.#renderComparison(service1, service2);
  }

  #renderComparison(service1, service2) {
    const hosts = Object.keys(this.#data);
    const stats = this.#calculateStats(service1, service2, hosts);

    const table = this.#createComparisonTable(service1, service2, hosts);
    const header = this.#createComparisonHeader(service1, service2, stats);

    this.#elements.container.innerHTML = '';
    this.#elements.container.appendChild(header);
    this.#elements.container.appendChild(table);
    this.#elements.container.style.display = 'block';
  }

  #createComparisonHeader(service1, service2, stats) {
    const header = createElement('div', { className: 'comparison-header' });

    const title = createElement('h3', {}, [`Comparing ${service1} vs ${service2}`]);
    header.appendChild(title);

    const statsDiv = createElement('div', { className: 'comparison-stats' });

    const createStatItem = (label, value) => {
      const stat = createElement('div', { className: 'stat' });
      const statLabel = createElement('span', { className: 'stat-label' }, [label]);
      const statValue = createElement('span', { className: 'stat-value' }, [String(value)]);
      stat.appendChild(statLabel);
      stat.appendChild(statValue);
      return stat;
    };

    statsDiv.appendChild(createStatItem('Shared', stats.shared));
    statsDiv.appendChild(createStatItem(`${service1} Only`, stats.service1Only));
    statsDiv.appendChild(createStatItem(`${service2} Only`, stats.service2Only));

    header.appendChild(statsDiv);

    return header;
  }

  #createComparisonTable(service1, service2, hosts) {
    const wrapper = createElement('div', { className: 'table-wrapper' });
    const table = createElement('table', { className: 'comparison-table' });

    // Header
    const thead = createElement('thead');
    thead.innerHTML = `
      <tr>
        <th>Host</th>
        <th>${service1}</th>
        <th>${service2}</th>
        <th>Status</th>
      </tr>
    `;
    table.appendChild(thead);

    // Body
    const tbody = createElement('tbody');
    hosts.forEach(host => {
      const row = this.#createComparisonRow(host, service1, service2);
      if (row) {
        tbody.appendChild(row);
      }
    });
    table.appendChild(tbody);

    wrapper.appendChild(table);
    return wrapper;
  }

  #createComparisonRow(host, service1, service2) {
    const hostData = this.#data[host];

    if (!hostData) {
      console.warn(`Host data not found for: ${host}`);
      return null;
    }

    const findServiceKey = (serviceName) => {
      if (hostData[serviceName] !== undefined) {
        return serviceName;
      }
      const serviceKey = Object.keys(hostData).find(
        key => key.toLowerCase() === serviceName.toLowerCase()
      );
      return serviceKey;
    };

    const serviceKey1 = findServiceKey(service1);
    const serviceKey2 = findServiceKey(service2);

    const supported1 = serviceKey1 ? hostData[serviceKey1] === '✅' : false;
    const supported2 = serviceKey2 ? hostData[serviceKey2] === '✅' : false;

    let statusClass = 'neither-supported';
    let statusText = 'Neither';

    if (supported1 && supported2) {
      statusClass = 'both-supported';
      statusText = 'Both';
    } else if (supported1) {
      statusClass = 'service1-only';
      statusText = `${service1} only`;
    } else if (supported2) {
      statusClass = 'service2-only';
      statusText = `${service2} only`;
    }

    const row = createElement('tr', {
      className: `comparison-row ${statusClass}`,
      dataset: { status: statusClass }
    });

    const hostCell = createElement('td', { className: 'service-name' }, [host]);
    row.appendChild(hostCell);

    const status1Cell = this.#createStatusCell(supported1);
    row.appendChild(status1Cell);

    const status2Cell = this.#createStatusCell(supported2);
    row.appendChild(status2Cell);

    const statusTextCell = createElement('td', { className: 'status-text' });
    const badge = createElement('span', {
      className: `status-badge ${statusClass}`
    }, [statusText]);
    statusTextCell.appendChild(badge);
    row.appendChild(statusTextCell);

    return row;
  }

  #createStatusCell(isSupported) {
    const cell = createElement('td', {
      className: `support-status ${isSupported ? 'supported' : 'not-supported'}`,
      dataset: { supported: isSupported ? 'true' : 'false' }
    });

    const indicator = createElement('span', {
      className: 'status-indicator',
      'aria-hidden': 'true',
      dataset: { supported: isSupported ? 'true' : 'false' }
    }, [isSupported ? '✅' : '❌']);

    const srText = createElement('span', {
      className: 'visually-hidden'
    }, [isSupported ? 'Supported' : 'Not supported']);

    cell.appendChild(indicator);
    cell.appendChild(srText);

    return cell;
  }

  #calculateStats(service1, service2, hosts) {
    let shared = 0;
    let service1Only = 0;
    let service2Only = 0;

    const findServiceKey = (hostData, serviceName) => {
      if (hostData[serviceName] !== undefined) {
        return serviceName;
      }
      return Object.keys(hostData).find(
        key => key.toLowerCase() === serviceName.toLowerCase()
      );
    };

    hosts.forEach(host => {
      const hostData = this.#data[host];
      if (!hostData) return;

      const serviceKey1 = findServiceKey(hostData, service1);
      const serviceKey2 = findServiceKey(hostData, service2);

      const supported1 = serviceKey1 ? hostData[serviceKey1] === '✅' : false;
      const supported2 = serviceKey2 ? hostData[serviceKey2] === '✅' : false;

      if (supported1 && supported2) shared++;
      else if (supported1) service1Only++;
      else if (supported2) service2Only++;
    });

    return { shared, service1Only, service2Only };
  }

  #showEmptyState() {
    this.#elements.container.innerHTML = `
      <div class="empty-state">
        <h3>Select Two Services to Compare</h3>
        <p>Choose services from the dropdowns above to see a detailed comparison.</p>
      </div>
    `;
    this.#elements.container.style.display = 'block';
  }

  #showSameProviderWarning() {
    this.#elements.container.innerHTML = `
      <div class="warning-state">
        <div class="warning-icon">⚠️</div>
        <h3>Same Service Selected</h3>
        <p>Please select two different services to compare</p>
      </div>
    `;
    this.#elements.container.style.display = 'block';
  }
}
