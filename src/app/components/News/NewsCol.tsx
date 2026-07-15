'use client'

import { useState, useMemo, useEffect, useTransition } from 'react'
import { useSearchParams } from 'next/navigation'
import BlockTitle from '@/app/ui/BlockTitle'
import Search from '../../../../public/Search.png'
import Image from 'next/image'
import ArticleCard from '@/app/ui/ArticleCard'
import { LoadMoreButton } from '@/app/ui/LoadMoreButton'
import Link from 'next/link'
import { sortByFeatured, type ArticleView } from '@/app/lib/viewModels'
import { loadMoreNews } from '@/app/actions/news'

interface Props {
  articles: ArticleView[]
  categories: string[]
  title: string
  subtitle?: string
  limit: number
  totalDocs: number
}

export default function NewsCol({
  articles,
  categories,
  title,
  subtitle,
  limit,
  totalDocs,
}: Props) {
  const searchParams = useSearchParams()

  const fullCategories = useMemo(() => ['All', ...categories], [categories])
  const initialCategory = searchParams.get('category') || 'All'

  const [activeCategory, setActiveCategory] = useState(initialCategory)
  const [searchQuery, setSearchQuery] = useState('')

  const [allArticles, setAllArticles] = useState(articles)
  const [page, setPage] = useState(1)
  const [isPending, startTransition] = useTransition()

  const hasMore = allArticles.length < totalDocs

  const sortedCards = useMemo(() => sortByFeatured(allArticles), [allArticles])

  const filteredCards = useMemo(() => {
    return sortedCards.filter((card) => {
      const matchesCategory =
        activeCategory === 'All' ||
        card.categories?.some((cat) => cat.toLowerCase() === activeCategory.toLowerCase())

      const matchesSearch = card.title.toLowerCase().includes(searchQuery.trim().toLowerCase())

      return matchesCategory && matchesSearch
    })
  }, [sortedCards, activeCategory, searchQuery])

  useEffect(() => {
    setActiveCategory(searchParams.get('category') || 'All')
  }, [searchParams])

  const handleLoadMore = () => {
    startTransition(async () => {
      const nextPage = page + 1
      const res = await loadMoreNews({ page: nextPage, limit })
      setAllArticles((prev) => [...prev, ...res.articles])
      setPage(nextPage)
    })
  }

  return (
    <div className="flex flex-col gap-6 pb-4">
      <div className="flex flex-col gap-3">
        <BlockTitle title={title} subtitle={subtitle} />

        <div className="relative w-full p-3 pl-7 overflow-hidden bg-white rounded-lg">
          <div className="w-3 h-3 absolute top-1/2 -translate-y-1/2 left-3">
            <Image src={Search} alt="" />
          </div>
          <input
            className="relative h-full border-none outline-none w-full text-sm placeholder:text-placeholder"
            placeholder="Search analysis..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {fullCategories.map((cat) => {
          const isActive = activeCategory === cat
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`py-2.5 px-4 rounded-lg text-sm transition-colors
                ${isActive ? 'text-ink bg-sand' : 'text-muted bg-white'}`}
            >
              {cat}
            </button>
          )
        })}
      </div>

      <div className="flex flex-col gap-2">
        {filteredCards.length > 0 ? (
          filteredCards.map((card) => (
            <Link key={card.slug} href={`/analysis/${card.slug}`}>
              <ArticleCard card={card} />
            </Link>
          ))
        ) : (
          <div className="text-sm text-muted text-center py-6">Nothing found</div>
        )}
      </div>

      {hasMore && <LoadMoreButton onClick={handleLoadMore} isPending={isPending} />}
    </div>
  )
}
