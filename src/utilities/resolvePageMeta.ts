import type { Metadata } from 'next'
import type { Media } from '@/payload-types'
import { getSiteSettings } from '@/utilities/getSiteSettings'
import { siteConfig } from '@/utilities/siteConfig'

type MetaGroup =
  | {
      title?: string | null
      description?: string | null
      image?: (string | null) | Media
    }
  | null
  | undefined

/**
 * Merge an editable meta group over per-page fallbacks and return a COMPLETE
 * openGraph object. Next.js replaces (does not deep-merge) `openGraph` per route,
 * so every page must re-emit `siteName`/`type`/`locale` or link unfurls fall back
 * to showing the bare domain instead of the brand name.
 */
export async function resolvePageMeta(
  meta: MetaGroup,
  fallback: { title: string; description?: string; url?: string },
): Promise<Metadata> {
  const { siteName } = await getSiteSettings()
  const name = siteName || siteConfig.name
  const title = meta?.title || fallback.title
  const description = meta?.description || fallback.description || undefined
  const image = meta?.image
  const imageUrl = image && typeof image === 'object' ? (image.url ?? undefined) : undefined

  return {
    title,
    ...(description ? { description } : {}),
    openGraph: {
      type: 'website',
      siteName: name,
      locale: siteConfig.ogLocale,
      ...(fallback.url ? { url: fallback.url } : {}),
      title,
      ...(description ? { description } : {}),
      ...(imageUrl ? { images: [{ url: imageUrl }] } : {}),
    },
  }
}
