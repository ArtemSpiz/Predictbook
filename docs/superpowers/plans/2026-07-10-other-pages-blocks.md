# Phase 2 — Migrate Other Sidebar+Main Pages to Region Blocks

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Bring the Signals, Live Feed, Blog, About, and Contact pages onto the same region+blocks admin pattern the home page uses — every rendered string admin-editable, right-rail promo unified on the `real-card` block, and the Contact form actually persisting to a new collection.

**Architecture:** A shared `blockType → async component` registry plus a generic `RenderBlockList` renderer (no grouping) serve the non-home pages; home keeps its grouping renderer but delegates single-block rendering to the same registry. Each page's global gets region tabs (blocks arrays); each page's container becomes a frame delegating to the renderer. New blocks: `signals-list`, `live-feed-list`, `blog-list`, `contact-form`, `contact-methods`, `contact-value`. Reuse `real-card`, `summary`, `live-feed-block`. Contact submissions persist via a new `contact-submissions` collection and `POST /api/contact`.

**Tech Stack:** Payload CMS 3.x (MongoDB Atlas, string IDs), Next.js App Router (RSC), TypeScript, Tailwind, Vitest, Playwright.

## Global Constraints

- **No hardcoded content** on any migrated page — every string/setting comes from Payload (the page global's block wrapper fields or the collection data). This includes fixing `ContactOther.tsx` hardcoded "Other ways to reach us".
- **Block Components use hand-written local prop types** (not `@/payload-types`), mirroring existing `src/blocks/*/Component.tsx`.
- **Relationship/upload IDs are strings** (mongo). Prop types touching them accept `number | string | Media`/`Category`.
- **Baseline (NOT regressions):** at branch HEAD there are the same 5 pre-existing typecheck errors (viewModels.ts:70/84/96, BlogSlug.tsx:23, LiveFeedSlug.tsx:10) and 3 pre-existing `src/starter/adapters/db.test.ts` failures. Gate for every task = introduce NO NEW typecheck errors or test failures. Verify the delta before committing.
- **Do NOT run `pnpm seed:predictbook` or `pnpm dev`/e2e against the remote Atlas DB** during implementation tasks — seed edits are code-only; runtime verification is a controller-run, user-gated step (Task P8).
- Blocks live in `src/blocks/<Name>/{config.ts,Component.tsx}`; add each to the registry (Task P1) as they are created.
- Match conventions; minimal comments. `pnpm typecheck` + `pnpm lint` clean before every commit; run full `pnpm test:unit` once before commit.
- Reuse the shared `hiddenField` (`src/blocks/_shared/fields.ts`) on every new block.

---

### Task P1: Shared block registry + generic `RenderBlockList`

**Files:**
- Create: `src/blocks/regionBlockComponents.tsx`
- Create: `src/blocks/RenderBlockList.tsx`
- Modify: `src/blocks/RenderHomeBlocks.tsx` (delegate single-block rendering to the registry)
- Test: `src/blocks/RenderBlockList.test.tsx` (pure segment logic already covered by `planRegion`; here test the registry lookup + hidden filtering via a tiny pure helper)

**Interfaces:**
- Produces: `regionBlockComponents: Record<string, React.ComponentType<{ block: any }>>` (maps blockType → the async Component, initially: `signal-feed, summary, real-card, analysis, live-feed-block, category-section`), and `RenderBlockList({ blocks }: { blocks: RenderableBlock[] | null | undefined })` — a server component that filters `hidden`, renders each block via the registry, inserts a `bg-line` divider between visible blocks, and warns (dev) on unknown blockType. Reuses `planRegion`'s sibling `RenderableBlock` type from `src/blocks/homeBlocks.ts`.

- [ ] **Step 1: Write the registry**

```tsx
// src/blocks/regionBlockComponents.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import { SignalFeedBlockComponent } from './SignalFeed/Component'
import { SummaryBlockComponent } from './Summary/Component'
import { RealCardBlockComponent } from './RealCard/Component'
import { AnalysisBlockComponent } from './Analysis/Component'
import { LiveFeedBlockComponent } from './LiveFeedBlock/Component'

// Single-block renderers shared by home and other pages. Grouped block types
// (signal-feed, category-section) are handled specially in RenderHomeBlocks and
// are intentionally NOT in this map.
export const regionBlockComponents: Record<string, React.ComponentType<{ block: any }>> = {
  summary: SummaryBlockComponent,
  'real-card': RealCardBlockComponent,
  analysis: AnalysisBlockComponent,
  'live-feed-block': LiveFeedBlockComponent,
}
```

> Later tasks add `signals-list`, `live-feed-list`, `blog-list`, `contact-form`, `contact-methods`, `contact-value` entries here.

- [ ] **Step 2: Write the generic renderer + a pure helper for tests**

```tsx
// src/blocks/RenderBlockList.tsx
import { Fragment } from 'react'
import type { RenderableBlock } from './homeBlocks'
import { regionBlockComponents } from './regionBlockComponents'

const Divider = () => <div className="w-full h-px bg-line" />

/** Visible blocks in order (pure — unit tested). */
export function visibleBlocks<B extends RenderableBlock>(blocks: B[] | null | undefined): B[] {
  return (blocks ?? []).filter((b) => !b.hidden)
}

export function RenderBlockList({ blocks }: { blocks: RenderableBlock[] | null | undefined }) {
  const visible = visibleBlocks(blocks)
  return (
    <>
      {visible.map((block, i) => {
        const Component = regionBlockComponents[block.blockType]
        if (!Component) {
          if (process.env.NODE_ENV !== 'production') {
            console.warn('No renderer for block:', block.blockType)
          }
          return null
        }
        return (
          <Fragment key={i}>
            {i > 0 && <Divider />}
            <Component block={block} />
          </Fragment>
        )
      })}
    </>
  )
}
```

- [ ] **Step 3: Write the failing test**

```tsx
// src/blocks/RenderBlockList.test.tsx
import { describe, expect, it } from 'vitest'
import { visibleBlocks } from './RenderBlockList'

const b = (blockType: string, hidden = false) => ({ blockType, hidden })

describe('visibleBlocks', () => {
  it('returns [] for nullish', () => expect(visibleBlocks(null)).toEqual([]))
  it('drops hidden blocks, preserves order', () => {
    expect(visibleBlocks([b('a'), b('b', true), b('c')])).toEqual([b('a'), b('c')])
  })
})
```

- [ ] **Step 4: Run test (fails → passes)**

Run: `pnpm test:unit -- src/blocks/RenderBlockList.test.tsx`
Expected: FAIL (module missing) → after Steps 1-2 exist, PASS (2 tests).

- [ ] **Step 5: Refactor RenderHomeBlocks to reuse the registry for singles**

In `src/blocks/RenderHomeBlocks.tsx`, replace the inline `switch`/ternary that maps single (non-grouped) block types to components with a lookup into `regionBlockComponents`. Keep the grouped handling (`signal-feed` → `<Signals>` wrapper, `category-section` → `<CategorySections>`) exactly as-is. Remove now-unused direct component imports that the registry covers (`SummaryBlockComponent`, `RealCardBlockComponent`, `AnalysisBlockComponent`, `LiveFeedBlockComponent`); keep `SignalFeedBlockComponent` and `CategorySections` imports (used by grouping). The rendered output must be identical.

- [ ] **Step 6: Verify + commit**

Run: `pnpm typecheck` (only 5 baseline errors) && `pnpm lint` && `pnpm test:unit` (only 3 baseline failures).
```bash
git add src/blocks/regionBlockComponents.tsx src/blocks/RenderBlockList.tsx src/blocks/RenderBlockList.test.tsx src/blocks/RenderHomeBlocks.tsx
git commit -m "feat(pages): shared block registry + generic RenderBlockList"
```

---

### Task P2: About page → region blocks (reuse live-feed-block + real-card)

Validates the per-page pattern end-to-end with zero new blocks. Removes the temp Feed stopgap and the old hardcoded `Home/RealCard`.

**Files:**
- Modify: `src/globals/AboutPage.ts` (add a "Right sidebar" region blocks field, keep content fields under a Content tab)
- Modify: `src/app/(frontend)/about/page.tsx` (render rail via `RenderBlockList`; drop `Home/Feed` + `Home/RealCard` imports)
- Modify: `scripts/seed-predictbook.ts` (seed About rail blocks)

**Interfaces:**
- Consumes: `RenderBlockList` (P1), `getAboutPageContent` (`src/utilities/getPageContent.ts`), `LiveFeedBlock`/`RealCardBlock` configs.
- Produces: `AboutPage.sidebarBlocks` (blocks: live-feed-block, real-card).

- [ ] **Step 1: Restructure the global**

Wrap the existing fields in a `tabs` field. Read the current `src/globals/AboutPage.ts` first, then produce:
```ts
fields: [
  {
    type: 'tabs',
    tabs: [
      { label: 'Content', fields: [ /* existing title, body, cta fields, unchanged */ ] },
      {
        label: 'Right sidebar',
        description: 'Widgets in the right column.',
        fields: [
          {
            name: 'sidebarBlocks',
            type: 'blocks',
            labels: { singular: 'Sidebar block', plural: 'Sidebar blocks' },
            blocks: [LiveFeedBlock, RealCardBlock],
          },
        ],
      },
    ],
  },
]
```
Import `LiveFeedBlock` from `@/blocks/LiveFeedBlock/config` and `RealCardBlock` from `@/blocks/RealCard/config`.

- [ ] **Step 2: Regenerate types**

Run: `pnpm generate:types` — `AboutPage` gains `sidebarBlocks`.

- [ ] **Step 3: Rewrite the About route's rail**

Read `src/app/(frontend)/about/page.tsx`. Replace the two hardcoded rail widgets (`<Feed .../>` stopgap + `<RealCard/>`) with `<RenderBlockList blocks={content?.sidebarBlocks} />` (fetch `content` via `getAboutPageContent()` if not already fetched). Remove the now-dead `Home/Feed` and `Home/RealCard` imports and the `findLiveFeed` call that fed the stopgap. Keep the main column (AboutMain) unchanged.

- [ ] **Step 4: Seed the About rail**

In `scripts/seed-predictbook.ts`, find the `about-page` `updateGlobal` and add:
```ts
sidebarBlocks: [
  { blockType: 'live-feed-block', heading: 'Live Feed', limit: 1, viewAllText: 'All threads', viewAllUrl: '/live-feed', hidden: false },
  { blockType: 'real-card', badgeIcon: lightningId, badgeText: 'Real-time alerts', showLiveDot: true, title: 'Want signals in real time?', description: 'Get instant alerts with advanced filtering tailored to your interests.', buttonText: 'Join Real-time Alerts', buttonUrl: '/signals', backgroundImage: graphId, hidden: false },
]
```
`lightningId`/`graphId` are defined earlier in the seed (home section). Ensure they are in scope; if the About `updateGlobal` runs before they are defined, move the `promoImg` helper + `lightningId`/`graphId` definitions above the first global that needs them.

- [ ] **Step 5: Verify + commit**

Run: `pnpm typecheck` (5 baseline) && `pnpm lint` && `pnpm test:unit` (3 baseline). Grep: `grep -n "Home/RealCard\|Home/Feed" src/app/(frontend)/about/page.tsx` → nothing.
```bash
git add src/globals/AboutPage.ts src/payload-types.ts "src/app/(frontend)/about/page.tsx" scripts/seed-predictbook.ts
git commit -m "feat(pages): migrate About rail to region blocks (live-feed + promo)"
```

---

### Task P3: Signals page → `signals-list` block

**Files:**
- Create: `src/blocks/SignalsList/config.ts`, `src/blocks/SignalsList/Component.tsx`, `src/blocks/SignalsList/config.test.ts`
- Modify: `src/app/components/Signals/SignalsInfo.tsx` and `SignalsCard.tsx` (accept props; read current files first)
- Modify: `src/blocks/regionBlockComponents.tsx` (register `signals-list`)
- Modify: `src/globals/SignalsPage.ts` (region tabs), `src/app/components/Signals/SignalsMain.tsx` (render via RenderBlockList), `scripts/seed-predictbook.ts`

**Interfaces:**
- Produces: `SignalsListBlock` (slug `signals-list`; fields `heading`, `subtitle`, `delayText`, `limit`, `hidden`), `SignalsListBlockComponent` (async; `findSignals({ limit })` all kinds, renders the info header + card list).

- [ ] **Step 1: Block config (TDD)**

```ts
// src/blocks/SignalsList/config.ts
import type { Block } from 'payload'
import { hiddenField } from '../_shared/fields'

export const SignalsListBlock: Block = {
  slug: 'signals-list',
  labels: { singular: 'Signals List', plural: 'Signals Lists' },
  fields: [
    { name: 'heading', type: 'text', required: true, defaultValue: 'Signals' },
    { name: 'subtitle', type: 'textarea' },
    { name: 'delayText', type: 'text', defaultValue: '10-min delay' },
    { name: 'limit', type: 'number', defaultValue: 20, min: 1, max: 50 },
    hiddenField,
  ],
}
```
Test (`config.test.ts`) asserts slug `signals-list` and fields `heading, subtitle, delayText, limit, hidden` — mirror `src/blocks/Analysis/config.test.ts`.

- [ ] **Step 2: Refactor SignalsInfo/SignalsCard to props**

Read `src/app/components/Signals/SignalsInfo.tsx` and `SignalsCard.tsx`. Change `SignalsInfo` to take `{ title, subtitle, delayText, count }` props (remove any global fetch/hardcoded strings inside). Ensure `SignalsCard` takes the signal cards as a prop (it likely already does). Do NOT change their markup/styles.

- [ ] **Step 3: Block Component**

```tsx
// src/blocks/SignalsList/Component.tsx
import SignalsInfo from '@/app/components/Signals/SignalsInfo'
import SignalsCard from '@/app/components/Signals/SignalsCard'
import { findSignals } from '@/utilities/getSignals'
import { signalToView } from '@/app/lib/viewModels'

type SignalsListBlockProps = { heading: string; subtitle?: string | null; delayText?: string | null; limit?: number | null }

export async function SignalsListBlockComponent({ block }: { block: SignalsListBlockProps }) {
  const res = await findSignals({ limit: block.limit ?? 20 })
  const items = res.docs.map(signalToView)
  return (
    <>
      <SignalsInfo title={block.heading} subtitle={block.subtitle ?? undefined} delayText={block.delayText ?? undefined} count={res.totalDocs} />
      <SignalsCard items={items} />
    </>
  )
}
```
> Read the CURRENT `SignalsCard`/`SignalsInfo` to match their exact prop shapes (the view-model type they expect — likely `SignalView`). Adjust `signalToView` usage to whatever the card consumes. If the current card maps signals itself, pass the raw docs it expects instead.

- [ ] **Step 4: Register + wire page global + render + seed**

- Add `'signals-list': SignalsListBlockComponent` to `regionBlockComponents.tsx`.
- `src/globals/SignalsPage.ts`: wrap fields in tabs → "Main content" tab with `mainBlocks: blocks[SignalsListBlock]`, "Right sidebar" tab with `sidebarBlocks: blocks[RealCardBlock]`. Keep the existing `title/subtitle/delayText` fields available for seeding the block, or drop them if fully superseded (prefer: remove them, since the block now owns those strings).
- `src/app/components/Signals/SignalsMain.tsx`: keep the two-column frame; render `<RenderBlockList blocks={content?.mainBlocks} />` in main and `<RenderBlockList blocks={content?.sidebarBlocks} />` in the rail (fetch via `getSignalsPageContent`). Remove the `Home/RealCard` import.
- Seed `signals-page`: `mainBlocks: [{ blockType: 'signals-list', heading: 'Signals', subtitle: '<the old SignalsPage subtitle>', delayText: '10-min delay', limit: 20, hidden: false }]`, `sidebarBlocks: [{ blockType: 'real-card', ...same promo as About... }]`.

- [ ] **Step 5: Verify + commit** (typecheck 5 baseline, lint clean, unit 3 baseline; grep no `Home/RealCard` in SignalsMain)
```bash
git commit -am "feat(pages): migrate Signals page to signals-list + promo blocks"
```

---

### Task P4: Live Feed page → `live-feed-list` block

Mirror Task P3 for Live Feed.

**Files:** Create `src/blocks/LiveFeedList/{config.ts,Component.tsx,config.test.ts}`; modify `src/app/components/LiveFeed/LiveFeedInfo.tsx` (props), `regionBlockComponents.tsx`, `src/globals/LiveFeedPage.ts`, `src/app/components/LiveFeed/LiveFeedMain.tsx`, `scripts/seed-predictbook.ts`.

**Interfaces:** `LiveFeedListBlock` (slug `live-feed-list`; fields `heading`, `subtitle`, `limit`, `hidden`), `LiveFeedListBlockComponent` (async; `findLiveFeed({ limit })`, renders info header + `FeedCard` list).

- [ ] **Step 1: Config (TDD)** — mirror P3 Step 1 with fields `heading, subtitle, limit, hidden` (no delayText); default `limit: 20`, max 50. Test asserts them.
- [ ] **Step 2: Refactor `LiveFeedInfo` to `{ title, subtitle }` props** (read current file; remove internal global fetch / hardcoded strings).
- [ ] **Step 3: Component** — read current `LiveFeedMain.tsx` to see how the list of `FeedCard` is built; mirror it:
```tsx
// src/blocks/LiveFeedList/Component.tsx
import LiveFeedInfo from '@/app/components/LiveFeed/LiveFeedInfo'
import FeedCard from '@/app/ui/FeedCard'
import Link from 'next/link'
import { findLiveFeed } from '@/utilities/getLiveFeed'
import { liveFeedToView } from '@/app/lib/viewModels'

type Props = { heading: string; subtitle?: string | null; limit?: number | null }
export async function LiveFeedListBlockComponent({ block }: { block: Props }) {
  const res = await findLiveFeed({ limit: block.limit ?? 20 })
  const items = res.docs.map(liveFeedToView)
  return (
    <>
      <LiveFeedInfo title={block.heading} subtitle={block.subtitle ?? undefined} />
      <div className="flex flex-col gap-6">
        {items.map((card) => (
          <Link key={card.slug} href={`/live-feed/${card.slug}`}><FeedCard card={card} /></Link>
        ))}
      </div>
    </>
  )
}
```
> Match the exact list markup/classes from the current `LiveFeedMain.tsx`.
- [ ] **Step 4:** register `'live-feed-list'`; `LiveFeedPage` global tabs (main: `live-feed-list`, rail: `real-card`); `LiveFeedMain.tsx` renders via `RenderBlockList`; seed `live-feed-page` (main list block with the old subtitle + rail promo). Remove `Home/RealCard` import.
- [ ] **Step 5: Verify + commit** `feat(pages): migrate Live Feed page to live-feed-list + promo blocks`

---

### Task P5: Blog page → `blog-list` block + reuse `summary` in rail

**Files:** Create `src/blocks/BlogList/{config.ts,Component.tsx,config.test.ts}`; modify `src/app/components/Blog/BlogsCol.tsx` (props), `src/app/components/Blog/BlogMain.tsx` (frame + RenderBlockList), `regionBlockComponents.tsx`, `src/globals/BlogPage.ts`, `scripts/seed-predictbook.ts`.

**Interfaces:** `BlogListBlock` (slug `blog-list`; fields `heading`, `subtitle`, `categories` array of `{ title }`, `limit`, `hidden`), `BlogListBlockComponent` (async; fetches `findBlogPosts({ limit })`, passes articles + labels + category chips to the client `BlogsCol`).

- [ ] **Step 1: Config (TDD)**
```ts
// src/blocks/BlogList/config.ts
import type { Block } from 'payload'
import { hiddenField } from '../_shared/fields'
export const BlogListBlock: Block = {
  slug: 'blog-list',
  labels: { singular: 'Blog List', plural: 'Blog Lists' },
  fields: [
    { name: 'heading', type: 'text', required: true, defaultValue: 'Analysis' },
    { name: 'subtitle', type: 'textarea' },
    { name: 'categories', type: 'array', label: 'Filter categories', fields: [{ name: 'title', type: 'text', required: true }] },
    { name: 'limit', type: 'number', defaultValue: 30, min: 1, max: 100 },
    hiddenField,
  ],
}
```
Test asserts slug + `heading, subtitle, categories, limit, hidden`.
- [ ] **Step 2: Refactor `BlogsCol`** — read `src/app/components/Blog/BlogsCol.tsx`. It's a client component doing search/filter/load-more. Change it to accept `{ title, subtitle, categories, articles }` props (instead of reading a global or hardcoded arrays). Keep all client behavior.
- [ ] **Step 3: Component**
```tsx
// src/blocks/BlogList/Component.tsx
import BlogsCol from '@/app/components/Blog/BlogsCol'
import { findBlogPosts } from '@/utilities/getBlogPosts'
import { blogToArticleView } from '@/app/lib/viewModels'
type Props = { heading: string; subtitle?: string | null; categories?: { title: string }[] | null; limit?: number | null }
export async function BlogListBlockComponent({ block }: { block: Props }) {
  const res = await findBlogPosts({ limit: block.limit ?? 30 })
  const articles = res.docs.map(blogToArticleView)
  return <BlogsCol title={block.heading} subtitle={block.subtitle ?? undefined} categories={(block.categories ?? []).map((c) => c.title)} articles={articles} />
}
```
- [ ] **Step 4:** register `'blog-list'`; `BlogPage` global → tabs (main: `blog-list`; rail: `summary`); `BlogMain.tsx` becomes the two-column frame rendering `RenderBlockList` for both regions (fetch via `getBlogPageContent`); remove the hardcoded `TypeSummary` array + hardcoded "Summary" `BlockTitle` header (they become a `summary` block in the rail). Seed `blog-page`: main `blog-list` (old title/subtitle + categories from the old global), rail `summary` block with tabs = the old daily/weekly TypeSummary content.
- [ ] **Step 5: Verify + commit** `feat(pages): migrate Blog page to blog-list + summary rail blocks`

---

### Task P6: Contact submissions collection + API route + real save

**Files:**
- Create: `src/collections/ContactSubmissions/index.ts`
- Modify: `src/payload.config.ts` (register the collection)
- Create: `src/app/api/contact/route.ts`
- Modify: `src/app/components/Contact/ContactCard.tsx` (POST to the route instead of the fake `setTimeout`)

**Interfaces:** Collection `contact-submissions` (fields: `name`, `email`, `subject`, `message`; timestamps on). `POST /api/contact` accepts `{ name, email, subject, message }` JSON, creates a submission via local Payload API with `overrideAccess: true`, returns `{ ok: true }` or a 400/500.

- [ ] **Step 1: Collection**
```ts
// src/collections/ContactSubmissions/index.ts
import type { CollectionConfig } from 'payload'
import { isAdminOrEditor } from '@/access/isAdminOrEditor'

export const ContactSubmissions: CollectionConfig = {
  slug: 'contact-submissions',
  labels: { singular: 'Contact Submission', plural: 'Contact Submissions' },
  admin: { useAsTitle: 'subject', defaultColumns: ['subject', 'name', 'email', 'createdAt'] },
  access: {
    // Created only via the server route (overrideAccess); never publicly listable.
    create: () => false,
    read: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  timestamps: true,
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'subject', type: 'text', required: true },
    { name: 'message', type: 'textarea', required: true },
  ],
}
```
Register in `src/payload.config.ts`: import `ContactSubmissions` and add it to the `collections: [...]` array (place near other collections). Run `pnpm generate:types`.

- [ ] **Step 2: API route**
```ts
// src/app/api/contact/route.ts
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, subject, message } = body ?? {}
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ ok: false, error: 'Missing fields' }, { status: 400 })
    }
    const payload = await getPayload({ config })
    await payload.create({
      collection: 'contact-submissions',
      data: { name, email, subject, message },
      overrideAccess: true,
    })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false, error: 'Failed to submit' }, { status: 500 })
  }
}
```

- [ ] **Step 3: Wire ContactCard** — read `src/app/components/Contact/ContactCard.tsx`. Replace the fake `await new Promise(setTimeout)` submit with a real `fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email, subject, message }) })`; set `status` to `'sent'` on `res.ok`, `'error'` otherwise. Keep the existing form fields/labels and status UI. Preserve field state variable names.

- [ ] **Step 4: Verify + commit** — `pnpm typecheck` (5 baseline) && `pnpm lint` && `pnpm test:unit`. (No unit test for the route; it's covered by manual/e2e in P8.)
```bash
git add src/collections/ContactSubmissions src/payload.config.ts src/payload-types.ts src/app/api/contact/route.ts src/app/components/Contact/ContactCard.tsx
git commit -m "feat(contact): persist submissions to contact-submissions collection via /api/contact"
```

---

### Task P7: Contact page → region blocks

**Files:** Create `src/blocks/ContactForm2/{config.ts,Component.tsx,config.test.ts}` (slug `contact-form-fields` to avoid clashing with the existing form-builder `contact-form-block`), `src/blocks/ContactMethods/{config.ts,Component.tsx}`, `src/blocks/ContactValue/{config.ts,Component.tsx}`; modify `src/app/components/Contact/{ContactMain,ContactCard,ContactOther,ContactValue}.tsx` (props; fix hardcoded heading), `regionBlockComponents.tsx`, `src/globals/ContactPage.ts`, `scripts/seed-predictbook.ts`.

**Interfaces:**
- `contact-form-fields` block: `heading`, `subtitle`, `subjectOptions` (array of `{ label }`), `nameLabel`, `emailLabel`, `subjectLabel`, `messageLabel`, `buttonText`, `hidden`. Component renders `ContactMain` (heading/subtitle) + `ContactCard` (labels/subjects as props).
- `contact-methods` block: `heading`, `methods` (array: `icon` upload, `title`, `linkText`, `link`), `socials` (array: `icon` upload, `link`), `hidden`. Component renders `ContactOther` with a heading prop (fixes hardcoded "Other ways to reach us").
- `contact-value` block: `title`, `text`, `buttonText`, `hidden`. Component renders `ContactValue`.

- [ ] **Step 1: Configs (TDD)** — create the three block configs with the fields above (+ `hiddenField`). One `config.test.ts` asserting each slug + its field names. Read the current `ContactPage.ts` field shapes (methods/socials/valueCard) to mirror the array subfields exactly.

- [ ] **Step 2: Refactor components to props** — read `ContactMain.tsx`, `ContactCard.tsx`, `ContactOther.tsx`, `ContactValue.tsx`. Change each to accept its content via props (labels, subject options, methods, socials, heading, value-card fields). In `ContactOther.tsx:14` replace the hardcoded `"Other ways to reach us"` with a `heading` prop. `ContactCard` keeps the real submit from P6 but takes `nameLabel/emailLabel/subjectLabel/messageLabel/subjectOptions/buttonText` as props.

- [ ] **Step 3: Block Components** — each wraps its refactored component, reading fields off `block`. Hand-written local prop types. Mirror the structure of home block Components.

- [ ] **Step 4: Register + global + render + seed**
- Add the three to `regionBlockComponents.tsx`.
- `src/globals/ContactPage.ts` → tabs: "Main content" (`mainBlocks: blocks[ContactForm2]`), "Right sidebar" (`sidebarBlocks: blocks[ContactMethods, ContactValue]`). The old flat `title/subtitle/methods/socials/valueCard` fields are superseded — move their content into the block seeds and remove the flat fields.
- `src/app/(frontend)/contact/page.tsx`: two-column frame rendering `RenderBlockList` for `mainBlocks` and `sidebarBlocks` (fetch via `getContactPageContent`).
- Seed `contact-page`: main `contact-form-fields` block (old title/subtitle + labels "Full name"/"Email address"/"Subject"/"Message" + the old `SUBJECT_OPTIONS` + button text); rail `contact-methods` (heading "Other ways to reach us" + the old methods/socials) and `contact-value` (old valueCard fields).

- [ ] **Step 5: Verify + commit** — typecheck 5 baseline, lint, unit 3 baseline; grep `grep -rn "Other ways to reach us" src/app/components/Contact/` → nothing (now from prop). 
```bash
git commit -am "feat(pages): migrate Contact page to region blocks (form/methods/value)"
```

---

### Task P8: Runtime verification (controller-run, user-gated)

**Files:** Create `tests/e2e/other-pages.spec.ts`.

- [ ] **Step 1: e2e spec** — Playwright tests asserting each migrated page renders its admin-driven content:
```ts
import { test, expect } from '@playwright/test'
const pages: [string, string][] = [
  ['/signals', 'Signals'],
  ['/live-feed', 'Live Feed'],
  ['/blog', 'Analysis'],
  ['/about', 'About Predictbook'],
  ['/contact', 'Contact'],
]
for (const [path, marker] of pages) {
  test(`renders ${path}`, async ({ page }) => {
    await page.goto(path)
    await expect(page.getByText(marker, { exact: false }).first()).toBeVisible()
  })
}
test('contact form submits', async ({ page }) => {
  await page.goto('/contact')
  await page.getByLabel(/name/i).fill('Test User')
  await page.getByLabel(/email/i).fill('test@example.com')
  await page.getByLabel(/message/i).fill('Hello from e2e')
  // submit + assert a success state per ContactCard's status UI
})
```
> Adjust selectors to the real form labels/roles after reading `ContactCard`.

- [ ] **Step 2: Commit** `test(pages): e2e coverage for migrated pages`

- [ ] **Step 3 (controller, user-gated):** After all tasks, the CONTROLLER re-seeds Atlas (`pnpm seed:predictbook`), clears `.next/cache`, starts dev, and curls each page for its admin-driven markers + submits the contact form and confirms a `contact-submissions` doc is created. Do not run this inside an implementer task.

---

## Self-Review

**Spec coverage (Phase 2 section):**
- Generalize renderer → P1. ✔
- About rail blocks + drop stopgap/old RealCard → P2. ✔
- Signals `signals-list` → P3. ✔
- Live Feed `live-feed-list` → P4. ✔
- Blog `blog-list` + summary rail → P5. ✔
- Contact persistence (`contact-submissions` + `/api/contact`) → P6. ✔
- Contact blocks + fix hardcoded heading → P7. ✔
- No hardcoded content across pages → P2–P7 (each removes its page's hardcoded strings/RealCard). ✔
- Verification → P8. ✔

**Placeholder scan:** "mirror home X / read current file Y" instructions are deliberate (established pattern; exact markup lives in the current component the implementer reads) — each names the file and the exact prop list, so they are actionable, not vague. New/critical code (registry, RenderBlockList, block configs, collection, API route, ContactCard fetch) is given in full.

**Type consistency:** `RenderableBlock` reused from `homeBlocks.ts` across P1; `regionBlockComponents` keys are the block slugs defined in each block config; page globals expose `mainBlocks`/`sidebarBlocks` consumed by `RenderBlockList`. Contact block slug is `contact-form-fields` to avoid clashing with the pre-existing form-builder `contact-form-block`.
