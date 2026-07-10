import type { CollectionConfig } from 'payload'
import { isAdminOrEditor } from '@/access/isAdminOrEditor'

export const Ticker: CollectionConfig = {
  slug: 'ticker',
  admin: {
    useAsTitle: 'market',
    defaultColumns: ['venue', 'market', 'price', 'order'],
    group: 'Content',
  },
  access: {
    read: () => true,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  defaultSort: 'order',
  fields: [
    {
      name: 'venue',
      type: 'select',
      required: true,
      options: [
        { label: 'Kalshi', value: 'Kalshi' },
        { label: 'Polymarket', value: 'Polymarket' },
      ],
    },
    { name: 'market', type: 'text', required: true },
    { name: 'price', type: 'text', required: true },
    { name: 'order', type: 'number', defaultValue: 0, admin: { step: 1 } },
  ],
}
