import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { SiteSetting as SiteSettingsDoc } from '@/payload-types'
import { cacheTags } from '@/utilities/cacheTags'

export type SiteSettings = {
  sitemapIncludeNews: boolean
  sitemapIncludeSignals: boolean
  sitemapIncludeLiveFeed: boolean
  robotsDisallowAll: boolean
  gtmId?: string
  ga4Id?: string
}

const DEFAULTS: SiteSettings = {
  sitemapIncludeNews: true,
  sitemapIncludeSignals: true,
  sitemapIncludeLiveFeed: true,
  robotsDisallowAll: false,
}

async function fetchSiteSettings(): Promise<SiteSettings> {
  try {
    const payload = await getPayload({ config })
    const data = (await payload.findGlobal({
      slug: 'site-settings',
    })) as unknown as Record<string, unknown>
    return {
      sitemapIncludeNews: data.sitemapIncludeNews !== false,
      sitemapIncludeSignals: data.sitemapIncludeSignals !== false,
      sitemapIncludeLiveFeed: data.sitemapIncludeLiveFeed !== false,
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
  unstable_cache(fetchSiteSettings, ['site-settings'], {
    tags: [cacheTags.global('site-settings')],
  })()

async function fetchSiteSidebar(): Promise<Pick<SiteSettingsDoc, 'promoBlocks' | 'sponsoredBlocks'>> {
  try {
    const payload = await getPayload({ config })
    const data = (await payload.findGlobal({
      slug: 'site-settings',
      depth: 1,
    })) as unknown as SiteSettingsDoc
    return { promoBlocks: data.promoBlocks ?? [], sponsoredBlocks: data.sponsoredBlocks ?? [] }
  } catch {
    return { promoBlocks: [], sponsoredBlocks: [] }
  }
}

/** Cached site-wide sidebar blocks (promo + sponsored) for news sub-routes, depth:1 for populated media. */
export const getSiteSidebar = () =>
  unstable_cache(fetchSiteSidebar, ['site-sidebar'], {
    tags: [cacheTags.global('site-settings')],
  })()
