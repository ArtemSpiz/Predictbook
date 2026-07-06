import type { Metadata } from 'next'
import { getPageBySlug } from '@/utilities/getPageBySlug'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { localeAlternates } from '@/utilities/metadataAlternates'
import { Footer } from '../Footer'
import Main from '../components/Home/Main'

export const metadata: Metadata = { ...localeAlternates('') }

export default async function HomePage() {
  const page = await getPageBySlug('home')
  if (!page) {
    return (
      <div>
        <Main />
      </div>
    )
  }
  return (
    <main>
      <RenderBlocks blocks={page.blocks ?? []} />
    </main>
  )
}
