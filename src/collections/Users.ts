import type { CollectionConfig } from 'payload'
import { isAdmin } from '@/access/isAdmin'

const isAdminUser = ({ req }: { req: { user?: unknown } }): boolean =>
  (req.user as { role?: string })?.role === 'admin'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'role'],
  },
  access: {
    create: isAdmin,
    read: isAdmin,
    update: isAdmin,
    delete: isAdmin,
    admin: isAdminUser,
  },
  fields: [
    { name: 'name', type: 'text' },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
      access: { update: ({ req }) => (req.user as { role?: string })?.role === 'admin' },
    },
  ],
}
