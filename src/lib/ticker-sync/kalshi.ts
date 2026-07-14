import { formatCents } from '@/lib/signals-sync/mapItem'
import type { KalshiMarket, KalshiMarketsResponse, TickerRowData } from './types'

const DEFAULT_KALSHI_URL = 'https://api.elections.kalshi.com/trade-api/v2/markets'
const MAX_TITLE_LENGTH = 80

/**
 * Prefer the current string `*_dollars` form (already a 0–1 fraction), then the
 * legacy numeric field, which itself migrated integer cents → decimal dollars.
 */
function toFraction(dollars?: string, legacy?: number): number | undefined {
  const value = dollars !== undefined ? Number(dollars) : legacy
  if (typeof value !== 'number' || Number.isNaN(value) || value <= 0) return undefined
  return value > 1 ? value / 100 : value
}

export function kalshiVolume(m: KalshiMarket): number {
  const value = m.volume_24h_fp !== undefined ? Number(m.volume_24h_fp) : m.volume_24h
  return typeof value === 'number' && !Number.isNaN(value) ? value : 0
}

function truncate(text: string): string {
  return text.length > MAX_TITLE_LENGTH ? `${text.slice(0, MAX_TITLE_LENGTH - 1).trimEnd()}…` : text
}

export function mapKalshiMarket(m: KalshiMarket): TickerRowData | null {
  if (!m.ticker || !m.title) return null
  const bid = toFraction(m.yes_bid_dollars, m.yes_bid)
  const ask = toFraction(m.yes_ask_dollars, m.yes_ask)
  const midpoint = bid !== undefined && ask !== undefined ? (bid + ask) / 2 : undefined
  const price = formatCents(toFraction(m.last_price_dollars, m.last_price) ?? midpoint)
  if (!price) return null
  return {
    venue: 'Kalshi',
    market: truncate(m.title),
    price,
    order: 0,
    externalId: `kalshi:${m.ticker}`,
    volume24h: kalshiVolume(m) || undefined,
  }
}

/** No sort param exists on the Kalshi API — paginate and keep a running top-N by volume. */
export async function fetchKalshiTop(limit: number): Promise<TickerRowData[]> {
  const base = process.env.KALSHI_API_URL ?? DEFAULT_KALSHI_URL
  const maxPages = Number(process.env.KALSHI_SYNC_MAX_PAGES ?? 10)
  const all: KalshiMarket[] = []
  let cursor: string | undefined

  for (let page = 0; page < maxPages; page++) {
    const qs = new URLSearchParams({ status: 'open', mve_filter: 'exclude', limit: '1000' })
    if (cursor) qs.set('cursor', cursor)
    const url = `${base}?${qs}`
    const res = await fetch(url, { signal: AbortSignal.timeout(8000), cache: 'no-store' })
    if (!res.ok) throw new Error(`Kalshi API ${res.status} for ${url}`)
    const data = (await res.json()) as KalshiMarketsResponse
    all.push(...(data.markets ?? []))
    cursor = data.cursor || undefined
    if (!cursor || (data.markets ?? []).length === 0) break
  }

  return all
    .sort((a, b) => kalshiVolume(b) - kalshiVolume(a))
    .map(mapKalshiMarket)
    .filter((row): row is TickerRowData => row !== null)
    .slice(0, limit)
}
