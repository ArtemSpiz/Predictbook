import Link from 'next/link'
import type { ReactNode } from 'react'
import ArticleCard from '@/app/ui/ArticleCard'
import type { ArticleView } from '@/app/lib/viewModels'

/** Vertical list of article cards; the first card renders as featured, matching
 * the original page markup. `children` renders inside the list container (e.g. a
 * Load more button) to preserve the original spacing. */
export function ArticleList({
  articles,
  children,
}: {
  articles: ArticleView[]
  children?: ReactNode
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-2 xl:grid-cols-2">
        {articles.map((article, index) => (
          <Link
            key={article.slug}
            href={`/analysis/${article.slug}`}
            className={index === 0 ? 'xl:col-span-2' : ''}
          >
            <ArticleCard card={{ ...article, featured: index === 0 }} />
          </Link>
        ))}
      </div>
      {children}
    </div>
  )
}
