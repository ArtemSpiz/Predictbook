import { Block } from 'payload'

export const SummaryBlock: Block = {
  slug: 'summary',
  imageURL: '/public/blocks/summary-block.png',
  labels: {
    singular: 'Summary Block',
    plural: 'Summary Blocks',
  },
  fields: [
    {
      name: 'tabs',
      type: 'array',
      label: 'Summary Tabs',
      minRows: 1,
      admin: {
        description: 'If there is only one, the tabs are not displayed on the site.',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'infoTitle',
          type: 'text',
          required: true,
        },
        {
          name: 'day',
          type: 'text',
          defaultValue: 'Today',
        },
        {
          name: 'time',
          type: 'text',
          defaultValue: '20:00',
        },
        {
          name: 'info',
          type: 'array',
          label: 'Bullet Points',
          minRows: 1,
          fields: [
            {
              name: 'text',
              type: 'text',
              required: true,
            },
          ],
        },
      ],
    },
  ],
}
