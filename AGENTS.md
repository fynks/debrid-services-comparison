# debrid-services-comparison

Static, backend-free Vite site comparing debrid services. `index.html` is the shell; `src/main.js` fills its `[data-mount]` slots with components and wires up interactions.

## Commands

- `bun install`
- `bun run dev`: local dev server
- `bun test`: Bun's built-in test runner
- `bun run verify`: typecheck + tests + build; run before any PR
- `bun run build` / `bun run preview`: production build and preview

Bun is the package manager. Use `bun run <script>` for anything in `package.json`. Toolchain versions are pinned in `.bun-version` (1.4.4) and `.nvmrc` / `.node-version` (26).

## Where things live

- `index.html`: static copy, SEO metadata, inline `#i-*` SVG sprite, `[data-mount]` slots.
- `src/main.js`: mount order matters. Counts and components mount before scroll spy measures offsets.
- `src/data/*.ts`: typed source for service metadata, pricing, limits, policies, resources (`src/types/data.ts`).
- `data/*.json` → `scripts/optimize-json.ts` → `src/json/*-optimized.json`. Edit the raw `data/` files only; the optimized files are generated before `typecheck`.
- `src/components/`: tables and cards; `src/lib/`: theme, fuzzy search, nav, scroll spy, hash links, service worker.
- `src/styles/globals.css`: Tailwind 4 + theme tokens; theme flips via `data-theme` on `<html>`.
- `README.md`, `Adult-hosts.md`: hand-maintained tables. Keep them in sync with `src/data/` and `data/`, and update the "Last updated" line.
- `dist/`: generated output, never edit directly.

## Conventions

- Stay factual and neutral. Back every price, host, or policy change with an official source; prices change often, so recheck before editing.
- Report user-reported problems as a `role="alert"` warning linking to the GitHub issue (see the Deepbrid/issue #43 warning), not as established fact.
- Reuse the existing `#i-*` icons and `warning` / `info` / `primary` token classes instead of inventing new styling.
- Adding or renaming a service means updating `src/data/services.ts` (`SERVICE_ORDER`), the raw host JSON, the pricing/limits/policy data, and the README/Adult-hosts tables, then running `bun run verify`.
- Service IDs are canonical strings; the alias map in `optimize-json.ts` handles legacy names from raw data.
