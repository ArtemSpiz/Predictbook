import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Signal } from '@/payload-types'
import { cacheTags } from '@/utilities/cacheTags'
import type { SummaryItem } from '@/app/components/Home/Summary'

const DAY_MS = 24 * 60 * 60 * 1000

const money = (s?: string | null) => (s ? Number(s.replace(/[^0-9.]/g, '')) || 0 : 0)
const pct = (s?: string | null) => (s ? parseFloat(s.replace(/[^0-9.]/g, '')) || 0 : 0)

function summarize(items: Signal[]): string[] {
  if (items.length === 0) return ['No new signals in this period.']

  const whales = items.filter((i) => i.kind === 'whale')
  const arbs = items.filter((i) => i.kind === 'arbitrage')
  const info = [
    `${items.length} new signals — ${whales.length} whale alerts, ${arbs.length} arbitrage opportunities`,
  ]

  const biggestWhale = [...whales].filter((w) => w.size).sort((a, b) => money(b.size) - money(a.size))[0]
  if (biggestWhale?.size) info.push(`Largest whale: ${biggestWhale.size} on “${biggestWhale.title}”`)

  const widestArb = [...arbs].filter((a) => a.spread).sort((a, b) => pct(b.spread) - pct(a.spread))[0]
  if (widestArb?.spread) info.push(`Widest spread: ${widestArb.spread} on “${widestArb.title}”`)

  return info
}

async function fetchSignalsSummary(): Promise<SummaryItem[]> {
  try {
    const payload = await getPayload({ config })
    const now = Date.now()
    const weekAgo = new Date(now - 7 * DAY_MS).toISOString()
    const { docs } = await payload.find({
      collection: 'signals',
      where: { publishedAt: { greater_than_equal: weekAgo } },
      sort: '-publishedAt',
      limit: 1000,
      depth: 0,
      overrideAccess: true,
    })
    const week = docs as unknown as Signal[]
    const dayCutoff = now - DAY_MS
    const day = week.filter((s) => s.publishedAt && new Date(s.publishedAt).getTime() >= dayCutoff)

    const time = new Date(now).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'UTC',
    })

    return [
      { title: 'Daily summary', infoTitle: 'Daily Market Pulse', day: 'Today', time, info: summarize(day) },
      { title: 'Weekly summary', infoTitle: 'Weekly Market Pulse', day: 'Last 7 days', time, info: summarize(week) },
    ]
  } catch {
    return []
  }
}

/** Cached daily/weekly market summaries derived from the signals collection. */
export const getSignalsSummary = () =>
  unstable_cache(fetchSignalsSummary, ['signals-summary'], {
    tags: [cacheTags.all, cacheTags.collection('signals')],
  })()
