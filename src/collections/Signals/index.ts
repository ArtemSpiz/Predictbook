import type { Access, CollectionConfig } from 'payload'
import { isAdminOrEditor } from '@/access/isAdminOrEditor'
import { slugField } from '@/fields/slug'
import { revalidateCollectionHooks } from '@/hooks/revalidateFrontCache'

const readAccess: Access = ({ req }) => {
  const role = (req.user as { role?: string })?.role
  if (role === 'admin' || role === 'editor') return true
  return { _status: { equals: 'published' } }
}

export const Signals: CollectionConfig = {
  slug: 'signals',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'kind', 'publishedAt', '_status'],
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
  hooks: revalidateCollectionHooks,
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            { name: 'title', type: 'text', required: true },
            { name: 'subtitle', type: 'textarea' },
            {
              name: 'kind',
              type: 'select',
              required: true,
              defaultValue: 'arbitrage',
              options: [
                { label: 'Arbitrage', value: 'arbitrage' },
                { label: 'Whale alert', value: 'whale' },
              ],
            },
            { name: 'featured', type: 'checkbox', defaultValue: false },
            { name: 'coverImage', type: 'upload', relationTo: 'media' },
          ],
        },
        {
          label: 'Market',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'yesPrice', type: 'text', admin: { width: '50%' } },
                { name: 'noPrice', type: 'text', admin: { width: '50%' } },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'poly', type: 'text', label: 'Polymarket', admin: { width: '50%' } },
                { name: 'kalshi', type: 'text', label: 'Kalshi', admin: { width: '50%' } },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'size', type: 'text', admin: { width: '33%' } },
                { name: 'odds', type: 'text', admin: { width: '33%' } },
                { name: 'spread', type: 'text', admin: { width: '33%' } },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'volume', type: 'text', admin: { width: '50%' } },
                {
                  name: 'profitablyPP',
                  type: 'text',
                  label: 'Profit (pp)',
                  admin: { width: '50%' },
                },
              ],
            },
            { name: 'profitably', type: 'checkbox', defaultValue: false },
          ],
        },
        {
          label: 'Meta',
          fields: [
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
