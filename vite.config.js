import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { DEFAULT_TARGETS, optimizeAllHosts, optimizeHostsFile } from './scripts/optimize-json.ts';
import { syncAllFonts } from './scripts/sync-fonts.ts';

/**
 * Vite plugin that:
 * 1. Keeps `src/json/*-optimized.json` synchronized with `data/*.json` on
 *    both `vite dev` and `vite build` (with HMR on source JSON edits).
 * 2. Copies the self-hosted Inter woff2 subsets into `public/fonts/`.
 * 3. Compacts inline JSON-LD and strips HTML comments/indentation in production builds.
 * 4. Inlines the built stylesheet into <head> so first paint needs no
 *    render-blocking extra request.
 * 5. Emits a lightweight, self-contained `dist/sw.js` keyed by the build's
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
      syncAllFonts({ quiet: !isBuild });
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
    url.pathname.startsWith('/fonts/')||
    /\\.(?:png|jpg|jpeg|gif|webp|svg|ico|woff2?|ttf|otf)$/i.test(url.pathname);
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

      preloadEntryScript(distDir);
      inlineStylesheets(distDir);
    },
  };
}

/**
 * Add a `<link rel="modulepreload">` for the entry chunk at the very top of
 * `<head>`.
 *
 * Vite's HTML transform relocates the built `<script type="module">` to the end
 * of `<head>`, so the bundle is not discovered until the parser has consumed the
 * whole head — which, once the stylesheet is inlined, is ~48 KB in. A preload
 * next to the font hint starts the fetch (and parse/compile) immediately; the
 * script tag later in the head then reuses it, so it is still fetched once.
 */
function preloadEntryScript(distDir) {
  const htmlPath = path.join(distDir, 'index.html');
  if (!existsSync(htmlPath)) return;

  const html = readFileSync(htmlPath, 'utf8');
  if (html.includes('rel="modulepreload"')) return;

  const entry = html.match(/<script type="module"[^>]*src="([^"]+)"[^>]*>/);
  const anchor = /<link rel="preload" as="font"[^>]*>/;
  if (!entry || !anchor.test(html)) return;

  // Credentials mode must match the script tag or the preload is discarded and
  // the module is fetched twice.
  const crossorigin = /\bcrossorigin\b/.test(entry[0]) ? ' crossorigin' : '';
  const link = `<link rel="modulepreload"${crossorigin} href="${entry[1]}">`;

  writeFileSync(htmlPath, html.replace(anchor, (match) => match + link), 'utf8');
  console.log(`[modulepreload] ${entry[1]} → preloaded from the top of <head>`);
}

/**
 * Inline every emitted stylesheet into `<head>` and drop the standalone files.
 *
 * The app ships a single ~36 KB (≈7 KB gzipped) stylesheet. Previously Vite
 * emitted it as `assets/css/index-*.css` referenced from the very end of the
 * 46 KB HTML document, so the browser only discovered a *render-blocking*
 * stylesheet after parsing the entire page — an extra round trip sitting
 * directly in front of first paint.
 *
 * Inlining costs less than it saves: brotli/gzip compresses the CSS better when
 * it shares a stream with the HTML, and the whole critical path collapses to a
 * single request. This is the "inline critical CSS" technique from tools like
 * `critical`, without needing a headless browser at build time — the stylesheet
 * is already small enough that splitting critical/non-critical would only add a
 * second request for the remainder.
 */
function inlineStylesheets(distDir) {
  const htmlPath = path.join(distDir, 'index.html');
  const cssDir = path.join(distDir, 'assets', 'css');
  if (!existsSync(htmlPath) || !existsSync(cssDir)) return;

  let html = readFileSync(htmlPath, 'utf8');

  for (const file of readdirSync(cssDir).filter((f) => f.endsWith('.css')).sort()) {
    const href = `/assets/css/${file}`;
    const linkPattern = new RegExp(`<link[^>]*href="${href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*>`);
    if (!linkPattern.test(html)) continue;

    const css = readFileSync(path.join(cssDir, file), 'utf8');
    if (/<\/style/i.test(css)) {
      // Would terminate the <style> element early and corrupt the page.
      throw new Error(
        `[inline-css] ${file} contains "</style", which cannot be inlined safely.`
      );
    }

    html = html.replace(linkPattern, '');

    // Inline at the `<meta name="app-styles">` marker, which sits immediately
    // after the font preload and entry script. Anchoring there keeps those two
    // requests at the very top of the document — if the sheet went in first,
    // the parser would have to consume ~36 KB of CSS before it ever saw them.
    const anchor = /<meta name="app-styles"[^>]*>/;
    if (!anchor.test(html)) {
      throw new Error(
        '[inline-css] could not find <meta name="app-styles"> to inline the stylesheet into.'
      );
    }
    html = html.replace(anchor, `<style>${css}</style>`);

    rmSync(path.join(cssDir, file));
    console.log(
      `[inline-css] ${file} → inlined into index.html (${css.length.toLocaleString()}B raw)`
    );
  }

  writeFileSync(htmlPath, html, 'utf8');
  if (existsSync(cssDir) && readdirSync(cssDir).length === 0) {
    rmSync(cssDir, { recursive: true });
  }
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
