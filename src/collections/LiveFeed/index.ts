import type { Access, CollectionConfig } from 'payload'
import { isAdminOrEditor } from '@/access/isAdminOrEditor'
import { slugField } from '@/fields/slug'
import { wideMarkupLexical } from '@/fields/wideMarkupLexical'
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
    // Stamp each timeline update with its creation time once, so the public
    // "x minutes ago" label is stable across edits (manual `time` stays the label).
    beforeChange: [
      ({ data, req }) => {
        if (Array.isArray(data?.timeline)) {
          const now = new Date().toISOString()
          data.timeline = data.timeline.map((entry) =>
            entry && !entry.at ? { ...entry, at: now } : entry,
          )
        }
        if (data && req.user) data.lastEditedBy = req.user.id
        return data
      },
    ],
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
                {
                  name: 'time',
                  type: 'text',
                  required: true,
                  admin: { description: 'Manual label shown for this update (e.g. "Latest", "09:30").' },
                },
                { name: 'heading', type: 'text', admin: { description: 'Optional update title.' } },
                { name: 'image', type: 'upload', relationTo: 'media' },
                { name: 'body', type: 'richText', editor: wideMarkupLexical, required: true },
                {
                  name: 'at',
                  type: 'date',
                  admin: {
                    date: { pickerAppearance: 'dayAndTime' },
                    description:
                      'Drives the "x minutes ago" label. Auto-set when the update is first added; edit to override.',
                  },
                },
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
              name: 'authors',
              type: 'relationship',
              relationTo: 'authors',
              hasMany: true,
              admin: { description: 'Byline — one or more authors running this thread.' },
            },
            {
              name: 'lastEditedBy',
              type: 'relationship',
              relationTo: 'users',
              admin: {
                readOnly: true,
                description: 'Auto: the last user who edited this thread ("Edited by").',
              },
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
