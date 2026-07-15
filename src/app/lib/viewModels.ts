import type { News, Signal, LiveFeed, Media, Category } from '@/payload-types'
import type { AlertCard } from '@/app/components/Home/Alert'

/** Normalized shapes the presentational cards/sections consume. */
export interface ArticleView {
  slug: string
  title: string
  text: string
  image: Media | null
  categories: string[]
  day: string
  time: string
  live?: boolean
  featured?: boolean
  authorName?: string
}

export interface FeedView {
  slug: string
  title: string
  subtitle?: string
  categories: string[]
  updates: number
  live?: boolean
  timeline: { time: string; text: string }[]
}

export interface SignalView {
  slug: string
  kind: Signal['kind']
  featured: boolean
  categories: string[]
  day: string
  time: string
  title: string
  subtitle?: string
  profitably: boolean
  yesPrice?: string
  noPrice?: string
  spread?: string
  volume?: string
  profitablyPP?: string
}

const mediaObj = (v: unknown): Media | null =>
  v && typeof v === 'object' && 'url' in (v as object) ? (v as Media) : null

const categoryTitles = (cats: (string | Category)[] | null | undefined): string[] =>
  (cats ?? [])
    .filter((c): c is Category => typeof c === 'object' && c !== null)
    .map((c) => c.title)

// Cards label times as UTC, so pin the formatters instead of trusting server TZ.
export const fmtDay = (iso?: string | null): string =>
  iso
    ? new Date(iso).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        timeZone: 'UTC',
      })
    : ''

export const fmtTime = (iso?: string | null): string =>
  iso
    ? new Date(iso).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'UTC',
      })
    : ''

export const categoryNames = categoryTitles

/** Stable sort that floats featured items to the top; preserves original order otherwise. */
export const sortByFeatured = <T extends { featured?: boolean }>(items: T[]): T[] =>
  [...items].sort((a, b) => Number(!!b.featured) - Number(!!a.featured))

export function newsToArticleView(b: News): ArticleView {
  const author = b.author && typeof b.author === 'object' ? b.author : null
  return {
    slug: b.slug,
    title: b.title,
    text: b.excerpt ?? '',
    image: mediaObj(b.coverImage),
    categories: categoryTitles(b.categories),
    day: fmtDay(b.publishedAt),
    time: fmtTime(b.publishedAt),
    live: b.live ?? false,
    featured: b.featured ?? false,
    authorName: author?.name ?? undefined,
  }
}

export function liveFeedToView(f: LiveFeed): FeedView {
  return {
    slug: f.slug,
    title: f.title,
    subtitle: f.subtitle ?? undefined,
    categories: categoryTitles(f.categories),
    updates: f.updates ?? f.timeline?.length ?? 0,
    live: f.live ?? false,
    timeline: (f.timeline ?? []).map((t) => ({ time: t.time, text: t.text })),
  }
}

export function signalToView(s: Signal): SignalView {
  return {
    slug: s.slug,
    kind: s.kind,
    featured: s.featured ?? false,
    categories: categoryTitles(s.categories),
    day: fmtDay(s.publishedAt),
    time: fmtTime(s.publishedAt),
    title: s.title,
    subtitle: s.subtitle ?? undefined,
    profitably: s.profitably ?? false,
    yesPrice: s.yesPrice ?? undefined,
    noPrice: s.noPrice ?? undefined,
    spread: s.spread ?? undefined,
    volume: s.volume ?? undefined,
    profitablyPP: s.profitablyPP ?? undefined,
  }
}

/** SignalView plus the Alert-card fields and a cursor, for the live polling feed. */
export interface LiveSignalView extends SignalView {
  size?: string
  odds?: string
  poly?: string
  kalshi?: string
  publishedAt: string
}

export function signalToLiveView(s: Signal): LiveSignalView {
  return {
    ...signalToView(s),
    size: s.size ?? undefined,
    odds: s.odds ?? undefined,
    poly: s.poly ?? undefined,
    kalshi: s.kalshi ?? undefined,
    publishedAt: s.publishedAt ?? s.createdAt,
  }
}

export function liveViewToAlert(v: LiveSignalView): AlertCard {
  return {
    type: v.kind,
    underTitle: v.kind === 'whale' ? 'whale alert' : 'ARBITRAGE',
    time: v.time,
    title: v.title,
    size: v.size,
    odds: v.odds,
    poly: v.poly,
    kalshi: v.kalshi,
    spread: v.spread,
  }
}

/** Map a Signal into the Home page's compact Alert card. */
export function signalToAlert(s: Signal): AlertCard {
  return {
    type: s.kind,
    underTitle: s.kind === 'whale' ? 'whale alert' : 'ARBITRAGE',
    time: fmtTime(s.publishedAt),
    title: s.title,
    size: s.size ?? undefined,
    odds: s.odds ?? undefined,
    poly: s.poly ?? undefined,
    kalshi: s.kalshi ?? undefined,
    spread: s.spread ?? undefined,
  }
}
