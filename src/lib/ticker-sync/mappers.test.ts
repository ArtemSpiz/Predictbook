import { describe, it, expect } from 'vitest'
import { mapGammaMarket } from './polymarket'
import { mapKalshiMarket } from './kalshi'
import { interleaveRows } from './sync'
import type { GammaMarket, KalshiMarket, TickerRowData } from './types'

describe('mapGammaMarket', () => {
  const market: GammaMarket = {
    id: '501234',
    question: 'Will France win the 2026 FIFA World Cup?',
    slug: 'will-france-win-the-2026-fifa-world-cup',
    outcomes: '["Yes", "No"]',
    outcomePrices: '["0.5815", "0.4185"]',
    volume24hr: 16100000,
  }

  it('parses JSON-encoded outcome arrays and picks the Yes price', () => {
    const row = mapGammaMarket(market)
    expect(row).toEqual({
      venue: 'Polymarket',
      market: 'Will France win the 2026 FIFA World Cup?',
      price: '58.2¢',
      order: 0,
      externalId: 'poly:501234',
      url: 'https://polymarket.com/market/will-france-win-the-2026-fifa-world-cup',
      volume24h: 16100000,
    })
  })

  it('accepts real arrays in case Gamma drops the double encoding', () => {
    const row = mapGammaMarket({ ...market, outcomes: ['No', 'Yes'], outcomePrices: ['0.4', '0.6'] })
    expect(row?.price).toBe('60¢')
  })

  it('falls back to the first outcome when there is no Yes', () => {
    const row = mapGammaMarket({ ...market, outcomes: '["Up", "Down"]' })
    expect(row?.price).toBe('58.2¢')
  })

  it('returns null for markets without a parseable price', () => {
    expect(mapGammaMarket({ ...market, outcomePrices: 'not-json' })).toBeNull()
    expect(mapGammaMarket({ id: 'x', question: undefined })).toBeNull()
  })
})

describe('mapKalshiMarket', () => {
  const market: KalshiMarket = {
    ticker: 'FED-28JAN-H0',
    title: 'Will the Fed hike rates by 0bps at their January 2028 meeting?',
    last_price_dollars: '0.6400',
    yes_bid_dollars: '0.6300',
    yes_ask_dollars: '0.6500',
    volume_24h_fp: '120000.00',
  }

  it('parses current string dollar fields', () => {
    const row = mapKalshiMarket(market)
    expect(row?.price).toBe('64¢')
    expect(row?.externalId).toBe('kalshi:FED-28JAN-H0')
    expect(row?.venue).toBe('Kalshi')
    expect(row?.volume24h).toBe(120000)
  })

  it('handles legacy numeric fields (decimal dollars and integer cents)', () => {
    const legacy: KalshiMarket = { ticker: 'X', title: 'q', last_price: 0.64 }
    expect(mapKalshiMarket(legacy)?.price).toBe('64¢')
    expect(mapKalshiMarket({ ...legacy, last_price: 64 })?.price).toBe('64¢')
  })

  it('falls back to the bid/ask midpoint when last_price is 0', () => {
    expect(mapKalshiMarket({ ...market, last_price_dollars: '0.0000' })?.price).toBe('64¢')
  })

  it('truncates long titles', () => {
    const row = mapKalshiMarket({ ...market, title: 'x'.repeat(120) })
    expect(row?.market.length).toBeLessThanOrEqual(80)
    expect(row?.market.endsWith('…')).toBe(true)
  })

  it('returns null without a usable price or title', () => {
    expect(
      mapKalshiMarket({
        ...market,
        last_price_dollars: '0.0000',
        yes_bid_dollars: '0.0000',
        yes_ask_dollars: '0.0000',
      }),
    ).toBeNull()
    expect(mapKalshiMarket({ ticker: 'X', title: undefined })).toBeNull()
  })
})

describe('interleaveRows', () => {
  const row = (externalId: string): TickerRowData => ({
    venue: externalId.startsWith('poly') ? 'Polymarket' : 'Kalshi',
    market: 'q',
    price: '50¢',
    order: 0,
    externalId,
  })

  it('alternates venues and assigns increasing order from 10', () => {
    const rows = interleaveRows([row('poly:1'), row('poly:2')], [row('kalshi:1')])
    expect(rows.map((r) => r.externalId)).toEqual(['poly:1', 'kalshi:1', 'poly:2'])
    expect(rows.map((r) => r.order)).toEqual([10, 20, 30])
  })

  it('handles one empty venue', () => {
    const rows = interleaveRows([], [row('kalshi:1'), row('kalshi:2')])
    expect(rows.map((r) => r.order)).toEqual([10, 20])
  })
})
