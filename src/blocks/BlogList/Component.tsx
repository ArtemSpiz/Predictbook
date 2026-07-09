import { Suspense } from 'react'
import BlogsCol from '@/app/components/Blog/BlogsCol'
import { findBlogPosts } from '@/utilities/getBlogPosts'
import { blogToArticleView } from '@/app/lib/viewModels'

type BlogListBlockProps = {
  heading: string
  subtitle?: string | null
  categories?: { title: string }[] | null
  limit?: number | null
}

export async function BlogListBlockComponent({ block }: { block: BlogListBlockProps }) {
  const res = await findBlogPosts({ limit: block.limit ?? 30 })
  const articles = res.docs.map(blogToArticleView)

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BlogsCol
        title={block.heading}
        subtitle={block.subtitle ?? undefined}
        categories={(block.categories ?? []).map((c) => c.title)}
        articles={articles}
      />
    </Suspense>
  )
}
