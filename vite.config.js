import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { DEFAULT_TARGETS, optimizeAllHosts, optimizeHostsFile } from './scripts/optimize-json.ts';

const HTML_COMMENT_RE = /<!--[\s\S]*?-->/g;
const JSON_LD_SCRIPT_RE = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
const LEADING_INDENT_RE = /^[ \t]+/gm;
const BLANK_LINES_RE = /\n{2,}/g;
const ENTRY_SCRIPT_RE = /<script type="module"[^>]*src="([^"]+)"[^>]*>/;
const FONT_PRELOAD_RE = /<link rel="preload" as="font"[^>]*>/;
const CROSSORIGIN_RE = /\bcrossorigin\b/;
const STYLE_CLOSE_RE = /<\/style/i;
const APP_STYLES_RE = /<meta name="app-styles"[^>]*>/;

/** Remove the tag containing `needle` without building a per-file RegExp. */
function removeTagContaining(html, needle) {
  const needleAt = html.indexOf(needle);
  if (needleAt === -1) return html;
  const start = html.lastIndexOf('<', needleAt);
  const end = html.indexOf('>', needleAt);
  if (start === -1 || end === -1) return html;
  if (html.indexOf('>', start) < needleAt) return html;
  return html.slice(0, start) + html.slice(end + 1);
}

/**
 * Vite plugin that:
 * 1. Keeps `src/json/*-optimized.json` synchronized with `data/*.json` on
 *    both `vite dev` and `vite build` (with HMR on source JSON edits).
 * 2. Compacts inline JSON-LD and strips HTML comments/indentation in production builds.
 * 3. Inlines the built stylesheet into <head> so first paint needs no
 *    render-blocking extra request.
 * 4. Emits a lightweight, self-contained `dist/sw.js` keyed by the build's
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
        .replace(HTML_COMMENT_RE, '')
        .replace(
          JSON_LD_SCRIPT_RE,
          (_, json) =>
            `<script type="application/ld+json">${JSON.stringify(JSON.parse(json))}</script>`
        )
        .replace(LEADING_INDENT_RE, '')
        .replace(BLANK_LINES_RE, '\n')
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
const STATIC_EXT_RE=/\\.(?:png|jpg|jpeg|gif|webp|svg|ico|woff2?|ttf|otf)$/i;
const FALLBACK_ICON_RE=/\\.(?:png|jpg|jpeg|gif|webp|svg|ico)$/i;
function respondWithHtml(e,req){
  e.respondWith((async()=>{
    const cachePromise=caches.open(HTML_CACHE);
    try{
      const ctrl=new AbortController();
      const timer=setTimeout(()=>ctrl.abort(),3000);
      const res=await fetch(req,{signal:ctrl.signal});
      clearTimeout(timer);
      if(res&&res.ok)(await cachePromise).put(req,res.clone());
      return res;
    }catch{
      const cache=await cachePromise;
      return (await cache.match(req))||(await cache.match('/'))||Response.error();
    }
  })());
}
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
  if(req.mode==='navigate'){
    respondWithHtml(e,req);
    return;
  }
  const url=new URL(req.url);
  if(url.pathname.endsWith('.html')){
    respondWithHtml(e,req);
    return;
  }
  const isStatic=
    url.pathname.startsWith('/assets/')||
    url.pathname.startsWith('/fonts/')||
    STATIC_EXT_RE.test(url.pathname);
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
        if(FALLBACK_ICON_RE.test(url.pathname)){
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

  const entry = html.match(ENTRY_SCRIPT_RE);
  if (!entry || !FONT_PRELOAD_RE.test(html)) return;

  // Credentials mode must match the script tag or the preload is discarded and
  // the module is fetched twice.
  const crossorigin = CROSSORIGIN_RE.test(entry[0]) ? ' crossorigin' : '';
  const link = `<link rel="modulepreload"${crossorigin} href="${entry[1]}">`;

  writeFileSync(htmlPath, html.replace(FONT_PRELOAD_RE, (match) => match + link), 'utf8');
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
    const hrefNeedle = `href="/assets/css/${file}"`;
    if (!html.includes(hrefNeedle)) continue;

    const css = readFileSync(path.join(cssDir, file), 'utf8');
    if (STYLE_CLOSE_RE.test(css)) {
      // Would terminate the <style> element early and corrupt the page.
      throw new Error(
        `[inline-css] ${file} contains "</style", which cannot be inlined safely.`
      );
    }

    html = removeTagContaining(html, hrefNeedle);

    // Inline at the `<meta name="app-styles">` marker, which sits immediately
    // after the font preload and entry script. Anchoring there keeps those two
    // requests at the very top of the document — if the sheet went in first,
    // the parser would have to consume ~36 KB of CSS before it ever saw them.
    if (!APP_STYLES_RE.test(html)) {
      throw new Error(
        '[inline-css] could not find <meta name="app-styles"> to inline the stylesheet into.'
      );
    }
    html = html.replace(APP_STYLES_RE, `<style>${css}</style>`);

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
