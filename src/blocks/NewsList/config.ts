import type { Block } from 'payload'
import { hiddenField } from '../_shared/fields'

export const NewsListBlock: Block = {
  slug: 'news-list',
  labels: { singular: 'News List', plural: 'News Lists' },
  fields: [
    { name: 'heading', type: 'text', required: true, defaultValue: 'Analysis' },
    { name: 'subtitle', type: 'textarea' },
    {
      name: 'categories',
      type: 'array',
      label: 'Filter categories',
      admin: { description: 'Category filter buttons shown above the list.' },
      fields: [{ name: 'title', type: 'text', required: true }],
    },
    { name: 'limit', type: 'number', defaultValue: 30, min: 1, max: 100 },
    hiddenField,
  ],
}
