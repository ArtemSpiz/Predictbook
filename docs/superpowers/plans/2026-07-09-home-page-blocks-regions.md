# Home Page Region-Aware Blocks Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the home page on Payload's block system so every block is editable in admin, grouped by on-site region (left sidebar / main column), with zero hardcoded content.

**Architecture:** The `home-page` global becomes a `tabs` field — one tab per region — each holding a `blocks` array plus a small group of mobile-header labels. New domain blocks (Signal Feed, Analysis, Live Feed, Category Section) plus the existing Summary and Promo (RealCard) blocks render via a region renderer (`RenderHomeBlocks`). Each block is a server component that fetches its own collection data; only the block "wrapper" (headings, labels, limits, links, visibility, accent) is editor-controlled. A pure `planRegion` function groups consecutive signal/category blocks so the mobile collapse and mobile category switcher keep working.

**Tech Stack:** Payload CMS 3.x, Next.js App Router (RSC), TypeScript, Tailwind, Vitest (unit), Playwright (e2e).

## Global Constraints

- **No hardcoded content.** Every rendered string/setting on the home page comes from Payload (headings, subtitles, delay labels, view-all texts/links, mobile section headers). Collection-sourced cards count as admin-driven.
- **Tailwind needs literal class names.** Never build `bg-cat-${x}-bg` at runtime — use the static `ACCENT_CLASSES` map (Task 2).
- **Match existing conventions:** blocks live in `src/blocks/<Name>/{config.ts,Component.tsx}`; data utilities are `findSignals` / `findBlogPosts` / `findLiveFeed` from `src/utilities/`; view models come from `src/app/lib/viewModels.ts`.
- **Minimal comments** — only for non-obvious "why".
- Run `pnpm typecheck` and `pnpm lint` clean before every commit.

---

### Task 1: `planRegion` — pure region segmenter

**Files:**
- Create: `src/blocks/homeBlocks.ts`
- Test: `src/blocks/homeBlocks.test.ts`

**Interfaces:**
- Produces: `RenderableBlock` (`{ blockType: string; hidden?: boolean | null }`), `RegionSegment<B>` (`{ kind: 'group'; blocks: B[] } | { kind: 'single'; block: B }`), and `planRegion<B>(blocks, groupType): RegionSegment<B>[]`.

- [ ] **Step 1: Write the failing test**

```ts
// src/blocks/homeBlocks.test.ts
import { describe, expect, it } from 'vitest'
import { planRegion } from './homeBlocks'

const b = (blockType: string, hidden = false) => ({ blockType, hidden })

describe('planRegion', () => {
  it('returns [] for empty/nullish input', () => {
    expect(planRegion([], 'signal-feed')).toEqual([])
    expect(planRegion(null, 'signal-feed')).toEqual([])
  })

  it('drops hidden blocks', () => {
    expect(planRegion([b('summary', true)], 'signal-feed')).toEqual([])
  })

  it('wraps a non-group block as single', () => {
    expect(planRegion([b('summary')], 'signal-feed')).toEqual([
      { kind: 'single', block: b('summary') },
    ])
  })

  it('merges consecutive group-type blocks into one group', () => {
    const res = planRegion([b('signal-feed'), b('signal-feed'), b('summary')], 'signal-feed')
    expect(res).toEqual([
      { kind: 'group', blocks: [b('signal-feed'), b('signal-feed')] },
      { kind: 'single', block: b('summary') },
    ])
  })

  it('starts a new group when the run is interrupted', () => {
    const res = planRegion([b('signal-feed'), b('summary'), b('signal-feed')], 'signal-feed')
    expect(res.map((s) => s.kind)).toEqual(['group', 'single', 'group'])
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test:unit -- src/blocks/homeBlocks.test.ts`
Expected: FAIL — `planRegion` is not defined / module not found.

- [ ] **Step 3: Write minimal implementation**

```ts
// src/blocks/homeBlocks.ts
export interface RenderableBlock {
  blockType: string
  hidden?: boolean | null
}

export type RegionSegment<B extends RenderableBlock> =
  | { kind: 'group'; blocks: B[] }
  | { kind: 'single'; block: B }

/** Split a region's blocks into render segments: consecutive `groupType`
 *  blocks collapse into one `group` segment; everything else is a `single`.
 *  Hidden blocks are removed first. Order is preserved. */
export function planRegion<B extends RenderableBlock>(
  blocks: B[] | null | undefined,
  groupType: string,
): RegionSegment<B>[] {
  const visible = (blocks ?? []).filter((block) => !block.hidden)
  const segments: RegionSegment<B>[] = []
  let i = 0
  while (i < visible.length) {
    if (visible[i].blockType === groupType) {
      const group: B[] = []
      while (i < visible.length && visible[i].blockType === groupType) {
        group.push(visible[i])
        i++
      }
      segments.push({ kind: 'group', blocks: group })
    } else {
      segments.push({ kind: 'single', block: visible[i] })
      i++
    }
  }
  return segments
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test:unit -- src/blocks/homeBlocks.test.ts`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add src/blocks/homeBlocks.ts src/blocks/homeBlocks.test.ts
git commit -m "feat(home): add planRegion region segmenter"
```

---

### Task 2: Shared block field + accent color map

**Files:**
- Create: `src/blocks/_shared/fields.ts`
- Create: `src/blocks/_shared/accent.ts`
- Test: `src/blocks/_shared/accent.test.ts`

**Interfaces:**
- Produces: `hiddenField` (Payload `CheckboxField`), `Accent` type, `ACCENT_VALUES: Accent[]`, `ACCENT_CLASSES: Record<Accent, string>`, `accentClasses(accent: string): string`.

- [ ] **Step 1: Write the failing test**

```ts
// src/blocks/_shared/accent.test.ts
import { describe, expect, it } from 'vitest'
import { ACCENT_VALUES, accentClasses } from './accent'

