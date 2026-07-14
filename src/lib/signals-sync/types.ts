export interface ArbitrageFields {
  topic?: string
  question?: string
  market_1?: string
  market_2?: string
  yes_venue?: string
  no_venue?: string
  yes_price?: number
  no_price?: number
  spread_ratio?: number
  spread?: string
  canonical_id?: string
  strategy?: string
}

export interface WhaleFields {
  platform?: string
  topic?: string
  market?: string
  address?: string
  address_pnl?: string
  side?: string
  size?: string
  odds_at_entry?: string
  market_outcome?: string
  event_id?: string
  source_name?: string
}

export interface ExternalSignalItem {
  id: string
  type: string
  source?: string
  title?: string
  text?: string
  fields?: ArbitrageFields & WhaleFields
  links?: Record<string, string>
  created_ms: number
}

export interface ExternalFeedResponse {
  items: ExternalSignalItem[]
  next_since?: number
}

export const SIGNAL_TYPES = ['whale', 'arbitrage'] as const
export type SignalType = (typeof SIGNAL_TYPES)[number]
