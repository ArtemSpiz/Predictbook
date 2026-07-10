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
