# Admin-driven Header & Footer — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make all Header/Footer content editable from the Payload admin, decomposed into small components, with zero visual change (guaranteed by a seed).

**Architecture:** Extend the `header`/`footer` Payload globals; fetch them in the server `layout.tsx` via cached utilities and pass as props to a thin client `Header` orchestrator and a thin server `Footer` orchestrator, each composed of focused subcomponents. Navigation/column links use the existing `linkField()`, resolved through one shared `resolveLinkHref` helper. A seed populates the globals with the current content and uploads webp-converted social icons.

**Tech Stack:** Next.js 15 (App Router), Payload CMS 3, React 19, Tailwind, sharp, vitest.

## Global Constraints

- **Zero visual change**: preserve every existing markup element and Tailwind class string verbatim; only swap the data source. The only intentional deltas are the live date and the real "signals today" count.
- Package manager: `pnpm`. Run scripts with the existing `cross-env NODE_OPTIONS=--no-deprecation` wrappers already defined in `package.json`.
- After any change to a global's fields, run `pnpm generate:types` and keep `src/payload-types.ts` committed.
- Social icons are uploaded as **webp** (converted from the current PNGs) to preserve the exact look while optimizing.
- Copyright string keeps the current text verbatim, including the existing "Predicook" spelling, with `{year}` as a token replaced at render time. (Flag the typo to the user; do not silently change visible copy.)
- Verify each component task with `pnpm typecheck` and `pnpm build`; there is no component unit-test harness in this repo, so build + the seeded visual check are the acceptance gates (except `resolveLinkHref`, which gets a real vitest test).

---

### Task 1: `resolveLinkHref` shared helper + block refactor

**Files:**
- Create: `src/utilities/resolveLinkHref.ts`
- Create (test): `src/utilities/resolveLinkHref.test.ts`
- Modify: `src/blocks/CallToAction/Component.tsx:19-24`
- Modify: `src/blocks/Hero/Component.tsx:45-51`

**Interfaces:**
- Produces: `resolveLinkHref(link: LinkValue): string` where
  `LinkValue = { type?: 'reference' | 'custom'; reference?: { relationTo?: string; value?: unknown } | null; url?: string | null; label?: string | null; newTab?: boolean | null } | null | undefined`

- [ ] **Step 1: Write the failing test**

```ts
// src/utilities/resolveLinkHref.test.ts
import { describe, it, expect } from 'vitest'
import { resolveLinkHref } from './resolveLinkHref'

describe('resolveLinkHref', () => {
  it('returns the custom url', () => {
    expect(resolveLinkHref({ type: 'custom', url: '/news/category/politics' })).toBe(
      '/news/category/politics',
    )
  })
  it('resolves a page reference to /slug', () => {
    expect(
      resolveLinkHref({ type: 'reference', reference: { relationTo: 'pages', value: { slug: 'about' } } }),
    ).toBe('/about')
  })
  it('resolves a news reference to /news/slug', () => {
    expect(
      resolveLinkHref({ type: 'reference', reference: { relationTo: 'news', value: { slug: 'hello' } } }),
    ).toBe('/news/hello')
  })
  it('falls back to # when empty', () => {
    expect(resolveLinkHref(undefined)).toBe('#')
    expect(resolveLinkHref({ type: 'custom' })).toBe('#')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test:unit resolveLinkHref`
Expected: FAIL — cannot find module `./resolveLinkHref`.

- [ ] **Step 3: Write the implementation**

```ts
// src/utilities/resolveLinkHref.ts
export type LinkValue =
  | {
      type?: 'reference' | 'custom'
      reference?: { relationTo?: string; value?: unknown } | null
      url?: string | null
      label?: string | null
      newTab?: boolean | null
    }
  | null
  | undefined

/** Resolve a `linkField` value to an href. Internal `news` refs map to
 * `/news/<slug>`, other refs to `/<slug>`; custom links use their url. */
export function resolveLinkHref(link: LinkValue): string {
  if (
    link?.type === 'reference' &&
    link.reference &&
    typeof link.reference.value === 'object' &&
    link.reference.value !== null
  ) {
    const slug = (link.reference.value as { slug?: string }).slug ?? ''
    return link.reference.relationTo === 'news' ? `/news/${slug}` : `/${slug}`
  }
  return link?.url ?? '#'
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test:unit resolveLinkHref`
Expected: PASS (4 tests).

- [ ] **Step 5: Refactor the two blocks to use the helper**

