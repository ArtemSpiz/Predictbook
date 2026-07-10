import type { GlobalConfig } from 'payload'
import { isAdminOrEditor } from '@/access/isAdminOrEditor'
import { revalidateGlobalHooks } from '@/hooks/revalidateFrontCache'
import { NewsListBlock } from '@/blocks/NewsList/config'
import { SummaryBlock } from '@/blocks/Summary/config'

export const NewsPage: GlobalConfig = {
  slug: 'news-page',
  label: 'News Page',
  admin: { group: 'Pages' },
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
              blocks: [NewsListBlock],
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
              blocks: [SummaryBlock],
            },
          ],
        },
      ],
    },
  ],
}
