import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import config from '@payload-config'

async function fetchSignalsToday(): Promise<number> {
  try {
    const payload = await getPayload({ config })
    const now = new Date()
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const res = await payload.count({
      collection: 'signals',
      where: {
        _status: { equals: 'published' },
        publishedAt: { greater_than_equal: startOfDay.toISOString() },
      },
    })
    return res.totalDocs
  } catch {
    return 0
  }
}

/** Cached count of signals published today; refreshed via the `payload` tag. */
export const getSignalsToday = () =>
  unstable_cache(fetchSignalsToday, ['signals-today'], { tags: ['payload'] })()
