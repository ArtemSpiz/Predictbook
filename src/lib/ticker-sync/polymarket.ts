import { formatCents } from '@/lib/signals-sync/mapItem'
import type { GammaMarket, TickerRowData } from './types'

const DEFAULT_GAMMA_URL = 'https://gamma-api.polymarket.com/markets'

/** Gamma double-encodes array fields as JSON strings; accept both forms. */
function parseArray(value?: string | string[]): string[] {
  if (Array.isArray(value)) return value
  if (typeof value !== 'string') return []
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed.map(String) : []
  } catch {
    return []
  }
}

export function mapGammaMarket(m: GammaMarket): TickerRowData | null {
  if (!m.id || !m.question) return null
  const outcomes = parseArray(m.outcomes)
  const prices = parseArray(m.outcomePrices)
  const yesIndex = Math.max(outcomes.indexOf('Yes'), 0)
  const price = formatCents(Number(prices[yesIndex]))
  if (!price) return null
  return {
    venue: 'Polymarket',
    market: m.question,
    price,
    order: 0,
    externalId: `poly:${m.id}`,
    url: m.slug ? `https://polymarket.com/market/${m.slug}` : undefined,
    volume24h: typeof m.volume24hr === 'number' ? m.volume24hr : undefined,
  }
}

export async function fetchPolymarketTop(limit: number): Promise<TickerRowData[]> {
  const base = process.env.POLYMARKET_GAMMA_URL ?? DEFAULT_GAMMA_URL
  const url = `${base}?active=true&closed=false&order=volume24hr&ascending=false&limit=${limit}`
  const res = await fetch(url, { signal: AbortSignal.timeout(8000), cache: 'no-store' })
  if (!res.ok) throw new Error(`Polymarket Gamma API ${res.status} for ${url}`)
  const markets = (await res.json()) as GammaMarket[]
  if (!Array.isArray(markets)) throw new Error('Polymarket Gamma API: unexpected response shape')
  return markets.map(mapGammaMarket).filter((row): row is TickerRowData => row !== null)
}
