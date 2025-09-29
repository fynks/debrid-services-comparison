// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import './style.css'

/** @type {import('vitepress').Theme} */
export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // Use default VitePress layout slots
    })
  },
  enhanceApp({ app, router, siteData }) {
    // Performance optimization: Add image loading attributes
    if (typeof window !== 'undefined') {
      let observer = null;
      
      const setupImageOptimization = () => {
        // Clean up existing observer
        if (observer) {
          observer.disconnect();
        }
        
        // Add loading="lazy" to images after mount
        observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === 1) { // Element node
                // Add loading attributes to shields.io images
                const images = node.querySelectorAll?.('img[src*="img.shields.io"], img[src*="shields.io"]') || [];
                images.forEach(img => {
                  if (!img.hasAttribute('loading')) {
                    img.setAttribute('loading', 'eager'); // Keep badges as eager loading
                    img.setAttribute('decoding', 'async');
                  }
                });
                
                // Add loading attributes to other images
                const otherImages = node.querySelectorAll?.('img:not([src*="shields.io"])') || [];
                otherImages.forEach(img => {
                  if (!img.hasAttribute('loading')) {
                    img.setAttribute('loading', 'lazy');
                    img.setAttribute('decoding', 'async');
                  }
                });
              }
            });
          });
        });
        
        if (document.body) {
          observer.observe(document.body, {
            childList: true,
            subtree: true
          });
        }
      };
      
      // Setup on initial load
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupImageOptimization);
      } else {
        setupImageOptimization();
      }
      
      // Clean up observer on route change and setup again
      router.onAfterRouteChanged = () => {
        if (observer) {
          observer.disconnect();
        }
        // Small delay to allow new content to render
        setTimeout(setupImageOptimization, 100);
      };
      
      // Clean up on beforeunload
      window.addEventListener('beforeunload', () => {
        if (observer) {
          observer.disconnect();
        }
      });
      
      // Table enhancements
      const enhanceTables = () => {
        const tables = document.querySelectorAll('.vp-doc table');
        tables.forEach(table => {
          // Wrap tables for horizontal scrolling on mobile
          if (!table.parentElement.classList.contains('table-wrapper')) {
            const wrapper = document.createElement('div');
            wrapper.className = 'table-wrapper';
            wrapper.style.overflowX = 'auto';
            wrapper.style.webkitOverflowScrolling = 'touch';
            table.parentNode.insertBefore(wrapper, table);
            wrapper.appendChild(table);
          }
          
          // Enhance table cells with better styling based on content
          const cells = table.querySelectorAll('td');
          cells.forEach(cell => {
            const content = cell.textContent.trim();
            
            // Style success/failure indicators
            if (content === '✅' || content.toLowerCase().includes('yes')) {
              cell.classList.add('cell-success');
              cell.setAttribute('aria-label', 'Supported');
            } else if (content === '❌' || content.toLowerCase().includes('no')) {
              cell.classList.add('cell-danger');
              cell.setAttribute('aria-label', 'Not supported');
            }
            
            // Style pricing cells
            if (content.includes('€') || content.includes('$')) {
              cell.classList.add('cell-price');
            }
            
            // Style trial/free cells
            if (content.toLowerCase().includes('trial') || content.toLowerCase().includes('free')) {
              cell.classList.add('cell-trial');
            }
          });
        });
      };
      
      // Run table enhancements
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', enhanceTables);
      } else {
        enhanceTables();
      }
      
      // Re-enhance tables on route change
      const originalRouteHandler = router.onAfterRouteChanged;
      router.onAfterRouteChanged = () => {
        if (originalRouteHandler) originalRouteHandler();
        if (observer) {
          observer.disconnect();
        }
        setTimeout(() => {
          setupImageOptimization();
          enhanceTables();
        }, 100);
      };
    }
  }
}
