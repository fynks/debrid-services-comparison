import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
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

  plugins: [react(), tailwindcss()],

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
            {
              name: 'react-vendor',
              test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
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
