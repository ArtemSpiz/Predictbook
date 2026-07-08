import type { Metadata } from 'next'
import Link from 'next/link'
import { findBlogPosts } from '@/utilities/getBlogPosts'
import { localeAlternates } from '@/utilities/metadataAlternates'
import BlogMain from '@/app/components/Blog/BlogMain'

export default async function BlogList() {
  const { docs } = await findBlogPosts({ limit: 20 })
  return (
    <main>
      <BlogMain />
    </main>
  )
}

export const metadata: Metadata = {
  title: 'Blog',
  ...localeAlternates('/blog'),
  openGraph: { type: 'website', title: 'Blog', url: '/blog' },
}
