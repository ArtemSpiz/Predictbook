import type { CollectionConfig, Field } from 'payload'
import starterConfig from '../../../starter.config'
import { wideMarkupLexical } from '@/fields/wideMarkupLexical'
import { slugField } from '@/fields/slug'
import { revalidateCollectionHooks } from '@/hooks/revalidateFrontCache'
import { pingIndexNowOnPublish } from '@/utilities/indexNow'
import { blogReadAccess, blogWriteAccess } from './access'

const enableCategories = starterConfig.collections.categories
const enableTags = starterConfig.collections.tags

const metaFields: Field[] = [
  { name: 'author', type: 'relationship', relationTo: 'users' },
  ...(enableCategories
    ? ([
        {
          name: 'categories',
          type: 'relationship',
          relationTo: 'categories',
          hasMany: true,
        },
      ] as Field[])
    : []),
  ...(enableTags
    ? ([
        {
          name: 'tags',
          type: 'relationship',
          relationTo: 'tags',
          hasMany: true,
        },
      ] as Field[])
    : []),
  {
    name: 'publishedAt',
    type: 'date',
    admin: { date: { pickerAppearance: 'dayAndTime' } },
  },
]

export const Blog: CollectionConfig = {
  slug: 'blog',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'publishedAt', '_status'],
  },
  access: {
    read: blogReadAccess,
    create: blogWriteAccess,
    update: blogWriteAccess,
    delete: blogWriteAccess,
  },
  versions: {
    drafts: { autosave: { interval: 2000 } },
    maxPerDoc: 25,
  },
  hooks: {
    afterChange: [
      ...revalidateCollectionHooks.afterChange,
      pingIndexNowOnPublish((slug) => `/blog/${slug}`),
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
            { name: 'excerpt', type: 'textarea' },
            { name: 'coverImage', type: 'upload', relationTo: 'media' },
            {
              type: 'row',
              fields: [
                {
                  name: 'featured',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: { width: '50%', description: 'Surface in featured/grid slots.' },
                },
                {
                  name: 'live',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: { width: '50%', description: 'Show the live badge.' },
                },
              ],
            },
            {
              name: 'content',
              type: 'richText',
              editor: wideMarkupLexical,
              required: true,
            },
          ],
        },
        {
          label: 'Meta',
          fields: metaFields,
        },
      ],
    },
    slugField('title'),
  ],
}
