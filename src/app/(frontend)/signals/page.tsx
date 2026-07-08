import type { Metadata } from 'next'
import { getPageBySlug } from '@/utilities/getPageBySlug'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { localeAlternates } from '@/utilities/metadataAlternates'
import SignalsMain from '@/app/components/Signals/SignalsMain'

export const metadata: Metadata = { ...localeAlternates('') }

export default async function Signals() {
  const page = await getPageBySlug('signals')
  if (!page) {
    return (
      <div>
        <SignalsMain />
      </div>
    )
  }
  return (
    <main>
      <RenderBlocks blocks={page.blocks ?? []} />
    </main>
  )
}
