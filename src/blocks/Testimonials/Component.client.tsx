'use client'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import type { Media } from '@/payload-types'
import type { PageBlock } from '@/blocks/types'

type Block = Extract<PageBlock, { blockType: 'testimonials' }>

interface Item {
  quote: string
  author: string
  role?: string
  avatar?: Media | string | null
}

export function TestimonialsClient({ block }: { block: Block }) {
  const items = (block.items ?? []) as Item[]
  return (
    <section className="px-6 py-12 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        {block.heading && (
          <h2 className="text-3xl font-bold text-center mb-8">{block.heading}</h2>
        )}
        <Swiper modules={[Navigation, Pagination]} navigation pagination={{ clickable: true }} loop>
          {items.map((t, i) => {
            const avatar = typeof t.avatar === 'object' ? t.avatar : null
            return (
              <SwiperSlide key={i}>
                <blockquote className="text-center px-12 pb-8">
                  <p className="text-xl italic mb-6">&ldquo;{t.quote}&rdquo;</p>
                  {avatar?.url && (
                    <img
                      src={avatar.url}
                      alt={t.author}
                      className="w-16 h-16 rounded-full mx-auto mb-3"
                    />
                  )}
                  <cite className="not-italic font-semibold">{t.author}</cite>
                  {t.role && <div className="text-sm text-gray-600">{t.role}</div>}
                </blockquote>
              </SwiperSlide>
            )
          })}
        </Swiper>
      </div>
    </section>
  )
}
