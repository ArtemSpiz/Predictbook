import type { Block } from 'payload'
import { defaultLexical } from '@/fields/defaultLexical'

export const FAQ: Block = {
  slug: 'faq',
  imageURL: '/blocks/faq.png',
  imageAltText: 'FAQ accordion',
  admin: { group: 'Social Proof' },
  fields: [
    { name: 'heading', type: 'text' },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'question', type: 'text', required: true },
        { name: 'answer', type: 'richText', editor: defaultLexical, required: true },
      ],
    },
  ],
}
