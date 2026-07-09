import type { Metadata } from 'next'
import { localeAlternates } from '@/utilities/metadataAlternates'
import { getBlogPageContent } from '@/utilities/getPageContent'
import BlogMain from '@/app/components/Blog/BlogMain'

export async function generateMetadata(): Promise<Metadata> {
  const content = await getBlogPageContent()
  const block = content?.mainBlocks?.find((b) => b.blockType === 'blog-list')
  const title = block?.heading ?? 'Analysis'
  return {
    title,
    description: block?.subtitle ?? undefined,
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
