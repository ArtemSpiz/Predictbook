import type { ExternalSignalItem, SignalType } from './types'
import { SIGNAL_TYPES } from './types'

export interface MappedSignalData {
  title: string
  subtitle?: string
  kind: SignalType
  slug: string
  publishedAt: string
  yesPrice?: string
  noPrice?: string
  yesVenue?: string
  noVenue?: string
  poly?: string
  kalshi?: string
  polyUrl?: string
  kalshiUrl?: string
  marketUrl?: string
  side?: string
  size?: string
  odds?: string
  spread?: string
  platform?: string
  profitablyPP?: string
  profitably: boolean
  externalId: string
  externalSource?: string
  externalCreatedMs: number
  externalText?: string
  _status: 'published'
}

/** 0.72 → '72¢', 0.015 → '1.5¢' */
export const formatCents = (price?: number): string | undefined => {
  if (typeof price !== 'number' || Number.isNaN(price)) return undefined
  const cents = Math.round(price * 1000) / 10
  return `${cents}¢`
}

const isPolymarket = (venue?: string) => venue?.toLowerCase().includes('poly') ?? false

/** First link whose key or value contains any of the needles (case-insensitive). */
const pickLink = (links: Record<string, string> | undefined, ...needles: string[]) => {
  if (!links) return undefined
  for (const [key, value] of Object.entries(links)) {
    const hay = `${key} ${value}`.toLowerCase()
    if (needles.some((n) => hay.includes(n))) return value
  }
  return undefined
}

/** Map an external feed item to `signals` collection data; null for unknown types. */
export function mapExternalToSignalData(item: ExternalSignalItem): MappedSignalData | null {
  if (!SIGNAL_TYPES.includes(item.type as SignalType)) return null
  const kind = item.type as SignalType
  const f = item.fields ?? {}

  const base = {
    kind,
    slug: `${kind}-${item.id}`,
    publishedAt: new Date(item.created_ms).toISOString(),
    externalId: item.id,
    externalSource: item.source,
    externalCreatedMs: item.created_ms,
    externalText: item.text,
    _status: 'published' as const,
  }

  const links = item.links

  if (kind === 'whale') {
    return {
      ...base,
      title: f.market ?? item.title ?? 'Whale alert',
      subtitle: f.market_outcome,
      side: f.side,
      size: f.size,
      odds: f.odds_at_entry,
      platform: f.platform,
      marketUrl: pickLink(links, 'poly', 'kalshi', 'market', 'event'),
      profitably: false,
    }
  }

  const yesPrice = formatCents(f.yes_price)
  const noPrice = formatCents(f.no_price)
  const polyIsYes = isPolymarket(f.yes_venue)
  const polyUrl = pickLink(links, 'poly')
  const kalshiUrl = pickLink(links, 'kalshi')
  return {
    ...base,
    title: f.question ?? item.title ?? 'Arbitrage alert',
    subtitle:
      f.yes_venue && f.no_venue ? `BUY YES @ ${f.yes_venue} · BUY NO @ ${f.no_venue}` : undefined,
    yesPrice,
    noPrice,
    yesVenue: f.yes_venue,
    noVenue: f.no_venue,
    poly: polyIsYes ? yesPrice : noPrice,
    kalshi: polyIsYes ? noPrice : yesPrice,
    polyUrl,
    kalshiUrl,
    marketUrl: polyUrl ?? kalshiUrl,
    spread: f.spread,
    profitablyPP: f.spread,
    profitably: true,
  }
}
