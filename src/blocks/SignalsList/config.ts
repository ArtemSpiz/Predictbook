import type { Block } from 'payload'
import { hiddenField } from '../_shared/fields'

export const SignalsListBlock: Block = {
  slug: 'signals-list',
  labels: { singular: 'Signals List', plural: 'Signals Lists' },
  fields: [
    { name: 'heading', type: 'text', required: true, defaultValue: 'Signals' },
    { name: 'subtitle', type: 'textarea' },
    { name: 'delayText', type: 'text', defaultValue: '30-min delay' },
    { name: 'limit', type: 'number', defaultValue: 20, min: 1, max: 50 },
    hiddenField,
  ],
}
