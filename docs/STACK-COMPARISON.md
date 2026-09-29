# Stack Comparison — Debrid Services Comparison

This document compares the four implementations of the DebridCompare frontend so we can pick the best path forward.

## Bundle size (gzipped, first paint)

| Implementation | HTML | CSS | JS entry | Vendor chunks | **Total** | Bundle topology |
|---|---|---|---|---|---|---|
| Original (vanilla DOM, commit 3c8c29f baseline) | 4.4 KB | 9 KB | 39 KB (1 chunk) | + 80 KB inline | **~130 KB** | 1 HTML + 1 CSS + 2 JS, no code split |
| React + shadcn (commit ecef1b1) | 4.4 KB | 9 KB | 21 KB app | + 9.9 KB react-vendor + 29 KB radix + 13 KB icons = 51.9 KB | **~86 KB** | 4 cache-friendly vendor chunks |
| Preact + Radix swap (commit 50b0fea) | 4.4 KB | 8.3 KB | 21 KB app | + 9.9 KB preact-vendor + 29 KB radix + 13 KB icons = 51.9 KB | **~86 KB** | Same as React |
| **Vanilla JS + morphdom + static HTML (current)** | 11.2 KB | 7.6 KB | 18.5 KB entry | + 2.1 KB morphdom | **~39 KB** | Markup in HTML, JS mounts into `[data-mount]` slots |

## Bundle-by-bundle pros and cons

### Original (vanilla DOM, jQuery-era pattern)

| Pros | Cons |
|---|---|
| Zero build step — drop a `<script>` and go | ~130 KB gzipped is roughly **3×** what the current build ships |
| No dependencies to update | Hand-rolled search / sort / scroll-spy — fragile and untested |
| Works without JS bundler | Inline JSON-LD, no code-split, no cache-friendly chunks |
| | Site rebuild required for every change |
| | No TypeScript — typo bugs in production |

**Verdict:** Acceptable for the original 2018-era deployment, but the size and lack of structure make any feature work painful.

### React 19 + shadcn/ui (commit ecef1b1)

| Pros | Cons |
|---|---|
| Familiar mental model — most devs know React | 51.9 KB of vendor JS (`preact`/`react` + `radix`) before app code runs |
| shadcn primitives give us accessible Radix Select / Tooltip / Tabs | Radix Select portal required jsdom polyfill workarounds in tests |
| Full TypeScript strict typing across the data layer | `class-variance-authority` + `tailwind-merge` add ~3 KB of dependency surface |
| Code-split into 4 cache-friendly vendor chunks | `lucide-react` adds 13 KB even though we only use 32 icons |
| | React 19 + ReactDOM runtime is ~45 KB before any app code |

**Verdict:** The most ergonomic development experience, but the largest payload by far. Best when the team is React-fluent and willing to trade bundle size for ecosystem familiarity.

### Preact + Radix swap (commit 50b0fea, shipped in PR #37)

| Pros | Cons |
|---|---|
| Same DX as React via `preact/compat` | Radix Select still ships its portal machinery (~29 KB) — biggest chunk |
| shadcn primitives unchanged, so all accessibility work is preserved | Tooltip, Tabs, Card, Separator installed and then deleted in commit 718af6a |
| TypeScript strict typing preserved | `lucide-react` still adds 13 KB for ~32 icons |
| Total gzipped: ~86 KB (similar to React, surprisingly) | Aliases (`react` → `preact/compat`) require careful tsconfig paths |
| | Drop-in React upgrade blocked by `preact/compat` shim layer |

**Verdict:** Honest improvement over plain React (kills React-DOM weight) but the Radix dependency dominates the bundle. PR #37 baseline.

### Vanilla JS + morphdom + static HTML (**current**, commit 24809f1)

| Pros | Cons |
|---|---|
| **~39 KB gzipped total** — roughly 55% smaller than Preact, 70% smaller than React | No virtual DOM — manual DOM building requires care (see `__node_N__` bug from earlier turn, now fixed) |
| Static markup in `index.html` is indexable by crawlers, view-source-able, and parseable without JS | Component reusability is reduced — each section is a one-off template, not a `<BenefitSection />` prop-driven component |
| 21 inline SVG symbols cover every icon — no `lucide-react` runtime | morphdom is a 2 KB dependency we need to keep around for the table patch path |
| All accessibility primitives (Radix Select, etc.) replaced by ~10 lines of vanilla DOM | Hand-rolled ARIA combobox / focus trap / scroll-spy means more code surface to maintain than shadcn |
| Code-split morphdom chunk (2.1 KB) is the only vendor chunk — everything else is page markup | Type safety on JS components is weaker — `cn()` strings are untyped by necessity |
| 50+ automated static-HTML checks catch missing icons / wrong padding / broken labels at build time | Testing the visual rendering requires jsdom + 31 runtime assertions vs. React Testing Library's ergonomics |
| Page works partially with JS disabled (search/sort just doesn't light up) | |

**Verdict:** Best payload-to-feature ratio. The trade-off is more care with DOM construction — but `npm run verify` catches the common bugs automatically.

## Bundle deltas at a glance

```
original (jQuery-style, 2018) ............ ~130 KB gzip
react 19 + radix (commit ecef1b1) ........ ~86 KB gzip  (−34%)
preact  + radix (commit 50b0fea) ......... ~86 KB gzip  (−34%)
vanilla + morphdom (current)  ............ ~39 KB gzip  (−70%)
```

## Migration cost

| From → To | Effort | Risk |
|---|---|---|
| Original → React | High — rewrite every component, introduce build tooling | Low — well-trodden migration path |
| React → Preact | Low — alias swaps, no component changes | Low — Preact's compat layer is mature |
| Preact → Vanilla | Medium — port every component, hand-roll ARIA combobox, manual DOM | Medium — first iteration leaked `__node_N__` markers, fixed by moving static markup to HTML |
| Vanilla → Preact (rollback) | Low — components have small surface area | Low — easy revert |

## Recommendation

**Stay on vanilla + static HTML.** Three reasons:

1. **Bundle** — at 39 KB gzipped we're below the React baseline by a factor of 2.2× and below Preact by 2.2×. For a content-heavy reference site that has to load fast on slow networks, this matters more than DX niceties.
2. **Maintainability** — the page is essentially static. 9 out of 11 sections render identical content for every visitor. Shipping them as HTML rather than rebuilding them in JS on every page load is the right architectural choice. Only the host-support-table, service-comparison, pricing-table, status-grid, speed-test-grid, policies-table, usenet-table, resource-groups, and disclaimer-cards need JS — and they're all isolated to their `[data-mount]` slots.
3. **Tests catch the failure modes** — the `static-checks.ts` and `icon-references.ts` scripts run on every build and would have caught the original "missing icons" and "leaked node markers" bugs in CI, not at runtime. That's the safety net a hand-rolled vanilla build needs to be maintainable.

The trade-off is real (no JSX, more boilerplate per component), but it's paid once per component and the bundle savings compound on every page view.

If we ever need richer interactions (animations, virtualized lists beyond the 60-row initial render, drag-and-drop), we'd want to revisit — but for the current content density, vanilla is the right call.