In `src/blocks/CallToAction/Component.tsx`, replace the inline `href` computation (the `const href = link?.type === 'reference' ...` block) with:

```tsx
import { resolveLinkHref } from '@/utilities/resolveLinkHref'
// ...
const href = resolveLinkHref(link)
```

In `src/blocks/Hero/Component.tsx`, apply the identical replacement at its `const href = ...` block (lines ~45-51).

- [ ] **Step 6: Verify**

Run: `pnpm typecheck` → Expected: no errors.
Run: `pnpm test:unit resolveLinkHref` → Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/utilities/resolveLinkHref.ts src/utilities/resolveLinkHref.test.ts src/blocks/CallToAction/Component.tsx src/blocks/Hero/Component.tsx
git commit -m "feat: add resolveLinkHref helper, use it in blocks"
```

---

### Task 2: Extend `header` and `footer` globals + regenerate types

**Files:**
- Modify: `src/globals/Header.ts`
- Modify: `src/globals/Footer.ts`
- Modify (generated): `src/payload-types.ts`

**Interfaces:**
- Produces: generated types `Header` and `Footer` (from `@/payload-types`) with the fields below. Later tasks consume `Header['nav']`, `Header['social']`, `Header['cta']`, `Footer['columns']`, `Footer['social']`, etc.

- [ ] **Step 1: Rewrite `src/globals/Header.ts`**

```ts
import type { GlobalConfig } from 'payload'
import { isAdminOrEditor } from '@/access/isAdminOrEditor'
import { linkField } from '@/fields/link'
import { revalidateGlobalHooks } from '@/hooks/revalidateFrontCache'

export const Header: GlobalConfig = {
  slug: 'header',
  admin: { group: 'Settings' },
  access: { read: () => true, update: isAdminOrEditor },
  hooks: revalidateGlobalHooks,
  fields: [
    { name: 'logo', type: 'upload', relationTo: 'media' },
    { name: 'brandName', type: 'text' },
    {
      name: 'nav',
      type: 'array',
      maxRows: 10,
      fields: [linkField(), { name: 'children', type: 'array', fields: [linkField()] }],
    },
    {
      name: 'social',
      type: 'array',
      fields: [
        { name: 'icon', type: 'upload', relationTo: 'media', required: true },
        { name: 'url', type: 'text' },
      ],
    },
    {
      name: 'cta',
      type: 'group',
      fields: [
        { name: 'label', type: 'text' },
        { name: 'href', type: 'text' },
      ],
    },
  ],
}
```

- [ ] **Step 2: Rewrite `src/globals/Footer.ts`**

```ts
import type { GlobalConfig } from 'payload'
import { isAdminOrEditor } from '@/access/isAdminOrEditor'
import { linkField } from '@/fields/link'
import { revalidateGlobalHooks } from '@/hooks/revalidateFrontCache'

export const Footer: GlobalConfig = {
  slug: 'footer',
  admin: { group: 'Settings' },
  access: { read: () => true, update: isAdminOrEditor },
  hooks: revalidateGlobalHooks,
  fields: [
    { name: 'brandName', type: 'text' },
    { name: 'tagline', type: 'text' },
    {
      name: 'social',
      type: 'array',
      fields: [
        { name: 'icon', type: 'upload', relationTo: 'media', required: true },
        { name: 'url', type: 'text' },
      ],
    },
    {
      name: 'columns',
      type: 'array',
      maxRows: 4,
      fields: [
        { name: 'title', type: 'text' },
        { name: 'items', type: 'array', fields: [linkField()] },
      ],
    },
    { name: 'disclaimer', type: 'textarea' },
    { name: 'copyright', type: 'text' },
  ],
}
```

- [ ] **Step 3: Regenerate types**

Run: `pnpm generate:types`
Expected: `src/payload-types.ts` updates with `Header`/`Footer` interfaces containing the new fields.

- [ ] **Step 4: Verify**

Run: `pnpm typecheck`
Expected: no errors (existing `Header`/`Footer` types just gained fields; nothing consumes them yet).

- [ ] **Step 5: Commit**

```bash
git add src/globals/Header.ts src/globals/Footer.ts src/payload-types.ts
git commit -m "feat(cms): extend header/footer globals for admin-driven content"
```

---

### Task 3: Data utilities (`getHeaderData`, `getFooterData`, `getSignalsToday`)

**Files:**
- Create: `src/utilities/getHeaderData.ts`
- Create: `src/utilities/getFooterData.ts`
- Create: `src/utilities/getSignalsToday.ts`

**Interfaces:**
- Consumes: `Header`, `Footer` from `@/payload-types` (Task 2).
- Produces:
  - `getHeaderData(): Promise<Header>`
  - `getFooterData(): Promise<Footer>`
  - `getSignalsToday(): Promise<number>`

- [ ] **Step 1: Create `src/utilities/getHeaderData.ts`**

```ts
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Header } from '@/payload-types'

