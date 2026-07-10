import GridArticles from '@/app/components/Home/GridArticles'
import { findNewsPosts } from '@/utilities/getNewsPosts'
import { newsToArticleView } from '@/app/lib/viewModels'

type AnalysisBlockProps = {
  heading: string
  subtitle?: string | null
  limit?: number | null
  viewAllText: string
  viewAllUrl?: string | null
}

export async function AnalysisBlockComponent({ block }: { block: AnalysisBlockProps }) {
  const res = await findNewsPosts({ limit: block.limit ?? 5 })
  const articles = res.docs.map(newsToArticleView)
  return (
    <GridArticles
      heading={block.heading}
      subtitle={block.subtitle ?? undefined}
      viewAllText={block.viewAllText}
      viewAllUrl={block.viewAllUrl ?? '/news'}
      articles={articles}
    />
  )
}
