import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  root: '.',
  base: '/',
  publicDir: 'public',

  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), './src'),
    },
  },

  plugins: [react()],

  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    cssCodeSplit: true,
    target: 'es2019',
    minify: 'esbuild',
    rollupOptions: {
      output: {
        // Keep JS bundle names similar to old build for caching predictability
        entryFileNames: 'assets/js/[name]-[hash].js',
        chunkFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: ({ name }) => {
          if (name?.endsWith('.css')) {
            return 'assets/css/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
        manualChunks: {
          // Split React into its own chunk for better caching across pages
          'react-vendor': ['react', 'react-dom'],
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
