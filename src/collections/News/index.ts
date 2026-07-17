import type { CollectionConfig, Field } from 'payload'
import starterConfig from '../../../starter.config'
import { wideMarkupLexical } from '@/fields/wideMarkupLexical'
import { slugField } from '@/fields/slug'
import { revalidateCollectionHooks } from '@/hooks/revalidateFrontCache'
import { pingIndexNowOnPublish } from '@/utilities/indexNow'
import { newsReadAccess, newsWriteAccess } from './access'

const enableCategories = starterConfig.collections.categories
const enableTags = starterConfig.collections.tags

const metaFields: Field[] = [
  { name: 'author', type: 'relationship', relationTo: 'users' },
  { name: 'author photo', type: 'upload', relationTo: 'media' },
  { name: 'author job', type: 'text' },
  {
    name: 'authorProfile',
    type: 'relationship',
    relationTo: 'authors',
    admin: { description: 'Public author profile shown on the site (/author/[slug]).' },
  },
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

export const News: CollectionConfig = {
  slug: 'news',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'publishedAt', '_status'],
    group: 'Content',
  },
  access: {
    read: newsReadAccess,
    create: newsWriteAccess,
    update: newsWriteAccess,
    delete: newsWriteAccess,
  },
  versions: {
    drafts: { autosave: { interval: 2000 } },
    maxPerDoc: 25,
  },
  hooks: {
    afterChange: [
      ...revalidateCollectionHooks.afterChange,
      pingIndexNowOnPublish((slug) => `/analysis/${slug}`),
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
                  admin: { width: '33%', description: 'Surface in featured/grid slots.' },
                },
                {
                  name: 'live',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: { width: '33%', description: 'Show the live badge.' },
                },
                {
                  name: 'isDeveloping',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: { width: '33%', description: 'Show the developing badge.' },
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
