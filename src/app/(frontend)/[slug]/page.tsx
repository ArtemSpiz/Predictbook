import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import { getPageBySlug, getPageBySlugDraft } from '@/utilities/getPageBySlug'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { generateMeta } from '@/utilities/generateMeta'
import { getSiteUrl } from '@/utilities/getSiteUrl'
import { generatePageStructuredData, jsonLdScriptContent } from '@/utilities/structuredData'
import { LivePreviewListener } from '@/app/components/LivePreviewListener'

type Props = { params: Promise<{ slug: string }> }

export const revalidate = 3600
// On-demand ISR: pages are generated on first request, then cached/revalidated.
export function generateStaticParams() {
  return []
}

export default async function DynamicPage({ params }: Props) {
  const { slug } = await params
  const { isEnabled: draft } = await draftMode()
  const page = draft ? await getPageBySlugDraft(slug) : await getPageBySlug(slug)
  if (!page) notFound()

  const base = getSiteUrl()
  const structuredData = generatePageStructuredData({
    title: page.meta?.title || page.title,
    description: page.meta?.description || undefined,
    url: `${base}/${page.slug}`,
  })

  return (
    <main>
      {draft && <LivePreviewListener />}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScriptContent(structuredData) }}
      />
      <RenderBlocks blocks={page.blocks ?? []} />
    </main>
  )
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const page = await getPageBySlug(slug)
  if (!page) return {}
  return generateMeta({ doc: page, pathSuffix: `/${page.slug}`, type: 'website' })
}
