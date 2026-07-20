import type { Metadata } from 'next'

import type { Media } from '@/payload-types'
import { getSiteUrl } from './getSiteUrl'
import { getSiteSettings } from './getSiteSettings'
import { localeAlternates } from './metadataAlternates'
import { siteConfig } from './siteConfig'

type MediaRef = (number | string | null) | Media

type MetaGroup = {
  title?: string | null
  description?: string | null
  image?: MediaRef
}

type MetaDoc = {
  title?: string | null
  excerpt?: string | null
  meta?: MetaGroup | null
  coverImage?: MediaRef
  publishedAt?: string | null
  updatedAt?: string | null
}

function mediaUrl(value: unknown): string | undefined {
  if (value && typeof value === 'object' && 'url' in value) {
    const url = (value as Media).url
    if (typeof url === 'string' && url.length > 0) return url
  }
  return undefined
}

/**
 * Build page `Metadata` from a CMS doc: plugin-seo `meta` fields with sensible
 * fallbacks to the doc's own title/excerpt/cover image. Sets canonical, Open
 * Graph and Twitter cards; emits `article` OG (with dates) when `type: 'article'`.
 */
export async function generateMeta(args: {
  doc: MetaDoc | null | undefined
  pathSuffix: string
  type?: 'website' | 'article'
}): Promise<Metadata> {
  const { doc, pathSuffix, type = 'website' } = args
  const base = getSiteUrl()
  const { defaultMetaDescription, defaultMetaImageUrl } = await getSiteSettings()

  const title = doc?.meta?.title || doc?.title || siteConfig.name
  const description =
    doc?.meta?.description || doc?.excerpt || defaultMetaDescription || siteConfig.description
  const customImage =
    mediaUrl(doc?.meta?.image) || mediaUrl(doc?.coverImage) || defaultMetaImageUrl
  const url = `${base}${pathSuffix.startsWith('/') || pathSuffix === '' ? pathSuffix : `/${pathSuffix}`}` || base

  return {
    title,
    description,
    ...localeAlternates(pathSuffix),
    openGraph: {
      type,
      url,
      title,
      description,
      siteName: siteConfig.name,
      locale: siteConfig.ogLocale,
      ...(customImage ? { images: [customImage] } : {}),
      ...(type === 'article'
        ? {
            publishedTime: doc?.publishedAt || undefined,
            modifiedTime: doc?.updatedAt || undefined,
          }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(customImage ? { images: [customImage] } : {}),
    },
  }
}
