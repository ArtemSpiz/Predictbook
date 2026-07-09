import type { Block } from 'payload'
import { hiddenField } from '../_shared/fields'

export const ContactMethodsBlock: Block = {
  slug: 'contact-methods',
  labels: { singular: 'Contact Methods', plural: 'Contact Methods' },
  fields: [
    { name: 'heading', type: 'text', defaultValue: 'Other ways to reach us' },
    {
      name: 'methods',
      type: 'array',
      label: 'Contact methods',
      fields: [
        { name: 'icon', type: 'upload', relationTo: 'media' },
        { name: 'title', type: 'text', required: true },
        { name: 'linkText', type: 'text', required: true },
        { name: 'link', type: 'text' },
      ],
    },
    {
      name: 'socials',
      type: 'array',
      label: 'Social links',
      fields: [
        { name: 'icon', type: 'upload', relationTo: 'media' },
        { name: 'link', type: 'text', required: true },
      ],
    },
    hiddenField,
  ],
}
