import type { Block } from 'payload'
import { wideMarkupLexical } from '@/fields/wideMarkupLexical'

export const RichTextBlock: Block = {
  slug: 'rich-text-block',
  imageURL: '/blocks/rich-text-block.png',
  imageAltText: 'Rich text — full editor including media, tables, highlight',
  admin: { group: 'Content' },
  fields: [
    { name: 'content', type: 'richText', editor: wideMarkupLexical, required: true },
    {
      name: 'maxWidth',
      type: 'select',
      defaultValue: 'prose',
      options: [
        { label: 'Narrow (prose)', value: 'prose' },
        { label: 'Wide', value: 'wide' },
        { label: 'Full', value: 'full' },
      ],
    },
  ],
}
