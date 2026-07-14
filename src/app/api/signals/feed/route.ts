import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import type { Where } from 'payload'
import config from '@payload-config'
import type { Signal } from '@/payload-types'
import { signalToLiveView } from '@/app/lib/viewModels'

export const dynamic = 'force-dynamic'

/**
 * Uncached JSON feed of published signals for client-side live polling.
 * Query: `since` (ISO publishedAt, exclusive), `kind` (whale|arbitrage), `limit`.
 * Items are mapped to view models on the server so date formatting stays
 * consistent with the server-rendered cards.
 */
export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams
  const since = params.get('since')
  const kind = params.get('kind')
  const limit = Math.min(Math.max(Number(params.get('limit') ?? 20) || 20, 1), 50)

  const where: Where = { _status: { equals: 'published' } }
  if (since) where.publishedAt = { greater_than: since }
  if (kind === 'whale' || kind === 'arbitrage') where.kind = { equals: kind }

  const payload = await getPayload({ config })
  const res = await payload.find({
    collection: 'signals',
    where,
    limit,
    sort: '-publishedAt',
    depth: 1,
  })

  const docs = res.docs as unknown as Signal[]
  const items = docs.map(signalToLiveView)
  return NextResponse.json({ items, latest: items[0]?.publishedAt ?? null })
}
