import type { CollectionConfig } from 'payload'
import { isAdminOrEditor } from '@/access/isAdminOrEditor'
import { revalidateCollectionHooks } from '@/hooks/revalidateFrontCache'

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
  hooks: revalidateCollectionHooks,
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
    { name: 'url', type: 'text' },
    // Not unique: manual rows have no externalId and Mongo's non-sparse unique
    // index would reject multiple nulls. Sync upserts look rows up by this.
    {
      name: 'externalId',
      type: 'text',
      index: true,
      admin: { readOnly: true, description: 'Set by ticker-sync; empty = manually managed row' },
    },
    { name: 'volume24h', type: 'number', admin: { readOnly: true } },
  ],
}
