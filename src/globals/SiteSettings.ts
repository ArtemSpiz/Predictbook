import type { GlobalConfig } from 'payload'
import { isAdminOrEditor } from '@/access/isAdminOrEditor'
import { revalidateGlobalHooks } from '@/hooks/revalidateFrontCache'
import { RealCardBlock } from '@/blocks/RealCard/config'
import { SponsoredCardBlock } from '@/blocks/SponsoredCard/config'
import { SummaryBlock } from '@/blocks/Summary/config'

/**
 * Site-wide SEO / analytics backbone. Sitemap and robots route handlers read
 * these flags; the analytics component reads the IDs. All fields are optional
 * with safe defaults so the site works before anything is configured.
 */
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  admin: { group: 'Settings' },
  access: { read: () => true, update: isAdminOrEditor },
  hooks: revalidateGlobalHooks,
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Branding',
          fields: [
            {
              name: 'siteName',
              type: 'text',
              admin: {
                description:
                  'Site name shown in the browser tab and the title suffix (e.g. "Page | Site Name"). Falls back to the built-in default when empty.',
              },
            },
            {
              name: 'favicon',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description:
                  'Site-wide favicon shown in browser tabs. Use a square .ico, .png, or .svg (32×32 or larger).',
              },
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            {
              name: 'defaultMetaDescription',
              type: 'textarea',
              admin: {
                description:
                  'Site-wide default meta description for search results and social shares. Used on every page that has no description of its own.',
              },
            },
            {
              name: 'defaultMetaImage',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description:
                  'Site-wide default Open Graph / social share image (recommended 1200×630). Used on every page that has no image of its own.',
              },
            },
            {
              name: 'sitemapIncludeNews',
              type: 'checkbox',
              defaultValue: true,
              admin: { description: 'Include published news posts in sitemap.xml.' },
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
            {
              name: 'googleSiteVerification',
              type: 'text',
              admin: {
                description:
                  'Google Search Console verification token. In GSC, add a URL-prefix property and choose the "HTML tag" method — paste only the content value here (not the whole meta tag).',
              },
            },
            {
              name: 'bingSiteVerification',
              type: 'text',
              admin: {
                description: 'Bing Webmaster Tools verification token (msvalidate.01 meta content).',
              },
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
          label: 'Social',
          description: 'Site-wide social links used in the header, footer, mobile menu, and article share row.',
          fields: [
            {
              name: 'social',
              type: 'array',
              labels: { singular: 'Social link', plural: 'Social links' },
              fields: [
                { name: 'icon', type: 'upload', relationTo: 'media', required: true },
                { name: 'url', type: 'text' },
              ],
            },
          ],
        },
        {
          label: 'Sidebar',
          description: 'Widgets shown in the right column of news article/category/author pages.',
          fields: [
            {
              name: 'promoBlocks',
              type: 'blocks',
              labels: { singular: 'Promo block', plural: 'Promo blocks' },
              admin: { description: 'Promo card shown on all news sub-pages.' },
              blocks: [SummaryBlock, RealCardBlock],
            },
            {
              name: 'sponsoredBlocks',
              type: 'blocks',
              labels: { singular: 'Sponsored block', plural: 'Sponsored blocks' },
              admin: { description: 'Sponsored logos card shown on news article pages only.' },
              blocks: [SponsoredCardBlock],
            },
          ],
        },
      ],
    },
  ],
}