const EMPTY = { id: '', updatedAt: '', createdAt: '' } as unknown as Header

async function fetchHeaderData(): Promise<Header> {
  try {
    const payload = await getPayload({ config })
    return (await payload.findGlobal({ slug: 'header', depth: 1 })) as Header
  } catch {
    return EMPTY
  }
}

/** Cached `header` global (depth 1 populates logo/social media + link refs). */
export const getHeaderData = () =>
  unstable_cache(fetchHeaderData, ['header-global'], { tags: ['payload'] })()
```

- [ ] **Step 2: Create `src/utilities/getFooterData.ts`**

```ts
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Footer } from '@/payload-types'

const EMPTY = { id: '', updatedAt: '', createdAt: '' } as unknown as Footer

async function fetchFooterData(): Promise<Footer> {
  try {
    const payload = await getPayload({ config })
    return (await payload.findGlobal({ slug: 'footer', depth: 1 })) as Footer
  } catch {
    return EMPTY
  }
}

/** Cached `footer` global (depth 1 populates social media + link refs). */
export const getFooterData = () =>
  unstable_cache(fetchFooterData, ['footer-global'], { tags: ['payload'] })()
```

- [ ] **Step 3: Create `src/utilities/getSignalsToday.ts`**

```ts
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import config from '@payload-config'

async function fetchSignalsToday(): Promise<number> {
  try {
    const payload = await getPayload({ config })
    const now = new Date()
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const res = await payload.count({
      collection: 'signals',
      where: { publishedAt: { greater_than_equal: startOfDay.toISOString() } },
    })
    return res.totalDocs
  } catch {
    return 0
  }
}

/** Cached count of signals published today; refreshed via the `payload` tag. */
export const getSignalsToday = () =>
  unstable_cache(fetchSignalsToday, ['signals-today'], { tags: ['payload'] })()
```

- [ ] **Step 4: Verify**

Run: `pnpm typecheck`
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/utilities/getHeaderData.ts src/utilities/getFooterData.ts src/utilities/getSignalsToday.ts
git commit -m "feat: cached data utilities for header/footer globals and signals-today count"
```

---

### Task 4: Shared `SocialLinks` component

**Files:**
- Create: `src/app/ui/SocialLinks.tsx`

**Interfaces:**
- Consumes: `PayloadImage` (`src/app/components/PayloadImage.tsx`), `Media` from `@/payload-types`.
- Produces: `SocialLinks({ items, className?, linkClassName?, iconClassName? })` where
  `items: { icon?: Media | string | number | null; url?: string | null }[]`.

- [ ] **Step 1: Create the component**

```tsx
// src/app/ui/SocialLinks.tsx
import { PayloadImage } from '@/app/components/PayloadImage'
import type { Media } from '@/payload-types'

type SocialItem = { icon?: Media | string | number | null; url?: string | null }

export function SocialLinks({
  items,
  className = 'flex items-center gap-3',
  linkClassName = 'w-8 h-8',
  iconClassName,
}: {
  items: SocialItem[]
  className?: string
  linkClassName?: string
  iconClassName?: string
}) {
  if (!items?.length) return null
  return (
    <div className={className}>
      {items.map((item, i) => (
        <a
          key={i}
          href={item.url ?? ''}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClassName}
        >
          <PayloadImage media={item.icon} alt="" className={iconClassName} />
        </a>
      ))}
    </div>
  )
}
```

Note: original markup used `target="_black"` (a typo). Using `target="_blank"` is the correct, behavior-preserving equivalent and is not a visual change.

- [ ] **Step 2: Verify**

