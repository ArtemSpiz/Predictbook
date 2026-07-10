import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'
import enFallback from '@/i18n/locales/en.json'
import { isMultiLocale } from '@/i18n/config'
import { cacheTags } from '@/utilities/cacheTags'

type Translations = typeof enFallback

async function fetchTranslations(locale: string): Promise<Translations> {
  if (!isMultiLocale) return enFallback as Translations
  try {
    const payload = await getPayload({ config })
    // The `translations` global is only registered when multiple locales are
    // configured, so it is absent from the generated single-locale global union.
    // This branch is unreachable unless `isMultiLocale`, hence the casts.
    const data = await payload.findGlobal({
      slug: 'translations' as 'header',
      locale: locale as 'all',
    })
    return { ...enFallback, ...(data as Partial<Translations>) }
  } catch {
    return enFallback as Translations
  }
}

export const getTranslations = (locale: string) =>
  unstable_cache(() => fetchTranslations(locale), ['translations', locale], {
    tags: [cacheTags.all, cacheTags.global('translations')],
  })()
