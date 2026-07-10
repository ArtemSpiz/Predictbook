# SEO & Traffic-Resilience Hardening — Design

**Date:** 2026-07-10
**Status:** Approved for planning
**Scope:** H1, H2, M1, M2, M3 (full recommended set)

## Context

Predictbook is a Payload CMS 3.x + Next.js 15 (App Router, React 19) site on MongoDB,
deployed on Vercel (storage: R2/S3 in prod). An audit of rendering, caching, and SEO
posture found the foundation healthy — listings render static (CDN edge), detail pages
use on-demand ISR, data fetches are wrapped in `unstable_cache` + `react cache()`,
`generateMetadata`/canonical/JSON-LD/sitemap/robots are all present.

This design addresses five findings that limit scale and SEO ceiling. It changes
**only** the items below; the existing rendering strategy and SEO plumbing stay intact.

## Goals

- Survive high traffic without cache stampedes or DB connection exhaustion.
- Remove an open image-proxy abuse/cost vector.
- Keep sitemaps valid as the news archive grows past tens of thousands of URLs.
- Improve social/SERP click-through with per-entity OG images.

## Non-goals

- No change to the static/ISR rendering model of any route.
- No new CMS collections or content modeling.
- No multi-locale rollout (i18n stays `en`-only).

---

## H1 — Granular cache invalidation

**Problem.** Every front-end fetch is tagged with a single shared tag `payload`
(`src/utilities/*.ts`), and `revalidateFrontCache` (`src/hooks/revalidateFrontCache.ts`)
flushes exactly that one tag on **any** create/update/delete of **any** collection or
global. Under active editorial + high traffic, one edit invalidates the entire
front-end cache → all pages regenerate on next hit (stampede).

**Design.** Introduce a small typed tag helper and switch fetchers + hooks to
collection/entity-scoped tags. Keep `payload` as a coarse "flush everything" fallback
used only by the manual `/api/revalidate` webhook.

- New `src/utilities/cacheTags.ts`:
  - `tags.collection(slug)` → `payload:col:<slug>` (e.g. `payload:col:news`)
  - `tags.doc(slug, id)` → `payload:doc:<slug>:<id>`
  - `tags.docSlug(slug, urlSlug)` → `payload:slug:<slug>:<urlSlug>`
  - `tags.global(name)` → `payload:global:<name>`
  - `tags.all` → `payload` (fallback)
- Fetchers attach the **narrowest applicable** tags. Examples:
  - `findNewsPosts` → `[tags.collection('news')]`
  - `getNewsPostBySlug(slug)` → `[tags.collection('news'), tags.docSlug('news', slug)]`
  - `getSiteSettings` → `[tags.global('site-settings')]`; `getSiteSidebar` → `[tags.global('site-sidebar')]`
  - page/pageContent fetchers → `[tags.collection('pages'), tags.docSlug('pages', slug)]`
  - live-feed / signals → their respective collection + doc-slug tags
