import type { CollectionConfig } from 'payload'
import { isAdminOrEditor } from '@/access/isAdminOrEditor'
import { slugField } from '@/fields/slug'
import { revalidateCollectionHooks } from '@/hooks/revalidateFrontCache'

export const Authors: CollectionConfig = {
  slug: 'authors',
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'role', 'slug'], group: 'Content' },
  hooks: revalidateCollectionHooks,
  access: {
    read: () => true,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'role', type: 'text', label: 'Role / job title' },
    { name: 'photo', type: 'upload', relationTo: 'media' },
    { name: 'bio', type: 'textarea' },
    {
      name: 'social',
      type: 'array',
      labels: { singular: 'Social link', plural: 'Social links' },
      fields: [
        { name: 'icon', type: 'upload', relationTo: 'media', required: true },
        { name: 'url', type: 'text' },
      ],
    },
    slugField('name'),
  ],
}
