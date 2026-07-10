import type { Block } from 'payload'
import { hiddenField } from '../_shared/fields'

export const SponsoredCardBlock: Block = {
  slug: 'sponsored-card',
  labels: { singular: 'Sponsored Card', plural: 'Sponsored Cards' },
  fields: [
    { name: 'heading', type: 'text', required: true, defaultValue: 'Sponsored by' },
    { name: 'infoIcon', type: 'upload', relationTo: 'media' },
    {
      name: 'sponsors',
      type: 'array',
      label: 'Sponsor logos',
      fields: [{ name: 'logo', type: 'upload', relationTo: 'media', required: true }],
    },
    {
      name: 'footerText',
      type: 'textarea',
      defaultValue: 'Trusted by the leading companies shaping prediction markets.',
    },
    hiddenField,
  ],
}
