import type { Field, GroupField } from 'payload'

export const linkField = (overrides?: Partial<GroupField>): Field => ({
  type: 'group',
  name: 'link',
  ...overrides,
  fields: [
    {
      name: 'type',
      type: 'radio',
      defaultValue: 'reference',
      options: [
        { label: 'Internal', value: 'reference' },
        { label: 'External URL', value: 'custom' },
      ],
      admin: { layout: 'horizontal' },
    },
    {
      name: 'reference',
      type: 'relationship',
      relationTo: ['pages', 'blog', 'case-studies'],
      required: true,
      admin: { condition: (_d, sib) => sib?.type === 'reference' },
    },
    {
      name: 'url',
      type: 'text',
      required: true,
      admin: { condition: (_d, sib) => sib?.type === 'custom' },
    },
    { name: 'label', type: 'text', required: true },
    { name: 'newTab', type: 'checkbox', label: 'Open in new tab' },
  ],
})
