import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getSyncSecret } from '@/lib/signals-sync/secret'
import { runSignalsSyncTick } from '@/lib/signals-sync/sync'

/**
 * POST with header `x-sync-secret` to run one ingestion tick against the
 * external Signals API. Called by the in-process poller (which shares the
 * secret via getSyncSecret); must run as a request so the revalidateTag hooks
 * fired by the upserts work.
 */
export async function POST(req: NextRequest) {
  if (req.headers.get('x-sync-secret') !== getSyncSecret()) {
    return NextResponse.json({ ok: false }, { status: 401 })
  }

  const payload = await getPayload({ config })
  const stats = await runSignalsSyncTick(payload)
  return NextResponse.json({ ok: true, ...stats })
}
