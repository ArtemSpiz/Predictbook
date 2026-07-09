import type { Block } from 'payload'
import { hiddenField } from '../_shared/fields'

export const AnalysisBlock: Block = {
  slug: 'analysis',
  labels: { singular: 'Analysis', plural: 'Analysis Blocks' },
  fields: [
    { name: 'heading', type: 'text', required: true, defaultValue: 'Analysis' },
    {
      name: 'subtitle',
      type: 'text',
      defaultValue: 'Expert perspectives behind market movements.',
    },
    { name: 'limit', type: 'number', defaultValue: 5, min: 1, max: 12 },
    { name: 'viewAllText', type: 'text', required: true, defaultValue: 'All articles' },
    { name: 'viewAllUrl', type: 'text', defaultValue: '/blog' },
    hiddenField,
  ],
}
