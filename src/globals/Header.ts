import type { GlobalConfig } from 'payload'
import { isAdminOrEditor } from '@/access/isAdminOrEditor'
import { linkField } from '@/fields/link'

export const Header: GlobalConfig = {
  slug: 'header',
  access: { read: () => true, update: isAdminOrEditor },
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
