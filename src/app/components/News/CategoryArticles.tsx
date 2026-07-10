'use client'

import { useState, useTransition } from 'react'
import { ArticleList } from '@/app/ui/ArticleList'
import { LoadMoreButton } from '@/app/ui/LoadMoreButton'
import { loadMoreNews } from '@/app/actions/news'
import type { ArticleView } from '@/app/lib/viewModels'

interface Props {
  initial: ArticleView[]
  categorySlug: string
  limit: number
  totalDocs: number
}

export function CategoryArticles({ initial, categorySlug, limit, totalDocs }: Props) {
  const [articles, setArticles] = useState(initial)
  const [page, setPage] = useState(1)
  const [isPending, startTransition] = useTransition()

  const hasMore = articles.length < totalDocs

  const handleLoadMore = () => {
    startTransition(async () => {
      const nextPage = page + 1
      const res = await loadMoreNews({ page: nextPage, limit, categorySlug })
      setArticles((prev) => [...prev, ...res.articles])
      setPage(nextPage)
    })
  }

  return (
    <ArticleList articles={articles}>
      {hasMore && <LoadMoreButton onClick={handleLoadMore} isPending={isPending} />}
    </ArticleList>
  )
}
