import GridArticles from '@/app/components/Home/GridArticles'
import { findBlogPosts } from '@/utilities/getBlogPosts'
import { blogToArticleView } from '@/app/lib/viewModels'

type AnalysisBlockProps = {
  heading: string
  subtitle?: string | null
  limit?: number | null
  viewAllText: string
  viewAllUrl?: string | null
}

export async function AnalysisBlockComponent({ block }: { block: AnalysisBlockProps }) {
  const res = await findBlogPosts({ limit: block.limit ?? 5 })
  const articles = res.docs.map(blogToArticleView)
  return (
    <GridArticles
      heading={block.heading}
      subtitle={block.subtitle ?? undefined}
      viewAllText={block.viewAllText}
      viewAllUrl={block.viewAllUrl ?? '/blog'}
      articles={articles}
    />
  )
}
