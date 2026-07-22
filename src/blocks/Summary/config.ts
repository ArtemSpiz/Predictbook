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
        description:
          'Default link for the "Read …" button, used by any tab without its own URL (defaults to the signals page).',
      },
    },
    {
      name: 'buttonText',
      type: 'text',
      admin: {
        description:
          'Default label for the button, used by any tab without its own text. Leave empty to fall back to "Read <tab title>".',
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
          name: 'buttonUrl',
          type: 'text',
          admin: {
            description:
              'Where this tab\'s "Read …" button links. Leave empty to use the block-level default below.',
          },
        },
        {
          name: 'buttonText',
          type: 'text',
          admin: {
            description:
              'This tab\'s button label. Leave empty to use the block-level default, then "Read <tab title>".',
          },
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
