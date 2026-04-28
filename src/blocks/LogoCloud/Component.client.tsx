'use client'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'
import type { PageBlock, Media } from '@/payload-types'

type Block = Extract<PageBlock, { blockType: 'logo-cloud' }>

interface Logo {
  image: Media | string
  name?: string
}

export function LogoCloudCarousel({ block }: { block: Block }) {
  const logos = (block.logos ?? []) as Logo[]
  return (
    <section className="px-6 py-12">
      {block.heading && (
        <h2 className="text-2xl font-semibold text-center mb-8">{block.heading}</h2>
      )}
      <div className="max-w-6xl mx-auto">
        <Swiper
          modules={[Autoplay]}
          slidesPerView={5}
          spaceBetween={32}
          loop
          autoplay={{ delay: 0, disableOnInteraction: false }}
          speed={6000}
        >
          {logos.map((logo, i) => {
            const img = typeof logo.image === 'object' ? logo.image : null
            return img?.url ? (
              <SwiperSlide key={i}>
                <img
                  src={img.url}
                  alt={logo.name ?? img.alt ?? ''}
                  className="h-12 mx-auto opacity-70"
                />
              </SwiperSlide>
            ) : null
          })}
        </Swiper>
      </div>
    </section>
  )
}
