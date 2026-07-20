import type { Metadata } from 'next'

import { getSiteUrl } from './getSiteUrl'

/**
 * Single-language canonical URL for a page.
 *
 * `pathSuffix` is the path after the base URL, e.g. `''` for home, `'/analysis'`,
 * `'/analysis/my-slug'`. Kept as a dedicated helper so multi-locale `hreflang`
 * alternates can be layered in later without touching every page.
 *
 * `feedPath` is the RSS feed advertised for autodiscovery; defaults to the
 * site-wide `/feed`. Section/category pages pass their own feed so crawlers
 * (and Google Publisher Center) can discover the narrower feeds too.
 */
export function localeAlternates(
  pathSuffix: string,
  feedPath = '/feed',
): Pick<Metadata, 'alternates'> {
  const base = getSiteUrl().replace(/\/$/, '')
  const suffix =
    pathSuffix === '' || pathSuffix === '/'
      ? ''
      : pathSuffix.startsWith('/')
        ? pathSuffix
        : `/${pathSuffix}`

  const canonical = `${base}${suffix || '/'}`
  const feed = feedPath.startsWith('/') ? feedPath : `/${feedPath}`

  return { alternates: { canonical, types: { 'application/rss+xml': `${base}${feed}` } } }
}
