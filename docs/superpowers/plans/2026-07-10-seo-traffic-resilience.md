# SEO & Traffic-Resilience Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Harden the Predictbook site for high traffic and stronger SEO by scoping cache invalidation, bounding the Mongo pool, closing the open image-proxy, chunking sitemaps, and adding per-article OG images.

**Architecture:** Small, pure, unit-tested helpers hold the new logic (tag names, pool options, image-host parsing, sitemap sharding, OG template); thin call sites (Payload hook, `next.config.js`, `db.ts`, `app/sitemap.ts`, OG route) wire them in. The existing static/ISR rendering model and SEO plumbing are untouched.

**Tech Stack:** Next.js 15 (App Router), Payload CMS 3.x, MongoDB (mongoose adapter), React 19, `next/og`, Vitest (unit), Playwright (e2e), pnpm.

## Global Constraints

- Comments: minimal — only genuine "why"/edge cases, one compact line; remove redundant comments encountered while editing.
- Unit tests live at `src/**/*.test.ts`, run with `pnpm test:unit` (Vitest, jsdom, `@/` path alias + `vite-tsconfig-paths`).
- E2E tests live at `tests/e2e/*.spec.ts`, run with `pnpm test:e2e` (Playwright; `webServer` auto-starts `pnpm dev` on `http://localhost:3000`).
- Typecheck with `pnpm typecheck` (`tsc --noEmit`); lint with `pnpm lint`.
- The single coarse tag `payload` MUST remain valid as a "flush everything" fallback used by `POST /api/revalidate` — do not delete it.
- `next.config.js` is ESM; helpers it imports must be plain-JS `.mjs` (no TS), because the config is not transpiled.
- All new cache tags MUST be produced through the shared `src/utilities/cacheTags.ts` helper so fetcher tags and hook-invalidation tags are structurally identical.

---

### Task 1: MongoDB connection pool options (H2)

Bound the mongoose connection pool via env so serverless concurrency cannot exhaust the Atlas connection cap.

**Files:**
- Create: `src/starter/mongoConnectOptions.ts`
- Create: `src/starter/mongoConnectOptions.test.ts`
- Modify: `src/starter/adapters/db.ts:78`
- Modify: `.env.example`

**Interfaces:**
- Produces: `mongoConnectOptions(env?: NodeJS.ProcessEnv): { maxPoolSize: number; minPoolSize: number; serverSelectionTimeoutMS: number; socketTimeoutMS: number }`

- [ ] **Step 1: Write the failing test**

Create `src/starter/mongoConnectOptions.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { mongoConnectOptions } from './mongoConnectOptions'

describe('mongoConnectOptions', () => {
  it('uses safe defaults when env is empty', () => {
    expect(mongoConnectOptions({})).toEqual({
      maxPoolSize: 10,
      minPoolSize: 0,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    })
  })

  it('reads overrides from env', () => {
    const opts = mongoConnectOptions({
      MONGO_MAX_POOL_SIZE: '25',
      MONGO_MIN_POOL_SIZE: '2',
      MONGO_SERVER_SELECTION_TIMEOUT_MS: '3000',
      MONGO_SOCKET_TIMEOUT_MS: '60000',
    })
    expect(opts).toEqual({
      maxPoolSize: 25,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 3000,
      socketTimeoutMS: 60000,
    })
  })

  it('falls back to defaults for non-numeric or negative values', () => {
    const opts = mongoConnectOptions({ MONGO_MAX_POOL_SIZE: 'abc', MONGO_MIN_POOL_SIZE: '-3' })
    expect(opts.maxPoolSize).toBe(10)
    expect(opts.minPoolSize).toBe(0)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test:unit src/starter/mongoConnectOptions.test.ts`
Expected: FAIL — cannot resolve `./mongoConnectOptions`.

- [ ] **Step 3: Write minimal implementation**

Create `src/starter/mongoConnectOptions.ts`:

```ts
export interface MongoConnectOptions {
  maxPoolSize: number
  minPoolSize: number
  serverSelectionTimeoutMS: number
  socketTimeoutMS: number
}

const num = (value: string | undefined, fallback: number): number => {
  const n = Number(value)
  return Number.isFinite(n) && n >= 0 ? n : fallback
}

/** Bounded mongoose pool options; keep maxPoolSize small on serverless so
 * per-instance pool × concurrency stays under the Atlas connection cap. */
export function mongoConnectOptions(
  env: NodeJS.ProcessEnv = process.env,
): MongoConnectOptions {
  return {
    maxPoolSize: num(env.MONGO_MAX_POOL_SIZE, 10),
    minPoolSize: num(env.MONGO_MIN_POOL_SIZE, 0),
    serverSelectionTimeoutMS: num(env.MONGO_SERVER_SELECTION_TIMEOUT_MS, 5000),
    socketTimeoutMS: num(env.MONGO_SOCKET_TIMEOUT_MS, 45000),
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test:unit src/starter/mongoConnectOptions.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Wire into the adapter**

In `src/starter/adapters/db.ts`, add the import near the top of the file (after the existing imports):

```ts
import { mongoConnectOptions } from '../mongoConnectOptions'
```

Replace line 78:

```ts
    return mongooseAdapter({ url })
