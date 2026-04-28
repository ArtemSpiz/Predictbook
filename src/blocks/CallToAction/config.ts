import type { Block } from 'payload'
import { defaultLexical } from '@/fields/defaultLexical'
import { linkField } from '@/fields/link'

export const CallToAction: Block = {
  slug: 'call-to-action',
  imageURL: '/blocks/call-to-action.png',
  imageAltText: 'CTA — heading + description + buttons',
  admin: { group: 'Hero & CTA' },
  fields: [
    { name: 'heading', type: 'text', required: true },
    { name: 'description', type: 'richText', editor: defaultLexical },
    {
      name: 'buttons',
      type: 'array',
      maxRows: 2,
      fields: [linkField()],
    },
  ],
}
