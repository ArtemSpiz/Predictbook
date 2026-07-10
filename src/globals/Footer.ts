import type { GlobalConfig } from 'payload'
import { isAdminOrEditor } from '@/access/isAdminOrEditor'
import { linkField } from '@/fields/link'
import { revalidateGlobalHooks } from '@/hooks/revalidateFrontCache'

export const Footer: GlobalConfig = {
  slug: 'footer',
  admin: { group: 'Settings' },
  access: { read: () => true, update: isAdminOrEditor },
  hooks: revalidateGlobalHooks,
  fields: [
    { name: 'brandName', type: 'text' },
    { name: 'tagline', type: 'text' },
    {
      name: 'social',
      type: 'array',
      fields: [
        { name: 'icon', type: 'upload', relationTo: 'media', required: true },
        { name: 'url', type: 'text' },
      ],
    },
    {
      name: 'columns',
      type: 'array',
      maxRows: 4,
      fields: [
        { name: 'title', type: 'text' },
        { name: 'items', type: 'array', fields: [linkField()] },
      ],
    },
    { name: 'disclaimer', type: 'textarea' },
    { name: 'copyright', type: 'text' },
  ],
}
