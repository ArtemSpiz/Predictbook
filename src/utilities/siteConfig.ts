import { defaultLocale } from '@/i18n/config'

/**
 * Site-wide identity used by metadata, Open Graph and structured data.
 *
 * Override per-project via env (`NEXT_PUBLIC_SITE_NAME`, `NEXT_PUBLIC_SITE_DESCRIPTION`)
 * or by editing the defaults below. For per-request/CMS-driven values, layer a
 * SiteSettings global on top where needed.
 */
export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || 'Payload Starter',
  description:
    process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
    'A blog built with Payload CMS and Next.js.',
  /** BCP-47 language tag for the default locale, e.g. `en`. */
  locale: defaultLocale,
  /** Open Graph locale form, e.g. `en_US`. */
  ogLocale: (process.env.NEXT_PUBLIC_OG_LOCALE || 'en_US') as string,
  /** Optional Twitter/X handle (with leading @) for `twitter:site`/`creator`. */
  twitterHandle: process.env.NEXT_PUBLIC_TWITTER_HANDLE || undefined,
  /** Path (under the public dir / served route) to the default OG image. */
  defaultOgImage: process.env.NEXT_PUBLIC_DEFAULT_OG_IMAGE || '/og-default.png',
} as const
