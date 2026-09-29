import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { createHash } from 'node:crypto';
import { existsSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { DEFAULT_TARGETS, optimizeAllHosts, optimizeHostsFile } from './scripts/optimize-json.ts';

/**
 * Vite plugin that:
 * 1. Keeps `src/json/*-optimized.json` synchronized with `data/*.json` on
 *    both `vite dev` and `vite build` (with HMR on source JSON edits).
 * 2. Compacts inline JSON-LD and strips HTML comments/indentation in production builds.
 * 3. Emits a lightweight, self-contained `dist/sw.js` keyed by the build's
 *    content hash (replacing the external `workbox-cli` build step and 16 KB workbox runtime).
 */
function buildPipelinePlugin() {
  const inputToOutput = new Map(
    DEFAULT_TARGETS.map(({ input, output }) => [path.resolve(input), path.resolve(output)])
  );
  let isBuild = false;

  return {
    name: 'debrid-build-pipeline',
    configResolved(config) {
      isBuild = config.command === 'build';
    },
    buildStart() {
      optimizeAllHosts();
    },
    configureServer(server) {
      for (const inputPath of inputToOutput.keys()) {
        server.watcher.add(inputPath);
      }
      server.watcher.on('change', (changedPath) => {
        const resolved = path.resolve(changedPath);
        const outputPath = inputToOutput.get(resolved);
        if (outputPath) {
          optimizeHostsFile(resolved, outputPath);
        }
      });
    },
    transformIndexHtml(html) {
      if (!isBuild) return html;
      return html
        .replace(/<!--[\s\S]*?-->/g, '')
        .replace(
          /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
          (_, json) =>
            `<script type="application/ld+json">${JSON.stringify(JSON.parse(json))}</script>`
        )
        .replace(/^[ \t]+/gm, '')
        .replace(/\n{2,}/g, '\n')
        .trim();
    },
    closeBundle() {
      if (!isBuild) return;
      const distDir = path.resolve(process.cwd(), 'dist');
      if (!existsSync(distDir)) return;

      const hash = createHash('sha256');
      for (const sub of ['assets/js', 'assets/css']) {
        const dir = path.join(distDir, sub);
        if (existsSync(dir)) {
          for (const f of readdirSync(dir).sort()) {
            hash.update(f);
          }
        }
      }
      const version = hash.digest('hex').slice(0, 8);
      const swCode = `const CACHE_VERSION='debrid-v-${version}';
const STATIC_CACHE=CACHE_VERSION+'-static';
const HTML_CACHE=CACHE_VERSION+'-html';
self.addEventListener('install',()=>{self.skipWaiting()});
self.addEventListener('activate',e=>{
  e.waitUntil(
    caches.keys().then(keys=>Promise.all(
      keys.filter(k=>!k.startsWith(CACHE_VERSION)).map(k=>caches.delete(k))
    )).then(()=>self.clients.claim())
  );
});
self.addEventListener('fetch',e=>{
  const req=e.request;
  if(req.method!=='GET')return;
  const url=new URL(req.url);
  if(req.mode==='navigate'||url.pathname.endsWith('.html')){
    e.respondWith((async()=>{
      const cache=await caches.open(HTML_CACHE);
      try{
        const ctrl=new AbortController();
        const timer=setTimeout(()=>ctrl.abort(),3000);
        const res=await fetch(req,{signal:ctrl.signal});
        clearTimeout(timer);
        if(res&&res.ok)cache.put(req,res.clone());
        return res;
      }catch{
        return (await cache.match(req))||(await cache.match('/'))||Response.error();
      }
    })());
    return;
  }
  const isStatic=
    url.pathname.startsWith('/assets/')||
    /\\.(?:png|jpg|jpeg|gif|webp|svg|ico)$/i.test(url.pathname)||
    /^https:\\/\\/fonts\\.(?:googleapis|gstatic)\\.com/.test(url.href);
  if(isStatic){
    e.respondWith((async()=>{
      const cache=await caches.open(STATIC_CACHE);
      const cached=await cache.match(req);
      if(cached)return cached;
      try{
        const res=await fetch(req);
        if(res&&(res.ok||res.type==='opaque'))cache.put(req,res.clone());
        return res;
      }catch{
        if(/\\.(?:png|jpg|jpeg|gif|webp|svg|ico)$/i.test(url.pathname)){
          return (await cache.match('/favicon.svg'))||Response.error();
        }
        return Response.error();
      }
    })());
  }
});
`;
      writeFileSync(path.join(distDir, 'sw.js'), swCode, 'utf8');
    },
  };
}

export default defineConfig({
  root: '.',
  base: '/',
  publicDir: 'public',

  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), './src'),
    },
  },

  plugins: [buildPipelinePlugin(), tailwindcss()],

  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    cssCodeSplit: true,
    target: 'es2020',
    modulePreload: false,
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
      },
    },
  },

  server: {
    open: false,
    host: true,
    allowedHosts: true,
  },
});
