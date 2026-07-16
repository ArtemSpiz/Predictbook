import { Block } from 'payload'
import { hiddenField } from '../_shared/fields'

export const SummaryBlock: Block = {
  slug: 'summary',
  imageURL: '/public/blocks/summary-block.png',
  labels: {
    singular: 'Summary Block',
    plural: 'Summary Blocks',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      admin: {
        description: 'Optional heading above the block, e.g. "Summary". Leave empty to hide.',
      },
    },
    {
      name: 'subtitle',
      type: 'textarea',
      admin: {
        description: 'Optional description text below the title.',
      },
    },
    {
      name: 'buttonUrl',
      type: 'text',
      defaultValue: '/signals',
      admin: {
        description: 'Where the "Read …" button links (defaults to the signals page).',
      },
    },
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
    hiddenField,
  ],
}
