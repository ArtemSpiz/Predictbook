import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getSyncSecret } from '@/lib/signals-sync/secret'
import { runTickerSyncTick } from '@/lib/ticker-sync/sync'

/**
 * POST with header `x-sync-secret` to run one ticker reconciliation tick
 * against the Polymarket/Kalshi APIs. Called by the in-process poller (which
 * shares the secret via getSyncSecret); must run as a request so the
 * revalidateTag hooks fired by the writes work.
 */
export async function POST(req: NextRequest) {
  if (req.headers.get('x-sync-secret') !== getSyncSecret()) {
    return NextResponse.json({ ok: false }, { status: 401 })
  }

  const payload = await getPayload({ config })
  const stats = await runTickerSyncTick(payload)
  return NextResponse.json({ ok: true, ...stats })
}
