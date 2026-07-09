'use client'

import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import BlockTitle from '@/app/ui/BlockTitle'
import Search from '../../../../public/Search.png'
import Image from 'next/image'
import ArticleCard from '@/app/ui/ArticleCard'
import Arrow from '../../../../public/down.png'
import Link from 'next/link'
import type { ArticleView } from '@/app/lib/viewModels'

interface Props {
  articles: ArticleView[]
  categories: string[]
  title: string
  subtitle?: string
}

export default function BlogCol({ articles, categories, title, subtitle }: Props) {
  const searchParams = useSearchParams()

  const initialCategory = searchParams.get('category') || 'All'

  const [activeCategory, setActiveCategory] = useState(initialCategory)
  const [searchQuery, setSearchQuery] = useState('')

  const sortedCards = useMemo(
    () => [...articles].sort((a, b) => Number(!!b.featured) - Number(!!a.featured)),
    [articles],
  )

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
        {categories.map((cat) => {
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
            <Link key={card.slug} href={`/blog/${card.slug}`}>
              <ArticleCard card={card} />
            </Link>
          ))
        ) : (
          <div className="text-sm text-muted text-center py-6">Nothing found</div>
        )}
      </div>

      <button
        className={`bg-sand justify-center group w-max mx-auto border-none flex items-center gap-2 px-3 py-2.5 rounded-lg`}
      >
        <span>Load more</span>
        <Image src={Arrow} alt="Arrow" className="w-4 h-4 relative " />
      </button>
    </div>
  )
}
