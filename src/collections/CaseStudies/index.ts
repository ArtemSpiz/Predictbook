import type { CollectionConfig } from 'payload'
import { wideMarkupLexical } from '@/fields/wideMarkupLexical'
import { slugField } from '@/fields/slug'
import { revalidateCollectionHooks } from '@/hooks/revalidateFrontCache'
import { pingIndexNowOnPublish } from '@/utilities/indexNow'
import { caseStudiesReadAccess, caseStudiesWriteAccess } from './access'

export const CaseStudies: CollectionConfig = {
  slug: 'case-studies',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'client', 'industry', 'publishedAt', '_status'],
  },
  access: {
    read: caseStudiesReadAccess,
    create: caseStudiesWriteAccess,
    update: caseStudiesWriteAccess,
    delete: caseStudiesWriteAccess,
  },
  versions: {
    drafts: { autosave: { interval: 2000 } },
    maxPerDoc: 25,
  },
  hooks: {
    afterChange: [
      ...revalidateCollectionHooks.afterChange,
      pingIndexNowOnPublish((slug) => `/case-studies/${slug}`),
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
              name: 'content',
              type: 'richText',
              editor: wideMarkupLexical,
              required: true,
            },
          ],
        },
        {
          label: 'Meta',
          fields: [
            { name: 'client', type: 'text' },
            { name: 'industry', type: 'text' },
            {
              name: 'services',
              type: 'array',
              fields: [{ name: 'name', type: 'text', required: true }],
            },
            {
              name: 'duration',
              type: 'text',
              admin: { description: 'e.g. "3 months", "Q1 2024"' },
            },
            {
              name: 'relatedCaseStudies',
              type: 'relationship',
              relationTo: 'case-studies',
              hasMany: true,
              filterOptions: ({ id }) => ({ id: { not_equals: id } }),
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
