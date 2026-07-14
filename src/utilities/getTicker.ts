import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Ticker } from '@/payload-types'
import { cacheTags } from '@/utilities/cacheTags'

async function fetchTicker(): Promise<Ticker[]> {
  try {
    const payload = await getPayload({ config })
    const res = await payload.find({
      collection: 'ticker',
      sort: 'order',
      limit: 100,
      pagination: false,
    })
    return res.docs
  } catch {
    return []
  }
}

/** Cached ticker rows for the header marquee; flushed by the ticker collection hooks. */
export const getTicker = () =>
  unstable_cache(fetchTicker, ['ticker'], {
    tags: [cacheTags.all, cacheTags.collection('ticker')],
  })()
