'use server'

import { findNewsPosts } from '@/utilities/getNewsPosts'
import { newsToArticleView } from '@/app/lib/viewModels'

export async function loadMoreNews({
  page,
  limit,
  categorySlug,
}: {
  page: number
  limit: number
  categorySlug?: string
}) {
  const res = await findNewsPosts({ page, limit, categorySlug })

  return {
    articles: res.docs.map(newsToArticleView),
    totalPages: res.totalPages,
    totalDocs: res.totalDocs,
  }
}

export async function searchNews({ query, limit = 30 }: { query: string; limit?: number }) {
  const trimmed = query.trim()
  if (!trimmed) return { articles: [] }
  const res = await findNewsPosts({ search: trimmed, limit })
  return { articles: res.docs.map(newsToArticleView) }
}
