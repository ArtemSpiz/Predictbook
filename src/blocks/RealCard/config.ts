import { Block } from 'payload'

export const RealCardBlock: Block = {
  slug: 'real-card',
  imageURL: '/public/blocks/real-card-block.png',
  labels: {
    singular: 'Real Card Block',
    plural: 'Real Card Blocks',
  },
  fields: [
    {
      name: 'badgeIcon',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Badge Icon',
      admin: {
        description: 'Icon in the badge (e.g., Lightning)',
      },
    },
    {
      name: 'badgeText',
      type: 'text',
      required: true,
      defaultValue: 'Real-time alerts',
      label: 'Badge Text',
    },
    {
      name: 'showLiveDot',
      type: 'checkbox',
      defaultValue: true,
      label: 'Show live indicator',
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Want signals in real time?',
      label: 'Title',
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      defaultValue: 'Get instant alerts with advanced filtering tailored to your interests.',
      label: 'Description',
    },
    {
      name: 'buttonText',
      type: 'text',
      required: true,
      defaultValue: 'Join Real-time Alerts',
      label: 'Button Text',
    },
    {
      name: 'buttonUrl',
      type: 'text',
      label: 'Button URL',
      admin: {
        description: 'Where the button leads (optional; if left blank, there is no link)',
      },
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Background Graph Image',
      admin: {
        description: 'Decorative image (e.g., Graph)',
      },
    },
  ],
}
