import type { Tab } from 'payload'
import type { Metadata } from 'next'
import type { Media } from '@/payload-types'

/**
 * SEO meta tab for page globals. Mirrors the `meta` group the seo plugin adds to
 * collections (title/description/image) so editing feels consistent everywhere.
 */
export const seoTab: Tab = {
  label: 'SEO',
  fields: [
    {
      name: 'meta',
      type: 'group',
      label: false,
      fields: [
        {
          name: 'title',
          type: 'text',
          admin: { description: 'Browser tab / search title. Falls back to the page heading.' },
        },
        {
          name: 'description',
          type: 'textarea',
          admin: { description: 'Meta description for search engines and social shares.' },
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'Open Graph / social share image (recommended 1200×630).' },
        },
      ],
    },
  ],
}

type MetaGroup =
  | {
      title?: string | null
      description?: string | null
      image?: (string | null) | Media
    }
  | null
  | undefined

/** Merge an editable meta group over sensible per-page fallbacks. */
export function resolvePageMeta(
  meta: MetaGroup,
  fallback: { title: string; description?: string },
): Metadata {
  const title = meta?.title || fallback.title
  const description = meta?.description || fallback.description || undefined
  const image = meta?.image
  const imageUrl = image && typeof image === 'object' ? (image.url ?? undefined) : undefined

  return {
    title,
    ...(description ? { description } : {}),
    openGraph: {
      title,
      ...(description ? { description } : {}),
      ...(imageUrl ? { images: [{ url: imageUrl }] } : {}),
    },
  }
}
