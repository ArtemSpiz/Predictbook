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
    {
      name: 'items',
      type: 'array',
      maxRows: 10,
      fields: [linkField()],
    },
  ],
}
