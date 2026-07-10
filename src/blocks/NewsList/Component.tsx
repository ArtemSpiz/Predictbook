import { Suspense } from 'react'
import NewsCol from '@/app/components/News/NewsCol'
import { findNewsPosts } from '@/utilities/getNewsPosts'
import { newsToArticleView } from '@/app/lib/viewModels'

type NewsListBlockProps = {
  heading: string
  subtitle?: string | null
  categories?: { title: string }[] | null
  limit?: number | null
}

export async function NewsListBlockComponent({ block }: { block: NewsListBlockProps }) {
  const limit = block.limit ?? 30
  const res = await findNewsPosts({ limit })
  const articles = res.docs.map(newsToArticleView)

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewsCol
        title={block.heading}
        subtitle={block.subtitle ?? undefined}
        categories={(block.categories ?? []).map((c) => c.title)}
        articles={articles}
        limit={limit}
        totalDocs={res.totalDocs}
      />
    </Suspense>
  )
}