Run: `pnpm typecheck`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/ui/SocialLinks.tsx
git commit -m "feat(ui): shared SocialLinks component"
```

---

### Task 5: Seed header/footer globals + webp social icons

Run the seed early so the dev DB is populated before the components are wired, making the visual-parity check in Tasks 6–7 meaningful.

**Files:**
- Modify: `scripts/seed-predictbook.ts` (add a header/footer seeding section near the other `updateGlobal` calls)

**Interfaces:**
- Consumes: Task 2 global field shapes; `sharp` (already a dependency).

- [ ] **Step 1: Add imports at the top of `scripts/seed-predictbook.ts`** (if not already present)

```ts
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const publicDir = path.resolve(__dirname, '../public')
```

(If the script already defines `__dirname`/`publicDir` or imports these, reuse the existing ones instead of redeclaring.)

- [ ] **Step 2: Add a helper to upload a PNG as webp** (place above the main seed body, after `payload` is available inside the seed function; if the file structures things differently, inline the helper where `payload` is in scope)

```ts
async function uploadIconWebp(payload: any, pngName: string, alt: string) {
  const buf = await sharp(path.join(publicDir, pngName)).webp().toBuffer()
  const doc = await payload.create({
    collection: 'media',
    data: { alt },
    file: {
      data: buf,
      mimetype: 'image/webp',
      name: pngName.replace(/\.png$/, '.webp'),
      size: buf.length,
    },
  })
  return doc.id
}
```

- [ ] **Step 3: Seed the icons and globals** (add near the other `await payload.updateGlobal(...)` calls)

```ts
const headerTg = await uploadIconWebp(payload, 'tg.png', 'Telegram')
const headerX = await uploadIconWebp(payload, 'x.png', 'X')
const footerTg = await uploadIconWebp(payload, 'footerTg.png', 'Telegram')
const footerX = await uploadIconWebp(payload, 'footerX.png', 'X')

const link = (url: string, label: string) => ({ link: { type: 'custom' as const, url, label } })

await payload.updateGlobal({
  slug: 'header',
  data: {
    brandName: 'Predictbook',
    nav: [
      link('/', 'Home'),
      {
        link: { type: 'custom' as const, url: '/news', label: 'Analysis' },
        children: [
          link('/news', 'All analysis'),
          link('/news/category/sports', 'Sports'),
          link('/news/category/politics', 'Politics'),
          link('/news/category/economics', 'Economics'),
          link('/news/category/crypto', 'Crypto'),
        ],
      },
      link('/signals', 'Signals'),
      link('/live-feed', 'Live Feed'),
    ],
    social: [
      { icon: headerTg, url: '' },
      { icon: headerX, url: '' },
    ],
    cta: { label: 'Real-time alerts', href: '' },
  },
})

await payload.updateGlobal({
  slug: 'footer',
  data: {
    brandName: 'Predictbook',
    tagline: 'AI-powered newsroom covering prediction markets',
    social: [
      { icon: footerTg, url: '' },
      { icon: footerX, url: '' },
    ],
    columns: [
      {
        title: 'HOME',
        items: [
          link('/whale-alerts', 'Whale Alerts'),
          link('/arbitrage-opportunities', 'Arbitrage Opportunities'),
          link('/live-analysis', 'Live analysis'),
          link('/daily-recap', 'Daily Recap'),
          link('/weekly-series', 'Weekly series'),
          link('/newsletter', 'Newsletter (Substack)'),
        ],
      },
      {
        title: 'ANALYSIS',
        items: [
          link('/news/category/politics', 'Politics'),
          link('/news/category/economics', 'Economics'),
          link('/news/category/crypto', 'Crypto'),
          link('/news/category/technology', 'Technology'),
          link('/news/category/sports', 'Sports'),
          link('/news/category/science', 'Science'),
        ],
      },
      {
        title: 'ABOUT',
        items: [
          link('/about', 'About us'),
          link('/contact', 'Contact us'),
          link('/advertise', 'Advertise'),
          link('/privacy-policy', 'Privacy Policy'),
          link('/terms-of-service', 'Terms of Service'),
        ],
      },
    ],
    disclaimer:
      'This website does not constitute investing advice. Prediction markets and/or gambling may result in loss of funds. You are advised to conduct your own due diligence before taking any action',
    copyright: '© {year} Predicook. All rights reserved.',
  },
})
```

- [ ] **Step 4: Run the seed**

Run: `pnpm seed:predictbook`
Expected: completes without error; 4 media docs created, header/footer globals updated.

- [ ] **Step 5: Verify the globals populated**

Start dev (`pnpm dev`), open `http://localhost:3000/admin` → Settings → Header and Footer; confirm nav items, columns, social icons, brand, tagline, disclaimer, copyright are present. (Components are not wired yet, so the front-end still shows the old hardcode — that is expected until Tasks 6–7.)

- [ ] **Step 6: Commit**

```bash
git add scripts/seed-predictbook.ts
git commit -m "feat(seed): populate header/footer globals + webp social icons"
```

