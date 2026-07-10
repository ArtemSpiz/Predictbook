import type { GlobalConfig } from 'payload'
import { isAdminOrEditor } from '@/access/isAdminOrEditor'
import { revalidateGlobalHooks } from '@/hooks/revalidateFrontCache'
import { RealCardBlock } from '@/blocks/RealCard/config'
import { SponsoredCardBlock } from '@/blocks/SponsoredCard/config'

/**
 * Site-wide SEO / analytics backbone. Sitemap and robots route handlers read
 * these flags; the analytics component reads the IDs. All fields are optional
 * with safe defaults so the site works before anything is configured.
 */
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  access: { read: () => true, update: isAdminOrEditor },
  hooks: revalidateGlobalHooks,
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'SEO',
          fields: [
            {
              name: 'sitemapIncludeBlog',
              type: 'checkbox',
              defaultValue: true,
              admin: { description: 'Include published blog posts in sitemap.xml.' },
            },
            {
              name: 'sitemapIncludeCaseStudies',
              type: 'checkbox',
              defaultValue: true,
              admin: { description: 'Include published case studies in sitemap.xml.' },
            },
            {
              name: 'sitemapIncludeSignals',
              type: 'checkbox',
              defaultValue: true,
              admin: { description: 'Include published signals in sitemap.xml.' },
            },
            {
              name: 'sitemapIncludeLiveFeed',
              type: 'checkbox',
              defaultValue: true,
              admin: { description: 'Include published live feed threads in sitemap.xml.' },
            },
            {
              name: 'robotsDisallowAll',
              type: 'checkbox',
              defaultValue: false,
              admin: { description: 'Block all crawlers (robots.txt Disallow: /). Use for staging.' },
            },
          ],
        },
        {
          label: 'Analytics',
          fields: [
            {
              name: 'gtmId',
              type: 'text',
              admin: { description: 'Google Tag Manager container ID (GTM-XXXXXXX).' },
            },
            {
              name: 'ga4Id',
              type: 'text',
              admin: { description: 'GA4 Measurement ID (G-XXXXXXXXXX).' },
            },
          ],
        },
        {
          label: 'Sidebar',
          description: 'Widgets shown in the right column of blog article/category/author pages.',
          fields: [
            {
              name: 'promoBlocks',
              type: 'blocks',
              labels: { singular: 'Promo block', plural: 'Promo blocks' },
              admin: { description: 'Promo card shown on all blog sub-pages.' },
              blocks: [RealCardBlock],
            },
            {
              name: 'sponsoredBlocks',
              type: 'blocks',
              labels: { singular: 'Sponsored block', plural: 'Sponsored blocks' },
              admin: { description: 'Sponsored logos card shown on blog article pages only.' },
              blocks: [SponsoredCardBlock],
            },
          ],
        },
      ],
    },
  ],
}
