import type { Block } from 'payload'
import { hiddenField } from '../_shared/fields'

export const LiveFeedListBlock: Block = {
  slug: 'live-feed-list',
  labels: { singular: 'Live Feed List', plural: 'Live Feed Lists' },
  fields: [
    { name: 'heading', type: 'text', required: true, defaultValue: 'Live Feed' },
    { name: 'subtitle', type: 'textarea' },
    { name: 'limit', type: 'number', defaultValue: 20, min: 1, max: 50 },
    hiddenField,
  ],
}
