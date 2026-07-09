import type { Metadata } from 'next'
import { localeAlternates } from '@/utilities/metadataAlternates'
import Main from '../components/Home/Main'

export const metadata: Metadata = { ...localeAlternates('') }

export default async function HomePage() {
  return (
    <main>
      <Main />
    </main>
  )
}
