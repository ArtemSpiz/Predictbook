import type { News, LiveFeed, User } from '@/payload-types'
import { categoryNames } from '@/app/lib/viewModels'

export interface RssItem {
  title: string
  link: string
  /** ISO date; formatted to RFC-822 for <pubDate>. */
  pubDate?: string | null
  description?: string
  categories?: string[]
  creator?: string
}

interface FeedMeta {
  title: string
  description: string
  /** Human page the feed represents. */
  link: string
  /** Absolute URL of this feed (for <atom:link rel="self">). */
  feedUrl: string
  items: RssItem[]
}

export function xmlEscape(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

const cdata = (s: string): string => `<![CDATA[${s.replace(/]]>/g, ']]]]><![CDATA[>')}]]>`

/** RSS requires RFC-822 dates; toUTCString() emits a compliant value. */
export function toRfc822(iso?: string | null): string {
  const d = iso ? new Date(iso) : new Date()
  return (Number.isNaN(d.getTime()) ? new Date() : d).toUTCString()
}

export function buildRss({ title, description, link, feedUrl, items }: FeedMeta): string {
  const body = items
    .map((it) => {
      const parts = [
        `<title>${cdata(it.title)}</title>`,
        `<link>${xmlEscape(it.link)}</link>`,
        `<guid isPermaLink="true">${xmlEscape(it.link)}</guid>`,
      ]
      if (it.pubDate) parts.push(`<pubDate>${toRfc822(it.pubDate)}</pubDate>`)
      if (it.creator) parts.push(`<dc:creator>${cdata(it.creator)}</dc:creator>`)
      for (const c of it.categories ?? []) parts.push(`<category>${cdata(c)}</category>`)
      if (it.description) parts.push(`<description>${cdata(it.description)}</description>`)
      return `    <item>\n${parts.map((p) => `      ${p}`).join('\n')}\n    </item>`
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${cdata(title)}</title>
    <link>${xmlEscape(link)}</link>
    <description>${cdata(description)}</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${xmlEscape(feedUrl)}" rel="self" type="application/rss+xml"/>
${body}
  </channel>
</rss>`
}

export function rssResponse(xml: string): Response {
  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  })
}

export function newsToRssItem(base: string, p: News): RssItem {
  const author = p.author && typeof p.author === 'object' ? (p.author as User) : null
  return {
    title: p.title,
    link: `${base}/analysis/${p.slug}`,
    pubDate: p.publishedAt ?? p.createdAt,
    description: p.excerpt ?? '',
    categories: categoryNames(p.categories),
    creator: author?.name ?? undefined,
  }
}

export function liveToRssItem(base: string, f: LiveFeed): RssItem {
  return {
    title: f.title,
    link: `${base}/live/${f.slug}`,
    pubDate: f.publishedAt ?? f.createdAt,
    description: f.subtitle ?? '',
    categories: categoryNames(f.categories),
  }
}
