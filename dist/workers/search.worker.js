/**
 * Search Worker - Offloads heavy search/filter operations from main thread
 * Handles fuzzy matching, hostname extraction, and data filtering
 */

// Normalize hostname for fuzzy matching
const normalizeHostname = (hostname) => {
  if (!hostname) return '';
  
  return hostname
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '') // Remove non-alphanumeric
    .replace(/^(www|ftp|cdn|dl|download|file|files|upload|uploads)\d*/g, '') // Remove common prefixes
    .replace(/\d+$/g, ''); // Remove trailing numbers
};

// Levenshtein distance algorithm
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

// Calculate similarity score between two strings
const calculateSimilarity = (str1, str2) => {
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
};

// Extract hostname from URL
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

// Perform search operation
const performSearch = (data, searchTerm) => {
  const isURL = extractHostnameFromURL(searchTerm);
  const term = isURL || searchTerm.toLowerCase();
  
  if (isURL) {
    // Use fuzzy matching for URL-based searches
    const matches = [];
    
    for (const [host, hostData] of Object.entries(data)) {
      const similarity = calculateSimilarity(host, term);
      
      // Include if similarity is above threshold (60%)
      if (similarity >= 60) {
        matches.push({
          host,
          hostData,
          similarity
        });
      }
    }
    
    // Sort by similarity score (highest first)
    matches.sort((a, b) => b.similarity - a.similarity);
    
    // Convert back to object
    return {
      filtered: Object.fromEntries(
        matches.map(({ host, hostData }) => [host, hostData])
      ),
      isURLSearch: true,
      extractedHostname: term
    };
  } else {
    // Regular text search (exact substring matching)
    return {
      filtered: Object.fromEntries(
        Object.entries(data).filter(([host]) =>
          host.toLowerCase().includes(term)
        )
      ),
      isURLSearch: false
    };
  }
};

// Filter data based on criteria
const filterData = (data, filters) => {
  return Object.fromEntries(
    Object.entries(data).filter(([host, hostData]) => {
      return Object.entries(filters).every(([key, value]) => {
        if (value === null || value === undefined) return true;
        return hostData[key] === value;
      });
    })
  );
};

// Sort data
const sortData = (data, column, direction) => {
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
};

// Message handler
self.addEventListener('message', (event) => {
  const { action, data, ...params } = event.data;
  
  try {
    let result;
    
    switch (action) {
      case 'search':
        result = performSearch(data, params.term);
        break;
        
      case 'filter':
        result = filterData(data, params.filters);
        break;
        
      case 'sort':
        result = sortData(data, params.column, params.direction);
        break;
        
      case 'calculate-similarity':
        result = calculateSimilarity(params.str1, params.str2);
        break;
        
      default:
        throw new Error(`Unknown action: ${action}`);
    }
    
    self.postMessage({
      success: true,
      action,
      result
    });
  } catch (error) {
    self.postMessage({
      success: false,
      action,
      error: error.message
    });
  }
});
