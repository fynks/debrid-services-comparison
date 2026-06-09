import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  base: '/',
  publicDir: 'public',

  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    cssCodeSplit: false,

    rollupOptions: {
      output: {
        entryFileNames: 'js/app-min.[hash].js',
        chunkFileNames: 'js/[name]-min.[hash].js',
        assetFileNames: (assetInfo) => {
          const name = assetInfo.name;
          if (name?.endsWith('.css')) {
            return 'css/styles-min.[hash][extname]';
          }
          return 'assets/[name]-min.[hash][extname]';
        }
      }
    }
  },

  server: {
    open: true,
  }
});
