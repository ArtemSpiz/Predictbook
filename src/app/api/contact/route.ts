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

/** Client IP from the proxy chain (Caddy sets X-Forwarded-For; Cloudflare sets its own). */
function getClientIp(req: Request): string | undefined {
  const xff = req.headers.get('x-forwarded-for')
  if (xff) return xff.split(',')[0]!.trim()
  return (
    req.headers.get('cf-connecting-ip') || req.headers.get('x-real-ip') || undefined
  )
}

const isPrivateIp = (ip?: string): boolean =>
  !ip ||
  ip === '::1' ||
  ip.startsWith('127.') ||
  ip.startsWith('10.') ||
  ip.startsWith('192.168.') ||
  /^172\.(1[6-9]|2\d|3[01])\./.test(ip)

/** Best-effort IP→location lookup (never blocks or fails the submission). */
async function lookupGeo(
  ip?: string,
): Promise<{ country?: string; city?: string; region?: string }> {
  if (isPrivateIp(ip)) return {}
  try {
    const res = await fetch(`https://ipwho.is/${encodeURIComponent(ip!)}`, {
      signal: AbortSignal.timeout(3000),
    })
    const d = (await res.json()) as {
      success?: boolean
      country?: string
      city?: string
      region?: string
    }
    if (d?.success) return { country: d.country, city: d.city, region: d.region }
  } catch {
    // ignore — location is optional
  }
  return {}
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
        metadata: {
          ipAddress: ip,
          country: geo.country,
          city: geo.city,
          region: geo.region,
          referrer:
            typeof referrer === 'string' && referrer
              ? referrer
              : req.headers.get('referer') || undefined,
          landingUrl: typeof landingUrl === 'string' ? landingUrl : undefined,
          userAgent: req.headers.get('user-agent') || undefined,
        },
      },
      overrideAccess: true,
    })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false, error: 'Failed to submit' }, { status: 500 })
  }
}
