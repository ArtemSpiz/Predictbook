import type { GlobalConfig } from 'payload'
import { isAdminOrEditor } from '@/access/isAdminOrEditor'
import { revalidateGlobalHooks } from '@/hooks/revalidateFrontCache'

export const BlogPage: GlobalConfig = {
  slug: 'blog-page',
  label: 'Blog Page',
  access: { read: () => true, update: isAdminOrEditor },
  hooks: revalidateGlobalHooks,
  fields: [
    { name: 'title', type: 'text', defaultValue: 'Analysis' },
    {
      name: 'subtitle',
      type: 'textarea',
      defaultValue:
        'Short-form market analysis — 3 pieces per day, ~300 words each. Our writers take live prediction market signals and give context and directional reasoning.',
    },
    {
      name: 'categories',
      type: 'array',
      label: 'Filter categories',
      admin: { description: 'Category filter buttons shown above the list.' },
      fields: [{ name: 'title', type: 'text', required: true }],
    },
  ],
}
