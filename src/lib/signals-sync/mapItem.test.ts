import { describe, it, expect } from 'vitest'
import { formatCents, mapExternalToSignalData } from './mapItem'
import type { ExternalSignalItem } from './types'

const arbitrageItem: ExternalSignalItem = {
  id: '6a568a6032885161aaddc7f4',
  type: 'arbitrage',
  source: 'arbitrage-bot',
  title: 'ARBITRAGE ALERT | Polymarket × Kalshi | SPORTS',
  text: 'ARBITRAGE ALERT ...',
  fields: {
    topic: 'SPORTS',
    question: 'Will New Orleans Saints win the 2027 NFL NFC Championship?',
    yes_venue: 'Polymarket',
    no_venue: 'Kalshi',
    yes_price: 0.015,
    no_price: 0.72,
    spread_ratio: 0.265,
    spread: '26.5%',
    strategy: 'BUY_YES@Polymarket+BUY_NO@Kalshi',
  },
  created_ms: 1784056241754,
}

const whaleItem: ExternalSignalItem = {
  id: '6a56949532885161aaddc7fd',
  type: 'whale',
  source: 'whale-bot',
  title: 'WHALE ALERT | KALSHI | SPORTS',
  text: 'WHALE ALERT ...',
  fields: {
    platform: 'KALSHI',
    market: 'France vs Spain: To Advance',
    side: 'BUY',
    size: '$247,716',
    odds_at_entry: '64.00%',
    market_outcome: 'Spain advances, Yes',
  },
  created_ms: 1784059027408,
}

describe('formatCents', () => {
  it('formats 0-1 prices as cents', () => {
    expect(formatCents(0.72)).toBe('72¢')
    expect(formatCents(0.015)).toBe('1.5¢')
    expect(formatCents(undefined)).toBeUndefined()
  })
})

describe('mapExternalToSignalData', () => {
  it('maps arbitrage items', () => {
    const data = mapExternalToSignalData(arbitrageItem)
    expect(data).toMatchObject({
      kind: 'arbitrage',
      title: 'Will New Orleans Saints win the 2027 NFL NFC Championship?',
      subtitle: 'BUY YES @ Polymarket · BUY NO @ Kalshi',
      yesPrice: '1.5¢',
      noPrice: '72¢',
      yesVenue: 'Polymarket',
      noVenue: 'Kalshi',
      poly: '1.5¢',
      kalshi: '72¢',
      spread: '26.5%',
      profitablyPP: '26.5%',
      profitably: true,
      externalId: arbitrageItem.id,
      externalCreatedMs: arbitrageItem.created_ms,
      slug: `arbitrage-${arbitrageItem.id}`,
      _status: 'published',
    })
    expect(data?.publishedAt).toBe(new Date(arbitrageItem.created_ms).toISOString())
  })

  it('swaps venue prices when Kalshi holds the YES side', () => {
    const data = mapExternalToSignalData({
      ...arbitrageItem,
      fields: { ...arbitrageItem.fields, yes_venue: 'Kalshi', no_venue: 'Polymarket' },
    })
    expect(data?.poly).toBe('72¢')
    expect(data?.kalshi).toBe('1.5¢')
  })

  it('maps whale items with raw upstream strings', () => {
    const data = mapExternalToSignalData(whaleItem)
    expect(data).toMatchObject({
      kind: 'whale',
      title: 'France vs Spain: To Advance',
      subtitle: 'Spain advances, Yes',
      side: 'BUY',
      size: '$247,716',
      odds: '64.00%',
      profitably: false,
      slug: `whale-${whaleItem.id}`,
    })
    expect(data?.yesPrice).toBeUndefined()
  })

  it('returns null for unknown types', () => {
    expect(mapExternalToSignalData({ ...whaleItem, type: 'news' })).toBeNull()
  })
})
