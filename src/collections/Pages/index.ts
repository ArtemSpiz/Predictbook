import type { CollectionConfig } from 'payload'
import { slugField } from '@/fields/slug'
import { Hero } from '@/blocks/Hero/config'
import { pagesReadAccess, pagesWriteAccess } from './access'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', '_status', 'updatedAt'],
  },
  access: {
    read: pagesReadAccess,
    create: pagesWriteAccess,
    update: pagesWriteAccess,
    delete: pagesWriteAccess,
  },
  versions: {
    drafts: { autosave: { interval: 2000 } },
    maxPerDoc: 25,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            { name: 'title', type: 'text', required: true },
            {
              name: 'blocks',
              type: 'blocks',
              minRows: 0,
              blocks: [Hero], // remaining 12 blocks added in Phase 6 final wiring
            },
          ],
        },
      ],
    },
    slugField('title'),
  ],
}