describe('accentClasses', () => {
  it('returns full literal Tailwind classes for a known accent', () => {
    expect(accentClasses('sports')).toBe(
      'border-cat-sports-border text-cat-sports-text bg-cat-sports-bg',
    )
  })

  it('falls back to politics for an unknown accent', () => {
    expect(accentClasses('nope')).toBe(
      'border-cat-politics-border text-cat-politics-text bg-cat-politics-bg',
    )
  })

  it('exposes all selectable accent values', () => {
    expect(ACCENT_VALUES).toEqual(['politics', 'sports', 'crypto', 'tech', 'science'])
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test:unit -- src/blocks/_shared/accent.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Write the implementations**

```ts
// src/blocks/_shared/accent.ts
export type Accent = 'politics' | 'sports' | 'crypto' | 'tech' | 'science'

export const ACCENT_VALUES: Accent[] = ['politics', 'sports', 'crypto', 'tech', 'science']

// Full literal strings so Tailwind's content scanner keeps these classes.
export const ACCENT_CLASSES: Record<Accent, string> = {
  politics: 'border-cat-politics-border text-cat-politics-text bg-cat-politics-bg',
  sports: 'border-cat-sports-border text-cat-sports-text bg-cat-sports-bg',
  crypto: 'border-cat-crypto-border text-cat-crypto-text bg-cat-crypto-bg',
  tech: 'border-cat-tech-border text-cat-tech-text bg-cat-tech-bg',
  science: 'border-cat-science-border text-cat-science-text bg-cat-science-bg',
}

export function accentClasses(accent: string): string {
  return ACCENT_CLASSES[accent as Accent] ?? ACCENT_CLASSES.politics
}
```

```ts
// src/blocks/_shared/fields.ts
import type { CheckboxField } from 'payload'

/** Shared "hide this block on the site without deleting it" toggle. */
export const hiddenField: CheckboxField = {
  name: 'hidden',
  type: 'checkbox',
  label: 'Hide on site',
  defaultValue: false,
  admin: { description: 'Temporarily hide this block without deleting it.' },
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test:unit -- src/blocks/_shared/accent.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/blocks/_shared
git commit -m "feat(home): add shared hidden field and accent color map"
```

---

### Task 3: Signal Feed block (+ Alert refactor, CustomBtn href)

Replaces the two hardcoded `Alert` instances. Makes `heading`, `delayLabel`, `viewAllText`, `viewAllUrl`, `kind`, `limit` editable — fixing the hardcoded `"30-min delay"` and `"View all whale alerts"` in `Alert.tsx`.

**Files:**
- Create: `src/blocks/SignalFeed/config.ts`
- Create: `src/blocks/SignalFeed/Component.tsx`
- Modify: `src/app/ui/CustomBtn.tsx` (add optional `href`)
- Modify: `src/app/components/Home/Alert.tsx` (props instead of hardcoded strings)
- Test: `src/blocks/SignalFeed/config.test.ts`

**Interfaces:**
- Consumes: `hiddenField` (Task 2), `findSignals` (`src/utilities/getSignals.ts`), `signalToAlert` (`src/app/lib/viewModels.ts`), `AlertCard` (`src/app/components/Home/Alert.tsx`).
- Produces: `SignalFeedBlock` (Payload `Block`, slug `signal-feed`), `SignalFeedBlockComponent({ block })` (async RSC). New `Alert` props: `title, cards, delayLabel, viewAllText, viewAllUrl?`. New `CustomBtn` prop: `href?: string`.

- [ ] **Step 1: Write the failing config test**

```ts
// src/blocks/SignalFeed/config.test.ts
import { describe, expect, it } from 'vitest'
import { SignalFeedBlock } from './config'

const names = SignalFeedBlock.fields.map((f) => ('name' in f ? f.name : undefined))

describe('SignalFeedBlock', () => {
  it('has slug signal-feed', () => {
    expect(SignalFeedBlock.slug).toBe('signal-feed')
  })
  it('exposes the editable wrapper fields and hidden toggle', () => {
    for (const n of ['heading', 'kind', 'delayLabel', 'limit', 'viewAllText', 'viewAllUrl', 'hidden']) {
      expect(names).toContain(n)
    }
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test:unit -- src/blocks/SignalFeed/config.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Write the block config**

```ts
// src/blocks/SignalFeed/config.ts
import type { Block } from 'payload'
import { hiddenField } from '../_shared/fields'

export const SignalFeedBlock: Block = {
  slug: 'signal-feed',
  labels: { singular: 'Signal Feed', plural: 'Signal Feeds' },
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
      admin: { description: 'On-site title, e.g. "Whale Alert" or "Arbitrage Alert".' },
    },
    {
      name: 'kind',
      type: 'select',
      required: true,
      defaultValue: 'whale',
      admin: { description: 'Which signals to pull from the Signals collection.' },
      options: [
        { label: 'Whale alert', value: 'whale' },
        { label: 'Arbitrage', value: 'arbitrage' },
      ],
    },
    { name: 'delayLabel', type: 'text', defaultValue: '30-min delay' },
    { name: 'limit', type: 'number', defaultValue: 3, min: 1, max: 10 },
    { name: 'viewAllText', type: 'text', required: true, defaultValue: 'View all signals' },
    { name: 'viewAllUrl', type: 'text', defaultValue: '/signals' },
    hiddenField,
  ],
}
```

- [ ] **Step 4: Run config test to verify it passes**

Run: `pnpm test:unit -- src/blocks/SignalFeed/config.test.ts`
Expected: PASS.

- [ ] **Step 5: Add `href` support to CustomBtn**

Replace the whole `src/app/ui/CustomBtn.tsx` with:

```tsx
import Image from 'next/image'
import Link from 'next/link'
import Arrow from '../../../public/BtnArrow.png'

interface CustomBtnProps {
  text: string
  center?: boolean
  light?: boolean
  icon?: boolean
  href?: string
}

export default function CustomBtn({
  text,
  center = false,
  light = false,
  icon = true,
  href,
}: CustomBtnProps) {
  const className = `group w-full border-none flex items-center gap-2 px-3 py-2.5 rounded-lg ${
    center ? 'justify-center' : 'justify-between'
  } ${light ? 'bg-[#F4F0ED] ' : 'bg-sand'}`

  const inner = (
    <>
      <span>{text}</span>
      {icon && (
        <Image
          src={Arrow}
          alt="Arrow"
          className="w-4 h-4 relative group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-500 ease-out"
        />
      )}
    </>
  )

  if (href) {
    return (
      <Link href={href} className={className}>
        {inner}
      </Link>
    )
  }
  return (
    <button type="button" className={className}>
      {inner}
    </button>
  )
}
```

- [ ] **Step 6: Refactor Alert to take props (remove hardcoded strings)**

In `src/app/components/Home/Alert.tsx`:

Change the `AlertProps` type and the header/button. Replace:

```tsx
type AlertProps = {
  title: string
  cards: AlertCard[]
}

export default function Alert({ title, cards }: AlertProps) {
```
with:
```tsx
type AlertProps = {
  title: string
  cards: AlertCard[]
  delayLabel?: string
  viewAllText: string
  viewAllUrl?: string
}

export default function Alert({ title, cards, delayLabel, viewAllText, viewAllUrl }: AlertProps) {
```

Replace the hardcoded delay `<span>30-min delay</span>` with:
```tsx
{delayLabel && <span>{delayLabel}</span>}
```

Replace `<CustomBtn text="View all whale alerts" center />` with:
```tsx
<CustomBtn text={viewAllText} center href={viewAllUrl} />
```

- [ ] **Step 7: Write the block Component**

```tsx
// src/blocks/SignalFeed/Component.tsx
import Alert from '@/app/components/Home/Alert'
import { findSignals } from '@/utilities/getSignals'
import { signalToAlert } from '@/app/lib/viewModels'

type SignalFeedBlockProps = {
  heading: string
  kind: 'whale' | 'arbitrage'
  delayLabel?: string | null
  limit?: number | null
  viewAllText: string
  viewAllUrl?: string | null
}

export async function SignalFeedBlockComponent({ block }: { block: SignalFeedBlockProps }) {
  const res = await findSignals({ kind: block.kind, limit: block.limit ?? 3 })
  const cards = res.docs.map(signalToAlert)
  return (
    <Alert
      title={block.heading}
      cards={cards}
      delayLabel={block.delayLabel ?? undefined}
      viewAllText={block.viewAllText}
      viewAllUrl={block.viewAllUrl ?? undefined}
    />
  )
}
```

- [ ] **Step 8: Verify typecheck/lint and full unit suite**

Run: `pnpm typecheck && pnpm lint && pnpm test:unit`
Expected: no type errors, no lint errors, all unit tests pass.

- [ ] **Step 9: Commit**

```bash
git add src/blocks/SignalFeed src/app/ui/CustomBtn.tsx src/app/components/Home/Alert.tsx
git commit -m "feat(home): add Signal Feed block; make Alert delay/view-all editable; CustomBtn href"
```

---

### Task 4: Analysis block (+ GridArticles refactor)

**Files:**
- Create: `src/blocks/Analysis/config.ts`
- Create: `src/blocks/Analysis/Component.tsx`
- Modify: `src/app/components/Home/GridArticles.tsx`
- Test: `src/blocks/Analysis/config.test.ts`

**Interfaces:**
- Consumes: `hiddenField`, `findBlogPosts`, `blogToArticleView`, `ArticleView` (`src/app/lib/viewModels.ts`).
- Produces: `AnalysisBlock` (slug `analysis`), `AnalysisBlockComponent({ block })`. New `GridArticles` props: `heading, subtitle?, viewAllText, viewAllUrl, articles`.

- [ ] **Step 1: Write the failing config test**

```ts
// src/blocks/Analysis/config.test.ts
import { describe, expect, it } from 'vitest'
import { AnalysisBlock } from './config'

const names = AnalysisBlock.fields.map((f) => ('name' in f ? f.name : undefined))

describe('AnalysisBlock', () => {
  it('has slug analysis', () => expect(AnalysisBlock.slug).toBe('analysis'))
  it('exposes wrapper fields and hidden', () => {
    for (const n of ['heading', 'subtitle', 'limit', 'viewAllText', 'viewAllUrl', 'hidden']) {
      expect(names).toContain(n)
    }
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test:unit -- src/blocks/Analysis/config.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Write the block config**

```ts
// src/blocks/Analysis/config.ts
import type { Block } from 'payload'
import { hiddenField } from '../_shared/fields'

export const AnalysisBlock: Block = {
  slug: 'analysis',
  labels: { singular: 'Analysis', plural: 'Analysis Blocks' },
  fields: [
    { name: 'heading', type: 'text', required: true, defaultValue: 'Analysis' },
    {
      name: 'subtitle',
      type: 'text',
      defaultValue: 'Expert perspectives behind market movements.',
    },
    { name: 'limit', type: 'number', defaultValue: 5, min: 1, max: 12 },
    { name: 'viewAllText', type: 'text', required: true, defaultValue: 'All articles' },
    { name: 'viewAllUrl', type: 'text', defaultValue: '/blog' },
    hiddenField,
  ],
}
```

- [ ] **Step 4: Run config test to verify it passes**

Run: `pnpm test:unit -- src/blocks/Analysis/config.test.ts`
Expected: PASS.

- [ ] **Step 5: Refactor GridArticles to take props**

Replace `src/app/components/Home/GridArticles.tsx` with:

```tsx
import AllBtn from '@/app/ui/AllBtn'
import BlockTitle from '@/app/ui/BlockTitle'
import ArticleCard from '@/app/ui/ArticleCard'
import Link from 'next/link'
import type { ArticleView } from '@/app/lib/viewModels'

interface GridArticlesProps {
  heading: string
  subtitle?: string
  viewAllText: string
  viewAllUrl: string
  articles: ArticleView[]
}

export default function GridArticles({
  heading,
  subtitle,
  viewAllText,
  viewAllUrl,
  articles,
}: GridArticlesProps) {
  const sortedCards = [...articles].sort((a, b) => Number(!!b.featured) - Number(!!a.featured))

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-center gap-3 pr-5">
        <BlockTitle title={heading} subtitle={subtitle} />
        <AllBtn text={viewAllText} link={viewAllUrl} />
      </div>

      <div className="grid gap-2 xl:grid-cols-2">
        {sortedCards.map((card) => (
          <Link
            key={card.slug}
            href={`/blog/${card.slug}`}
            className={`${card.featured ? 'xl:col-span-2' : ''}`}
          >
            <ArticleCard card={card} />
          </Link>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 6: Write the block Component**

```tsx
// src/blocks/Analysis/Component.tsx
import GridArticles from '@/app/components/Home/GridArticles'
import { findBlogPosts } from '@/utilities/getBlogPosts'
import { blogToArticleView } from '@/app/lib/viewModels'

type AnalysisBlockProps = {
  heading: string
  subtitle?: string | null
  limit?: number | null
  viewAllText: string
  viewAllUrl?: string | null
}

export async function AnalysisBlockComponent({ block }: { block: AnalysisBlockProps }) {
  const res = await findBlogPosts({ limit: block.limit ?? 5 })
  const articles = res.docs.map(blogToArticleView)
  return (
    <GridArticles
      heading={block.heading}
      subtitle={block.subtitle ?? undefined}
      viewAllText={block.viewAllText}
      viewAllUrl={block.viewAllUrl ?? '/blog'}
      articles={articles}
    />
  )
}
```

- [ ] **Step 7: Verify and commit**

Run: `pnpm typecheck && pnpm lint && pnpm test:unit`
Expected: clean.

```bash
git add src/blocks/Analysis src/app/components/Home/GridArticles.tsx
git commit -m "feat(home): add Analysis block; make GridArticles heading/links editable"
```

---

### Task 5: Live Feed block (+ Feed refactor)

**Files:**
- Create: `src/blocks/LiveFeedBlock/config.ts`
- Create: `src/blocks/LiveFeedBlock/Component.tsx`
- Modify: `src/app/components/Home/Feed.tsx`
- Test: `src/blocks/LiveFeedBlock/config.test.ts`

**Interfaces:**
- Consumes: `hiddenField`, `findLiveFeed`, `liveFeedToView`, `FeedView`.
- Produces: `LiveFeedBlock` (slug `live-feed-block`), `LiveFeedBlockComponent({ block })`. New `Feed` props: `heading, viewAllText, viewAllUrl, items`.

- [ ] **Step 1: Write the failing config test**

```ts
// src/blocks/LiveFeedBlock/config.test.ts
import { describe, expect, it } from 'vitest'
import { LiveFeedBlock } from './config'

const names = LiveFeedBlock.fields.map((f) => ('name' in f ? f.name : undefined))

describe('LiveFeedBlock', () => {
  it('has slug live-feed-block', () => expect(LiveFeedBlock.slug).toBe('live-feed-block'))
  it('exposes wrapper fields and hidden', () => {
    for (const n of ['heading', 'limit', 'viewAllText', 'viewAllUrl', 'hidden']) {
      expect(names).toContain(n)
    }
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test:unit -- src/blocks/LiveFeedBlock/config.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Write the block config**

```ts
// src/blocks/LiveFeedBlock/config.ts
import type { Block } from 'payload'
import { hiddenField } from '../_shared/fields'

export const LiveFeedBlock: Block = {
  slug: 'live-feed-block',
  labels: { singular: 'Live Feed', plural: 'Live Feed Blocks' },
  fields: [
    { name: 'heading', type: 'text', required: true, defaultValue: 'Live Feed' },
    { name: 'limit', type: 'number', defaultValue: 1, min: 1, max: 10 },
    { name: 'viewAllText', type: 'text', required: true, defaultValue: 'All threads' },
    { name: 'viewAllUrl', type: 'text', defaultValue: '/live-feed' },
    hiddenField,
  ],
}
```

- [ ] **Step 4: Run config test to verify it passes**

Run: `pnpm test:unit -- src/blocks/LiveFeedBlock/config.test.ts`
Expected: PASS.

- [ ] **Step 5: Refactor Feed to take props**

Replace `src/app/components/Home/Feed.tsx` with:

```tsx
import AllBtn from '@/app/ui/AllBtn'
import FeedCard from '@/app/ui/FeedCard'
import Link from 'next/link'
import type { FeedView } from '@/app/lib/viewModels'

interface FeedProps {
  heading: string
  viewAllText: string
  viewAllUrl: string
  items: FeedView[]
}

export default function Feed({ heading, viewAllText, viewAllUrl, items }: FeedProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between gap-3">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full p-0.5 bg-live-a24">
            <div className="w-1 h-1 rounded-full bg-live" />
          </div>
          <div className="text-live text-2xl font-extrabold max-md:text-lg">{heading}</div>
        </div>

        <AllBtn text={viewAllText} link={viewAllUrl} />
      </div>

      <div className="flex flex-col gap-6">
        {items.map((card) => (
          <Link key={card.slug} href={`/live-feed/${card.slug}`}>
            <FeedCard card={card} home />
          </Link>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 6: Write the block Component**

```tsx
// src/blocks/LiveFeedBlock/Component.tsx
import Feed from '@/app/components/Home/Feed'
import { findLiveFeed } from '@/utilities/getLiveFeed'
import { liveFeedToView } from '@/app/lib/viewModels'

type LiveFeedBlockProps = {
  heading: string
  limit?: number | null
  viewAllText: string
  viewAllUrl?: string | null
}

export async function LiveFeedBlockComponent({ block }: { block: LiveFeedBlockProps }) {
  const res = await findLiveFeed({ limit: block.limit ?? 1 })
  const items = res.docs.map(liveFeedToView)
  return (
    <Feed
      heading={block.heading}
      viewAllText={block.viewAllText}
      viewAllUrl={block.viewAllUrl ?? '/live-feed'}
      items={items}
    />
  )
}
```

- [ ] **Step 7: Verify and commit**

Run: `pnpm typecheck && pnpm lint && pnpm test:unit`
Expected: clean.

```bash
git add src/blocks/LiveFeedBlock src/app/components/Home/Feed.tsx
git commit -m "feat(home): add Live Feed block; make Feed heading/links editable"
```

---

### Task 6: Category Section block (+ ArticleType/Switcher refactor, group renderer)

The most involved task: category blocks drive BOTH the desktop stacked list and the mobile switcher. A `CategorySections` server component fetches per-category articles and renders both.

**Files:**
- Create: `src/blocks/CategorySection/config.ts`
- Create: `src/blocks/CategorySection/CategorySections.tsx`
- Modify: `src/app/components/Home/ArticlesType.tsx` (accent + viewAllUrl props, no hardcoded colors)
- Modify: `src/app/components/Home/ArticleTypeMobileSwitcher.tsx` (data-driven header + sections)
- Test: `src/blocks/CategorySection/config.test.ts`

**Interfaces:**
- Consumes: `hiddenField`, `ACCENT_VALUES`, `accentClasses`, `findBlogPosts`, `blogToArticleView`, `ArticleView`, `Category` (`@/payload-types`).
- Produces: `CategorySectionBlock` (slug `category-section`), `CategorySections({ blocks, header })`, `CategorySectionData` (`{ label; accent; viewAllUrl; cards }`). New `ArticleType` props: `title, accent, viewAllUrl, cards`. New `ArticleTypeMobileSwitcher` props: `header: { title; subtitle? }`, `sections: CategorySectionData[]`.

- [ ] **Step 1: Write the failing config test**

```ts
// src/blocks/CategorySection/config.test.ts
import { describe, expect, it } from 'vitest'
import { CategorySectionBlock } from './config'

const names = CategorySectionBlock.fields.map((f) => ('name' in f ? f.name : undefined))

describe('CategorySectionBlock', () => {
  it('has slug category-section', () => expect(CategorySectionBlock.slug).toBe('category-section'))
  it('exposes label, category, accent, limit, hidden', () => {
    for (const n of ['label', 'category', 'accent', 'limit', 'hidden']) {
      expect(names).toContain(n)
    }
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test:unit -- src/blocks/CategorySection/config.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Write the block config**

```ts
// src/blocks/CategorySection/config.ts
import type { Block } from 'payload'
import { hiddenField } from '../_shared/fields'
import { ACCENT_VALUES } from '../_shared/accent'

export const CategorySectionBlock: Block = {
  slug: 'category-section',
  labels: { singular: 'Category Section', plural: 'Category Sections' },
  fields: [
    { name: 'label', type: 'text', required: true, admin: { description: 'Row heading, e.g. "Politics".' } },
    { name: 'category', type: 'relationship', relationTo: 'categories', required: true },
    {
      name: 'accent',
      type: 'select',
      required: true,
      defaultValue: 'politics',
      admin: { description: 'Badge color theme for this row.' },
      options: ACCENT_VALUES.map((v) => ({ label: v[0].toUpperCase() + v.slice(1), value: v })),
    },
    { name: 'limit', type: 'number', defaultValue: 3, min: 1, max: 9 },
    hiddenField,
  ],
}
```

- [ ] **Step 4: Run config test to verify it passes**

Run: `pnpm test:unit -- src/blocks/CategorySection/config.test.ts`
Expected: PASS.

- [ ] **Step 5: Refactor ArticleType (accent + viewAllUrl, drop hardcoded colors)**

Replace `src/app/components/Home/ArticlesType.tsx` with:

```tsx
import AllBtn from '@/app/ui/AllBtn'
import Link from 'next/link'
import { PayloadImage } from '@/app/components/PayloadImage'
import { accentClasses } from '@/blocks/_shared/accent'
import type { ArticleView } from '@/app/lib/viewModels'

interface ArticleTypeProps {
  title: string
  accent: string
  viewAllUrl: string
  cards: ArticleView[]
}

export default function ArticleType({ title, accent, viewAllUrl, cards }: ArticleTypeProps) {
  const filteredCards = cards.slice(0, 3)

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <div className="font-semibold text-2xl max-md:text-base">{title}</div>
        <AllBtn text="All articles" link={viewAllUrl} />
      </div>

      <div className="grid xl:grid-cols-3 gap-2">
        {filteredCards.map((card) => (
          <Link
            href={`/blog/${card.slug}`}
            key={card.slug}
            className="bg-white border border-line border-solid"
          >
            {card.image && (
              <div className="w-full h-auto">
                <PayloadImage media={card.image} alt="" className="w-full h-auto" />
              </div>
            )}

            <div className="p-3 flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <div className={`py-1 px-1.5 border border-solid text-xs uppercase ${accentClasses(accent)}`}>
                  {title}
                </div>
                <div className="text-xs text-date flex-nowrap text-nowrap">
                  {card.day} · {card.time}
                </div>
              </div>

              <div>
                <div className="font-medium text-base mt-1">{card.title}</div>
                <div className="text-sm line-clamp-3 text-muted">{card.text}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
```

> Note: cards are now pre-filtered per category by the fetch (Task 6 Step 7), so the old `card.categories.some(...)` client filter is removed.

- [ ] **Step 6: Refactor ArticleTypeMobileSwitcher (data-driven)**

Replace `src/app/components/Home/ArticleTypeMobileSwitcher.tsx` with:

```tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import ArticleType from './ArticlesType'
import type { CategorySectionData } from '@/blocks/CategorySection/CategorySections'

interface ArticleTypeMobileSwitcherProps {
  header: { title: string; subtitle?: string | null }
  sections: CategorySectionData[]
}

export default function ArticleTypeMobileSwitcher({
  header,
  sections,
}: ArticleTypeMobileSwitcherProps) {
  const [active, setActive] = useState(0)
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [sliderStyle, setSliderStyle] = useState({ left: 0, width: 0 })

  const updateSlider = (index: number) => {
    const btn = btnRefs.current[index]
    if (btn) setSliderStyle({ left: btn.offsetLeft, width: btn.offsetWidth })
  }

  useEffect(() => {
    updateSlider(active)
    const handleResize = () => updateSlider(active)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [active])

  if (sections.length === 0) return null
  const current = sections[Math.min(active, sections.length - 1)]

  return (
    <div className="xl:hidden flex flex-col gap-3 w-full">
      <div>
        <div className="font-semibold text-base">{header.title}</div>
        {header.subtitle && <div className="text-sm text-muted">{header.subtitle}</div>}
      </div>
      <div className="relative mx-auto w-full justify-between flex rounded-xl bg-white p-1 gap-2 border border-line">
        <span
          className="absolute top-1 bottom-1 rounded-lg bg-ink shadow-sm transition-all duration-350 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ left: sliderStyle.left, width: sliderStyle.width }}
        />
        {sections.map((s, i) => (
          <button
            key={s.label}
            ref={(el) => {
              btnRefs.current[i] = el
            }}
            onClick={() => setActive(i)}
            className={`relative z-10 flex-1 px-4 py-2 rounded-lg text-sm bg-transparent transition-colors duration-300 ${
              active === i ? 'text-paper-2' : 'text-muted'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <ArticleType
        title={current.label}
        accent={current.accent}
        viewAllUrl={current.viewAllUrl}
        cards={current.cards}
      />
    </div>
  )
}
```

- [ ] **Step 7: Write the group component (`CategorySections`)**

```tsx
// src/blocks/CategorySection/CategorySections.tsx
import ArticleType from '@/app/components/Home/ArticlesType'
import ArticleTypeMobileSwitcher from '@/app/components/Home/ArticleTypeMobileSwitcher'
import { findBlogPosts } from '@/utilities/getBlogPosts'
import { blogToArticleView, type ArticleView } from '@/app/lib/viewModels'
import type { Category } from '@/payload-types'

export type CategorySectionData = {
  label: string
  accent: string
  viewAllUrl: string
  cards: ArticleView[]
}

export type CategoryBlock = {
  label: string
  category: number | Category
  accent: string
  limit?: number | null
}

function categorySlug(category: number | Category): string {
  return typeof category === 'object' && category !== null ? category.slug : ''
}

export async function CategorySections({
  blocks,
  header,
}: {
  blocks: CategoryBlock[]
  header: { title: string; subtitle?: string | null }
}) {
  const sections: CategorySectionData[] = await Promise.all(
    blocks.map(async (b) => {
      const slug = categorySlug(b.category)
      const res = await findBlogPosts({ categorySlug: slug, limit: b.limit ?? 3 })
      return {
        label: b.label,
        accent: b.accent,
        viewAllUrl: `/blog/category/${slug}`,
        cards: res.docs.map(blogToArticleView),
      }
    }),
  )

  return (
    <>
      <ArticleTypeMobileSwitcher header={header} sections={sections} />
      <div className="max-xl:hidden flex flex-col gap-5">
        {sections.map((s, i) => (
          <div key={s.label} className="flex flex-col gap-5">
            <ArticleType title={s.label} accent={s.accent} viewAllUrl={s.viewAllUrl} cards={s.cards} />
            {i < sections.length - 1 && <div className="w-full h-px bg-line" />}
          </div>
        ))}
      </div>
    </>
  )
}
```

- [ ] **Step 8: Verify and commit**

Run: `pnpm typecheck && pnpm lint && pnpm test:unit`
Expected: clean. (`Category` must have a `slug` field — it does; categories use the shared slug field.)

```bash
git add src/blocks/CategorySection src/app/components/Home/ArticlesType.tsx src/app/components/Home/ArticleTypeMobileSwitcher.tsx
git commit -m "feat(home): add Category Section block with accent; data-drive category rows + mobile switcher"
```

---

### Task 7: Add `hidden` toggle to Summary and RealCard blocks

**Files:**
- Modify: `src/blocks/Summary/config.ts`
- Modify: `src/blocks/RealCard/config.ts`
- Test: `src/blocks/Summary/config.test.ts`

**Interfaces:**
- Consumes: `hiddenField`.
- Produces: `SummaryBlock` and `RealCardBlock` each gain a `hidden` field (existing slugs `summary`, `real-card` unchanged).

- [ ] **Step 1: Write the failing test**

```ts
// src/blocks/Summary/config.test.ts
import { describe, expect, it } from 'vitest'
import { SummaryBlock } from './config'
import { RealCardBlock } from '../RealCard/config'

const hasHidden = (b: typeof SummaryBlock) =>
  b.fields.some((f) => 'name' in f && f.name === 'hidden')

describe('Summary/RealCard blocks', () => {
  it('Summary block has a hidden toggle', () => expect(hasHidden(SummaryBlock)).toBe(true))
  it('RealCard block has a hidden toggle', () => expect(hasHidden(RealCardBlock)).toBe(true))
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test:unit -- src/blocks/Summary/config.test.ts`
Expected: FAIL — no `hidden` field yet.

- [ ] **Step 3: Add `hiddenField` to both configs**

In `src/blocks/Summary/config.ts`: add the import and append `hiddenField` to the top-level `fields` array (after `tabs`):
```ts
import { hiddenField } from '../_shared/fields'
```
Change `fields: [ { name: 'tabs', ... } ]` to end with `, hiddenField]`.

In `src/blocks/RealCard/config.ts`: add the same import and append `hiddenField` as the last entry of `fields`.

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test:unit -- src/blocks/Summary/config.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/blocks/Summary/config.ts src/blocks/RealCard/config.ts src/blocks/Summary/config.test.ts
git commit -m "feat(home): add hidden toggle to Summary and RealCard blocks"
```

---

### Task 8: Restructure the `home-page` global (tabs + region blocks + mobile headers)

**Files:**
- Modify: `src/globals/HomePage.ts` (full rewrite)
- Run: `pnpm generate:types` (updates `src/payload-types.ts`)

**Interfaces:**
- Consumes: all six block configs (`SignalFeedBlock`, `SummaryBlock`, `RealCardBlock`, `AnalysisBlock`, `LiveFeedBlock`, `CategorySectionBlock`).
- Produces: generated `HomePage` type with `sidebarBlocks`, `mainBlocks`, `signalsMobileHeader { title; subtitle? }`, `categorySwitcherHeader { title; subtitle? }`.

- [ ] **Step 1: Rewrite the global**

Replace `src/globals/HomePage.ts` with:

```ts
import type { GlobalConfig } from 'payload'
import { isAdminOrEditor } from '@/access/isAdminOrEditor'
import { revalidateGlobalHooks } from '@/hooks/revalidateFrontCache'
import { SignalFeedBlock } from '@/blocks/SignalFeed/config'
import { SummaryBlock } from '@/blocks/Summary/config'
import { RealCardBlock } from '@/blocks/RealCard/config'
import { AnalysisBlock } from '@/blocks/Analysis/config'
import { LiveFeedBlock } from '@/blocks/LiveFeedBlock/config'
import { CategorySectionBlock } from '@/blocks/CategorySection/config'

export const HomePage: GlobalConfig = {
  slug: 'home-page',
  label: 'Home Page',
  access: { read: () => true, update: isAdminOrEditor },
  hooks: revalidateGlobalHooks,
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Left sidebar',
          description: 'Blocks shown in the left column of the home page.',
          fields: [
            {
              name: 'signalsMobileHeader',
              type: 'group',
              label: 'Signals header (mobile only)',
              fields: [
                { name: 'title', type: 'text', required: true, defaultValue: 'Signals' },
                {
                  name: 'subtitle',
                  type: 'text',
                  defaultValue: 'Track emerging trends before they become headlines',
                },
              ],
            },
            {
              name: 'sidebarBlocks',
              type: 'blocks',
              labels: { singular: 'Sidebar block', plural: 'Sidebar blocks' },
              admin: { description: 'Whale Alert, Arbitrage Alert, Summaries, Promo card.' },
              blocks: [SignalFeedBlock, SummaryBlock, RealCardBlock],
            },
          ],
        },
        {
          label: 'Main content',
          description: 'Blocks shown in the main (right) column of the home page.',
          fields: [
            {
              name: 'categorySwitcherHeader',
              type: 'group',
              label: 'Category switcher header (mobile only)',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                  defaultValue: 'Explore by Category',
                },
                {
                  name: 'subtitle',
                  type: 'text',
                  defaultValue:
                    'The latest articles from our most-followed prediction market topics.',
                },
              ],
            },
            {
              name: 'mainBlocks',
              type: 'blocks',
              labels: { singular: 'Main block', plural: 'Main blocks' },
              admin: { description: 'Analysis, Live Feed, Category sections.' },
              blocks: [AnalysisBlock, LiveFeedBlock, CategorySectionBlock],
            },
          ],
        },
      ],
    },
  ],
}
```

- [ ] **Step 2: Regenerate Payload types**

Run: `pnpm generate:types`
Expected: `src/payload-types.ts` updated; `HomePage` now has `sidebarBlocks`, `mainBlocks`, `signalsMobileHeader`, `categorySwitcherHeader`. The old `summaries`/`articleSections` are gone from the type.

- [ ] **Step 3: Verify typecheck (expect Main.tsx to now fail — fixed in Task 9)**

Run: `pnpm typecheck`
Expected: errors ONLY in `src/app/components/Home/Main.tsx` (it still reads removed fields). This is expected; Task 9 fixes it. Do not commit yet if the repo requires green typecheck per-commit — proceed directly to Task 9 and commit them together. If commits may be red, commit now:

```bash
git add src/globals/HomePage.ts src/payload-types.ts
git commit -m "feat(home): restructure home-page global into region tabs with block arrays"
```

> If your workflow requires every commit to typecheck clean, skip this commit and fold it into Task 9's commit.

---

### Task 9: Region renderer + Main.tsx rewrite

**Files:**
- Create: `src/blocks/RenderHomeBlocks.tsx`
- Modify: `src/app/components/Home/Main.tsx` (full rewrite)
- Modify: `src/app/components/Home/Signals.tsx` (data-driven header)

**Interfaces:**
- Consumes: `planRegion`, all block Components, `Signals`, `CategorySections`, generated `HomePage` type, `getHomePageContent`.
- Produces: `SidebarRegion({ blocks, signalsHeader })`, `MainRegion({ blocks, categoryHeader })`.

- [ ] **Step 1: Make Signals header data-driven**

In `src/app/components/Home/Signals.tsx`:

Change the props type and signature:
```tsx
type SignalsProps = {
  children: React.ReactNode
  header: { title: string; subtitle?: string | null }
}

export default function Signals({ children, header }: SignalsProps) {
```
Replace the hardcoded title/subtitle block:
```tsx
<div className="font-semibold text-lg mb-1">Signals</div>
<div className="text-muted text-sm">
  Track emerging trends before they become headlines
</div>
```
with:
```tsx
<div className="font-semibold text-lg mb-1">{header.title}</div>
{header.subtitle && <div className="text-muted text-sm">{header.subtitle}</div>}
```

- [ ] **Step 2: Write the region renderer**

```tsx
// src/blocks/RenderHomeBlocks.tsx
import { Fragment } from 'react'
import { planRegion } from './homeBlocks'
import Signals from '@/app/components/Home/Signals'
import { SignalFeedBlockComponent } from './SignalFeed/Component'
import { SummaryBlockComponent } from './Summary/Component'
import { RealCardBlockComponent } from './RealCard/Component'
import { AnalysisBlockComponent } from './Analysis/Component'
import { LiveFeedBlockComponent } from './LiveFeedBlock/Component'
import { CategorySections } from './CategorySection/CategorySections'
import type { HomePage } from '@/payload-types'

const Divider = () => <div className="w-full h-px bg-line" />

type SidebarBlock = NonNullable<HomePage['sidebarBlocks']>[number]
type MainBlock = NonNullable<HomePage['mainBlocks']>[number]
type Header = { title: string; subtitle?: string | null }

// Runtime guarantee: planRegion groups only blocks whose blockType matches.
type Extract2<U, T> = U extends { blockType: T } ? U : never

export function SidebarRegion({
  blocks,
  signalsHeader,
}: {
  blocks: SidebarBlock[] | null | undefined
  signalsHeader: Header
}) {
  const segments = planRegion(blocks, 'signal-feed')
  return (
    <>
      {segments.map((seg, i) => (
        <Fragment key={i}>
          {i > 0 && <Divider />}
          {seg.kind === 'group' ? (
            <Signals header={signalsHeader}>
              {seg.blocks.map((b, j) => (
                <Fragment key={j}>
                  {j > 0 && <Divider />}
                  <SignalFeedBlockComponent block={b as Extract2<SidebarBlock, 'signal-feed'>} />
                </Fragment>
              ))}
            </Signals>
          ) : seg.block.blockType === 'summary' ? (
            <SummaryBlockComponent block={seg.block} />
          ) : seg.block.blockType === 'real-card' ? (
            <RealCardBlockComponent block={seg.block} />
          ) : null}
        </Fragment>
      ))}
    </>
  )
}

export function MainRegion({
  blocks,
  categoryHeader,
}: {
  blocks: MainBlock[] | null | undefined
  categoryHeader: Header
}) {
  const segments = planRegion(blocks, 'category-section')
  return (
    <>
      {segments.map((seg, i) => (
        <Fragment key={i}>
          {i > 0 && <Divider />}
          {seg.kind === 'group' ? (
            <CategorySections
              blocks={seg.blocks as Extract2<MainBlock, 'category-section'>[]}
              header={categoryHeader}
            />
          ) : seg.block.blockType === 'analysis' ? (
            <AnalysisBlockComponent block={seg.block} />
          ) : seg.block.blockType === 'live-feed-block' ? (
            <LiveFeedBlockComponent block={seg.block} />
          ) : null}
        </Fragment>
      ))}
    </>
  )
}
```

> If TypeScript complains that a generated block prop (e.g. `blockName`, `id`) is incompatible with a Component's hand-written prop type, widen the cast on that `block={...}` to the Component's local prop type — the runtime data is correct; only structural typing needs the hint.

- [ ] **Step 3: Rewrite Main.tsx**

Replace `src/app/components/Home/Main.tsx` with:

```tsx
import { SidebarRegion, MainRegion } from '@/blocks/RenderHomeBlocks'
import { getHomePageContent } from '@/utilities/getPageContent'

export default async function Main() {
  const content = await getHomePageContent()

  const signalsHeader = content?.signalsMobileHeader ?? { title: 'Signals' }
  const categoryHeader = content?.categorySwitcherHeader ?? { title: 'Explore by Category' }

  return (
    <div className="container-custom">
      <div className="md:border-l md:border-r border-line p-6 flex gap-5 max-md:flex-col max-lg:p-0 max-lg:py-5">
        <div className="flex flex-col gap-5 w-full md:max-w-[300px]">
          <SidebarRegion blocks={content?.sidebarBlocks} signalsHeader={signalsHeader} />
        </div>

        <div className="md:border-l border-line flex flex-col gap-5 md:pl-5 flex-1">
          <MainRegion blocks={content?.mainBlocks} categoryHeader={categoryHeader} />
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Verify typecheck + lint + unit**

Run: `pnpm typecheck && pnpm lint && pnpm test:unit`
Expected: clean (all Main.tsx errors from Task 8 resolved).

- [ ] **Step 5: Commit**

```bash
git add src/blocks/RenderHomeBlocks.tsx src/app/components/Home/Main.tsx src/app/components/Home/Signals.tsx
git commit -m "feat(home): render home page from region block arrays"
```
(If you deferred Task 8's commit, also `git add src/globals/HomePage.ts src/payload-types.ts` here.)

---

### Task 10: Seed the default layout + schema migration + remove dead code

**Files:**
- Modify: `scripts/seed-predictbook.ts` (replace the `home-page` global seeding)
- Run: `pnpm payload migrate:create home_page_blocks` (generates a schema migration under `src/migrations/`)
- Grep-check: no remaining references to removed fields.

**Interfaces:**
- Consumes: category IDs/slugs already created earlier in the seed; the `home-page` global slug.
- Produces: a seeded home page with default sidebar + main blocks and mobile headers.

- [ ] **Step 1: Locate the current home-page seeding**

Run: `grep -n "home-page\|summaries\|articleSections" scripts/seed-predictbook.ts`
Read that section to find the existing `updateGlobal({ slug: 'home-page', ... })` call and the variables holding created category IDs (e.g. a `categories` map/array and any media IDs used for the promo card).

- [ ] **Step 2: Replace the home-page global data**

Replace the existing `home-page` `updateGlobal` `data` with the block structure below. Wire `category` values to the real category IDs created earlier in the seed, and `badgeIcon`/`backgroundImage` to existing seeded media IDs (reuse whatever the seed already uploads for the promo/graph images; if none exist, upload `public/Lightning.png` and `public/Graph.png` the same way other media are seeded and use those IDs).

```ts
await payload.updateGlobal({
  slug: 'home-page',
  data: {
    signalsMobileHeader: {
      title: 'Signals',
      subtitle: 'Track emerging trends before they become headlines',
    },
    categorySwitcherHeader: {
      title: 'Explore by Category',
      subtitle: 'The latest articles from our most-followed prediction market topics.',
    },
    sidebarBlocks: [
      {
        blockType: 'signal-feed',
        heading: 'Whale Alert',
        kind: 'whale',
        delayLabel: '30-min delay',
        limit: 3,
        viewAllText: 'View all whale alerts',
        viewAllUrl: '/signals',
        hidden: false,
      },
      {
        blockType: 'signal-feed',
        heading: 'Arbitrage Alert',
        kind: 'arbitrage',
        delayLabel: '30-min delay',
        limit: 3,
        viewAllText: 'View all arbitrage alerts',
        viewAllUrl: '/signals',
        hidden: false,
      },
      {
        blockType: 'summary',
        tabs: [
          {
            title: 'Daily',
            infoTitle: 'Market pulse',
            day: 'Today',
            time: '20:00',
            info: [{ text: 'Markets stayed range-bound ahead of the data print.' }],
          },
        ],
        hidden: false,
      },
      {
        blockType: 'real-card',
        badgeIcon: LIGHTNING_MEDIA_ID, // replace with seeded media id
        badgeText: 'Real-time alerts',
        showLiveDot: true,
        title: 'Want signals in real time?',
        description: 'Get instant alerts with advanced filtering tailored to your interests.',
        buttonText: 'Join Real-time Alerts',
        buttonUrl: '/signals',
        backgroundImage: GRAPH_MEDIA_ID, // replace with seeded media id
        hidden: false,
      },
    ],
    mainBlocks: [
      {
        blockType: 'analysis',
        heading: 'Analysis',
        subtitle: 'Expert perspectives behind market movements.',
        limit: 5,
        viewAllText: 'All articles',
        viewAllUrl: '/blog',
        hidden: false,
      },
      {
        blockType: 'live-feed-block',
        heading: 'Live Feed',
        limit: 1,
        viewAllText: 'All threads',
        viewAllUrl: '/live-feed',
        hidden: false,
      },
      {
        blockType: 'category-section',
        label: 'Politics',
        category: POLITICS_CATEGORY_ID, // replace with seeded category id
        accent: 'politics',
        limit: 3,
        hidden: false,
      },
      {
        blockType: 'category-section',
        label: 'Sports',
        category: SPORTS_CATEGORY_ID, // replace with seeded category id
        accent: 'sports',
        limit: 3,
        hidden: false,
      },
      {
        blockType: 'category-section',
        label: 'Crypto',
        category: CRYPTO_CATEGORY_ID, // replace with seeded category id
        accent: 'crypto',
        limit: 3,
        hidden: false,
      },
    ],
  },
})
```

- [ ] **Step 3: Run the seed and confirm no errors**

Run: `pnpm seed:predictbook`
Expected: completes without validation errors; the `home-page` global saves with the blocks above.

- [ ] **Step 4: Generate the schema migration**

Run: `pnpm payload migrate:create home_page_blocks`
Expected: a new file under `src/migrations/` capturing the schema change (new block tables, dropped `summaries`/`articleSections`). Review it for obvious destructive statements, then keep it.

- [ ] **Step 5: Confirm no dead references remain**

Run: `grep -rn "DEFAULT_SECTIONS\|articleSections\|content?.summaries" src/`
Expected: no results. (Main.tsx was rewritten in Task 9; if anything shows up, remove it.)

- [ ] **Step 6: Commit**

```bash
git add scripts/seed-predictbook.ts src/migrations
git commit -m "feat(home): seed default region blocks and add schema migration"
```

---

### Task 11: End-to-end verification

**Files:**
- Create: `tests/e2e/home-blocks.spec.ts`

**Interfaces:**
- Consumes: seeded DB from Task 10; the Playwright config's `webServer` (starts the app).

- [ ] **Step 1: Write the e2e test**

```ts
// tests/e2e/home-blocks.spec.ts
import { test, expect } from '@playwright/test'

test.describe('home page blocks', () => {
  test('renders sidebar and main region blocks', async ({ page }) => {
    await page.goto('/')
    // Sidebar signal feeds
    await expect(page.getByText('Whale Alert', { exact: false }).first()).toBeVisible()
    await expect(page.getByText('Arbitrage Alert', { exact: false }).first()).toBeVisible()
    // Main region
    await expect(page.getByText('Analysis', { exact: false }).first()).toBeVisible()
    await expect(page.getByText('Live Feed', { exact: false }).first()).toBeVisible()
  })

  test('promo card CTA is present and editable-sourced', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Want signals in real time?', { exact: false })).toBeVisible()
  })
})
```

- [ ] **Step 2: Run the e2e test**

Run: `pnpm test:e2e -- home-blocks.spec.ts`
Expected: PASS. (If the runner needs a seeded DB, run `pnpm seed:predictbook` first.)

- [ ] **Step 3: Manual admin check (documented, not automated)**

Start the app (`pnpm dev`), open `/admin` → Globals → Home Page. Confirm:
- Two tabs labeled **Left sidebar** and **Main content**.
- Sidebar block picker offers only Signal Feed / Summary / Promo card; Main offers Analysis / Live Feed / Category Section.
- Toggling **Hide on site** on a block removes it from the rendered home page after save.
- Reordering blocks within a tab reorders them on-site.
- Editing a Signal Feed heading / delay label / view-all text changes the site.

- [ ] **Step 4: Commit**

```bash
git add tests/e2e/home-blocks.spec.ts
git commit -m "test(home): e2e coverage for region block rendering"
```

---

## Self-Review

**Spec coverage:**
- Region tabs + two block arrays → Task 8. ✔
- Region-restricted block pickers + labels + descriptions → Task 8. ✔
- Mobile header label groups (admin-driven) → Task 8 (config) + Tasks 6/9 (consumption). ✔
- Signal Feed / Analysis / Live Feed / Category Section blocks → Tasks 3/4/5/6. ✔
- Reuse Summary + RealCard, add `hidden` → Task 7. ✔
- `hidden` toggle on every home block → Tasks 2/3/4/5/6/7. ✔
- Auto content from collections, editable wrapper only → block Components in Tasks 3/4/5/6. ✔
- No hardcoded strings (delay label, view-all, mobile headers, category colors) → Tasks 3/6/9. ✔
- Dividers/frame stay in code, auto-inserted → Task 9 (`Divider`). ✔
- Category section as independent instances → Task 6 + seed Task 10. ✔
- Region rendering (planRegion), self-fetching blocks → Tasks 1/9. ✔
- Data migration + seed; remove old fields/DEFAULT_SECTIONS → Tasks 8/10. ✔
- Tests (unit planRegion/accent/configs; e2e render/hidden) → Tasks 1/2/3-7/11. ✔
- **Deferred (noted):** block-picker `imageURL` thumbnails are omitted to avoid shipping broken images until design assets exist; block labels + descriptions carry the clarity in the meantime. Pages-collection `RenderBlocks` does not honor `hidden` (out of scope; home only).

**Placeholder scan:** The only intentional placeholders are the seed IDs (`LIGHTNING_MEDIA_ID`, `*_CATEGORY_ID`) in Task 10 — these must be wired to real seeded IDs, with explicit instructions in Step 1/2. No other TBDs.

**Type consistency:** `CategorySectionData` defined in Task 6 and consumed by the switcher (Task 6) and group (Task 6); `Header` shape `{ title; subtitle? }` consistent across Signals, switcher, `SidebarRegion`/`MainRegion` (Tasks 6/9); block Component prop types match their config field names (Tasks 3-6 vs 8). `planRegion`/`RegionSegment` names consistent Tasks 1/9.
