import type { Tab } from 'payload'

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
