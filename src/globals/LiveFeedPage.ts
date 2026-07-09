import type { GlobalConfig } from 'payload'
import { isAdminOrEditor } from '@/access/isAdminOrEditor'
import { revalidateGlobalHooks } from '@/hooks/revalidateFrontCache'
import { LiveFeedListBlock } from '@/blocks/LiveFeedList/config'
import { RealCardBlock } from '@/blocks/RealCard/config'

export const LiveFeedPage: GlobalConfig = {
  slug: 'live-feed-page',
  label: 'Live Feed Page',
  access: { read: () => true, update: isAdminOrEditor },
  hooks: revalidateGlobalHooks,
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Main content',
          fields: [
            {
              name: 'mainBlocks',
              type: 'blocks',
              labels: { singular: 'Main block', plural: 'Main blocks' },
              blocks: [LiveFeedListBlock],
            },
          ],
        },
        {
          label: 'Right sidebar',
          fields: [
            {
              name: 'sidebarBlocks',
              type: 'blocks',
              labels: { singular: 'Sidebar block', plural: 'Sidebar blocks' },
              blocks: [RealCardBlock],
            },
          ],
        },
      ],
    },
  ],
}
