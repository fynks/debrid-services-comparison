module.exports = {
  // Base directory - still needed for SW generation
  globDirectory: "dist/",
  // Explicitly disable precaching for lean SW install
  globPatterns: [],
  
  // Enhanced runtime caching strategies
  runtimeCaching: [
    // 1. Navigation routes (for SPAs) - Network first with offline fallback
    {
      urlPattern: ({ request }) => request.mode === 'navigate',
      handler: 'NetworkFirst',
      options: {
        cacheName: 'navigation-cache',
        networkTimeoutSeconds: 3, // Fallback to cache after 3s
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 24 * 60 * 60 // 24 hours
        },
        cacheableResponse: {
          statuses: [0, 200] // Cache successful responses
        }
      }
    },

    // 2. HTML pages - Network first for fresh content
    {
      urlPattern: /\.html$/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'html-cache',
        networkTimeoutSeconds: 2,
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 12 * 60 * 60 // 12 hours
        }
      }
    },

    // 3. JS/CSS - StaleWhileRevalidate with versioning awareness
    {
      urlPattern: /\.(?:js|css)$/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-resources',
        expiration: {
          maxEntries: 60,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
          purgeOnQuotaError: true // Auto-cleanup when storage is full
        },
        cacheableResponse: {
          statuses: [0, 200]
        }
      }
    },

    // 4. Images - CacheFirst for performance
    {
      urlPattern: /\.(?:png|jpg|jpeg|gif|webp|svg|ico)$/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'image-cache',
        expiration: {
          maxEntries: 200, // More space for images
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
          purgeOnQuotaError: true
        },
        cacheableResponse: {
          statuses: [0, 200]
        },
        plugins: [
          {
            handlerDidError: async () => {
              // Return fallback image on error (use an existing icon)
              return caches.match('/favicon.svg');
            }
          }
        ]
      }
    },


    // 5. JSON responses (local and API) - NetworkFirst with timeout
    {
      urlPattern: ({url}) => /\.json$/i.test(url.pathname) || /\/api\//i.test(url.pathname) || /^https:\/\/api\./i.test(url.href),
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
        networkTimeoutSeconds: 5,
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 5 * 60 // 5 minutes for fresh API data
        },
        cacheableResponse: { statuses: [0, 200] },
        matchOptions: {
          ignoreSearch: false // Consider query params
        }
      }
    },

    // 8. Google Fonts - CacheFirst
    {
      urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts',
        expiration: {
          maxEntries: 30,
          maxAgeSeconds: 365 * 24 * 60 * 60 // 1 year
        },
        cacheableResponse: {
          statuses: [0, 200]
        }
      }
    }
  ],

  // Service worker output
  swDest: "dist/sw.js",
  
  // Disable sourcemaps in production
  sourcemap: false,
  
  // Immediate activation
  skipWaiting: true,
  clientsClaim: true,
  
  // Additional improvements
  cleanupOutdatedCaches: true, // Remove old caches automatically
  navigateFallback: null, // No fallback since no precaching
  
  // Ignore specific query parameters
  ignoreURLParametersMatching: [
    /^utm_/, // Marketing params
    /^fbclid$/ // Facebook click ID
  ],
  
  // Maximum file size to cache (15MB)
  maximumFileSizeToCacheInBytes: 15 * 1024 * 1024,
  
  // Mode for generated SW
  mode: 'production'
};