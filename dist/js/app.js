/**
 * @fileoverview Main application file for Debrid Services Comparison
 * Handles data fetching, table generation, search functionality, and comparison features
 */

// Utility to debounce frequent events
const debounce = (func, delay = 300) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

// Class to manage table operations
class TableManager {
  constructor(containerId, searchInputId, clearIconId) {
    this.container = document.querySelector(`#${containerId}`);
    this.searchInput = document.querySelector(`#${searchInputId}`);
    this.clearIcon = document.querySelector(`#${clearIconId}`);
    this._setupSearchFunctionality();
  }

  generateTable(data = {}) {
    if (!Object.keys(data).length) {
      this.container.innerHTML = '<p>No data available.</p>';
      return;
    }

    const providers = Object.keys(data[Object.keys(data)[0]]);
    this.container.innerHTML = `
      <table id="${this.container.id.replace('-container', '')}" aria-label="Service Comparison Table">
        <thead>
          <tr>
            <th>Service Name</th>
            ${providers.map(provider => `<th>${provider}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${Object.entries(data).map(([host, providerData]) => `
            <tr>
              <td>${host}</td>
              ${providers.map(provider => `
                <td style="text-align: center;">
                  ${providerData[provider] === 'yes' ? '✅' : '❌'}
                </td>
              `).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  _setupSearchFunctionality() {
    const handleSearch = debounce(() => {
      const searchTerm = this.searchInput.value.toLowerCase();
      const rows = this.container.querySelectorAll('table tbody tr');
      this.clearIcon.style.display = searchTerm ? 'block' : 'none';

      rows.forEach(row => {
        const serviceName = row.querySelector('td:first-child')?.textContent.toLowerCase();
        row.style.display = serviceName?.includes(searchTerm) ? '' : 'none';
      });
    });

    this.searchInput?.addEventListener('input', handleSearch);
    this.clearIcon?.addEventListener('click', () => {
      this.searchInput.value = '';
      this.clearIcon.style.display = 'none';
      handleSearch();
    });
  }
}

// Class to manage comparison operations
class ComparisonManager {
  constructor(containerId, select1Id, select2Id, data) {
    this.container = document.querySelector(`#${containerId}`);
    this.select1 = document.querySelector(`#${select1Id}`);
    this.select2 = document.querySelector(`#${select2Id}`);
    this.data = data;

    this._populateDropdowns();
    this._setupEventListeners();
  }

  _populateDropdowns() {
    const providers = Object.keys(this.data[Object.keys(this.data)[0]]);
    [this.select1, this.select2].forEach(select => {
      providers.forEach(provider => {
        const option = document.createElement('option');
        option.value = provider;
        option.textContent = provider;
        select.appendChild(option);
      });
    });
  }

  _generateCompareTable() {
    const provider1 = this.select1.value;
    const provider2 = this.select2.value;

    if (!provider1 || !provider2) return;

    this.container.innerHTML = `
      <button id="close-compare" title="Close Comparison">
    <span>Close</span>
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M18 6L6 18M6 6l12 12"/>
    </svg>
</button>
      <table id="compare-table" aria-label="Provider Comparison Table">
        <thead>
          <tr>
            <th>Service Name</th>
            <th>${provider1}</th>
            <th>${provider2}</th>
          </tr>
        </thead>
        <tbody>
          ${Object.entries(this.data).map(([host, providerData]) => `
            <tr>
              <td>${host}</td>
              <td>${providerData[provider1] === 'yes' ? '✅' : '❌'}</td>
              <td>${providerData[provider2] === 'yes' ? '✅' : '❌'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    this.container.style.display = 'block';
    this._setupCloseButton();
  }

  _setupEventListeners() {
    [this.select1, this.select2].forEach(select => {
      select?.addEventListener('change', () => this._generateCompareTable());
    });
  }

  _setupCloseButton() {
    this.container.querySelector('#close-compare')?.addEventListener('click', () => {
      this.container.style.display = 'none';
    });
  }
}

// Class to manage pricing operations
class PricingManager {
  constructor(containerId) {
    this.container = document.querySelector(`#${containerId}-table-container`);
  }

  generatePricingTable(data = {}) {
    if (!data.plans?.length) {
      this.container.innerHTML = '<p>Error: Invalid pricing data structure.</p>';
      return;
    }

    const services = Object.keys(data.plans[0]).filter(key => key !== 'name');
    this.container.innerHTML = `
      <table id="pricing-table" aria-label="Service Pricing Table">
        <thead>
          <tr>
            <th>Plans</th>
            ${services.map(service => `<th>${service}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${data.plans.map(plan => `
            <tr>
              <td>${plan.name}</td>
              ${services.map(service => `
                <td style="text-align: center;">${plan[service]}</td>
              `).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }
}

// Main application initialization
document.addEventListener('DOMContentLoaded', async () => {
  const fileHostsTable = new TableManager('file-hosts-table-container', 'host-search-input', 'clear-host-search');
  const adultHostsTable = new TableManager('adult-hosts-table-container', 'adult-host-search-input', 'clear-adult-host-search');
  const pricingManager = new PricingManager('pricing');

  try {
    const [fileHostsData, adultHostsData, pricingData] = await Promise.all([
      fetch('./json/file-hosts.json').then(res => res.json()),
      fetch('./json/adult-hosts.json').then(res => res.json()),
      fetch('./json/pricing.json').then(res => res.json())
    ]);

    fileHostsTable.generateTable(fileHostsData);
    adultHostsTable.generateTable(adultHostsData);
    pricingManager.generatePricingTable(pricingData);

    new ComparisonManager('compare-table-container', 'provider1', 'provider2', fileHostsData);
  } catch (error) {
    console.error('Error initializing application:', error);
    const errorMessage = '<p>Error loading data. Please try again later.</p>';
    fileHostsTable.container.innerHTML = errorMessage;
    adultHostsTable.container.innerHTML = errorMessage;
    pricingManager.container.innerHTML = errorMessage;
  }
});
