import type { MetadataRoute } from 'next'

import { getSiteUrl } from '@/utilities/getSiteUrl'
import { getSiteSettings } from '@/utilities/getSiteSettings'

export const revalidate = 3600

export default async function robots(): Promise<MetadataRoute.Robots> {
  const base = getSiteUrl()

  // Env kill-switch for staging/preview, plus a CMS-controlled flag.
  if (process.env.ROBOTS_NOINDEX === '1') {
    return { rules: { userAgent: '*', disallow: '/' } }
  }
  const settings = await getSiteSettings()
  if (settings.robotsDisallowAll) {
    return { rules: { userAgent: '*', disallow: '/' } }
  }

  return {
    rules: {
      userAgent: '*',
      // `/api/media` serves public images that should stay crawlable; the more
      // specific Allow overrides the broad `/api` Disallow.
      allow: ['/', '/_next/static/', '/_next/image', '/api/media'],
      disallow: ['/admin', '/api'],
    },
    sitemap: `${base}/sitemap.xml`,
  }
}
