import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import config from '@payload-config'
import type {
  HomePage,
  AboutPage,
  ContactPage,
  SignalsPage,
  LiveFeedPage,
  NewsPage,
} from '@/payload-types'
import { cacheTags } from '@/utilities/cacheTags'

type PageGlobalSlug =
  | 'home-page'
  | 'about-page'
  | 'contact-page'
  | 'signals-page'
  | 'live-feed-page'
  | 'news-page'

async function fetchGlobal<T>(slug: PageGlobalSlug): Promise<T | null> {
  try {
    const payload = await getPayload({ config })
    return (await payload.findGlobal({ slug, depth: 1 })) as unknown as T
  } catch {
    return null
  }
}

const cachedGlobal = <T>(slug: PageGlobalSlug) =>
  unstable_cache(() => fetchGlobal<T>(slug), [slug], { tags: [cacheTags.all, cacheTags.global(slug)] })()

export const getHomePageContent = () => cachedGlobal<HomePage>('home-page')
export const getAboutPageContent = () => cachedGlobal<AboutPage>('about-page')
export const getContactPageContent = () => cachedGlobal<ContactPage>('contact-page')
export const getSignalsPageContent = () => cachedGlobal<SignalsPage>('signals-page')
export const getLiveFeedPageContent = () => cachedGlobal<LiveFeedPage>('live-feed-page')
export const getNewsPageContent = () => cachedGlobal<NewsPage>('news-page')
