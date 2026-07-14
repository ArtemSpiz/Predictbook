import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export const dynamic = 'force-dynamic'

export interface TickerFeedItem {
  id: string
  venue: string
  market: string
  price: string
  order: number
}

/** Uncached JSON feed of ticker rows for client-side live polling of the header marquee. */
export async function GET() {
  const payload = await getPayload({ config })
  const res = await payload.find({
    collection: 'ticker',
    sort: 'order',
    limit: 100,
    pagination: false,
    depth: 0,
  })

  const items: TickerFeedItem[] = res.docs.map((doc) => ({
    id: String(doc.id),
    venue: doc.venue,
    market: doc.market,
    price: doc.price,
    order: doc.order ?? 0,
  }))
  return NextResponse.json({ items })
}
