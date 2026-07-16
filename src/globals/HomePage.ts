import type { GlobalConfig } from 'payload'
import { isAdminOrEditor } from '@/access/isAdminOrEditor'
import { revalidateGlobalHooks } from '@/hooks/revalidateFrontCache'
import { SignalFeedBlock } from '@/blocks/SignalFeed/config'
import { SummaryBlock } from '@/blocks/Summary/config'
import { RealCardBlock } from '@/blocks/RealCard/config'
import { AnalysisBlock } from '@/blocks/Analysis/config'
import { LiveFeedBlock } from '@/blocks/LiveFeedBlock/config'
import { CategorySectionBlock } from '@/blocks/CategorySection/config'
import { seoTab } from '@/fields/seoMeta'

export const HomePage: GlobalConfig = {
  slug: 'home-page',
  label: 'Home Page',
  admin: { group: 'Pages' },
  access: { read: () => true, update: isAdminOrEditor },
  hooks: revalidateGlobalHooks,
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Left sidebar',
          description: 'Blocks shown in the left column of the home page.',
          fields: [
            {
              name: 'signalsMobileHeader',
              type: 'group',
              label: 'Signals header (mobile only)',
              fields: [
                { name: 'title', type: 'text', required: true, defaultValue: 'Signals' },
                {
                  name: 'subtitle',
                  type: 'text',
                  defaultValue: 'Track emerging trends before they become headlines',
                },
              ],
            },
            {
              name: 'sidebarBlocks',
              type: 'blocks',
              labels: { singular: 'Sidebar block', plural: 'Sidebar blocks' },
              admin: { description: 'Whale Alert, Arbitrage Alert, Summaries, Promo card.' },
              blocks: [SignalFeedBlock, SummaryBlock, RealCardBlock],
            },
          ],
        },
        {
          label: 'Main content',
          description: 'Blocks shown in the main (right) column of the home page.',
          fields: [
            {
              name: 'categorySwitcherHeader',
              type: 'group',
              label: 'Category switcher header (mobile only)',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                  defaultValue: 'Explore by Category',
                },
                {
                  name: 'subtitle',
                  type: 'text',
                  defaultValue:
                    'The latest articles from our most-followed prediction market topics.',
                },
              ],
            },
            {
              name: 'mainBlocks',
              type: 'blocks',
              labels: { singular: 'Main block', plural: 'Main blocks' },
              admin: { description: 'Analysis, Live Feed, Category sections.' },
              blocks: [AnalysisBlock, LiveFeedBlock, CategorySectionBlock],
            },
          ],
        },
        seoTab,
      ],
    },
  ],
}
