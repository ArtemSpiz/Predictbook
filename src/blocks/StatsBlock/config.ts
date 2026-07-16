import type { Block } from 'payload'

export const NumbersBlock: Block = {
  slug: 'numbersBlock',
  imageURL: '/blocks/stats-block.png',
  labels: {
    singular: 'Stats Block',
    plural: 'Stats Blocks',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      defaultValue: 'By the numbers',
      required: true,
    },
    {
      name: 'stats',
      type: 'array',
      label: 'Stat Items',
      minRows: 1,
      maxRows: 6,
      fields: [
        {
          name: 'value',
          type: 'text',
          required: true,
          admin: {
            description: 'e.g. "24/7", "100%", "5+", "Real-time"',
          },
        },
        {
          name: 'label',
          type: 'text',
          required: true,
          admin: {
            description: 'e.g. "Market Monitoring"',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          required: false,
          admin: {
            description: 'e.g. "AI-powered tracking of prediction markets around the clock."',
          },
        },
      ],
    },
  ],
}

export default NumbersBlock
