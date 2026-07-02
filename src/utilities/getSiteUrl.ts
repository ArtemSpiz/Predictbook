/**
 * Absolute public base URL of the site, without a trailing slash.
 *
 * Resolution order:
 *   1. `NEXT_PUBLIC_SERVER_URL` (the starter's canonical env, also used by Payload)
 *   2. `NEXT_PUBLIC_SITE_URL` (alias)
 *   3. `VERCEL_URL` (preview/prod deploys)
 *   4. `http://localhost:3000`
 */
export function getSiteUrl(): string {
  const explicit =
    process.env.NEXT_PUBLIC_SERVER_URL?.trim() || process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (explicit) return explicit.replace(/\/$/, '')
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`.replace(/\/$/, '')
  return 'http://localhost:3000'
}