---

### Task 6: Footer decomposition + wiring

**Files:**
- Create: `src/app/components/Footer/FooterBrand.tsx`
- Create: `src/app/components/Footer/FooterColumns.tsx`
- Create: `src/app/components/Footer/FooterBottom.tsx`
- Rewrite: `src/app/Footer.tsx`
- Modify: `src/app/(frontend)/layout.tsx` (fetch footer data, pass to `<Footer>`)

**Interfaces:**
- Consumes: `Footer` type (Task 2), `getFooterData` (Task 3), `SocialLinks` (Task 4), `resolveLinkHref` (Task 1).
- Produces: `Footer({ data }: { data: FooterType })`.

- [ ] **Step 1: Create `FooterBrand.tsx`**

```tsx
// src/app/components/Footer/FooterBrand.tsx
import { SocialLinks } from '@/app/ui/SocialLinks'
import type { Footer } from '@/payload-types'

export function FooterBrand({
  brandName,
  tagline,
  social,
}: {
  brandName?: string | null
  tagline?: string | null
  social: NonNullable<Footer['social']>
}) {
  return (
    <div className="flex items-start justify-between">
      <div>
        <h2 className="text-3xl m-0 font-bold text-white">{brandName}</h2>
        <div className="mt-2 text-sm text-white-a80">{tagline}</div>
      </div>
      <SocialLinks items={social} className="flex items-center gap-3" linkClassName="w-8 h-8" />
    </div>
  )
}
```

- [ ] **Step 2: Create `FooterColumns.tsx`**

```tsx
// src/app/components/Footer/FooterColumns.tsx
import Link from 'next/link'
import { resolveLinkHref } from '@/utilities/resolveLinkHref'
import type { Footer } from '@/payload-types'

export function FooterColumns({ columns }: { columns: NonNullable<Footer['columns']> }) {
  return (
    <div className="mt-10 grid grid-cols-1 gap-8 border-t border-line-a08 pt-10 md:grid-cols-3">
      {columns.map((col, ci) => (
        <div key={ci}>
          <div className="text-xs tracking-wider font-medium text-muted-3 font-mono">{col.title}</div>
          <ul className="mt-4 space-y-2.5 pl-0">
            {(col.items ?? []).map((item, ii) => (
              <li key={ii}>
                <Link href={resolveLinkHref(item.link)} className="group inline-block">
                  <span className="text-sm text-cream">{item.link?.label}</span>
                  <span className="block h-px w-full scale-x-0 bg-cream origin-left transition-transform duration-300 group-hover:scale-x-100" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 3: Create `FooterBottom.tsx`**

```tsx
// src/app/components/Footer/FooterBottom.tsx
export function FooterBottom({
  disclaimer,
  copyright,
}: {
  disclaimer?: string | null
  copyright?: string | null
}) {
  const copyrightText = (copyright ?? '').replace('{year}', String(new Date().getFullYear()))
  return (
    <div className="mt-10 flex flex-col-reverse gap-4 border-t border-line-a08 pt-6 text-xs text-muted-4 md:flex-row md:items-center md:justify-between">
      <div className="max-w-xl">{disclaimer}</div>
      <div className="whitespace-nowrap text-white-a80">{copyrightText}</div>
    </div>
  )
}
```

- [ ] **Step 4: Rewrite `src/app/Footer.tsx`**

```tsx
// src/app/Footer.tsx
import type { Footer as FooterData } from '@/payload-types'
import { FooterBrand } from '@/app/components/Footer/FooterBrand'
import { FooterColumns } from '@/app/components/Footer/FooterColumns'
import { FooterBottom } from '@/app/components/Footer/FooterBottom'

export function Footer({ data }: { data: FooterData }) {
  return (
    <footer className="bg-ink">
      <div className="container-custom ">
        <div className="border-l border-r border-line-a08 px-6 py-12 md:px-12">
          <FooterBrand brandName={data.brandName} tagline={data.tagline} social={data.social ?? []} />
          <FooterColumns columns={data.columns ?? []} />
          <FooterBottom disclaimer={data.disclaimer} copyright={data.copyright} />
        </div>
      </div>
    </footer>
  )
}
```

- [ ] **Step 5: Wire in `layout.tsx`**

Add the import and fetch, and pass `data` to `<Footer>`. In `src/app/(frontend)/layout.tsx`:

```tsx
import { getFooterData } from '@/utilities/getFooterData'
// ...inside RootLayout, replace the settings fetch line with a parallel fetch:
const [settings, footerData] = await Promise.all([getSiteSettings(), getFooterData()])
// ...in JSX:
<Footer data={footerData} />
```

- [ ] **Step 6: Verify**

Run: `pnpm typecheck` → Expected: no errors.
Run: `pnpm build` → Expected: success.
Run: `pnpm dev`, open `http://localhost:3000`, scroll to the footer. Expected: brand, tagline, social icons, three columns (HOME/ANALYSIS/ABOUT), disclaimer, and `© <current year> Predicook. All rights reserved.` render **identically** to before.

