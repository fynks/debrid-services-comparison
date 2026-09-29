// Build-time font sync.
//
// Copies the Inter variable font subsets that this site actually uses out of
// `@fontsource-variable/inter` and into `public/fonts/`, so the woff2 files are
// served from our own origin instead of `fonts.gstatic.com`.
//
// Why: the previous setup pulled a stylesheet from `fonts.googleapis.com`, which
// then pointed at `fonts.gstatic.com`. That is two extra origins and a strictly
// serial chain (HTML → googleapis CSS → gstatic woff2) that had to finish before
// the hero text could be painted in Inter. Self-hosting plus a `<link
// rel="preload">` collapses it into the initial HTML response.
//
// Glyph coverage is unchanged: the `latin` / `latin-ext` unicode-ranges declared
// in `src/styles/globals.css` are copied verbatim from the fontsource `@font-face`
// rules, which are themselves what the Google Fonts CSS API serves.
//
// Idempotent writes: only touches output files when content changes.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, resolve } from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, '..');

const require = createRequire(import.meta.url);

/** fontsource package the woff2 subsets are read from. */
const FONT_PACKAGE = '@fontsource-variable/inter';

export interface FontTarget {
  /** File inside the fontsource package's `files/` directory. */
  source: string;
  /** File name written under `public/fonts/`. */
  output: string;
}

/**
 * Only the two Latin subsets ship. The rest of the fontsource subsets
 * (cyrillic, greek, vietnamese, …) are never matched by this site's content,
 * and the browser only ever downloaded `latin` from Google Fonts anyway.
 */
export const DEFAULT_FONT_TARGETS: FontTarget[] = [
  { source: 'inter-latin-wght-normal.woff2', output: 'inter-latin.woff2' },
  { source: 'inter-latin-ext-wght-normal.woff2', output: 'inter-latin-ext.woff2' },
];

export interface SyncFontResult {
  outputPath: string;
  bytes: number;
  updated: boolean;
}

export function fontsDir(): string {
  return resolve(ROOT, 'public/fonts');
}

/** Absolute path of `name` inside the installed fontsource package. */
function packageFilePath(name: string): string {
  // Resolve through the package entry point so this works with both npm's
  // flat layout and pnpm's symlinked store.
  const entry = require.resolve(`${FONT_PACKAGE}/package.json`);
  return resolve(dirname(entry), 'files', name);
}

export function syncFont(
  target: FontTarget,
  { quiet = false }: { quiet?: boolean } = {}
): SyncFontResult {
  const from = packageFilePath(target.source);
  if (!existsSync(from)) {
    throw new Error(
      `Missing font source ${from}. Run \`npm install\` so ${FONT_PACKAGE} is present.`
    );
  }

  const outDir = fontsDir();
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

  const to = resolve(outDir, target.output);
  const data = readFileSync(from);

  const existing = existsSync(to) ? readFileSync(to) : null;
  const updated = !existing || !existing.equals(data);
  if (updated) writeFileSync(to, data);

  if (!quiet) {
    const status = updated ? 'wrote' : 'up-to-date';
    console.log(
      `[sync-fonts] ${basename(from)} → fonts/${target.output} (${status}): ` +
        `${data.length.toLocaleString()}B`
    );
  }

  return { outputPath: to, bytes: data.length, updated };
}

export function syncAllFonts(
  options: { quiet?: boolean } = {},
  targets: FontTarget[] = DEFAULT_FONT_TARGETS
): SyncFontResult[] {
  return targets.map((target) => syncFont(target, options));
}

// Run as CLI when executed directly.
const isDirectRun = process.argv[1] && resolve(process.argv[1]) === __filename;

if (isDirectRun) {
  syncAllFonts();
}
