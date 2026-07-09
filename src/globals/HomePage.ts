import type { GlobalConfig } from 'payload'
import { isAdminOrEditor } from '@/access/isAdminOrEditor'
import { revalidateGlobalHooks } from '@/hooks/revalidateFrontCache'

export const HomePage: GlobalConfig = {
  slug: 'home-page',
  label: 'Home Page',
  access: { read: () => true, update: isAdminOrEditor },
  hooks: revalidateGlobalHooks,
  fields: [
    {
      name: 'summaries',
      type: 'array',
      label: 'Market pulse summaries',
      admin: { description: 'Daily / weekly summary tabs.' },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'infoTitle', type: 'text', required: true },
        {
          name: 'info',
          type: 'array',
          fields: [{ name: 'text', type: 'text', required: true }],
        },
      ],
    },
    {
      name: 'articleSections',
      type: 'array',
      label: 'Category article sections',
      admin: { description: 'Titled rows on the homepage sourced from a blog category.' },
      fields: [
        { name: 'label', type: 'text', required: true },
        {
          name: 'category',
          type: 'relationship',
          relationTo: 'categories',
          required: true,
        },
      ],
    },
  ],
}
