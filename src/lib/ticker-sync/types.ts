export type TickerVenue = 'Polymarket' | 'Kalshi'

export interface TickerRowData {
  venue: TickerVenue
  market: string
  price: string
  order: number
  externalId: string
  url?: string
  volume24h?: number
}

/** Subset of a Gamma /markets item. `outcomes`/`outcomePrices` arrive JSON-encoded. */
export interface GammaMarket {
  id: string
  question?: string
  slug?: string
  outcomes?: string | string[]
  outcomePrices?: string | string[]
  volume24hr?: number
}

/**
 * Subset of a trade-api v2 /markets item. Current responses carry string
 * `*_dollars`/`*_fp` fields; the plain numeric fields are the legacy form.
 */
export interface KalshiMarket {
  ticker: string
  title?: string
  yes_sub_title?: string
  last_price?: number
  last_price_dollars?: string
  yes_bid?: number
  yes_bid_dollars?: string
  yes_ask?: number
  yes_ask_dollars?: string
  volume_24h?: number
  volume_24h_fp?: string
}

export interface KalshiMarketsResponse {
  markets?: KalshiMarket[]
  cursor?: string
}
