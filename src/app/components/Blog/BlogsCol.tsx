'use client'

import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import BlockTitle from '@/app/ui/BlockTitle'
import Search from '../../../../public/Search.png'
import Image from 'next/image'
import ArticleCard from '@/app/ui/ArticleCard'
import gridImg from '../../../../public/gridImg.png'
import Arrow from '../../../../public/down.png'
import Link from 'next/link'
import { ArticlesContent } from '@/app/Mock/BlogMockData'

const Categories = [
  { title: 'All' },
  { title: 'Politics' },
  { title: 'Economics' },
  { title: 'Crypto' },
  { title: 'Technology' },
  { title: 'Sports' },
  { title: 'Science' },
]

export default function BlogCol() {
  const searchParams = useSearchParams()

  const initialCategory = searchParams.get('category') || 'All'

  const [activeCategory, setActiveCategory] = useState(initialCategory)
  const [searchQuery, setSearchQuery] = useState('')

  const sortedCards = useMemo(
    () => [...ArticlesContent].sort((a, b) => Number(!!b.image) - Number(!!a.image)),
    [],
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
        <BlockTitle
          title="Analysis"
          subtitle="Short-form market analysis — 3 pieces per day, ~300 words each. Our writers take live prediction market signals and give context and directional reasoning."
        />

        <div className="relative w-full p-3 pl-7 overflow-hidden bg-white rounded-lg">
          <div className="w-3 h-3 absolute top-1/2 -translate-y-1/2 left-3">
            <Image src={Search} alt="" />
          </div>
          <input
            className="relative h-full border-none outline-none w-full text-sm placeholder:text-[#BAB2AD]"
            placeholder="Search analysis..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {Categories.map((item, i) => {
          const isActive = activeCategory === item.title
          return (
            <button
              key={i}
              type="button"
              onClick={() => setActiveCategory(item.title)}
              className={`py-2.5 px-4 rounded-lg text-sm transition-colors
                ${isActive ? 'text-[#221E1D] bg-[#E8DFD8]' : 'text-[#5D554F] bg-white'}`}
            >
              {item.title}
            </button>
          )
        })}
      </div>

      <div className="flex flex-col gap-2">
        {filteredCards.length > 0 ? (
          filteredCards.map((card, i) => (
            <Link key={card.slug} href={`/blog/${card.slug}`}>
              <ArticleCard card={card} />
            </Link>
          ))
        ) : (
          <div className="text-sm text-[#5D554F] text-center py-6">Nothing found</div>
        )}
      </div>

      <button
        className={`bg-[#E8DFD8] justify-center group w-max mx-auto border-none flex items-center gap-2 px-3 py-2.5 rounded-lg`}
      >
        <span>Load more</span>
        <Image src={Arrow} alt="Arrow" className="w-4 h-4 relative " />
      </button>
    </div>
  )
}
