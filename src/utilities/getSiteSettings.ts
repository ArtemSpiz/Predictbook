import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import config from '@payload-config'

export type SiteSettings = {
  sitemapIncludeBlog: boolean
  sitemapIncludeCaseStudies: boolean
  robotsDisallowAll: boolean
  gtmId?: string
  ga4Id?: string
}

const DEFAULTS: SiteSettings = {
  sitemapIncludeBlog: true,
  sitemapIncludeCaseStudies: true,
  robotsDisallowAll: false,
}

async function fetchSiteSettings(): Promise<SiteSettings> {
  try {
    const payload = await getPayload({ config })
    const data = (await payload.findGlobal({
      slug: 'site-settings',
    })) as unknown as Record<string, unknown>
    return {
      sitemapIncludeBlog: data.sitemapIncludeBlog !== false,
      sitemapIncludeCaseStudies: data.sitemapIncludeCaseStudies !== false,
      robotsDisallowAll: data.robotsDisallowAll === true,
      gtmId: typeof data.gtmId === 'string' && data.gtmId ? data.gtmId : undefined,
      ga4Id: typeof data.ga4Id === 'string' && data.ga4Id ? data.ga4Id : undefined,
    }
  } catch {
    return DEFAULTS
  }
}

/** Cached SiteSettings global, invalidated by the shared `payload` tag. */
export const getSiteSettings = () =>
  unstable_cache(fetchSiteSettings, ['site-settings'], { tags: ['payload'] })()
