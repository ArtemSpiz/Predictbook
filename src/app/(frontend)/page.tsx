import type { Metadata } from 'next'
import { localeAlternates } from '@/utilities/metadataAlternates'
import { getHomePageContent } from '@/utilities/getPageContent'
import { getSiteSettings } from '@/utilities/getSiteSettings'
import { resolvePageMeta } from '@/fields/seoMeta'
import { siteConfig } from '@/utilities/siteConfig'
import Main from '../components/Home/Main'

export async function generateMetadata(): Promise<Metadata> {
  const [content, { siteName }] = await Promise.all([getHomePageContent(), getSiteSettings()])
  const name = siteName || siteConfig.name
  const meta = resolvePageMeta(content?.meta, {
    title: name,
    description: siteConfig.description,
  })
  return {
    ...meta,
    title: { absolute: content?.meta?.title || name },
    ...localeAlternates(''),
  }
}

export default async function HomePage() {
  return (
    <main>
      <Main />
    </main>
  )
}