```

with:

```ts
    return mongooseAdapter({ url, connectOptions: mongoConnectOptions() })
```

- [ ] **Step 6: Document env vars**

In `.env.example`, under the database section, add:

```
# MongoDB connection pool (serverless-safe defaults). Keep MONGO_MAX_POOL_SIZE small:
# per-instance pool × max concurrency must stay under the Atlas connection cap.
# MONGO_MAX_POOL_SIZE="10"
# MONGO_MIN_POOL_SIZE="0"
# MONGO_SERVER_SELECTION_TIMEOUT_MS="5000"
# MONGO_SOCKET_TIMEOUT_MS="45000"
```

- [ ] **Step 7: Typecheck and commit**

Run: `pnpm typecheck`
Expected: no errors.

```bash
git add src/starter/mongoConnectOptions.ts src/starter/mongoConnectOptions.test.ts src/starter/adapters/db.ts .env.example
git commit -m "feat(db): bound mongo connection pool via env (H2)"
```

---

### Task 2: Restrict image optimization hosts (M1)

Replace the `hostname: '**'` wildcard with an env-driven allow-list so `/_next/image` can only optimize known hosts.

**Files:**
- Create: `src/starter/imageHosts.mjs`
- Create: `src/starter/imageHosts.test.ts`
- Modify: `next.config.js`
- Modify: `.env.example`

**Interfaces:**
- Produces: `buildImageRemotePatterns(env?): Array<{ protocol: 'http' | 'https'; hostname: string }>`

- [ ] **Step 1: Write the failing test**

Create `src/starter/imageHosts.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { buildImageRemotePatterns } from './imageHosts.mjs'

