import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

// We use Preact instead of React. preact/compat is a thin compatibility
// shim that satisfies the react / react-dom module shape, so every
// library we depend on (Radix, lucide-react, cmdk, class-variance-authority,
// tailwind-merge, cmdk) keeps working unchanged. The runtime cost of
// preact + preact/compat is roughly 5 kB gzipped, vs ~45 kB for React +
// ReactDOM + scheduler + jsx-runtime.
export default defineConfig({
  root: '.',
  base: '/',
  publicDir: 'public',

  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), './src'),
      react: 'preact/compat',
      'react-dom': 'preact/compat',
      'react-dom/test-utils': 'preact/test-utils',
      'react/jsx-runtime': 'preact/jsx-runtime',
    },
  },

  plugins: [preact(), tailwindcss()],

  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    cssCodeSplit: true,
    target: 'es2020',
    rolldownOptions: {
      output: {
        entryFileNames: 'assets/js/[name]-[hash].js',
        chunkFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: ({ name }) => {
          if (name?.endsWith('.css')) {
            return 'assets/css/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
        codeSplitting: {
          groups: [
            // Preact runtime + compat + hooks — replaces the previous
            // react-vendor chunk (which held react, react-dom, scheduler).
            {
              name: 'preact-vendor',
              test: /[\\/]node_modules[\\/](preact|preact[\\/][a-z-]+)[\\/]/,
            },
            {
              name: 'radix-vendor',
              test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
            },
            {
              name: 'icons-vendor',
              test: /[\\/]node_modules[\\/](lucide-react|cmdk|class-variance-authority|clsx|tailwind-merge|tw-animate-css)[\\/]/,
            },
          ],
        },
      },
    },
  },

  server: {
    open: false,
    host: true,
    allowedHosts: true,
  },
});