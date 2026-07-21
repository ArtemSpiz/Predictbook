import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import {
  buildSubmissionMetadata,
  getClientIp,
  lookupGeo,
  verifyTurnstile,
} from '@/utilities/submissionMeta'

type Payload = Awaited<ReturnType<typeof getPayload>>

async function resolveRecipient(payload: Payload, subject: string): Promise<string | undefined> {
  const page = await payload.findGlobal({ slug: 'contact-page', depth: 0 })
  const block = page?.mainBlocks?.find((b) => b.blockType === 'contact-form-fields')
  const match = block?.subjectOptions?.find((o) => o.label === subject)
  return match?.routeTo || block?.defaultRecipient || process.env.CONTACT_INBOX || undefined
}

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

    // Best-effort notification to the branded mailbox; the submission is already
    // persisted, so a send failure must not fail the request.
    try {
      const to = await resolveRecipient(payload, subject)
      if (to) {
        await payload.sendEmail({
          to,
          replyTo: email,
          subject: `[Contact] ${subject} — ${name}`,
          text: `From: ${name} <${email}>\nSubject: ${subject}\n\n${message}`,
        })
      }
    } catch (err) {
      payload.logger.error({ err }, 'Contact form email notification failed')
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false, error: 'Failed to submit' }, { status: 500 })
  }
}
