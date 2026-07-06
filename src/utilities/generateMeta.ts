import type { Metadata } from 'next'

import type { Media } from '@/payload-types'
import { getSiteUrl } from './getSiteUrl'
import { localeAlternates } from './metadataAlternates'
import { siteConfig } from './siteConfig'

type MetaGroup = {
  title?: string | null
  description?: string | null
  image?: (number | null) | Media
}

type MetaDoc = {
  title?: string | null
  excerpt?: string | null
  meta?: MetaGroup | null
  coverImage?: (number | null) | Media
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
export function generateMeta(args: {
  doc: MetaDoc | null | undefined
  pathSuffix: string
  type?: 'website' | 'article'
}): Metadata {
  const { doc, pathSuffix, type = 'website' } = args
  const base = getSiteUrl()

  const title = doc?.meta?.title || doc?.title || siteConfig.name
  const description = doc?.meta?.description || doc?.excerpt || siteConfig.description
  const image =
    mediaUrl(doc?.meta?.image) || mediaUrl(doc?.coverImage) || siteConfig.defaultOgImage
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
      images: [image],
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
      images: [image],
    },
  }
}
