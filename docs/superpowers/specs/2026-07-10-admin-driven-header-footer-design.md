# Design: Admin-driven Header & Footer

**Date:** 2026-07-10
**Status:** Approved (pending spec review)

## Problem

`src/app/Header.tsx` and `src/app/Footer.tsx` render fully hardcoded content
(brand, tagline, social links, navigation with a dropdown, CTA button,
disclaimer, copyright, and a stale date + fake "8 signals today" counter). The
`header` and `footer` Payload globals exist but are generic starter stubs that
neither cover the real design nor feed the components. Editors cannot change any
of it from the admin.

## Goal

Make all Header/Footer text, links, social icons, and CTA editable from the
Payload admin, with **zero visual change** to the current site (guaranteed by a
seed that populates the globals with the current content). Two intentional
correctness fixes: the header date becomes the real current date, and the
"signals today" counter becomes a real count.

## Non-goals

- No redesign, no markup/class changes beyond swapping the data source.
- No unrelated refactoring of blocks or other globals.

## Data model (Payload globals)

Navigation and column links use the existing `linkField()` (internal reference /
external URL picker) for consistency with the rest of the starter. Social icons
are `upload` relations to `media` (icons uploaded as **webp**, converted from the
current PNGs to preserve the exact look while optimizing).

### `header` global (`src/globals/Header.ts`)

- `logo` — upload → media (existing). Rendered if present, else `brandName`.
- `brandName` — text (e.g. "Predictbook").
- `nav` — array (maxRows 10), each item:
  - `link` — `linkField()` (label + internal/external href; the "Analysis"
    parent points at `/news`).
  - `children` — array of `linkField()` (dropdown items). Presence of children
    renders the hover dropdown / mobile accordion.
- `social` — array: `icon` (upload → media, required) + `url` (text, required).
- `cta` — group: `label` (text) + `href` (text, optional). Plain fields rather
  than `linkField()` because this is a standalone button that may have no
  destination yet; `linkField` would force a required URL. Rendered as a
  `<button>` when `href` is empty, a `<Link>` when set.

### `footer` global (`src/globals/Footer.ts`)

- `brandName` — text.
- `tagline` — text ("AI-powered newsroom covering prediction markets").
- `social` — array: `icon` (upload → media) + `url`.
- `columns` — array (maxRows 4): `title` (text) + `items` (array of `linkField()`).
- `disclaimer` — textarea.
- `copyright` — text; the token `{year}` is replaced with the current year at
  render time so the year stays dynamic.

All existing generic fields on these globals are replaced by the above (fresh DB
context — no production data to migrate; dev data is reseeded).

## Rendering & wiring

- New cached utilities mirroring `getSiteSettings`:
  - `getHeaderData()` and `getFooterData()` in `src/utilities/` — `unstable_cache`
    + `payload.findGlobal({ depth: 1 })` (depth 1 to populate media + references),
    wrapped in `try/catch` returning safe empty defaults.
- New shared helper `resolveLinkHref(link)` in `src/utilities/` — resolves a
  `linkField` value to an href, correctly handling `relationTo`:
  - reference → `news` ⇒ `/news/${slug}`, otherwise `/${slug}`
  - custom ⇒ `link.url`
  - fallback ⇒ `#`
  Replaces the naive inline resolver currently duplicated in
  `blocks/CallToAction` and `blocks/Hero` (those are updated to use it).
- `layout.tsx` (server) fetches both globals and passes them as props to
  `<Header>` and `<Footer>`.
- `Header` stays a client component (mobile drawer, dropdown state) but receives
  all data via props — no hardcoded arrays.
- `Footer` stays a server component, receives its data via props.

## Component decomposition

Today `Header.tsx` (238 lines) and `Footer.tsx` (115 lines) are single monolith
files. Both are split into small, single-purpose components. Subcomponents live
under `src/app/components/Header/` and `src/app/components/Footer/` (matching the
existing `components/` grouping); the public entry points `src/app/Header.tsx`
and `src/app/Footer.tsx` remain so `@/app/Header` / `@/app/Footer` imports and
`layout.tsx` are unaffected.

**Shared:**
- `ui/SocialLinks.tsx` — renders an array of `{ icon, url }` as icon links.
  Reused by the header top bar, the header mobile drawer, and the footer;
  `className`/size props cover the layout differences so markup stays identical.

