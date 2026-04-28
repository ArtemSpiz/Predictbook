import type { Block } from 'payload'
import { wideMarkupLexical } from '@/fields/wideMarkupLexical'

export const TextColumns: Block = {
  slug: 'text-columns',
  imageURL: '/blocks/text-columns.png',
  imageAltText: 'Text in N columns',
  admin: { group: 'Content' },
  fields: [
    { name: 'heading', type: 'text' },
    {
      name: 'columns',
      type: 'select',
      defaultValue: '2',
      options: [
        { label: '2', value: '2' },
        { label: '3', value: '3' },
        { label: '4', value: '4' },
      ],
    },
    {
      name: 'items',
      type: 'array',
      minRows: 2,
      fields: [
        { name: 'heading', type: 'text' },
        { name: 'content', type: 'richText', editor: wideMarkupLexical },
      ],
    },
  ],
}
