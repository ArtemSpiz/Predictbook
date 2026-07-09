import type { GlobalConfig } from 'payload'
import { isAdminOrEditor } from '@/access/isAdminOrEditor'
import { revalidateGlobalHooks } from '@/hooks/revalidateFrontCache'

export const LiveFeedPage: GlobalConfig = {
  slug: 'live-feed-page',
  label: 'Live Feed Page',
  access: { read: () => true, update: isAdminOrEditor },
  hooks: revalidateGlobalHooks,
  fields: [
    { name: 'title', type: 'text', defaultValue: 'Live Feed' },
    {
      name: 'subtitle',
      type: 'textarea',
      defaultValue:
        'Real-time liveblog threads on trending prediction market topics — one carefully selected event per day.',
    },
  ],
}