**Header (`src/app/Header.tsx` = client orchestrator holding drawer + dropdown state):**
- `components/Header/DesktopNav.tsx` — desktop nav row; maps nav items.
- `components/Header/NavItem.tsx` — one nav item with optional hover dropdown.
- `components/Header/HeaderMeta.tsx` — client; the live date + "N signals today"
  indicator (computes the date after mount).
- `components/Header/CtaButton.tsx` — the CTA button/link.
- `components/Header/MobileMenu.tsx` — the slide-in drawer with the accordion nav.
- `InfiniteScroll` stays as-is.

**Footer (`src/app/Footer.tsx` = server orchestrator):**
- `components/Footer/FooterBrand.tsx` — brand + tagline + social.
- `components/Footer/FooterColumns.tsx` — the link columns.
- `components/Footer/FooterBottom.tsx` — disclaimer + copyright (`{year}` token).

Each unit takes typed props derived from the global data; none reach back into
Payload directly. `isActive` logic stays in the header orchestrator and is passed
down (or recomputed from `usePathname` inside `NavItem`, whichever keeps props
minimal).

## Dynamic header data (computed, not admin fields)

- **Date** (currently the stale hardcoded "Tuesday, June 23 · 2026"): computed
  on the client in `Header` after mount (`useState`/`useEffect`) so it is always
  the real current date and cannot cause a hydration mismatch. Same format as
  today, built with
  `toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })`
  plus the year (e.g. "Friday, July 10 · 2026").
- **"N signals today"**: a server count of the `signals` collection with
  `publishedAt` within the current day, passed from `layout.tsx` as a prop.
  Refreshes on the existing ISR/`payload`-tag revalidation cadence. Renders the
  real number instead of the hardcoded "8".

## Social icons

- Field: `upload` → media per social entry + `url`.
- Media already allows `image/*` (webp accepted).
- The seed converts the current PNG icons (`public/tg.png`, `public/x.png`,
  `public/footerTg.png`, `public/footerX.png`) to webp via `sharp` and uploads
  them, so the rendered icons look identical but are optimized.

## Fresh-DB fallback & seed

- `getHeaderData`/`getFooterData` and the components guard empty/missing arrays
  (no crash on an empty global).
- `scripts/seed-predictbook.ts` is extended to `updateGlobal('header')` and
  `updateGlobal('footer')` with the exact current content (brand, tagline, the
  three footer columns, both nav items incl. the Analysis dropdown, social links,
  CTA, disclaimer, copyright), uploading the webp social icons first and
  referencing them. Running the seed makes a fresh DB render the site identically.
- **Deliverable step:** run the seed at the end (dev Mongo + local storage) and
  verify the site is visually unchanged.

## Visual parity guarantee

Only the data source changes; all markup/Tailwind classes are preserved. After
seeding the globals with the current content, the site is pixel-identical. The
only deliberate deltas are the real date and the real signals count.

## Testing / verification

- `pnpm typecheck`, `pnpm lint`, `pnpm build` all green.
- `pnpm generate:types` after global changes (payload-types updated).
- Run the seed, then visually confirm header/footer unchanged (brand, nav +
  dropdown, social icons, CTA, footer columns, disclaimer, copyright) and that
  the date/signals count are live.

## Affected files

- `src/globals/Header.ts`, `src/globals/Footer.ts` — extended fields.
- `src/app/Header.tsx`, `src/app/Footer.tsx` — become thin orchestrators that
  consume props and compose subcomponents (hardcode removed).
- `src/app/components/Header/*` — `DesktopNav`, `NavItem`, `HeaderMeta`,
  `CtaButton`, `MobileMenu` (new).
- `src/app/components/Footer/*` — `FooterBrand`, `FooterColumns`, `FooterBottom`
  (new).
- `src/app/ui/SocialLinks.tsx` — new shared social-icons component.
- `src/app/(frontend)/layout.tsx` — fetch globals + signals count, pass props.
- `src/utilities/getHeaderData.ts`, `src/utilities/getFooterData.ts` — new.
- `src/utilities/resolveLinkHref.ts` — new shared helper.
- `src/blocks/CallToAction/Component.tsx`, `src/blocks/Hero/Component.tsx` —
  use the shared resolver.
- `scripts/seed-predictbook.ts` — seed header/footer + webp icons.
- `src/payload-types.ts` — regenerated.
