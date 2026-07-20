import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import {
  buildSubmissionMetadata,
  getClientIp,
  lookupGeo,
  verifyTurnstile,
} from '@/utilities/submissionMeta'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, subject, message, turnstileToken, referrer, landingUrl } = body ?? {}
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ ok: false, error: 'Missing fields' }, { status: 400 })
    }
    if (!(await verifyTurnstile(turnstileToken, req))) {
      return NextResponse.json({ ok: false, error: 'Captcha verification failed' }, { status: 400 })
    }

    const ip = getClientIp(req)
    const geo = await lookupGeo(ip)

    const payload = await getPayload({ config })
    await payload.create({
      collection: 'contact-submissions',
      data: {
        name,
        email,
        subject,
        message,
        metadata: buildSubmissionMetadata(req, { ip, geo, referrer, landingUrl }),
      },
      overrideAccess: true,
    })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false, error: 'Failed to submit' }, { status: 500 })
  }
}
