import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  upload: { staticDir: 'public/media' },
  fields: [{ name: 'alt', type: 'text' }],
}
