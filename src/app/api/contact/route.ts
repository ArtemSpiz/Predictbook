import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

// Verify a Cloudflare Turnstile token. No-op (returns true) when the secret is
// unset, so the endpoint keeps working before the captcha is configured.
async function verifyTurnstile(token: unknown, req: Request): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) return true
  if (typeof token !== 'string' || !token) return false
  const form = new URLSearchParams({ secret, response: token })
  const ip = req.headers.get('cf-connecting-ip')
  if (ip) form.set('remoteip', ip)
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: form,
    })
    const data = (await res.json()) as { success?: boolean }
    return data.success === true
  } catch {
    return false
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, subject, message, turnstileToken } = body ?? {}
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ ok: false, error: 'Missing fields' }, { status: 400 })
    }
    if (!(await verifyTurnstile(turnstileToken, req))) {
      return NextResponse.json({ ok: false, error: 'Captcha verification failed' }, { status: 400 })
    }
    const payload = await getPayload({ config })
    await payload.create({
      collection: 'contact-submissions',
      data: { name, email, subject, message },
      overrideAccess: true,
    })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false, error: 'Failed to submit' }, { status: 500 })
  }
}