- `revalidateCollectionHooks` / `revalidateGlobalHooks` receive the collection slug /
  global name (via the hook's `collection`/`global` context) and invalidate:
  - collection change → `revalidateTag(tags.collection(slug))` **and**
    `revalidateTag(tags.docSlug(slug, doc.slug))` when the doc has a slug.
  - global change → `revalidateTag(tags.global(name))`.
- The `/api/revalidate` webhook keeps flushing `tags.all` (`payload`) as the escape hatch.

**Interface impact.** Hook wiring in the 14 collections/globals already listed changes
call shape (they must pass their slug/name). All `unstable_cache` tag arrays change.
No route or component code changes.

**Verification.** Edit one news post → confirm only news-tagged pages regenerate
(home/other sections stay served from cache). Edit a global → only its dependents flush.

---

## H2 — MongoDB connection pooling

**Problem.** `mongooseAdapter({ url })` (`src/starter/adapters/db.ts:78`) uses driver
defaults with no pool bounds. On Vercel Fluid Compute, many concurrent function
instances each open connections; an Atlas tier's connection cap can be exhausted under
a spike, causing request failures.

**Design.** Pass `connectOptions` to the mongoose adapter, values driven by env with
safe defaults:

```
mongooseAdapter({
  url,
  connectOptions: {
    maxPoolSize: Number(process.env.MONGO_MAX_POOL_SIZE ?? 10),
    minPoolSize: Number(process.env.MONGO_MIN_POOL_SIZE ?? 0),
    serverSelectionTimeoutMS: Number(process.env.MONGO_SERVER_SELECTION_TIMEOUT_MS ?? 5000),
    socketTimeoutMS: Number(process.env.MONGO_SOCKET_TIMEOUT_MS ?? 45000),
  },
})
```

- Document the four vars in `.env.example` with guidance: on serverless, keep
  `maxPoolSize` small (per-instance pool × concurrency must stay under the Atlas cap).
- Default `maxPoolSize: 10` is conservative and overridable per environment.

**Verification.** Boot with the vars set; confirm Payload connects and pool options are
honored (log/inspect). No behavior change at low load.

---

## M1 — Restrict image optimization hosts

**Problem.** `next.config.js` sets `images.remotePatterns` to `hostname: '**'`, letting
Next's Image Optimization fetch and optimize **any** remote host — an open image proxy
(abuse) and a compute/bandwidth amplification vector under traffic.

**Design.** Replace the wildcard with an explicit allow-list derived from actual media
sources:

- Always: the media/CDN host from `NEXT_PUBLIC_CDN_URL` and `NEXT_PUBLIC_SERVER_URL`
  (parsed at config load), plus localhost for dev.
- Optional extra hosts via `NEXT_PUBLIC_IMAGE_HOSTS` (comma-separated) for known
  third-party sources (e.g. S3/R2 public bucket domain, sponsor logos).
- Build the `remotePatterns` array from those values; keep AVIF/WebP formats.

**Verification.** CMS media + CDN images still optimize and render; an off-list host
returns 400 from `/_next/image` (confirm).

---

## M2 — Chunked sitemaps + index

**Problem.** A single `app/sitemap.ts` returns all URLs in one file. Next caps a single
sitemap at ~50k URLs; a growing news archive will silently truncate/break.

**Design.** Convert to Next's multi-sitemap API:

- Add `generateSitemaps()` returning shards (one per ~10k news URLs, computed from a
  published-news count query; pages/live-feed small enough to ride in shard 0 or a
  dedicated shard).
- `sitemap(id)` returns the slice for shard `id`.
- Next serves `/sitemap/<id>.xml` and auto-emits the index at `/sitemap.xml`.
- `robots.ts` continues to point `sitemap` at `${base}/sitemap.xml` (now the index).
- Preserve current `revalidate = 3600`, the `sitemapInclude*` settings flags, the
  home/section entries, and the `home`-slug skip.

**Verification.** `/sitemap.xml` returns a valid `<sitemapindex>`; each shard validates
and stays under the URL cap; a seeded large news set spreads across shards.

---

## M3 — Dynamic Open Graph images

**Problem.** OG metadata is text-only; no per-entity image → weaker social/SERP CTR.

**Design.** Add `ImageResponse`-based OG image routes (Next file convention):

- `src/app/(frontend)/news/[slug]/opengraph-image.tsx` — renders title + section label
  + site brand on a branded background; pulls the post via the existing cached fetcher.
- A shared OG template helper (`src/app/lib/ogTemplate.tsx`) for consistent layout,
  reused by a generic page OG route if cheap to add.
- Fall back to the existing static OG image (already in metadata) when an entity has no
  usable data.
- Font: load one embedded font file for `ImageResponse` (no external fetch).

**Verification.** `/news/<slug>/opengraph-image` returns a 1200×630 PNG; the post's
`generateMetadata` OG image resolves to it; validate with a social-card debugger shape
(og:image dimensions present).

---

## Rollout order

1. **H2** — isolated config + env (low risk, immediate resilience win).
2. **M1** — isolated config + env.
3. **H1** — touches all fetchers + hook wiring; largest blast radius, do with care + tests.
4. **M2** — sitemap refactor.
5. **M3** — new OG routes (additive).

## Testing

- Unit: `cacheTags` helpers; sitemap sharding math; image-host parsing.
- E2E (Playwright, extend existing `tests/e2e/sitemap.spec.ts`): sitemap index + a shard
  fetch; `/_next/image` off-host rejection; OG image route returns PNG.
- Manual: cache-invalidation scoping (edit one entity, observe selective regeneration).

## Low-priority follow-ups (out of this scope, noted)

- **L1** safety-net time `revalidate` on listings against out-of-band DB writes.
- **L2** `loadMoreNews` server action is compute-per-scroll (accepted trade-off).
- **L3** verify `stale-while-revalidate` / Cache-Control for static assets on self-host (Caddy).
