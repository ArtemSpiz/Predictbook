import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'
import enFallback from '@/i18n/locales/en.json'
import { isMultiLocale } from '@/i18n/config'

type Translations = typeof enFallback

async function fetchTranslations(locale: string): Promise<Translations> {
  if (!isMultiLocale) return enFallback as Translations
  try {
    const payload = await getPayload({ config })
    const data = await payload.findGlobal({ slug: 'translations', locale })
    return { ...enFallback, ...(data as Partial<Translations>) }
  } catch {
    return enFallback as Translations
  }
}

export const getTranslations = (locale: string) =>
  unstable_cache(() => fetchTranslations(locale), ['translations', locale], {
    tags: [`translations:${locale}`],
    revalidate: 300,
  })()
