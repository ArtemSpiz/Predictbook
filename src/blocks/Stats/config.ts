import type { Block } from 'payload'

export const Stats: Block = {
  slug: 'stats',
  imageURL: '/blocks/stats.png',
  imageAltText: 'Animated stats / metrics',
  admin: { group: 'Data & Stats' },
  fields: [
    { name: 'heading', type: 'text' },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      fields: [
        {
          name: 'value',
          type: 'text',
          required: true,
          admin: { description: 'Numeric or formatted ("$2.4M", "+47%", "12,500")' },
        },
        { name: 'label', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
        { name: 'animateCounter', type: 'checkbox', defaultValue: true },
      ],
    },
  ],
}
