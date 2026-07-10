import Image from 'next/image'
import Live from '../../../../public/live.png'
import Facebook from '../../../../public/Facebook.png'
import X from '../../../../public/XNews.png'
import Copy from '../../../../public/Copy.png'
import AnotherNews from './AnotherNews'
import { Breadcrumbs } from '@/app/ui/Breadcrumbs'
import { getCategoryStyle } from '@/app/lib/getCategoryStyle'
import { PayloadImage } from '@/app/components/PayloadImage'
import { categoryNames, fmtDay, fmtTime, type ArticleView } from '@/app/lib/viewModels'
import { RichText } from '@payloadcms/richtext-lexical/react'
import Link from 'next/link'
import type { News, Media } from '@/payload-types'

interface Props {
  post: News
  related: ArticleView[]
}

const Contacts = [{ icon: X }, { icon: Facebook }, { icon: Copy }]

export default function NewsSlug({ post, related }: Props) {
  const categories = categoryNames(post.categories)
  const author = post.author && typeof post.author === 'object' ? post.author : null
  const cover = post.coverImage && typeof post.coverImage === 'object' ? (post.coverImage as Media) : null

  return (
    <div className="flex flex-col gap-6 flex-1 md:border-r border-line md:p-5">
      <Breadcrumbs items={[{ label: 'Analysis', href: '/news' }, { label: post.title }]} />
      <div className="flex items-center gap-2">
        {post.live && (
          <div className="flex h-[-webkit-fill-available] gap-2 items-center bg-live-soft px-1.5 py-1 text-xs font-medium uppercase text-danger">
            <Image src={Live} alt="" className="w-4 h-4" />
            LIVE
          </div>
        )}

        {categories.map((category) => (
          <Link
            key={category}
            href={`/news/category/${category.toLowerCase()}`}
            className={`border border-solid px-1.5 py-1 text-xs uppercase max-md:text-xs transition-opacity hover:opacity-80 ${getCategoryStyle(category)}`}
          >
            {category}
          </Link>
        ))}
      </div>

      <h1 className="text-2xl font-bold">{post.title}</h1>

      <div className="flex items-center justify-between">
        <div>
          {author?.name && (
            <Link
              href={`/news/${post.slug}/${encodeURIComponent(author.name.replace(/\s+/g, '-'))}`}
              className="text-muted mb-1 text-base hover:underline"
            >
              {author.name}
            </Link>
          )}
          <div className="text-muted text-base">
            {fmtDay(post.publishedAt)} • {fmtTime(post.publishedAt)}
          </div>
        </div>

        <div className="flex gap-1 items-center self-stretch">
          {Contacts.map((card, i) => (
            <div
              key={i}
              className="border border-line cursor-pointer rounded-md w-10 h-10 flex justify-center items-center"
            >
              <Image src={card.icon} alt="" className="w-4 h-4" />
            </div>
          ))}
        </div>
      </div>
      <div className="w-full h-px bg-line" />

      <div className="flex flex-col gap-6">
        {cover && <PayloadImage media={cover} alt={post.title} className="w-full rounded-xl" />}

        <div className="prose max-w-none">
          <RichText data={post.content} />
        </div>
      </div>

      <div className="w-full h-px bg-line" />

      <AnotherNews currentSlug={post.slug} articles={related} />
    </div>
  )
}
