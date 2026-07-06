import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

/**
 * POST with header `x-revalidate-secret: <REVALIDATE_SECRET>` (or query `?secret=`
 * for manual tests) to flush the shared `payload` cache tag. Use from external
 * webhooks / CI when content changes outside the Payload admin.
 */
export async function POST(req: NextRequest) {
  const expected = process.env.REVALIDATE_SECRET
  if (!expected) {
    return NextResponse.json(
      { ok: false, error: 'REVALIDATE_SECRET not configured' },
      { status: 503 },
    )
  }

  const headerSecret = req.headers.get('x-revalidate-secret')
  const querySecret = new URL(req.url).searchParams.get('secret')
  if (headerSecret !== expected && querySecret !== expected) {
    return NextResponse.json({ ok: false }, { status: 401 })
  }

  revalidateTag('payload')
  return NextResponse.json({ ok: true, revalidated: 'payload' })
}
