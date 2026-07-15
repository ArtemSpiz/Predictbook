import type { Access, CollectionConfig } from 'payload'
import { isAdminOrEditor } from '@/access/isAdminOrEditor'
import { slugField } from '@/fields/slug'
import { revalidateCollectionHooks } from '@/hooks/revalidateFrontCache'
import { pingIndexNowOnPublish } from '@/utilities/indexNow'

const readAccess: Access = ({ req }) => {
  const role = (req.user as { role?: string })?.role
  if (role === 'admin' || role === 'editor') return true
  return { _status: { equals: 'published' } }
}

export const LiveFeed: CollectionConfig = {
  slug: 'live-feed',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'live', 'publishedAt', '_status'],
    group: 'Content',
  },
  access: {
    read: readAccess,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  versions: {
    drafts: { autosave: { interval: 2000 } },
    maxPerDoc: 25,
  },
  hooks: {
    afterChange: [
      ...revalidateCollectionHooks.afterChange,
      pingIndexNowOnPublish((slug) => `/live/${slug}`),
    ],
    afterDelete: revalidateCollectionHooks.afterDelete,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            { name: 'title', type: 'text', required: true },
            { name: 'subtitle', type: 'textarea' },
            { name: 'coverImage', type: 'upload', relationTo: 'media' },
            {
              name: 'timeline',
              type: 'array',
              labels: { singular: 'Update', plural: 'Updates' },
              fields: [
                { name: 'time', type: 'text', required: true },
                { name: 'text', type: 'textarea', required: true },
              ],
            },
          ],
        },
        {
          label: 'Meta',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'live', type: 'checkbox', defaultValue: false, admin: { width: '50%' } },
                {
                  name: 'updates',
                  type: 'number',
                  admin: { width: '50%', description: 'Update count badge.' },
                },
              ],
            },
            {
              name: 'categories',
              type: 'relationship',
              relationTo: 'categories',
              hasMany: true,
            },
            {
              name: 'publishedAt',
              type: 'date',
              admin: { date: { pickerAppearance: 'dayAndTime' } },
            },
          ],
        },
      ],
    },
    slugField('title'),
  ],
}
