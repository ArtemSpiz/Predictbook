import { notFound } from 'next/navigation'
import { getPageBySlug } from '@/utilities/getPageBySlug'
import { RenderBlocks } from '@/blocks/RenderBlocks'

type Props = { params: Promise<{ slug: string }> }

export default async function DynamicPage({ params }: Props) {
  const { slug } = await params
  const page = await getPageBySlug(slug)
  if (!page) notFound()
  return (
    <main>
      <RenderBlocks blocks={page.blocks ?? []} />
    </main>
  )
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const page = await getPageBySlug(slug)
  if (!page) return {}
  return { title: page.title }
}