describe('buildImageRemotePatterns', () => {
  it('always allows localhost for dev', () => {
    const patterns = buildImageRemotePatterns({})
    expect(patterns).toEqual(
      expect.arrayContaining([
        { protocol: 'http', hostname: 'localhost' },
        { protocol: 'http', hostname: '127.0.0.1' },
      ]),
    )
  })

  it('derives hosts from CDN and server URLs', () => {
    const patterns = buildImageRemotePatterns({
      NEXT_PUBLIC_CDN_URL: 'https://cdn.example.com',
      NEXT_PUBLIC_SERVER_URL: 'https://predictbook.example.com',
    })
    expect(patterns).toEqual(
      expect.arrayContaining([
        { protocol: 'https', hostname: 'cdn.example.com' },
        { protocol: 'https', hostname: 'predictbook.example.com' },
      ]),
    )
  })

  it('parses NEXT_PUBLIC_IMAGE_HOSTS (bare hosts and full URLs), de-duped', () => {
    const patterns = buildImageRemotePatterns({
      NEXT_PUBLIC_CDN_URL: 'https://cdn.example.com',
      NEXT_PUBLIC_IMAGE_HOSTS: 'cdn.example.com, bucket.r2.dev, https://logos.example.com',
    })
    const https = patterns.filter((p) => p.protocol === 'https').map((p) => p.hostname)
    expect(https).toContain('cdn.example.com')
    expect(https).toContain('bucket.r2.dev')
    expect(https).toContain('logos.example.com')
    expect(https.filter((h) => h === 'cdn.example.com')).toHaveLength(1)
  })

  it('ignores malformed URLs without throwing', () => {
    expect(() => buildImageRemotePatterns({ NEXT_PUBLIC_CDN_URL: 'not a url' })).not.toThrow()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test:unit src/starter/imageHosts.test.ts`
Expected: FAIL — cannot resolve `./imageHosts.mjs`.

- [ ] **Step 3: Write minimal implementation**

Create `src/starter/imageHosts.mjs`:

```js
/**
 * Build Next `images.remotePatterns` from env. Fail-closed: only localhost plus
 * explicitly-configured hosts are allowed, so `/_next/image` cannot be abused as
 * an open proxy. Set NEXT_PUBLIC_CDN_URL / NEXT_PUBLIC_SERVER_URL (and optionally
 * NEXT_PUBLIC_IMAGE_HOSTS) in production or media images will be rejected.
 */
export function buildImageRemotePatterns(env = process.env) {
  const patterns = []
  const seen = new Set()

  const add = (protocol, hostname) => {
    if (!hostname) return
    const key = `${protocol}//${hostname}`
    if (seen.has(key)) return
    seen.add(key)
    patterns.push({ protocol, hostname })
  }

  const addUrl = (raw) => {
    if (!raw) return
    try {
      const u = new URL(raw)
      add(u.protocol.replace(':', ''), u.hostname)
    } catch {
      /* ignore malformed URL */
    }
  }

  addUrl(env.NEXT_PUBLIC_CDN_URL)
  addUrl(env.NEXT_PUBLIC_SERVER_URL)
  addUrl(env.NEXT_PUBLIC_SITE_URL)

  for (const entry of (env.NEXT_PUBLIC_IMAGE_HOSTS ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)) {
    if (entry.includes('://')) addUrl(entry)
    else add('https', entry)
  }

  add('http', 'localhost')
  add('http', '127.0.0.1')
  return patterns
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test:unit src/starter/imageHosts.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Wire into `next.config.js`**

Add the import at the top of `next.config.js` (with the other imports):

```js
import { buildImageRemotePatterns } from './src/starter/imageHosts.mjs'
```

Replace the entire `images` block:

```js
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      // Local dev: Payload serves media with an absolute URL derived from
      // NEXT_PUBLIC_SERVER_URL (http://localhost:3000).
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'http', hostname: '127.0.0.1' },
    ],
  },
```

with:

```js
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: buildImageRemotePatterns(),
  },
```

- [ ] **Step 6: Document env var**

In `.env.example`, under the storage section, add:

```
# Extra hosts allowed for Next Image Optimization (comma-separated bare hosts or
# URLs), in addition to NEXT_PUBLIC_CDN_URL / NEXT_PUBLIC_SERVER_URL. Example:
# NEXT_PUBLIC_IMAGE_HOSTS="bucket.r2.dev,logos.example.com"
```

- [ ] **Step 7: Verify the build starts and images resolve**

Run: `pnpm dev` (in a scratch shell), then confirm a CMS media image on the home page renders (200 from `/_next/image`), and a request for an off-list host is rejected:

Run: `curl -s -o /dev/null -w "%{http_code}\n" "http://localhost:3000/_next/image?url=https%3A%2F%2Fexample.org%2Fx.jpg&w=640&q=75"`
Expected: `400`.

- [ ] **Step 8: Typecheck and commit**

Run: `pnpm typecheck`
Expected: no errors.

```bash
git add src/starter/imageHosts.mjs src/starter/imageHosts.test.ts next.config.js .env.example
git commit -m "feat(images): allow-list optimization hosts, drop wildcard (M1)"
```

---

### Task 3: Cache-tag helper (H1)

Introduce the single source of truth for cache tag names, used by both fetchers and the invalidation hook.

**Files:**
- Create: `src/utilities/cacheTags.ts`
- Create: `src/utilities/cacheTags.test.ts`

**Interfaces:**
- Produces:
  - `cacheTags.all: 'payload'`
  - `cacheTags.collection(slug: string): string` → `payload:col:<slug>`
  - `cacheTags.docSlug(slug: string, urlSlug: string): string` → `payload:slug:<slug>:<urlSlug>`
  - `cacheTags.global(name: string): string` → `payload:global:<name>`

- [ ] **Step 1: Write the failing test**

Create `src/utilities/cacheTags.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { cacheTags } from './cacheTags'

describe('cacheTags', () => {
  it('exposes the coarse fallback tag', () => {
    expect(cacheTags.all).toBe('payload')
  })

  it('builds collection tags', () => {
    expect(cacheTags.collection('news')).toBe('payload:col:news')
    expect(cacheTags.collection('live-feed')).toBe('payload:col:live-feed')
  })

  it('builds doc-slug tags', () => {
    expect(cacheTags.docSlug('news', 'my-post')).toBe('payload:slug:news:my-post')
  })

  it('builds global tags', () => {
    expect(cacheTags.global('site-settings')).toBe('payload:global:site-settings')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test:unit src/utilities/cacheTags.test.ts`
Expected: FAIL — cannot resolve `./cacheTags`.

- [ ] **Step 3: Write minimal implementation**

Create `src/utilities/cacheTags.ts`:

```ts
/**
 * Single source of truth for `unstable_cache` tag names. Fetchers tag their
 * cache entries and the Payload revalidation hook flushes the same strings, so
 * both must go through here. `all` stays as the coarse "flush everything"
 * fallback used by the manual /api/revalidate webhook.
 */
export const cacheTags = {
  all: 'payload' as const,
  collection: (slug: string) => `payload:col:${slug}`,
  docSlug: (slug: string, urlSlug: string) => `payload:slug:${slug}:${urlSlug}`,
  global: (name: string) => `payload:global:${name}`,
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test:unit src/utilities/cacheTags.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/utilities/cacheTags.ts src/utilities/cacheTags.test.ts
git commit -m "feat(cache): add granular cache-tag helper (H1)"
```

---

### Task 4: Scoped invalidation in the revalidation hook (H1)

Make `revalidateFrontCache` flush only the tags for the changed collection/global (read from the hook context), with a coarse fallback for broadly-embedded media.

**Files:**
- Modify: `src/hooks/revalidateFrontCache.ts`
- Create: `src/hooks/revalidateFrontCache.test.ts`

**Interfaces:**
- Consumes: `cacheTags` (Task 3).
- Produces:
  - `collectionRevalidationTags(slug: string, doc?: { slug?: unknown }): string[]`
  - `globalRevalidationTags(name: string): string[]`
  - unchanged exports `revalidateCollectionHooks`, `revalidateGlobalHooks` (same spread shape used by collections/globals — no call-site changes).

**Note:** Payload passes `collection` (with `.slug`) to `afterChange`/`afterDelete` and `global` (with `.slug`) to global `afterChange`. The hook reads the slug from there, so the 14 collection/global files need no edits.

- [ ] **Step 1: Write the failing test**

Create `src/hooks/revalidateFrontCache.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { collectionRevalidationTags, globalRevalidationTags } from './revalidateFrontCache'

describe('collectionRevalidationTags', () => {
  it('returns the collection tag plus the doc-slug tag when a slug exists', () => {
    expect(collectionRevalidationTags('news', { slug: 'my-post' })).toEqual([
      'payload:col:news',
      'payload:slug:news:my-post',
    ])
  })

  it('returns only the collection tag when the doc has no slug', () => {
    expect(collectionRevalidationTags('news', {})).toEqual(['payload:col:news'])
  })

  it('coarse-flushes for media (embedded across many docs)', () => {
    expect(collectionRevalidationTags('media', { slug: 'x' })).toEqual(['payload'])
  })
})

describe('globalRevalidationTags', () => {
  it('returns the global tag', () => {
    expect(globalRevalidationTags('site-settings')).toEqual(['payload:global:site-settings'])
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test:unit src/hooks/revalidateFrontCache.test.ts`
Expected: FAIL — `collectionRevalidationTags` is not exported.

- [ ] **Step 3: Rewrite the hook file**

Replace the entire contents of `src/hooks/revalidateFrontCache.ts` with:

```ts
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from 'payload'
import { cacheTags } from '@/utilities/cacheTags'

// Collections whose docs are embedded across many pages (media) can't be
// scoped cheaply — flush everything for those instead.
const COARSE_COLLECTIONS = new Set(['media'])

export function collectionRevalidationTags(slug: string, doc?: { slug?: unknown }): string[] {
  if (COARSE_COLLECTIONS.has(slug)) return [cacheTags.all]
  const tags = [cacheTags.collection(slug)]
  if (doc && typeof doc.slug === 'string' && doc.slug) {
    tags.push(cacheTags.docSlug(slug, doc.slug))
  }
  return tags
}

export function globalRevalidationTags(name: string): string[] {
  return [cacheTags.global(name)]
}

async function flush(tags: string[]): Promise<void> {
  try {
    const { revalidateTag } = await import('next/cache')
    for (const tag of tags) revalidateTag(tag)
  } catch {
    /* not running inside Next.js (e.g. the Payload CLI) */
  }
}

/** Flush the coarse `payload` tag directly (used by the manual webhook path). */
export async function revalidateFrontCache(): Promise<void> {
  await flush([cacheTags.all])
}

/** Spread into a collection's `hooks` to revalidate scoped tags on write. */
export const revalidateCollectionHooks: {
  afterChange: CollectionAfterChangeHook[]
  afterDelete: CollectionAfterDeleteHook[]
} = {
  afterChange: [
    ({ collection, doc }) => {
      void flush(collectionRevalidationTags(collection.slug, doc as { slug?: unknown }))
      return doc
    },
  ],
  afterDelete: [
    ({ collection, doc }) => {
      void flush(collectionRevalidationTags(collection.slug, doc as { slug?: unknown }))
      return doc
    },
  ],
}

/** Spread into a global's `hooks` to revalidate its scoped tag on save. */
export const revalidateGlobalHooks: { afterChange: GlobalAfterChangeHook[] } = {
  afterChange: [
    ({ global, doc }) => {
      void flush(globalRevalidationTags(global.slug))
      return doc
    },
  ],
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test:unit src/hooks/revalidateFrontCache.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Confirm the webhook still uses the coarse flush**

Read `src/app/api/revalidate/route.ts` and confirm it calls `revalidateTag('payload')` (unchanged). No edit needed — this step is a verification that Task 4 did not break the fallback path.

- [ ] **Step 6: Typecheck and commit**

Run: `pnpm typecheck`
Expected: no errors.

```bash
git add src/hooks/revalidateFrontCache.ts src/hooks/revalidateFrontCache.test.ts
git commit -m "feat(cache): scope revalidation to changed collection/global (H1)"
```

---

### Task 5: Point fetchers at scoped tags (H1)

Change every `tags: ['payload']` in the front-end data utilities to the narrowest tag(s) via `cacheTags`, matching what the hook flushes.

**Files:**
- Modify: `src/utilities/getNewsPosts.ts:38,54`
- Modify: `src/utilities/getPageBySlug.ts:24`
- Modify: `src/utilities/getPageContent.ts:31`
- Modify: `src/utilities/getSiteSettings.ts:43,60`
- Modify: `src/utilities/getLiveFeed.ts` (both `unstable_cache` calls)
- Modify: `src/utilities/getSignals.ts` (both `unstable_cache` calls)
- Modify: `src/utilities/sitemapData.ts` (the `unstable_cache` call)

**Interfaces:**
- Consumes: `cacheTags` (Task 3). Tag strings MUST match Task 4's hook output exactly:
  - news list → `[cacheTags.collection('news')]`; news by slug → `[cacheTags.collection('news'), cacheTags.docSlug('news', slug)]`
  - pages by slug → `[cacheTags.collection('pages'), cacheTags.docSlug('pages', slug)]`
  - page globals (`home-page`…`news-page`) → `[cacheTags.global(slug)]`
  - site-settings + sidebar → `[cacheTags.global('site-settings')]`
  - live-feed list → `[cacheTags.collection('live-feed')]`; by slug → `+ cacheTags.docSlug('live-feed', slug)`
  - signals list → `[cacheTags.collection('signals')]`; by slug → `+ cacheTags.docSlug('signals', slug)`
  - sitemap rows → `[cacheTags.collection(collection)]`

- [ ] **Step 1: `getNewsPosts.ts`**

Add import (after existing imports):

```ts
import { cacheTags } from '@/utilities/cacheTags'
```

Line 38 — change `{ tags: ['payload'] },` (inside `findNewsPosts`) to:

```ts
    { tags: [cacheTags.collection('news')] },
```

Line 54 — change the `getNewsPostBySlug` cache options `{ tags: ['payload'] }` to:

```ts
  unstable_cache(() => fetchNewsPostBySlug(slug), ['news-post', slug], {
    tags: [cacheTags.collection('news'), cacheTags.docSlug('news', slug)],
  })(),
```

- [ ] **Step 2: `getPageBySlug.ts`**

Add import:

```ts
import { cacheTags } from '@/utilities/cacheTags'
```

Change the `getPageBySlug` cache options to:

```ts
  unstable_cache(() => fetchPageBySlug(slug), ['page', slug], {
    tags: [cacheTags.collection('pages'), cacheTags.docSlug('pages', slug)],
  })(),
```

- [ ] **Step 3: `getPageContent.ts`**

Add import:

```ts
import { cacheTags } from '@/utilities/cacheTags'
```

Change `cachedGlobal` so each page-global caches under its own global tag:

```ts
const cachedGlobal = <T>(slug: PageGlobalSlug) =>
  unstable_cache(() => fetchGlobal<T>(slug), [slug], { tags: [cacheTags.global(slug)] })()
```

- [ ] **Step 4: `getSiteSettings.ts`**

Add import:

```ts
import { cacheTags } from '@/utilities/cacheTags'
```

Change both cache calls to the `site-settings` global tag:

```ts
export const getSiteSettings = () =>
  unstable_cache(fetchSiteSettings, ['site-settings'], {
    tags: [cacheTags.global('site-settings')],
  })()
```

```ts
export const getSiteSidebar = () =>
  unstable_cache(fetchSiteSidebar, ['site-sidebar'], {
    tags: [cacheTags.global('site-settings')],
  })()
```

- [ ] **Step 5: `getLiveFeed.ts`**

Add import:

```ts
import { cacheTags } from '@/utilities/cacheTags'
```

Change the list cache (`findLiveFeed`) options to `{ tags: [cacheTags.collection('live-feed')] }`, and the by-slug cache (`getLiveFeedBySlug`) options to:

```ts
    { tags: [cacheTags.collection('live-feed'), cacheTags.docSlug('live-feed', slug)] },
```

- [ ] **Step 6: `getSignals.ts`**

Add import:

```ts
import { cacheTags } from '@/utilities/cacheTags'
```

Change the list cache (`findSignals`) options to `{ tags: [cacheTags.collection('signals')] }`, and the by-slug cache (`getSignalBySlug`) options to:

```ts
    { tags: [cacheTags.collection('signals'), cacheTags.docSlug('signals', slug)] },
```

- [ ] **Step 7: `sitemapData.ts`**

Add import:

```ts
import { cacheTags } from '@/utilities/cacheTags'
```

Change the `getPublishedSitemapRows` cache options to:

```ts
  unstable_cache(() => fetchPublishedRows(collection), ['sitemap-rows', collection], {
    tags: [cacheTags.collection(collection)],
  })()
```

- [ ] **Step 8: Confirm no stray coarse tags remain in fetchers**

Run: `grep -rn "tags: \['payload'\]" src/utilities`
Expected: no matches (all now go through `cacheTags`).

- [ ] **Step 9: Typecheck, unit tests, build**

Run: `pnpm typecheck && pnpm test:unit`
Expected: no type errors; all unit tests pass.

Run: `pnpm build`
Expected: build succeeds; listing routes still prerender as static (as before).

- [ ] **Step 10: Manual scoped-invalidation check**

Run: `pnpm dev`. Load `/` and `/news` (populate cache). In the admin, edit and save one News post. Reload `/news` — it reflects the change; reload `/` — served from cache unless it embeds that post. Edit the Site Settings global — only settings-dependent output refreshes.

- [ ] **Step 11: Commit**

```bash
git add src/utilities/getNewsPosts.ts src/utilities/getPageBySlug.ts src/utilities/getPageContent.ts src/utilities/getSiteSettings.ts src/utilities/getLiveFeed.ts src/utilities/getSignals.ts src/utilities/sitemapData.ts
git commit -m "feat(cache): tag fetchers with scoped cache tags (H1)"
```

---

### Task 6: Chunked sitemaps + index (M2)

Paginate sitemap rows (removing the silent 1000-row cap) and split news across shards with an auto-generated sitemap index.

**Files:**
- Modify: `src/utilities/sitemapData.ts`
- Create: `src/utilities/sitemapShards.ts`
- Create: `src/utilities/sitemapShards.test.ts`
- Modify: `src/app/sitemap.ts`
- Modify: `tests/e2e/sitemap.spec.ts`

**Interfaces:**
- Consumes: `getPublishedSitemapRows` (extended), `cacheTags`.
- Produces:
  - `SITEMAP_SHARD_SIZE: number` (= 10000)
  - `sitemapShardIds(newsCount: number, size?: number): { id: number }[]` — always includes `{ id: 0 }` (core: static + pages + live-feed); ids `1..n` are news pages.
  - `getPublishedSitemapRows(collection, opts?: { page?: number; limit?: number }): Promise<SitemapRow[]>`
  - `getPublishedSitemapCount(collection): Promise<number>`

- [ ] **Step 1: Write the failing test for shard math**

Create `src/utilities/sitemapShards.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { sitemapShardIds, SITEMAP_SHARD_SIZE } from './sitemapShards'

describe('sitemapShardIds', () => {
  it('returns only the core shard when there is no news', () => {
    expect(sitemapShardIds(0)).toEqual([{ id: 0 }])
  })

  it('adds one news shard per size-worth of posts', () => {
    expect(sitemapShardIds(1, 10)).toEqual([{ id: 0 }, { id: 1 }])
    expect(sitemapShardIds(10, 10)).toEqual([{ id: 0 }, { id: 1 }])
    expect(sitemapShardIds(11, 10)).toEqual([{ id: 0 }, { id: 1 }, { id: 2 }])
  })

  it('uses a 10k default shard size', () => {
    expect(SITEMAP_SHARD_SIZE).toBe(10000)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test:unit src/utilities/sitemapShards.test.ts`
Expected: FAIL — cannot resolve `./sitemapShards`.

- [ ] **Step 3: Implement shard helper**

Create `src/utilities/sitemapShards.ts`:

```ts
export const SITEMAP_SHARD_SIZE = 10000

/** Shard 0 is the "core" sitemap (static routes + CMS pages + live-feed).
 * Shards 1..n each hold up to `size` news URLs. */
export function sitemapShardIds(
  newsCount: number,
  size: number = SITEMAP_SHARD_SIZE,
): { id: number }[] {
  const newsShards = Math.ceil(Math.max(0, newsCount) / size)
  const ids = [{ id: 0 }]
  for (let i = 1; i <= newsShards; i++) ids.push({ id: i })
  return ids
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test:unit src/utilities/sitemapShards.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Extend `sitemapData.ts` with pagination + count**

In `src/utilities/sitemapData.ts`, replace the `fetchPublishedRows` function and the exported `getPublishedSitemapRows` with paginated versions, and add a count fetcher. Full replacement for the body below the imports:

```ts
export type SitemapRow = { slug: string; updatedAt: string | null }

async function fetchPublishedRows(
  collection: CollectionSlug,
  page: number,
  limit: number,
): Promise<SitemapRow[]> {
  try {
    const { default: config } = await import('@payload-config')
    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection,
      where: { _status: { equals: 'published' } },
      depth: 0,
      page,
      limit,
      overrideAccess: true,
      select: { slug: true, updatedAt: true },
    })
    return docs
      .map((doc) => {
        const d = doc as Record<string, unknown>
        return {
          slug: typeof d.slug === 'string' ? d.slug : '',
          updatedAt: typeof d.updatedAt === 'string' ? d.updatedAt : null,
        }
      })
      .filter((r) => r.slug)
  } catch {
    return []
  }
}

async function fetchPublishedCount(collection: CollectionSlug): Promise<number> {
  try {
    const { default: config } = await import('@payload-config')
    const payload = await getPayload({ config })
    const { totalDocs } = await payload.count({
      collection,
      where: { _status: { equals: 'published' } },
      overrideAccess: true,
    })
    return totalDocs
  } catch {
    return 0
  }
}

/** Cached published slug + updatedAt rows for one page of a collection. */
export const getPublishedSitemapRows = (
  collection: CollectionSlug,
  { page = 1, limit = 1000 }: { page?: number; limit?: number } = {},
) =>
  unstable_cache(
    () => fetchPublishedRows(collection, page, limit),
    ['sitemap-rows', collection, String(page), String(limit)],
    { tags: [cacheTags.collection(collection)] },
  )()

/** Cached count of published docs in a collection (for shard planning). */
export const getPublishedSitemapCount = (collection: CollectionSlug) =>
  unstable_cache(
    () => fetchPublishedCount(collection),
    ['sitemap-count', collection],
    { tags: [cacheTags.collection(collection)] },
  )()
```

Ensure the imports at the top include `unstable_cache`, `getPayload`, `CollectionSlug`, and `cacheTags` (add `import { cacheTags } from '@/utilities/cacheTags'` if Task 5 Step 7 has not already added it).

- [ ] **Step 6: Rewrite `app/sitemap.ts` to shard**

Replace the entire contents of `src/app/sitemap.ts` with:

```ts
import type { MetadataRoute } from 'next'

import { getSiteUrl } from '@/utilities/getSiteUrl'
import { getSiteSettings } from '@/utilities/getSiteSettings'
import { getPublishedSitemapRows, getPublishedSitemapCount } from '@/utilities/sitemapData'
import { sitemapShardIds, SITEMAP_SHARD_SIZE } from '@/utilities/sitemapShards'

export const revalidate = 3600

export async function generateSitemaps() {
  const settings = await getSiteSettings()
  const newsCount = settings.sitemapIncludeNews ? await getPublishedSitemapCount('news') : 0
  return sitemapShardIds(newsCount)
}

export default async function sitemap({
  id,
}: {
  id: number
}): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl()
  const now = new Date()
  const settings = await getSiteSettings()

  // News shards (id >= 1): one paginated slice of published news.
  if (id >= 1) {
    if (!settings.sitemapIncludeNews) return []
    const rows = await getPublishedSitemapRows('news', { page: id, limit: SITEMAP_SHARD_SIZE })
    return rows.map((row) => ({
      url: `${base}/news/${row.slug}`,
      lastModified: row.updatedAt ? new Date(row.updatedAt) : now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  }

  // Core shard (id === 0): static routes + CMS pages + live-feed.
  const [pageRows, liveFeedRows] = await Promise.all([
    getPublishedSitemapRows('pages'),
    settings.sitemapIncludeLiveFeed
      ? getPublishedSitemapRows('live-feed')
      : Promise.resolve([]),
  ])

  const byUrl = new Map<string, MetadataRoute.Sitemap[number]>()
  const add = (entry: MetadataRoute.Sitemap[number]) => byUrl.set(entry.url, entry)

  add({ url: `${base}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 })
  if (settings.sitemapIncludeNews) {
    add({ url: `${base}/news`, lastModified: now, changeFrequency: 'daily', priority: 0.8 })
  }
  if (settings.sitemapIncludeSignals) {
    add({ url: `${base}/signals`, lastModified: now, changeFrequency: 'daily', priority: 0.8 })
  }
  if (settings.sitemapIncludeLiveFeed) {
    add({ url: `${base}/live-feed`, lastModified: now, changeFrequency: 'hourly', priority: 0.8 })
  }
  add({ url: `${base}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 })
  add({ url: `${base}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 })

  for (const row of pageRows) {
    if (row.slug === 'home') continue
    add({
      url: `${base}/${row.slug}`,
      lastModified: row.updatedAt ? new Date(row.updatedAt) : now,
      changeFrequency: 'monthly',
      priority: 0.7,
    })
  }

  for (const row of liveFeedRows) {
    add({
      url: `${base}/live-feed/${row.slug}`,
      lastModified: row.updatedAt ? new Date(row.updatedAt) : now,
      changeFrequency: 'daily',
      priority: 0.6,
    })
  }

  return [...byUrl.values()]
}
```

- [ ] **Step 7: Update the e2e sitemap test**

Replace the contents of `tests/e2e/sitemap.spec.ts` with:

```ts
import { test, expect } from '@playwright/test'

test('sitemap.xml returns a sitemap index', async ({ request }) => {
  const res = await request.get('/sitemap.xml')
  expect(res.status()).toBeLessThan(400)
  const body = await res.text()
  expect(body).toContain('<sitemapindex')
})

test('the core sitemap shard is valid and lists the home URL', async ({ request }) => {
  const res = await request.get('/sitemap/0.xml')
  expect(res.status()).toBeLessThan(400)
  const body = await res.text()
  expect(body).toContain('<urlset')
  expect(body).toContain('<loc>')
})
```

- [ ] **Step 8: Typecheck, unit, build**

Run: `pnpm typecheck && pnpm test:unit`
Expected: pass.

Run: `pnpm build`
Expected: build succeeds; `/sitemap.xml` and `/sitemap/[__metadata_id__].xml` appear in the route list.

- [ ] **Step 9: Run the sitemap e2e**

Run: `pnpm test:e2e sitemap`
Expected: both sitemap tests pass (index contains `<sitemapindex`; shard 0 contains `<urlset` and `<loc>`).

- [ ] **Step 10: Commit**

```bash
git add src/utilities/sitemapData.ts src/utilities/sitemapShards.ts src/utilities/sitemapShards.test.ts src/app/sitemap.ts tests/e2e/sitemap.spec.ts
git commit -m "feat(seo): chunked sitemaps with index, remove 1000-row cap (M2)"
```

---

### Task 7: Dynamic Open Graph images for news (M3)

Add a branded per-article OG image via `next/og`, plus a shared template.

**Files:**
- Create: `src/app/lib/ogTemplate.tsx`
- Create: `src/app/(frontend)/news/[slug]/opengraph-image.tsx`
- Create: `tests/e2e/og-image.spec.ts`

**Interfaces:**
- Consumes: `getNewsPostBySlug` (`@/utilities/getNewsPosts`), `siteConfig` (`@/utilities/siteConfig`).
- Produces:
  - `ogImageSize: { width: 1200; height: 630 }`
  - `ogImageElement(opts: { title: string; label?: string; siteName: string }): JSX.Element`

- [ ] **Step 1: Create the shared OG template**

Create `src/app/lib/ogTemplate.tsx`:

```tsx
import type { JSX } from 'react'

export const ogImageSize = { width: 1200, height: 630 }

/** Layout for `next/og` ImageResponse. Uses the built-in default font (no
 * network fetch) so it works offline and under a strict CSP. */
export function ogImageElement({
  title,
  label,
  siteName,
}: {
  title: string
  label?: string
  siteName: string
}): JSX.Element {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '80px',
        background: 'linear-gradient(135deg, #0b0f1a 0%, #111827 100%)',
        color: '#ffffff',
      }}
    >
      <div style={{ display: 'flex', fontSize: 32, letterSpacing: 2, opacity: 0.8 }}>
        {(label ?? siteName).toUpperCase()}
      </div>
      <div style={{ display: 'flex', fontSize: 72, fontWeight: 700, lineHeight: 1.1 }}>
        {title}
      </div>
      <div style={{ display: 'flex', fontSize: 28, opacity: 0.7 }}>{siteName}</div>
    </div>
  )
}
```

- [ ] **Step 2: Create the news OG route**

Create `src/app/(frontend)/news/[slug]/opengraph-image.tsx`:

```tsx
import { ImageResponse } from 'next/og'
import { getNewsPostBySlug } from '@/utilities/getNewsPosts'
import { siteConfig } from '@/utilities/siteConfig'
import { ogImageElement, ogImageSize } from '@/app/lib/ogTemplate'

export const size = ogImageSize
export const contentType = 'image/png'
export const alt = 'News article'
export const revalidate = 3600

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getNewsPostBySlug(slug)
  return new ImageResponse(
    ogImageElement({
      title: post?.title ?? siteConfig.name,
      label: 'News',
      siteName: siteConfig.name,
    }),
    ogImageSize,
  )
}
```

- [ ] **Step 3: Verify `siteConfig` exposes `name`**

Run: `grep -n "name" src/utilities/siteConfig.ts`
Expected: a `name` property exists on the exported `siteConfig`. If it is under a different key, use that key in Steps 1–2 instead.

- [ ] **Step 4: Write the e2e test**

Create `tests/e2e/og-image.spec.ts`:

```ts
import { test, expect } from '@playwright/test'

test('news opengraph-image returns a PNG', async ({ request }) => {
  // Falls back to the site name for unknown slugs, so any slug yields a PNG.
  const res = await request.get('/news/any-slug/opengraph-image')
  expect(res.status()).toBe(200)
  expect(res.headers()['content-type']).toContain('image/png')
})
```

- [ ] **Step 5: Typecheck and build**

Run: `pnpm typecheck`
Expected: no errors.

Run: `pnpm build`
Expected: build succeeds; the news route now emits an `opengraph-image` metadata route.

- [ ] **Step 6: Run the OG e2e**

Run: `pnpm test:e2e og-image`
Expected: PASS — 200, `content-type: image/png`.

- [ ] **Step 7: Commit**

```bash
git add "src/app/lib/ogTemplate.tsx" "src/app/(frontend)/news/[slug]/opengraph-image.tsx" tests/e2e/og-image.spec.ts
git commit -m "feat(seo): dynamic OG images for news articles (M3)"
```

---

### Task 8: Full verification pass

Confirm the whole change set is coherent before wrapping up.

**Files:** none (verification only).

- [ ] **Step 1: Lint, typecheck, unit tests**

Run: `pnpm lint && pnpm typecheck && pnpm test:unit`
Expected: all clean; all unit suites pass (mongoConnectOptions, imageHosts, cacheTags, revalidateFrontCache, sitemapShards).

- [ ] **Step 2: Production build**

Run: `pnpm build`
Expected: succeeds. Confirm in the route table that the listing routes (`/`, `/news`, `/signals`, `/live-feed`, `/about`, `/contact`) are still statically prerendered (unchanged rendering model), and `/sitemap.xml` + the news OG route are present.

- [ ] **Step 3: E2E suite**

Run: `pnpm test:e2e`
Expected: sitemap + OG tests pass.

- [ ] **Step 4: Confirm no coarse tags leaked into fetchers**

Run: `grep -rn "'payload'" src/utilities src/app/api/revalidate`
Expected: `payload` appears only in `src/utilities/cacheTags.ts` (as `all`) and `src/app/api/revalidate/route.ts` (the webhook fallback) — not in any fetcher.

- [ ] **Step 5: Update the spec status**

In `docs/superpowers/specs/2026-07-10-seo-traffic-resilience-design.md`, change `**Status:** Approved for planning` to `**Status:** Implemented`.

```bash
git add docs/superpowers/specs/2026-07-10-seo-traffic-resilience-design.md
git commit -m "docs: mark SEO/traffic-resilience spec implemented"
```

---

## Self-Review

**Spec coverage:**
- H1 (granular invalidation) → Tasks 3, 4, 5.
- H2 (Mongo pool) → Task 1.
- M1 (image host allow-list) → Task 2.
- M2 (chunked sitemaps + index) → Task 6.
- M3 (dynamic OG) → Task 7.
- Spec "Testing" section → unit tests per task + e2e in Tasks 6–7 + Task 8 pass.
- Spec rollout order (H2 → M1 → H1 → M2 → M3) → Task order 1 → 2 → 3–5 → 6 → 7.
- L1–L3 are explicitly out of scope in the spec; no tasks, as intended.

**Deviation from spec (noted):** The spec said hook wiring in 14 files would change; implementation reads the slug from Payload's hook context instead, so those files need no edits (simpler, same behavior). Media is coarse-flushed (`payload`) because it is embedded across many docs — a correctness refinement within H1's intent.

**Placeholder scan:** No TBD/TODO; every code step shows complete code; every command has an expected result.

**Type consistency:** `cacheTags` names are defined once (Task 3) and reused verbatim in Tasks 4–6. `ogImageSize`/`ogImageElement` defined in Task 7 Step 1 and consumed in Step 2. `sitemapShardIds`/`SITEMAP_SHARD_SIZE` defined in Task 6 Step 3 and used in Step 6. `getPublishedSitemapRows` signature extended once (Task 6 Step 5) and called with the new options object in Step 6.
