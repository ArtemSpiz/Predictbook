import ArticleType from '@/app/components/Home/ArticlesType'
import ArticleTypeMobileSwitcher from '@/app/components/Home/ArticleTypeMobileSwitcher'
import { findBlogPosts } from '@/utilities/getBlogPosts'
import { blogToArticleView, type ArticleView } from '@/app/lib/viewModels'
import type { Category } from '@/payload-types'

export type CategorySectionData = {
  label: string
  accent: string
  viewAllText: string
  viewAllUrl: string
  cards: ArticleView[]
}

export type CategoryBlock = {
  label: string
  category: number | string | Category
  accent: string
  limit?: number | null
  viewAllText: string
}

function categorySlug(category: number | string | Category): string {
  return typeof category === 'object' && category !== null ? category.slug : ''
}

export async function CategorySections({
  blocks,
  header,
}: {
  blocks: CategoryBlock[]
  header: { title: string; subtitle?: string | null }
}) {
  const sections: CategorySectionData[] = await Promise.all(
    blocks.map(async (b) => {
      const slug = categorySlug(b.category)
      if (!slug) {
        return {
          label: b.label,
          accent: b.accent,
          viewAllText: b.viewAllText,
          viewAllUrl: `/blog/category/${slug}`,
          cards: [],
        }
      }
      const res = await findBlogPosts({ categorySlug: slug, limit: b.limit ?? 3 })
      return {
        label: b.label,
        accent: b.accent,
        viewAllText: b.viewAllText,
        viewAllUrl: `/blog/category/${slug}`,
        cards: res.docs.map(blogToArticleView),
      }
    }),
  )

  return (
    <>
      <ArticleTypeMobileSwitcher header={header} sections={sections} />
      <div className="max-xl:hidden flex flex-col gap-5">
        {sections.map((s, i) => (
          <div key={s.label} className="flex flex-col gap-5">
            <ArticleType
              title={s.label}
              accent={s.accent}
              viewAllText={s.viewAllText}
              viewAllUrl={s.viewAllUrl}
              cards={s.cards}
            />
            {i < sections.length - 1 && <div className="w-full h-px bg-line" />}
          </div>
        ))}
      </div>
    </>
  )
}
