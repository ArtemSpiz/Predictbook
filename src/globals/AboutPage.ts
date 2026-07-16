import type { GlobalConfig } from 'payload'
import { isAdminOrEditor } from '@/access/isAdminOrEditor'
import { revalidateGlobalHooks } from '@/hooks/revalidateFrontCache'
import { wideMarkupLexical } from '@/fields/wideMarkupLexical'
import { LiveFeedBlock } from '@/blocks/LiveFeedBlock/config'
import { RealCardBlock } from '@/blocks/RealCard/config'
import { seoTab } from '@/fields/seoMeta'

export const AboutPage: GlobalConfig = {
  slug: 'about-page',
  label: 'About Page',
  admin: { group: 'Pages' },
  access: { read: () => true, update: isAdminOrEditor },
  hooks: revalidateGlobalHooks,
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            { name: 'title', type: 'text', defaultValue: 'About Predictbook' },
            { name: 'body', type: 'richText', editor: wideMarkupLexical },
            {
              name: 'cta',
              type: 'group',
              label: 'Newsletter CTA',
              fields: [
                { name: 'heading', type: 'text', defaultValue: 'Stay in the loop' },
                {
                  name: 'text',
                  type: 'textarea',
                  defaultValue:
                    'Never miss the latest market analysis, prediction insights, and emerging opportunities. Delivered straight to your inbox.',
                },
                { name: 'placeholder', type: 'text', defaultValue: 'Your email' },
                { name: 'buttonText', type: 'text', defaultValue: 'Subscribe' },
              ],
            },
          ],
        },
        {
          label: 'Right sidebar',
          description: 'Widgets in the right column.',
          fields: [
            {
              name: 'sidebarBlocks',
              type: 'blocks',
              labels: { singular: 'Sidebar block', plural: 'Sidebar blocks' },
              blocks: [LiveFeedBlock, RealCardBlock],
            },
          ],
        },
        seoTab,
      ],
    },
  ],
}
