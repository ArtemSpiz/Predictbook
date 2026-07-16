import type { Metadata } from 'next'
import { localeAlternates } from '@/utilities/metadataAlternates'
import { getHomePageContent } from '@/utilities/getPageContent'
import { resolvePageMeta } from '@/fields/seoMeta'
import { siteConfig } from '@/utilities/siteConfig'
import Main from '../components/Home/Main'

export async function generateMetadata(): Promise<Metadata> {
  const content = await getHomePageContent()
  const meta = resolvePageMeta(content?.meta, {
    title: siteConfig.name,
    description: siteConfig.description,
  })
  return {
    ...meta,
    title: { absolute: content?.meta?.title || siteConfig.name },
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
