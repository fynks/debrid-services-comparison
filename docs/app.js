/**
 * @fileoverview Main application file for Debrid Services Comparison
 * Handles data fetching, table generation, search functionality, and comparison features
 */

// Class to handle table-related operations
class TableManager {
    /**
     * @param {string} containerId - ID of the table container element
     * @param {string} searchInputId - ID of the search input element
     * @param {string} clearIconId - ID of the clear search icon element
     */
    constructor(containerId, searchInputId, clearIconId) {
      this.container = document.getElementById(containerId);
      this.searchInput = document.getElementById(searchInputId);
      this.clearIcon = document.getElementById(clearIconId);
      this.setupSearchFunctionality();
    }
  
    /**
     * Generates a table from provided data
     * @param {Object} data - Table data object
     * @returns {void}
     */
    generateTable(data) {
      if (!data || Object.keys(data).length === 0) {
        this.container.innerHTML = '<p>No data available.</p>';
        return;
      }
  
      const providers = Object.keys(data[Object.keys(data)[0]]);
      const tableHTML = `
        <table id="${this.container.id.replace('-container', '')}">
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
  
      this.container.innerHTML = tableHTML;
    }
  
    /**
     * Sets up search functionality for the table
     * @private
     */
    setupSearchFunctionality() {
      this.searchInput?.addEventListener('input', () => {
        const searchTerm = this.searchInput.value.toLowerCase();
        const rows = this.container.querySelectorAll('table tbody tr');
        
        this.clearIcon.style.display = searchTerm ? 'block' : 'none';
        
        rows.forEach(row => {
          const serviceName = row.querySelector('td:first-child')?.textContent.toLowerCase();
          row.style.display = serviceName?.includes(searchTerm) ? '' : 'none';
        });
      });
  
      this.clearIcon?.addEventListener('click', () => {
        this.searchInput.value = '';
        this.clearIcon.style.display = 'none';
        this.searchInput.dispatchEvent(new Event('input'));
      });
    }
  }
  
  // Class to handle comparison functionality
  class ComparisonManager {
    /**
     * @param {string} containerId - ID of the comparison container
     * @param {string} select1Id - ID of the first provider select element
     * @param {string} select2Id - ID of the second provider select element
     * @param {Object} data - Comparison data object
     */
    constructor(containerId, select1Id, select2Id, data) {
      this.container = document.getElementById(containerId);
      this.select1 = document.getElementById(select1Id);
      this.select2 = document.getElementById(select2Id);
      this.data = data;
      this.setupEventListeners();
      this.populateDropdowns();
    }
  
    /**
     * Populates provider dropdowns with available options
     * @private
     */
    populateDropdowns() {
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
  
    /**
     * Generates comparison table for selected providers
     * @private
     */
    generateCompareTable() {
      const provider1 = this.select1.value;
      const provider2 = this.select2.value;
  
      if (!provider1 || !provider2) return;
  
      const tableHTML = `
        <button id="close-compare" title="Close Comparison">X</button>
        <table id="compare-table">
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
  
      this.container.innerHTML = tableHTML;
      this.container.style.display = 'block';
      this.setupCloseButton();
    }
  
    /**
     * Sets up event listeners for comparison functionality
     * @private
     */
    setupEventListeners() {
      [this.select1, this.select2].forEach(select => {
        select?.addEventListener('change', () => this.generateCompareTable());
      });
    }
  
    /**
     * Sets up close button functionality
     * @private
     */
    setupCloseButton() {
      document.getElementById('close-compare')?.addEventListener('click', () => {
        this.container.style.display = 'none';
      });
    }
  }
  
  // Class to handle pricing table generation
  class PricingManager {
    /**
     * @param {string} containerId - ID of the pricing section container
     */
    constructor(containerId) {
      this.container = document.getElementById(containerId);
    }
  
    /**
     * Generates pricing table from provided data
     * @param {Object} data - Pricing data object
     */
    generatePricingTable(data) {
      if (!data?.plans?.length) {
        this.container.innerHTML = '<p>Error: Invalid pricing data structure.</p>';
        return;
      }
  
      const services = Object.keys(data.plans[0]).filter(key => key !== 'name');
      const tableHTML = `
        <table>
          <thead>
            <tr>
              <th>Plans</th>
              ${services.map(service => `<th>${service}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${data.plans.map(plan => `
              <tr class="pricing-tb">
                <td>${plan.name}</td>
                ${services.map(service => `<td>${plan[service]}</td>`).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
  
      this.container.innerHTML = tableHTML;
    }
  }
  
  // Main application initialization
  document.addEventListener('DOMContentLoaded', async () => {
    // Initialize table managers
    const fileHostsTable = new TableManager(
      'file-hosts-table-container',
      'host-search-input',
      'clear-host-search'
    );
    
    const adultHostsTable = new TableManager(
      'adult-hosts-table-container',
      'adult-host-search-input',
      'clear-adult-host-search'
    );
    
    const pricingManager = new PricingManager('pricing');
  
    try {
      // Fetch all required data concurrently
      const [fileHostsData, adultHostsData, pricingData] = await Promise.all([
        fetch('./json/file-hosts.json').then(res => res.json()),
        fetch('./json/adult-hosts.json').then(res => res.json()),
        fetch('./json/pricing.json').then(res => res.json())
      ]);
  
      // Generate tables and initialize comparison
      fileHostsTable.generateTable(fileHostsData);
      adultHostsTable.generateTable(adultHostsData);
      pricingManager.generatePricingTable(pricingData);
  
      // Initialize comparison manager
      new ComparisonManager(
        'compare-table-container',
        'provider1',
        'provider2',
        fileHostsData
      );
  
    } catch (error) {
      console.error('Error initializing application:', error);
      const errorMessage = '<p>Error loading data. Please try again later.</p>';
      fileHostsTable.container.innerHTML = errorMessage;
      adultHostsTable.container.innerHTML = errorMessage;
      pricingManager.container.innerHTML = errorMessage;
    }
  });