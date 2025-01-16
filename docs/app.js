 document.addEventListener('DOMContentLoaded', async () => {
            const fileHostsTableContainer = document.getElementById('file-hosts-table-container');
            const hostSearchInput = document.getElementById('host-search-input');
            const clearHostSearchIcon = document.getElementById('clear-host-search');
            const provider1Select = document.getElementById('provider1');
            const provider2Select = document.getElementById('provider2');
            const compareTableContainer = document.getElementById('compare-table-container');
            const closeCompareButton = document.getElementById('close-compare');

            const adultHostsTableContainer = document.getElementById('adult-hosts-table-container');
            const adultHostSearchInput = document.getElementById('adult-host-search-input');
            const clearAdultHostSearchIcon = document.getElementById('clear-adult-host-search');

            // Initially hide the comparison table container
            compareTableContainer.style.display = 'none';

            try {
                const [fileHostsResponse, adultHostsResponse] = await Promise.all([
                    fetch('./json/file-hosts.json'),
                    fetch('./json/adult-hosts.json')
                ]);
                const fileHostsData = await fileHostsResponse.json();
                const adultHostsData = await adultHostsResponse.json();

                // Function to generate a table
                const generateTable = (data, tableId) => {
                    const container = document.getElementById(tableId);
                    let tableHTML = `<table id="${tableId.replace('-container', '')}"><thead><tr><th>Service Name</th>`;
                    const providers = Object.keys(data[Object.keys(data)[0]]);
                    providers.forEach(provider => {
                        tableHTML += `<th>${provider}</th>`;
                    });
                    tableHTML += '</tr></thead><tbody>';

                    for (const host in data) {
                        tableHTML += `<tr><td>${host}</td>`;
                        providers.forEach(provider => {
                            const status = data[host][provider];
                            const icon = status === 'yes' ? '✅' : '❌';
                            tableHTML += `<td style="text-align: center;">${icon}</td>`;
                        });
                        tableHTML += '</tr>';
                    }
                    tableHTML += '</tbody></table>';
                    container.innerHTML = tableHTML;
                };

                // Function to populate provider dropdowns
                const populateProviderDropdowns = (data) => {
                    const providers = Object.keys(data[Object.keys(data)[0]]);
                    providers.forEach(provider => {
                        const option1 = document.createElement('option');
                        option1.value = provider;
                        option1.textContent = provider;
                        provider1Select.appendChild(option1);

                        const option2 = document.createElement('option');
                        option2.value = provider;
                        option2.textContent = provider;
                        provider2Select.appendChild(option2);
                    });
                };

                // Function to generate the comparison table
                const generateCompareTable = (data, provider1, provider2) => {
                    let tableHTML = '<table id="compare-table"><thead><tr><th>Service Name</th><th>' + provider1 + '</th><th>' + provider2 + '</th></tr></thead><tbody>';

                    for (const host in data) {
                        const status1 = data[host][provider1];
                        const status2 = data[host][provider2];
                        const icon1 = status1 === 'yes' ? '✅' : '❌';
                        const icon2 = status2 === 'yes' ? '✅' : '❌';
                        tableHTML += `<tr><td>${host}</td><td>${icon1}</td><td>${icon2}</td></tr>`;
                    }

                    tableHTML += '</tbody></table>';
                    compareTableContainer.innerHTML = `<button id="close-compare" title="Close Comparison">X</button>` + tableHTML;
                    // Re-add the event listener for the close button after it's generated
                    document.getElementById('close-compare').addEventListener('click', () => {
                        compareTableContainer.style.display = 'none';
                    });
                    compareTableContainer.style.display = 'block';
                };

                // Function for search functionality with clear icon visibility
                const setupSearch = (searchInput, clearIcon, tableContainerId) => {
                    searchInput.addEventListener('input', () => {
                        const searchTerm = searchInput.value.toLowerCase();
                        const rows = document.querySelectorAll(`#${tableContainerId} table tbody tr`);
                        if (!rows) return;

                        // Show/hide clear icon based on input
                        clearIcon.style.display = searchTerm ? 'block' : 'none';

                        rows.forEach(row => {
                            const serviceName = row.querySelector('td:first-child').textContent.toLowerCase();
                            row.style.display = serviceName.includes(searchTerm) ? '' : 'none';
                        });
                    });

                    clearIcon.addEventListener('click', () => {
                        searchInput.value = '';
                        clearIcon.style.display = 'none';
                        // Trigger the input event to refresh the table
                        searchInput.dispatchEvent(new Event('input'));
                    });
                };

                // Initial table generation and dropdown population
                generateTable(fileHostsData, 'file-hosts-table-container');
                generateTable(adultHostsData, 'adult-hosts-table-container');
                populateProviderDropdowns(fileHostsData);

                // Setup search for both tables
                setupSearch(hostSearchInput, clearHostSearchIcon, 'file-hosts-table-container');
                setupSearch(adultHostSearchInput, clearAdultHostSearchIcon, 'adult-hosts-table-container');

                // Comparison functionality
                const handleCompare = () => {
                    const provider1 = provider1Select.value;
                    const provider2 = provider2Select.value;
                    if (provider1 && provider2) {
                        generateCompareTable(fileHostsData, provider1, provider2);
                    }
                };

                provider1Select.addEventListener('change', handleCompare);
                provider2Select.addEventListener('change', handleCompare);

                // Close comparison functionality
                closeCompareButton.addEventListener('click', () => {
                    compareTableContainer.style.display = 'none';
                });

            } catch (error) {
                console.error('Error fetching or parsing JSON:', error);
                fileHostsTableContainer.innerHTML = '<p>Error loading file hosts data.</p>';
                adultHostsTableContainer.innerHTML = '<p>Error loading adult hosts data.</p>';
            }
        });