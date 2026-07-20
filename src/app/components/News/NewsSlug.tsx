import { LiveBadge } from '@/app/ui/LiveBadge'
import { DevelopingBadge } from '@/app/ui/DevelopingBadge'
import AnotherNews from './AnotherNews'
import { Breadcrumbs } from '@/app/ui/Breadcrumbs'
import { getCategoryStyle } from '@/app/lib/getCategoryStyle'
import { PayloadImage } from '@/app/components/PayloadImage'
import { SharePageButton } from '@/app/ui/SharePageButton'
import { PreferredSourceButton } from '@/app/ui/PreferredSourceButton'
import { InvestingDisclaimer } from '@/app/ui/InvestingDisclaimer'
import AboutCTA from '@/app/components/About/AboutCTA'
import { EXTERNAL_REL } from '@/app/ui/ExternalLink'
import type { SocialItem } from '@/app/ui/SocialLinks'
import { categoryRefs, fmtDay, fmtTime, type ArticleView } from '@/app/lib/viewModels'
import { RichText } from '@payloadcms/richtext-lexical/react'
import Link from 'next/link'
import type { News, Media } from '@/payload-types'

interface Props {
  post: News
  related: ArticleView[]
  social: SocialItem[]
}

export default function NewsSlug({ post, related, social }: Props) {
  const categories = categoryRefs(post.categories)
  const author = post.author && typeof post.author === 'object' ? post.author : null
  const authorProfile =
    post.authorProfile && typeof post.authorProfile === 'object' ? post.authorProfile : null
  const cover =
    post.coverImage && typeof post.coverImage === 'object' ? (post.coverImage as Media) : null

  return (
    <div className="flex flex-col gap-6 flex-1 lg:border-r border-line lg:p-5">
      <Breadcrumbs items={[{ label: 'Analysis', href: '/analysis' }, { label: post.title }]} />
      <div className="flex items-center gap-2">
        {post.isDeveloping && <DevelopingBadge className="h-[-webkit-fill-available]" />}

        {post.live && <LiveBadge className="h-[-webkit-fill-available] bg-live-soft" />}

        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/analysis/${category.slug}`}
            className={`border border-solid px-1.5 py-1 text-xs uppercase max-md:text-xs transition-opacity hover:opacity-80 ${getCategoryStyle(category.title)}`}
          >
            {category.title}
          </Link>
        ))}
      </div>

      <h1 className="text-2xl font-bold">{post.title}</h1>

      <div className="flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          {authorProfile ? (
            <Link
              href={`/author/${authorProfile.slug}`}
              className="text-muted mb-1 text-base hover:underline"
            >
              {authorProfile.name}
            </Link>
          ) : (
            author?.name && (
              <Link
                href={`/analysis/${post.slug}/${encodeURIComponent(author.name.replace(/\s+/g, '-'))}`}
                className="text-muted mb-1 text-base hover:underline"
              >
                {author.name}
              </Link>
            )
          )}
          <div className="text-muted text-base">
            {fmtDay(post.publishedAt)} • {fmtTime(post.publishedAt)}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 items-center max-md:w-full">
          <PreferredSourceButton />

          <div className="flex gap-1 items-center">
            {social.map((item, i) => (
              <a
                key={i}
                href={item.url ?? ''}
                target="_blank"
                rel={EXTERNAL_REL}
                className="border border-line cursor-pointer rounded-md w-10 h-10 flex justify-center items-center"
              >
                <PayloadImage media={item.icon} alt="" className="object-contain" />
              </a>
            ))}
            <SharePageButton title={post.title} />
          </div>
        </div>
      </div>

      <div className="w-full h-px bg-line" />

      <div className="flex flex-col gap-6">
        {cover && <PayloadImage media={cover} alt={post.title} className="w-full rounded-xl" />}

        <div className="prose max-w-none">
          <RichText data={post.content} />
        </div>

        <AboutCTA />

        <InvestingDisclaimer />
      </div>

      <div className="w-full h-px bg-line" />

      <AnotherNews currentSlug={post.slug} articles={related} />
    </div>
  )
}
