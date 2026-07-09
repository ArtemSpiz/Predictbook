import type { Block } from 'payload'
import { hiddenField } from '../_shared/fields'

export const ContactValueBlock: Block = {
  slug: 'contact-value',
  labels: { singular: 'Contact Value Card', plural: 'Contact Value Cards' },
  fields: [
    { name: 'title', type: 'text', defaultValue: 'Other ways to reach us' },
    {
      name: 'text',
      type: 'textarea',
      defaultValue: 'Your input helps us improve Predictbook and deliver better analysis.',
    },
    { name: 'buttonText', type: 'text', defaultValue: 'Suggest a topic' },
    hiddenField,
  ],
}
