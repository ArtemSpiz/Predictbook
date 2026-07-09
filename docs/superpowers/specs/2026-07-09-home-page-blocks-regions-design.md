# Home Page: Region-Aware Block Editing

**Date:** 2026-07-09
**Status:** Approved for planning
**Scope:** `home-page` global + home rendering. Other pages: audit only (backlog).

## Problem

The site is a news layout with a **left sidebar** and a **main column** on many pages.
Two problems on the home page today:

1. **Admin gives no sense of layout.** The `home-page` global (`src/globals/HomePage.ts`)
   is a flat list of two fields (`summaries`, `articleSections`). An editor cannot tell
   which block lands in the left sidebar vs. the main column.
2. **The Payload migration is incomplete.** Only `summaries` and `articleSections` are
   editable. The actual home page (`src/app/components/Home/Main.tsx`) hardcodes most
   blocks — Whale Alert, Arbitrage Alert, the "Real-time alerts" promo card, the
   "Analysis" heading/subtitle, the "Live Feed" heading, section headings, delay labels,
   and "view all" links.

The project **already has a block system** (`type: 'blocks'` + `src/blocks/RenderBlocks.tsx`)
used by the `pages` collection, and even ships unused `SummaryBlock` and `RealCardBlock`
configs (`src/blocks/Summary/config.ts`, `src/blocks/RealCard/config.ts`). The home page
does not use any of it. This design brings the home page onto that block system, adds the
missing domain blocks, and makes each block's on-site position explicit in admin.

## Decisions (confirmed with user)

- **Editing model:** Hybrid. Two fixed regions (left sidebar, main content). Editors
  reorder/toggle blocks **within** a region; blocks cannot move cross-region.
- **Content sourcing:** Auto from collections. Editors edit only the block "wrapper"
  (headings, labels, limits, links, visibility). Article/signal/feed data is pulled from
  the `signals`, `blog`, and `live-feed` collections as it is today. No manual item picking.
- **Dividers / two-column frame:** Stay in code, auto-inserted between blocks. Not editable.
- **Category sections:** Each category is its own block instance (add via "Add block"),
  replacing the old single `articleSections` array.
- **Visibility:** Every block has a `hidden` checkbox to disable it on-site without deleting.
- **Scope now:** Home page only. Other pages are audited into a backlog section below.
- **No hardcoded content (hard rule).** Every string and setting rendered on the home page
  must come from Payload — headings, subtitles, delay labels, "view all" texts/links, and
  the mobile section headers that are currently hardcoded in `Signals.tsx` ("Signals" +
  subtitle) and `ArticleTypeMobileSwitcher.tsx` ("Explore by Category" + subtitle). Category
  accent colors must not be keyed off hardcoded category names (`ArticlesType.tsx:42-44`);
  the accent becomes an explicit per-block field. Collection-sourced card data counts as
  admin-driven because the collections are themselves editable in admin.

## Architecture

### Admin structure — `src/globals/HomePage.ts`

Replace the two flat fields with a `tabs` field, one tab per region, each holding a
`blocks` array:

```
Home Page (global)
├── Tab "Left sidebar"   (admin label makes the on-site position explicit)
│     sidebarBlocks: blocks[]   allowed: Signal Feed, Summaries, Promo Card
└── Tab "Main content"
      mainBlocks: blocks[]      allowed: Analysis, Live Feed, Category Section
```

- Each region restricts its `blocks` list to the block types that belong in that column,
  so an editor can only add a Whale Alert to the sidebar and an Analysis grid to main.
- Block labels are named exactly as they read on-site ("Whale Alert", "Arbitrage Alert",
  "Analysis", "Live Feed", "Category section", "Promo card", "Market pulse summaries").
- Each block config gets an `imageURL` thumbnail so the block picker previews it.
- Tabs and blocks get `admin.description` text stating where the content appears.
- **Mobile section headers (admin-driven).** Besides its `blocks` array, each tab carries a
  small group of label fields for the mobile-only headers currently hardcoded in code:
  - Left sidebar tab → `signalsMobileHeader` group: `title`, `subtitle` (the mobile
    "Signals" collapse header).
  - Main content tab → `categorySwitcherHeader` group: `title`, `subtitle` (the mobile
    "Explore by Category" switcher header).

### Blocks

Reuse the existing block infrastructure and add home-specific blocks. All new blocks live
under `src/blocks/<Name>/{config.ts,Component.tsx}` following the existing convention.

| Block | slug | Editable wrapper fields | Auto content source |
|---|---|---|---|
| **Signal Feed** | `signal-feed` | `heading`, `kind` (whale \| arbitrage), `delayLabel`, `limit`, `viewAllText`, `viewAllUrl`, `hidden` | `signals` collection filtered by `kind` |
| **Analysis** | `analysis` | `heading`, `subtitle`, `limit`, `viewAllText`, `viewAllUrl`, `hidden` | `blog` (latest / featured first) |
| **Live Feed** | `live-feed-block` | `heading`, `limit`, `viewAllText`, `viewAllUrl`, `hidden` | `live-feed` collection |
| **Category Section** | `category-section` | `label`, `category` (relationship → categories), `accent` (select: politics \| sports \| crypto \| neutral), `limit`, `hidden` | `blog` filtered by category |
| **Market pulse summaries** | `summary` (existing) | reuse `SummaryBlock`; add `hidden` | — (inline content) |
| **Promo card** | `real-card` (existing) | reuse `RealCardBlock`; add `hidden` | — (inline content) |

**Shared field.** A small helper adds a `hidden` checkbox (label "Hide on site",
`defaultValue: false`) to every home block, so visibility is consistent.

