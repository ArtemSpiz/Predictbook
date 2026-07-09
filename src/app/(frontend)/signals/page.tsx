import type { Metadata } from 'next'
import { localeAlternates } from '@/utilities/metadataAlternates'
import { getSignalsPageContent } from '@/utilities/getPageContent'
import SignalsMain from '@/app/components/Signals/SignalsMain'

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSignalsPageContent()
  return {
    title: content?.title ?? 'Signals',
    description: content?.subtitle ?? undefined,
    ...localeAlternates('signals'),
  }
}

export default async function SignalsPageRoute() {
  return (
    <main>
      <SignalsMain />
    </main>
  )
}
