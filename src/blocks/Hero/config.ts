import type { Block } from 'payload'
import { defaultLexical } from '@/fields/defaultLexical'
import { linkField } from '@/fields/link'

export const Hero: Block = {
  slug: 'hero',
  imageURL: '/blocks/hero.png',
  imageAltText: 'Hero block — heading + subheading + CTA + optional bg media',
  admin: { group: 'Hero & CTA' },
  fields: [
    { name: 'heading', type: 'text', required: true },
    { name: 'subheading', type: 'richText', editor: defaultLexical },
    {
      name: 'ctas',
      type: 'array',
      maxRows: 2,
      fields: [linkField()],
    },
    {
      name: 'background',
      type: 'group',
      fields: [
        {
          name: 'type',
          type: 'select',
          defaultValue: 'none',
          options: [
            { label: 'None', value: 'none' },
            { label: 'Image', value: 'image' },
            { label: 'Video', value: 'video' },
          ],
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          admin: { condition: (_d, sib) => sib?.type === 'image' },
        },
        {
          name: 'video',
          type: 'upload',
          relationTo: 'media',
          admin: { condition: (_d, sib) => sib?.type === 'video' },
        },
      ],
    },
  ],
}
