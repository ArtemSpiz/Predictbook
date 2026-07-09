import type { Metadata } from 'next'
import { localeAlternates } from '@/utilities/metadataAlternates'
import { getBlogPageContent } from '@/utilities/getPageContent'
import BlogMain from '@/app/components/Blog/BlogMain'

export async function generateMetadata(): Promise<Metadata> {
  const content = await getBlogPageContent()
  const title = content?.title ?? 'Analysis'
  return {
    title,
    description: content?.subtitle ?? undefined,
    ...localeAlternates('blog'),
    openGraph: { type: 'website', title, url: '/blog' },
  }
}

export default async function BlogList() {
  return (
    <main>
      <BlogMain />
    </main>
  )
}
