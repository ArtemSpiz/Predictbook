import type { GlobalConfig } from 'payload'
import { isAdminOrEditor } from '@/access/isAdminOrEditor'
import { revalidateGlobalHooks } from '@/hooks/revalidateFrontCache'
import { BlogListBlock } from '@/blocks/BlogList/config'
import { SummaryBlock } from '@/blocks/Summary/config'

export const BlogPage: GlobalConfig = {
  slug: 'blog-page',
  label: 'Blog Page',
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
              blocks: [BlogListBlock],
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
