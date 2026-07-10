import type { Metadata } from 'next'

import { getSiteUrl } from './getSiteUrl'

/**
 * Single-language canonical URL for a page.
 *
 * `pathSuffix` is the path after the base URL, e.g. `''` for home, `'/news'`,
 * `'/news/my-slug'`. Kept as a dedicated helper so multi-locale `hreflang`
 * alternates can be layered in later without touching every page.
 */
export function localeAlternates(pathSuffix: string): Pick<Metadata, 'alternates'> {
  const base = getSiteUrl().replace(/\/$/, '')
  const suffix =
    pathSuffix === '' || pathSuffix === '/'
      ? ''
      : pathSuffix.startsWith('/')
        ? pathSuffix
        : `/${pathSuffix}`

  const canonical = `${base}${suffix || '/'}`

  return { alternates: { canonical } }
}
