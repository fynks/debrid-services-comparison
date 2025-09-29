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
    }
  }
}
