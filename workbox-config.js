module.exports = {
  // Specify files to precache
  globDirectory: "dist/",
  globPatterns: [
    "**/*.{html,css,js,json,svg,ico}",
    "json/*.json"
  ],
  
  runtimeCaching: [
    // Cache JSON files with a stale-while-revalidate strategy
    {
      urlPattern: /\.json$/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'json-cache',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 60 * 60 * 24 // 24 hours
        }
      }
    },

    // Cache static assets
    {
      urlPattern: /\.(?:png|css|svg|ico)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'static-assets',
        expiration: {
          maxEntries: 20,
          maxAgeSeconds: 60 * 60 * 24 * 7 // 7 days
        }
      }
    },

    // Cache HTML files 
    {
      urlPattern: /\.html$/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'html-cache',
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 60 * 60 * 24 // 24 hours
        }
      }
    }
  ],

  // Output path for service worker
  swDest: "dist/sw.js",
  
  // Don't generate sourcemaps
  sourcemap: false,

  // Skip waiting on install
  skipWaiting: true,
  
  // Claim clients immediately 
  clientsClaim: true
};