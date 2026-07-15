import type { CollectionConfig } from 'payload'
import { isAdminOrEditor } from '@/access/isAdminOrEditor'
import { slugField } from '@/fields/slug'
import { revalidateCollectionHooks } from '@/hooks/revalidateFrontCache'

export const Tags: CollectionConfig = {
  slug: 'tags',
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'slug'], group: 'Content' },
  hooks: revalidateCollectionHooks,
  access: {
    read: () => true,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField('title'),
  ],
}
