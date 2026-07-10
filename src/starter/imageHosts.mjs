/**
 * Build Next `images.remotePatterns` from env. Fail-closed: only localhost plus
 * explicitly-configured hosts are allowed, so `/_next/image` cannot be abused as
 * an open proxy. Set NEXT_PUBLIC_CDN_URL / NEXT_PUBLIC_SERVER_URL (and optionally
 * NEXT_PUBLIC_IMAGE_HOSTS) in production or media images will be rejected.
 *
 * @param {Partial<Record<string, string | undefined>>} [env]
 * @returns {Array<{ protocol: 'http' | 'https', hostname: string }>}
 */
export function buildImageRemotePatterns(env = process.env) {
  const patterns = []
  const seen = new Set()

  const add = (protocol, hostname) => {
    if (!hostname) return
    if (protocol !== 'http' && protocol !== 'https') return
    const key = `${protocol}//${hostname}`
    if (seen.has(key)) return
    seen.add(key)
    patterns.push({ protocol, hostname })
  }

  const addUrl = (raw) => {
    if (!raw) return
    try {
      const u = new URL(raw)
      add(u.protocol.replace(':', ''), u.hostname)
    } catch {
      /* ignore malformed URL */
    }
  }

  addUrl(env.NEXT_PUBLIC_CDN_URL)
  addUrl(env.NEXT_PUBLIC_SERVER_URL)
  addUrl(env.NEXT_PUBLIC_SITE_URL)

  for (const entry of (env.NEXT_PUBLIC_IMAGE_HOSTS ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)) {
    if (entry.includes('://')) addUrl(entry)
    else add('https', entry)
  }

  add('http', 'localhost')
  add('http', '127.0.0.1')
  return patterns
}
