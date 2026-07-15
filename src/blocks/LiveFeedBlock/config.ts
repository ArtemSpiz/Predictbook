import type { Block } from 'payload'
import { hiddenField } from '../_shared/fields'

export const LiveFeedBlock: Block = {
  slug: 'live-feed-block',
  labels: { singular: 'Live Feed', plural: 'Live Feed Blocks' },
  fields: [
    { name: 'heading', type: 'text', required: true, defaultValue: 'Live Feed' },
    { name: 'limit', type: 'number', defaultValue: 1, min: 1, max: 10 },
    { name: 'viewAllText', type: 'text', required: true, defaultValue: 'All threads' },
    { name: 'viewAllUrl', type: 'text', defaultValue: '/live' },
    hiddenField,
  ],
}
