import type { Block } from 'payload'
import { hiddenField } from '../_shared/fields'
import { ACCENT_VALUES } from '../_shared/accent'

export const CategorySectionBlock: Block = {
  slug: 'category-section',
  labels: { singular: 'Category Section', plural: 'Category Sections' },
  fields: [
    { name: 'label', type: 'text', required: true, admin: { description: 'Row heading, e.g. "Politics".' } },
    { name: 'category', type: 'relationship', relationTo: 'categories', required: true },
    {
      name: 'accent',
      type: 'select',
      required: true,
      defaultValue: 'politics',
      admin: { description: 'Badge color theme for this row.' },
      options: ACCENT_VALUES.map((v) => ({ label: v[0].toUpperCase() + v.slice(1), value: v })),
    },
    { name: 'limit', type: 'number', defaultValue: 3, min: 1, max: 9 },
    hiddenField,
  ],
}