- [ ] **Step 7: Commit**

```bash
git add src/app/components/Footer src/app/Footer.tsx "src/app/(frontend)/layout.tsx"
git commit -m "refactor(footer): admin-driven, decomposed into subcomponents"
```

---

### Task 7: Header decomposition + wiring

**Files:**
- Create: `src/app/components/Header/HeaderMeta.tsx`
- Create: `src/app/components/Header/CtaButton.tsx`
- Create: `src/app/components/Header/NavItem.tsx`
- Create: `src/app/components/Header/DesktopNav.tsx`
- Create: `src/app/components/Header/MobileMenu.tsx`
- Rewrite: `src/app/Header.tsx`
- Modify: `src/app/(frontend)/layout.tsx` (fetch header data + signals-today, pass to `<Header>`)

**Interfaces:**
- Consumes: `Header` type (Task 2), `getHeaderData` + `getSignalsToday` (Task 3), `SocialLinks` (Task 4), `resolveLinkHref` (Task 1), `PayloadImage`.
- Produces: `Header({ data, signalsToday }: { data: HeaderType; signalsToday: number })`.

- [ ] **Step 1: Create `HeaderMeta.tsx`** (client — live date + signals count)

```tsx
// src/app/components/Header/HeaderMeta.tsx
'use client'

import { useEffect, useState } from 'react'

export function HeaderMeta({ signalsToday }: { signalsToday: number }) {
  const [today, setToday] = useState('')
  useEffect(() => {
    const d = new Date()
    const base = d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
    setToday(`${base} · ${d.getFullYear()}`)
  }, [])

  return (
    <div className="flex items-center gap-4 max-lg:w-full max-lg:justify-between max-lg:py-3 max-lg:px-5 max-md:px-0">
      <div className="text-muted text-sm">{today}</div>
      <div className="flex items-center gap-1">
        <div className="w-2 h-2 rounded-full p-0.5  bg-success-a24 ">
          <div className="w-1 h-1 rounded-full bg-success" />
        </div>
        <div className="text-success text-sm">{signalsToday} signals today</div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create `CtaButton.tsx`**

```tsx
// src/app/components/Header/CtaButton.tsx
import Link from 'next/link'

export function CtaButton({
  label,
  href,
  className,
}: {
  label?: string | null
  href?: string | null
  className: string
}) {
  if (!label) return null
  if (href) {
    return (
      <Link href={href} className={className}>
        {label}
      </Link>
    )
  }
  return (
    <button className={className} type="button">
      {label}
    </button>
  )
}
```

- [ ] **Step 3: Create `NavItem.tsx`** (one desktop nav item + hover dropdown)

```tsx
// src/app/components/Header/NavItem.tsx
import Image from 'next/image'
import Down from '@/../public/down.png'
import { resolveLinkHref } from '@/utilities/resolveLinkHref'
import type { Header } from '@/payload-types'

type NavEntry = NonNullable<Header['nav']>[number]