**Signal Feed** unifies the two hardcoded `Alert` instances. It fixes two current hardcode
bugs in `src/app/components/Home/Alert.tsx`: the `"30-min delay"` label (line ~35) and the
`"View all whale alerts"` button that shows even for arbitrage (line ~92) — both become
editable per instance (`delayLabel`, `viewAllText`).

### Rendering

- **`Main.tsx`** keeps only the layout frame: the `container-custom` wrapper, the two-column
  grid (`md:max-w-[300px]` sidebar + `flex-1` main), and the auto dividers. It fetches the
  `home-page` global and renders `sidebarBlocks` into the left column and `mainBlocks` into
  the right, each via a new `RenderHomeBlocks`.
- **`RenderHomeBlocks`** (server component, mirrors `src/blocks/RenderBlocks.tsx`): maps
  `blockType → async component`, skips blocks with `hidden === true`, and inserts a
  `bg-line` divider between consecutive visible blocks.
- Each block Component is a **server component that fetches its own data** (e.g. Signal Feed
  calls `findSignals({ kind, limit })`). This keeps blocks self-contained and preserves the
  current data-fetching utilities (`getSignals`, `getBlogPosts`, `getLiveFeed`).
- Existing presentational components in `src/app/components/Home/*` (`Alert`, `Feed`,
  `GridArticles`, `ArticlesType`, `Summary`, `RealCard`) move to their block folders as the
  block Components (or are wrapped by them). No visual change to the rendered page.
- The mobile switcher (`ArticleTypeMobileSwitcher`) stays wired to the Category Section
  blocks (reads the same block list) so mobile behavior is preserved.

### Data migration

- A Payload migration + updated seed (`scripts/seed-predictbook.ts`) populate
  `sidebarBlocks` and `mainBlocks` with the current default layout (matching the screenshot):
  sidebar = Whale Alert, Arbitrage Alert, Summaries, Promo card; main = Analysis, Live Feed,
  Politics/Sports/Crypto Category Sections.
- Old `summaries` and `articleSections` fields are removed from `HomePage.ts` after their
  content is carried into the new blocks. `Main.tsx`'s `DEFAULT_SECTIONS` fallback is removed
  (defaults now live in seed data).
- Regenerate `payload-types` (`pnpm generate:types`) after the schema change.

## Testing

- **Unit:** `RenderHomeBlocks` — renders visible blocks in order, skips `hidden`, inserts
  dividers only between visible blocks, ignores unknown block types.
- **Unit:** each block Component maps its wrapper fields correctly and requests the right
  collection query (mocked data utilities).
- **E2E (Playwright):** home page renders sidebar and main blocks in the seeded order; a
  block marked `hidden` disappears; reordering blocks in admin reorders them on-site.
- **Manual/admin:** verify the two tabs are labeled by region, block picker shows only
  region-appropriate blocks with thumbnails, and live preview reflects changes.

## Out of scope

- Cross-region drag (blocks stay in their column).
- Manual per-item article/signal selection (auto-sourced only).
- Making dividers or the column frame editable.
- Migrating other pages (see backlog).

## Backlog: other pages with sidebar + main (audit)

To be migrated later with the same region+blocks pattern. This is an inventory for planning,
not part of this implementation:

- **Signals** (`src/app/(frontend)/signals`, `signals-page` global, `src/app/components/Signals`)
  — audit sidebar/main blocks and current hardcode.
- **Live Feed** (`src/app/(frontend)/live-feed`, `live-feed-page` global,
  `src/app/components/LiveFeed`).
- **Blog** (`src/app/(frontend)/blog`, `blog-page` global, `src/app/components/Blog`).
- **About** (`about-page` global) and **Contact** (`contact-page` global) — confirm whether
  they use the sidebar layout at all.

For each: list on-site blocks per region, mark which are hardcoded vs. collection-driven,
and queue migration in the confirmed layout order.

---

## Phase 2: Migrate other sidebar+main pages (approved 2026-07-10)

Apply the region+blocks pattern to the five other pages that share the two-column
layout. Case-studies (single column) stays out of scope. Blog sub-routes
(`/blog/[slug]`, `/blog/category/*`, author) stay in the backlog.

**Renderer:** Generalize `RenderHomeBlocks` into a shared `RenderRegion` + a
`blockType → async component` registry so every page renders through one path. The
signal-feed→Signals-collapse and category-section→switcher groupings remain but only
fire where those block types appear (home).

**Per page:**
- **About** — rail becomes blocks `[live-feed-block, real-card]` (removes the temp Feed
  stopgap and the old hardcoded `Home/RealCard`); main content (title/body/cta) stays in
  its existing editable global fields under a Content tab.
- **Signals** — new `signals-list` block (heading/subtitle/delayText/limit) in main;
  `real-card` in rail.
- **Live Feed** — new `live-feed-list` block (heading/subtitle/limit) in main; `real-card` in rail.
- **Blog** — new `blog-list` block (heading/subtitle/category source/limit) in main;
  reuse `summary` block in rail (replaces hardcoded TypeSummary array + "Summary" header).
- **Contact** — new `contact-form`, `contact-methods`, `contact-value` blocks wrapping the
  existing components; fix the hardcoded "Other ways to reach us" heading.

**Contact form persistence (approved):** the contact form must actually save. Add a new
Payload collection `contact-submissions` (name, email, subject, message; admin-readable,
not publicly listable) and a server route `POST /api/contact` that creates a submission via
the local Payload API. Wire `ContactCard` to POST to it (replacing the fake `setTimeout`).

**No hardcoded content** rule continues to apply to every migrated page. Each page's global
is seeded with its default block layout.
