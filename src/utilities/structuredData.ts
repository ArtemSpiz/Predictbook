import { getSiteUrl } from './getSiteUrl'
import { siteConfig } from './siteConfig'

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
