import type { GlobalConfig } from 'payload'
import { isAdminOrEditor } from '@/access/isAdminOrEditor'
import { revalidateGlobalHooks } from '@/hooks/revalidateFrontCache'
import { SignalsListBlock } from '@/blocks/SignalsList/config'
import { RealCardBlock } from '@/blocks/RealCard/config'

export const SignalsPage: GlobalConfig = {
  slug: 'signals-page',
  label: 'Signals Page',
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
              blocks: [SignalsListBlock],
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
