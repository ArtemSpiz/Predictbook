import type { Block } from 'payload'
import { hiddenField } from '../_shared/fields'

export const SignalFeedBlock: Block = {
  slug: 'signal-feed',
  labels: { singular: 'Signal Feed', plural: 'Signal Feeds' },
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
      admin: { description: 'On-site title, e.g. "Whale Alert" or "Arbitrage Alert".' },
    },
    {
      name: 'kind',
      type: 'select',
      required: true,
      defaultValue: 'whale',
      admin: { description: 'Which signals to pull from the Signals collection.' },
      options: [
        { label: 'Whale alert', value: 'whale' },
        { label: 'Arbitrage', value: 'arbitrage' },
      ],
    },
    { name: 'delayLabel', type: 'text', defaultValue: '30-min delay' },
    { name: 'limit', type: 'number', defaultValue: 3, min: 1, max: 10 },
    { name: 'viewAllText', type: 'text', required: true, defaultValue: 'View all signals' },
    { name: 'viewAllUrl', type: 'text', defaultValue: '/signals' },
    hiddenField,
  ],
}
