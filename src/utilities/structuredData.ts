import { getSiteUrl } from './getSiteUrl'
import { siteConfig } from './siteConfig'
import { sortByNewest } from './timeline'
import type { LiveFeed, Author } from '@/payload-types'

/**
 * Serialize for `<script type="application/ld+json">`: escape `<` so CMS-stored
 * text containing `</script>` cannot break out of the tag (stored XSS).
 */
export function jsonLdScriptContent(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}

/**
 * Organization + WebSite — rendered once in the site layout.
 */
export function generateStructuredData() {
  const baseUrl = getSiteUrl()

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${baseUrl}/#organization`,
        name: siteConfig.name,
        url: baseUrl,
        logo: {
          '@type': 'ImageObject',
          url: `${baseUrl}${siteConfig.defaultOgImage}`,
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${baseUrl}/#website`,
        url: baseUrl,
        name: siteConfig.name,
        description: siteConfig.description,
        publisher: { '@id': `${baseUrl}/#organization` },
        inLanguage: siteConfig.locale,
      },
    ],
  }
}

type LexicalNode = { text?: unknown; children?: LexicalNode[] }
type TimelineBody = NonNullable<LiveFeed['timeline']>[number]['body']

/** Flatten a Lexical richtext value to a single plain-text string. */
function lexicalToPlainText(data: TimelineBody): string {
  const walk = (nodes: LexicalNode[] = []): string =>
    nodes
      .map((n) => (typeof n.text === 'string' ? n.text : '') + (n.children ? walk(n.children) : ''))
      .join('')
  const root = (data as { root?: { children?: LexicalNode[] } })?.root
  return walk(root?.children)
    .replace(/\s+/g, ' ')
    .trim()
}

const absoluteUrl = (u: string | null | undefined, baseUrl: string): string | null =>
  u ? (/^https?:\/\//.test(u) ? u : `${baseUrl}${u}`) : null

/**
 * LiveBlogPosting for a live-feed thread — maps each timeline update to a
 * BlogPosting under `liveBlogUpdate`. Embed via `jsonLdScriptContent`.
 */
export function generateLiveBlogStructuredData(item: LiveFeed, url: string) {
  const baseUrl = getSiteUrl()
  const cover = item.coverImage && typeof item.coverImage === 'object' ? item.coverImage.url : null
  const image = absoluteUrl(cover, baseUrl) ?? `${baseUrl}${siteConfig.defaultOgImage}`
  const publisher = {
    '@type': 'Organization',
    name: siteConfig.name,
    logo: { '@type': 'ImageObject', url: `${baseUrl}${siteConfig.defaultOgImage}` },
  }
  const authors = (item.authors ?? [])
    .filter((a): a is Author => typeof a === 'object' && a !== null)
    .map((a) => ({ '@type': 'Person', name: a.name, url: `${baseUrl}/author/${a.slug}` }))
  const author = authors.length
    ? authors
    : { '@type': 'Organization', name: siteConfig.name, url: baseUrl }
  const editor =
    item.lastEditedBy && typeof item.lastEditedBy === 'object' ? item.lastEditedBy.name : null

  return {
    '@context': 'https://schema.org',
    '@type': 'LiveBlogPosting',
    '@id': `${url}/#liveblog`,
    url,
    headline: item.title,
    ...(item.subtitle && { description: item.subtitle }),
    ...(item.publishedAt && {
      datePublished: item.publishedAt,
      coverageStartTime: item.publishedAt,
    }),
    ...(item.updatedAt && { dateModified: item.updatedAt }),
    // Closed threads have a known end; live ones are still ongoing.
    ...(!item.live && item.updatedAt && { coverageEndTime: item.updatedAt }),
    image,
    author,
    ...(editor && { editor: { '@type': 'Person', name: editor } }),
    publisher,
    liveBlogUpdate: sortByNewest(item.timeline ?? []).map((entry) => {
      const at = entry.at ?? item.publishedAt ?? item.updatedAt
      return {
        '@type': 'BlogPosting',
        headline: entry.heading || entry.time || item.title,
        ...(at && { datePublished: at, dateModified: at }),
        articleBody: lexicalToPlainText(entry.body),
      }
    }),
  }
}

/**
 * Per-page WebPage / Article + BreadcrumbList.
 * Call from individual page components (embed via `jsonLdScriptContent`).
 */
export function generatePageStructuredData(page: {
  title: string
  description?: string
  url: string
  type?: 'website' | 'article'
  datePublished?: string
  dateModified?: string
  breadcrumbParent?: { name: string; url: string }
}) {
  const baseUrl = getSiteUrl()

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': page.type === 'article' ? 'Article' : 'WebPage',
        '@id': `${page.url}/#webpage`,
        url: page.url,
        name: page.title,
        ...(page.description ? { description: page.description } : {}),
        isPartOf: { '@id': `${baseUrl}/#website` },
        about: { '@id': `${baseUrl}/#organization` },
        inLanguage: siteConfig.locale,
        ...(page.datePublished && { datePublished: page.datePublished }),
        ...(page.dateModified && { dateModified: page.dateModified }),
        ...(page.type === 'article' && {
          headline: page.title,
          author: { '@id': `${baseUrl}/#organization` },
          publisher: { '@id': `${baseUrl}/#organization` },
        }),
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${page.url}/#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
          ...(page.breadcrumbParent
            ? [
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: page.breadcrumbParent.name,
                  item: page.breadcrumbParent.url,
                },
              ]
            : []),
          ...(page.url !== baseUrl && page.url !== `${baseUrl}/`
            ? [
                {
                  '@type': 'ListItem',
                  position: page.breadcrumbParent ? 3 : 2,
                  name: page.title,
                  item: page.url,
                },
              ]
            : []),
        ],
      },
    ],
  }
}
