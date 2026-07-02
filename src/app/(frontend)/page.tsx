import type { Metadata } from 'next'
import { getPageBySlug } from '@/utilities/getPageBySlug'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { localeAlternates } from '@/utilities/metadataAlternates'

export const metadata: Metadata = { ...localeAlternates('') }

export default async function HomePage() {
  const page = await getPageBySlug('home')
  if (!page) {
    return (
      <main style={{ padding: 40 }}>
        <h1>Payload Starter</h1>
        <p>
          No "home" page yet. Run <code>pnpm seed</code> after Phase 11 or create one in{' '}
          <a href="/admin/collections/pages">/admin/collections/pages</a>.
        </p>
      </main>
    )
  }
  return (
    <main>
      <RenderBlocks blocks={page.blocks ?? []} />
    </main>
  )
}
