import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import {
  buildSubmissionMetadata,
  getClientIp,
  lookupGeo,
  verifyTurnstile,
} from '@/utilities/submissionMeta'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, turnstileToken, referrer, landingUrl } = body ?? {}
    if (typeof email !== 'string' || !EMAIL_RE.test(email)) {
      return NextResponse.json({ ok: false, error: 'Invalid email' }, { status: 400 })
    }
    if (!(await verifyTurnstile(turnstileToken, req))) {
      return NextResponse.json({ ok: false, error: 'Captcha verification failed' }, { status: 400 })
    }

    const normalizedEmail = email.trim().toLowerCase()
    const payload = await getPayload({ config })

    // Dedupe by email: re-subscribing is idempotent, no duplicate row.
    const existing = await payload.find({
      collection: 'newsletter-submissions',
      where: { email: { equals: normalizedEmail } },
      limit: 1,
      overrideAccess: true,
    })
    if (existing.docs.length > 0) {
      return NextResponse.json({ ok: true, alreadySubscribed: true })
    }

    const ip = getClientIp(req)
    const geo = await lookupGeo(ip)
    await payload.create({
      collection: 'newsletter-submissions',
      data: {
        email: normalizedEmail,
        metadata: buildSubmissionMetadata(req, { ip, geo, referrer, landingUrl }),
      },
      overrideAccess: true,
    })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false, error: 'Failed to subscribe' }, { status: 500 })
  }
}
