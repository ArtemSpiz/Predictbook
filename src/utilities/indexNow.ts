import type { CollectionAfterChangeHook } from 'payload'

import { getSiteUrl } from './getSiteUrl'

const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow'

/**
 * Ping IndexNow about changed/published URLs.
 *
 * IndexNow is used by Bing / Yandex / Naver / Seznam (one request is co-shared
 * across participants). Google does NOT support it.
 *
 * No-op when: no `INDEXNOW_KEY`, not production, or the base URL is localhost.
 * Errors are logged only — a ping must never break saving a document.
 */
export async function pingIndexNow(urls: string[]): Promise<void> {
  const key = process.env.INDEXNOW_KEY?.trim()
  if (!key) return
  if (process.env.NODE_ENV !== 'production') return

  const list = urls.map((u) => u.trim()).filter(Boolean)
  if (list.length === 0) return

  const base = getSiteUrl().replace(/\/$/, '')
  let host: string
  try {
    host = new URL(base).host
  } catch {
    return
  }
  if (/^(localhost|127\.0\.0\.1)/i.test(host)) return

  try {
    const res = await fetch(INDEXNOW_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host,
        key,
        keyLocation: `${base}/indexnow.txt`,
        urlList: list,
      }),
    })
    if (!res.ok && res.status !== 202) {
      console.error(`[indexNow] ${res.status} ${res.statusText}`)
    }
  } catch (e) {
    console.error('[indexNow] ping failed', e)
  }
}

/**
 * Collection `afterChange` hook that pings IndexNow when a doc is published.
 * `pathFor(slug)` returns the site-relative path, e.g. `/analysis/${slug}`.
 */
export function pingIndexNowOnPublish(pathFor: (slug: string) => string): CollectionAfterChangeHook {
  return ({ doc }) => {
    const status = (doc as { _status?: string })?._status
    const slug = (doc as { slug?: string })?.slug
    if (status === 'published' && typeof slug === 'string' && slug) {
      void pingIndexNow([`${getSiteUrl().replace(/\/$/, '')}${pathFor(slug)}`])
    }
    return doc
  }
}
