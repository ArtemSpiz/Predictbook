import type { GlobalConfig } from 'payload'
import { isAdminOrEditor } from '@/access/isAdminOrEditor'
import { revalidateGlobalHooks } from '@/hooks/revalidateFrontCache'

export const Translations: GlobalConfig = {
  slug: 'translations',
  admin: { group: 'Settings' },
  access: { read: () => true, update: isAdminOrEditor },
  hooks: revalidateGlobalHooks,
  fields: [
    {
      name: 'navigation',
      type: 'group',
      fields: [
        { name: 'home', type: 'text', localized: true },
        { name: 'about', type: 'text', localized: true },
        { name: 'contact', type: 'text', localized: true },
        { name: 'news', type: 'text', localized: true },
      ],
    },
    {
      name: 'buttons',
      type: 'group',
      fields: [
        { name: 'readMore', type: 'text', localized: true },
        { name: 'submit', type: 'text', localized: true },
        { name: 'learnMore', type: 'text', localized: true },
      ],
    },
  ],
}