export function NavItem({ item, active }: { item: NavEntry; active: boolean }) {
  const children = item.children ?? []
  const hasChildren = children.length > 0
  return (
    <div className="relative group  border-r border-line">
      <a
        href={resolveLinkHref(item.link)}
        className="flex items-center gap-2 p-4 max-xl:p-3 hover:bg-shell group-hover:bg-shell"
      >
        <span className={`text-sm ${active ? 'font-bold' : 'font-normal'}`}>{item.link?.label}</span>
        {hasChildren && (
          <Image src={Down} alt="" className="w-3 transition-transform group-hover:-rotate-180" />
        )}
      </a>
      {hasChildren && (
        <div className="absolute left-0 mx-auto top-full hidden group-hover:block bg-shell min-w-[105px] z-20 ">
          {children.map((child, i) => (
            <a
              key={i}
              href={resolveLinkHref(child.link)}
              className="block p-4 text-sm text-center  border-t border-paper hover:bg-sand-2"
            >
              {child.link?.label}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Create `DesktopNav.tsx`**

```tsx
// src/app/components/Header/DesktopNav.tsx
import { NavItem } from './NavItem'
import type { Header } from '@/payload-types'

type NavEntry = NonNullable<Header['nav']>[number]

export function DesktopNav({
  nav,
  isActive,
}: {
  nav: NonNullable<Header['nav']>
  isActive: (item: NavEntry) => boolean
}) {
  return (
    <div className="flex max-lg:hidden">
      {nav.map((item, i) => (
        <NavItem key={i} item={item} active={isActive(item)} />
      ))}
    </div>
  )
}
```

- [ ] **Step 5: Create `MobileMenu.tsx`** (client — slide-in drawer)

```tsx
// src/app/components/Header/MobileMenu.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Down from '@/../public/down.png'
import { SocialLinks } from '@/app/ui/SocialLinks'
import { CtaButton } from './CtaButton'
import { resolveLinkHref } from '@/utilities/resolveLinkHref'
import type { Header } from '@/payload-types'

type NavEntry = NonNullable<Header['nav']>[number]

export function MobileMenu({
  nav,
  social,
  cta,
  isActive,
  isOpen,
  onClose,
}: {
  nav: NonNullable<Header['nav']>
  social: NonNullable<Header['social']>
  cta: Header['cta']
  isActive: (item: NavEntry) => boolean
  isOpen: boolean
  onClose: () => void
}) {
  const [analysisOpen, setAnalysisOpen] = useState(false)
  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed top-0 right-0 z-50 h-screen w-[320px] bg-paper shadow-2xl transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-line p-6">
          <h2 className="text-xl font-semibold">Menu</h2>
          <button onClick={onClose} className="text-3xl bg-transparent leading-none">
            ×
          </button>
        </div>

        <div className="py-2">
          {nav.map((item, i) => {
            const children = item.children ?? []
            return (
              <div key={i}>
                {children.length === 0 ? (
                  <Link
                    href={resolveLinkHref(item.link)}
                    onClick={onClose}
                    className={`block border-b border-line px-6 py-5 text-lg ${
                      isActive(item) ? 'font-bold' : ''
                    }`}
                  >
                    {item.link?.label}
                  </Link>
                ) : (
                  <>
                    <a
                      onClick={() => setAnalysisOpen(!analysisOpen)}
                      className="flex w-full bg-transparent items-center justify-between border-b border-line px-6 py-5 text-lg"
                    >
                      <span className={isActive(item) ? 'font-bold' : ''}>{item.link?.label}</span>
                      <Image
                        src={Down}
                        alt=""
                        className={`w-3 transition-transform ${analysisOpen ? 'rotate-180' : ''}`}
                      />
                    </a>
                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        analysisOpen ? 'max-h-96' : 'max-h-0'
                      }`}
                    >
                      {children.map((child, ci) => (
                        <Link
                          key={ci}
                          href={resolveLinkHref(child.link)}
                          onClick={onClose}
                          className="block bg-shell-2 px-10 py-4 text-muted"
                        >
                          {child.link?.label}
                        </Link>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>

        <div className=" p-6">
          <CtaButton label={cta?.label} href={cta?.href} className="w-full rounded-lg bg-ink py-3 text-white" />
          <SocialLinks
            items={social}
            className="mt-6 items-center justify-center flex gap-4"
            linkClassName="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow"
            iconClassName="w-5"
          />
        </div>
      </div>
    </>
  )
}
```

- [ ] **Step 6: Rewrite `src/app/Header.tsx`** (thin client orchestrator)

```tsx
// src/app/Header.tsx
'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import Burger from '@/../public/menu.png'
import { InfiniteScroll } from './InfiniteScroll'
import { PayloadImage } from '@/app/components/PayloadImage'
import { SocialLinks } from '@/app/ui/SocialLinks'
import { DesktopNav } from '@/app/components/Header/DesktopNav'
import { HeaderMeta } from '@/app/components/Header/HeaderMeta'
import { CtaButton } from '@/app/components/Header/CtaButton'
import { MobileMenu } from '@/app/components/Header/MobileMenu'
import { resolveLinkHref } from '@/utilities/resolveLinkHref'
import type { Header as HeaderData } from '@/payload-types'

type NavEntry = NonNullable<HeaderData['nav']>[number]

export function Header({ data, signalsToday }: { data: HeaderData; signalsToday: number }) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const nav = data.nav ?? []
  const social = data.social ?? []

  const isActive = (item: NavEntry) => {
    if ((item.children ?? []).length > 0) return pathname.startsWith('/news')
    return pathname === resolveLinkHref(item.link)
  }

  return (
    <>
      <InfiniteScroll />
      <header className="md:container-custom">
        <div className="border-line  md:border-r md:border-l">
          <div className=" mx-auto md:px-6 py-3 flex items-center justify-between border-b border-line max-md:px-5">
            <div className="flex gap-2 items-center">
              <button onClick={() => setIsOpen(true)} className="lg:hidden bg-transparent border-none">
                <Image src={Burger} alt="Menu" className="w-6 h-6" />
              </button>
              <div className="font-bold text-3xl max-lg:text-2xl max-md:text-xl ">
                {data.logo ? <PayloadImage media={data.logo} alt={data.brandName ?? ''} /> : data.brandName}
              </div>{' '}
            </div>
            <div className="flex items-center gap-6">
              <SocialLinks items={social} className="flex items-center gap-3 max-lg:hidden" linkClassName="w-8 h-8" />
              <CtaButton
                label={data.cta?.label}
                href={data.cta?.href}
                className="bg-ink border-none text-paper py-3 px-4 rounded-lg text-base"
              />
            </div>
          </div>
          <div className="mx-auto md:pr-6 max-xl:pr-2 flex items-center justify-between  border-b border-line max-md:px-5">
            <DesktopNav nav={nav} isActive={isActive} />
            <HeaderMeta signalsToday={signalsToday} />
          </div>
        </div>
      </header>

      <MobileMenu
        nav={nav}
        social={social}
        cta={data.cta}
        isActive={isActive}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  )
}
```

- [ ] **Step 7: Wire in `layout.tsx`**

Extend the parallel fetch and pass props. In `src/app/(frontend)/layout.tsx`:

```tsx
import { getHeaderData } from '@/utilities/getHeaderData'
import { getSignalsToday } from '@/utilities/getSignalsToday'
// ...replace the Task-6 fetch with the full parallel fetch:
const [settings, headerData, footerData, signalsToday] = await Promise.all([
  getSiteSettings(),
  getHeaderData(),
  getFooterData(),
  getSignalsToday(),
])
// ...in JSX:
<Header data={headerData} signalsToday={signalsToday} />
```

- [ ] **Step 8: Verify**

Run: `pnpm typecheck` → Expected: no errors.
Run: `pnpm build` → Expected: success.
Run: `pnpm dev`, open `http://localhost:3000`. Expected: header renders identically — brand "Predictbook", social icons, "Real-time alerts" button, desktop nav with the Analysis hover dropdown, and the meta row now shows the **real current date** and the **real** "N signals today". Resize to mobile: burger opens the drawer with nav accordion, CTA, and social icons.

- [ ] **Step 9: Commit**

```bash
git add src/app/components/Header src/app/Header.tsx "src/app/(frontend)/layout.tsx"
git commit -m "refactor(header): admin-driven, decomposed into subcomponents; live date + signals count"
```

---

### Task 8: Final verification

**Files:** none (verification only).

- [ ] **Step 1: Full checks**

Run: `pnpm typecheck` → Expected: clean.
Run: `pnpm lint` → Expected: no new errors (pre-existing warnings in untouched files are acceptable).
Run: `pnpm build` → Expected: success, all routes present.

- [ ] **Step 2: Re-run the seed on a clean state (optional sanity)**

Run: `pnpm seed:predictbook`
Expected: header/footer globals populated; front-end unchanged.

- [ ] **Step 3: Visual parity pass**

With `pnpm dev`, verify header + footer on home, a news article, and a category page look identical to pre-change (aside from the live date and real signals count). Toggle mobile viewport for the drawer.

- [ ] **Step 4: Confirm admin editability**

In `/admin` → Settings → Header/Footer, change a nav label and a footer column title, save, and confirm the change appears on the site (after revalidation / reload).

---

## Notes / follow-ups for the user

- The footer copyright keeps the existing "Predicook" spelling verbatim for visual parity. It is now editable in **Settings → Footer → copyright** — fix to "Predictbook" there if desired.
- Social link URLs are seeded empty (matching the current hardcoded empty hrefs). Set real Telegram/X URLs in **Settings → Header/Footer → social**.
- On a fresh production Mongo, run `pnpm seed:predictbook` (against prod env) once so the globals are populated; otherwise header/footer render empty.
