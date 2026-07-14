import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { runSignalsSyncTick } from '@/lib/signals-sync/sync'

/**
 * POST with header `x-sync-secret: <SIGNALS_SYNC_SECRET>` to run one ingestion
 * tick against the external Signals API. Called by the in-process poller; must
 * run as a request so the revalidateTag hooks fired by the upserts work.
 */
export async function POST(req: NextRequest) {
  const expected = process.env.SIGNALS_SYNC_SECRET
  if (!expected) {
    return NextResponse.json(
      { ok: false, error: 'SIGNALS_SYNC_SECRET not configured' },
      { status: 503 },
    )
  }
  if (req.headers.get('x-sync-secret') !== expected) {
    return NextResponse.json({ ok: false }, { status: 401 })
  }

  const payload = await getPayload({ config })
  const stats = await runSignalsSyncTick(payload)
  return NextResponse.json({ ok: true, ...stats })
}
