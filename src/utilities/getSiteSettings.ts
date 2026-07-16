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
  faviconUrl?: string
  siteName?: string
}

const DEFAULTS: SiteSettings = {
  sitemapIncludeNews: true,
  sitemapIncludeSignals: true,
  sitemapIncludeLiveFeed: true,
  robotsDisallowAll: false,
}

async function fetchSiteSettingsDoc(): Promise<SiteSettingsDoc | null> {
  try {
    const payload = await getPayload({ config })
    return (await payload.findGlobal({
      slug: 'site-settings',
      depth: 1,
    })) as unknown as SiteSettingsDoc
  } catch {
    return null
  }
}

/** Single cached read of the site-settings global (depth:1 for populated media);
 * the typed accessors below all derive from it, so one page = one DB read. */
const getSiteSettingsDoc = () =>
  unstable_cache(fetchSiteSettingsDoc, ['site-settings-doc'], {
    tags: [cacheTags.all, cacheTags.global('site-settings')],
  })()

export async function getSiteSettings(): Promise<SiteSettings> {
  const data = await getSiteSettingsDoc()
  if (!data) return DEFAULTS
  return {
    sitemapIncludeNews: data.sitemapIncludeNews !== false,
    sitemapIncludeSignals: data.sitemapIncludeSignals !== false,
    sitemapIncludeLiveFeed: data.sitemapIncludeLiveFeed !== false,
    robotsDisallowAll: data.robotsDisallowAll === true,
    gtmId: data.gtmId || undefined,
    ga4Id: data.ga4Id || undefined,
    faviconUrl:
      data.favicon && typeof data.favicon === 'object' ? (data.favicon.url ?? undefined) : undefined,
    siteName: data.siteName || undefined,
  }
}

export async function getSiteSidebar(): Promise<Pick<SiteSettingsDoc, 'promoBlocks' | 'sponsoredBlocks'>> {
  const data = await getSiteSettingsDoc()
  return { promoBlocks: data?.promoBlocks ?? [], sponsoredBlocks: data?.sponsoredBlocks ?? [] }
}

export async function getSocialLinks(): Promise<NonNullable<SiteSettingsDoc['social']>> {
  const data = await getSiteSettingsDoc()
  return data?.social ?? []
}
