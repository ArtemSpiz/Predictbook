import type { GlobalConfig } from 'payload'
import { isAdminOrEditor } from '@/access/isAdminOrEditor'
import { linkField } from '@/fields/link'
import { revalidateGlobalHooks } from '@/hooks/revalidateFrontCache'

export const Header: GlobalConfig = {
  slug: 'header',
  admin: { group: 'Settings' },
  access: { read: () => true, update: isAdminOrEditor },
  hooks: revalidateGlobalHooks,
  fields: [
    { name: 'logo', type: 'upload', relationTo: 'media' },
    { name: 'brandName', type: 'text' },
    {
      name: 'nav',
      type: 'array',
      maxRows: 10,
      fields: [linkField(), { name: 'children', type: 'array', fields: [linkField()] }],
    },
    {
      name: 'cta',
      type: 'group',
      fields: [
        { name: 'label', type: 'text' },
        { name: 'href', type: 'text' },
      ],
    },
  ],
}
