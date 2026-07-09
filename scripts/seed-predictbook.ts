#!/usr/bin/env tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import path from 'path'
import { fileURLToPath } from 'url'
import { getPayload } from 'payload'
import config from '../src/payload.config'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PUBLIC = path.resolve(__dirname, '../public')

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const richText = (text: string) => ({
  root: {
    type: 'root',
    children: [{ type: 'paragraph', version: 1, children: [{ type: 'text', version: 1, text }] }],
    direction: 'ltr',
    format: '',
    indent: 0,
    version: 1,
  },
})

// base publish time; stagger posts backwards from here
const BASE = new Date('2026-06-09T12:00:00Z').getTime()
const at = (hoursAgo: number) => new Date(BASE - hoursAgo * 3600_000).toISOString()

// ---------- category catalogue (title -> slug) ----------
const CATEGORY_TITLES = [
  'Markets',
  'Elections',
  'AI',
  'Regulation',
  'Politics',
  'Sports',
  'Crypto',
  'Technology',
  'Science',
  'Economics',
  'Arbitrage',
  'Whale Alert',
  'KALSHI VS POLYMARKET',
]

async function main() {
  const payload = await getPayload({ config })
  const catId: Record<string, string> = {}

  let authorId: string | undefined
  {
    const email = 'toghrul@predictbook.io'
    const found = await payload.find({
      collection: 'users',
      where: { email: { equals: email } },
      limit: 1,
    })
    if (found.docs.length) authorId = found.docs[0].id
    else {
      const u = await payload.create({
        collection: 'users',
        data: { email, password: 'editor1234', name: 'Dr. Toghrul Aliyev', role: 'editor' } as any,
      })
      authorId = u.id
      console.log(' ✓ author user (toghrul@predictbook.io / editor1234)')
    }
  }

  // categories
  console.log('[seed] categories...')
  for (const title of CATEGORY_TITLES) {
    const slug = slugify(title)
    const found = await payload.find({
      collection: 'categories',
      where: { slug: { equals: slug } },
      limit: 1,
    })
    if (found.docs.length) catId[slug] = found.docs[0].id
    else {
      const c = await payload.create({ collection: 'categories', data: { title, slug } as any })
      catId[slug] = c.id
    }
  }
  const cats = (...titles: string[]) => titles.map((t) => catId[slugify(t)]).filter(Boolean)

  // cover image (reuse mock gridImg.png)
  let coverId: string | undefined
  {
    const found = await payload.find({
      collection: 'media',
      where: { alt: { equals: 'Predictbook article cover' } },
      limit: 1,
    })
    if (found.docs.length) coverId = found.docs[0].id
    else {
      try {
        const m = await payload.create({
          collection: 'media',
          data: { alt: 'Predictbook article cover' } as any,
          filePath: path.join(PUBLIC, 'gridImg.png'),
        })
        coverId = m.id
        console.log(' ✓ cover image uploaded')
      } catch (e) {
        console.warn(
          ' ! cover image upload failed (continuing without images):',
          (e as Error).message,
        )
      }
    }
  }

  const upsert = async (collection: any, slug: string, data: any) => {
    const found = await payload.find({ collection, where: { slug: { equals: slug } }, limit: 1 })
    if (found.docs.length) {
      await payload.update({ collection, id: found.docs[0].id, data })
      return found.docs[0].id
    }
    const doc = await payload.create({ collection, data })
    return doc.id
  }

  // ---------- blog posts (from BlogMockData.ArticlesContent) ----------
  console.log('[seed] blog posts...')
  const text =
    '90 days of trading data reveals a systematic bias — and how to trade against it. 90 days of trading data reveals a systematic bias — and how to trade against it.'
  const blogSpecs = [
    { n: '', c: ['Markets', 'Elections'], featured: true, live: true },
    { n: '-2', c: ['AI', 'Regulation'] },
    { n: '-3', c: ['Markets', 'Elections'], title3: true },
    { n: '-4', c: ['Markets', 'Elections'] },
    { n: '-5', c: ['Markets', 'Elections'] },
    { n: '-6', c: ['Politics'] },
    { n: '-7', c: ['Sports'] },
    { n: '-8', c: ['Crypto'], live: true },
    { n: '-9', c: ['Technology'] },
    { n: '-10', c: ['Science'] },
  ]
  let i = 0
  for (const spec of blogSpecs) {
    const slug = `why-kalshi-consistently-underprices-third-party-candidates${spec.n}`
    const title = spec.title3
      ? 'Why Kalshi consistently underprices third-party candidates 3'
      : 'Why Kalshi consistently underprices third-party candidates'
    await upsert('blog', slug, {
      slug,
      title,
      excerpt: text,
      content: richText(text),
      _status: 'published',
      featured: !!spec.featured,
      live: !!spec.live,
      author: authorId,
      categories: cats(...spec.c),
      publishedAt: at(i++),
      ...(coverId ? { coverImage: coverId } : {}),
    })
  }

  // ---------- signals ----------
  console.log('[seed] signals...')
  const signals = [
    {
      slug: 'arb-eth-4k-kalshi-polymarket',
      kind: 'arbitrage',
      featured: true,
      categories: cats('Arbitrage', 'Crypto', 'KALSHI VS POLYMARKET'),
      title: 'Arb opportunity: ETH >$4K between Kalshi & Polymarket',
      subtitle:
        'A 7.2% spread exists between Kalshi (62¢ YES) and Polymarket (54¢ YES) on ETH breaking $4K by year-end. Risk-free profit window may close within hours.',
      profitably: true,
      yesPrice: '34¢',
      noPrice: '26¢',
      spread: '+8pp',
      poly: '34¢',
      kalshi: '26¢',
      profitablyPP: '+8PP',
    },
    {
      slug: 'arb-polymarket-kalshi-biden-2026',
      kind: 'arbitrage',
      categories: cats('Arbitrage', 'Politics', 'KALSHI VS POLYMARKET'),
      title: 'Polymarket vs Kalshi: 8pp spread on Biden 2026 candidacy',
      subtitle:
        'An 8pp spread between venues on Biden’s 2026 candidacy — a clean cross-market play.',
      profitably: true,
      yesPrice: '34¢',
      noPrice: '26¢',
      poly: '34¢',
      kalshi: '26¢',
      spread: '+8PP',
      profitablyPP: '+8PP',
    },
    {
      slug: 'arb-gop-senate-majority-briefing',
      kind: 'arbitrage',
      categories: cats('Technology', 'Sports', 'KALSHI VS POLYMARKET'),
      title: '$240K placed on GOP Senate majority — 48 min after closed briefing',
      subtitle:
        'Single wallet, 2.1× odds. Timing relative to the Senate briefing window raises questions. Market moved 4pp in 12 minutes after the bet settled.',
      profitably: false,
      yesPrice: '34¢',
      noPrice: '26¢',
      volume: '$1.4M',
      profitablyPP: '+8PP',
    },
    {
      slug: 'whale-240k-republican-senate',
      kind: 'whale',
      categories: cats('Whale Alert', 'Politics'),
      title: '$240K placed on Republican Senate win — 48 min after closed briefing',
      profitably: false,
      yesPrice: '34¢',
      noPrice: '26¢',
      size: '$240K',
      odds: '2.1×',
      volume: '$1.4M',
      profitablyPP: '+8PP',
    },
    {
      slug: 'whale-180k-eu-ai-act',
      kind: 'whale',
      categories: cats('Whale Alert', 'Regulation'),
      title: '$180K on EU AI Act approval before September',
      profitably: false,
      yesPrice: '41¢',
      noPrice: '59¢',
      size: '$180K',
      odds: '1.7×',
      volume: '$820K',
      profitablyPP: '+3PP',
    },
    {
      slug: 'whale-95k-bitcoin-120k',
      kind: 'whale',
      categories: cats('Whale Alert', 'Crypto'),
      title: '$95K on Bitcoin above $120K by year end',
      profitably: true,
      yesPrice: '29¢',
      noPrice: '71¢',
      size: '$95K',
      odds: '3.4×',
      volume: '$610K',
      profitablyPP: '+5PP',
    },
  ]
  let s = 0
  for (const sig of signals) {
    await upsert('signals', sig.slug, { ...sig, _status: 'published', publishedAt: at(s++) })
  }

  // ---------- live feed (from HomeMockData.FeedContent) ----------
  console.log('[seed] live feed...')
  const feed = [
    {
      slug: 'congress-crypto-hearing-how-odds-moved-in-real-time',
      title: 'Congress crypto hearing: how odds moved in real time',
      subtitle: 'Tracking live odds movements as news develops on the tariff negotiations.',
      categories: cats('Crypto'),
      updates: 12,
      live: true,
      timeline: [
        {
          time: 'Latest',
          text: 'Polymarket lifts "bill passes" to 61% — up 9pp since the session opened.',
        },
        {
          time: '14:18',
          text: 'Sen. Lummis confirms support for the Gillibrand amendment. Markets react within minutes.',
        },
        {
          time: '14:18',
          text: 'New market opens on Gillibrand amendment specifically. Opens at 38¢ YES.',
        },
      ],
    },
    {
      slug: 'after-supreme-courts-tps-decision',
      title:
        'After Supreme Court’s TPS decision, more than a million immigrants face scramble to stay in US',
      subtitle:
        'Until Thursday morning, hundreds of thousands of Haitians were legally living and working in the United States, along with thousands of Syrians.',
      categories: cats('Politics'),
      updates: 12,
      live: false,
      timeline: [
        {
          time: '15:01',
          text: 'Polymarket lifts "bill passes" to 61% — up 9pp since the session opened.',
        },
        {
          time: '14:18',
          text: 'Sen. Lummis confirms support for the Gillibrand amendment. Markets react within minutes.',
        },
        {
          time: '14:18',
          text: 'New market opens on Gillibrand amendment specifically. Opens at 38¢ YES.',
        },
      ],
    },
  ]
  let f = 0
  for (const item of feed) {
    await upsert('live-feed', item.slug, { ...item, _status: 'published', publishedAt: at(f++) })
  }

  // ---------- globals ----------
  console.log('[seed] globals...')

  // promo images for the Real Card block
  const promoImg = async (alt: string, file: string): Promise<string | undefined> => {
    const found = await payload.find({ collection: 'media', where: { alt: { equals: alt } }, limit: 1 })
    if (found.docs.length) return found.docs[0].id
    try {
      const m = await payload.create({ collection: 'media', data: { alt } as any, filePath: path.join(PUBLIC, file) })
      return m.id
    } catch (e) {
      console.warn(` ! ${file} upload failed:`, (e as Error).message)
      return coverId // fallback so the required field is still populated
    }
  }
  const lightningId = await promoImg('Real-time alerts badge', 'Lightning.png')
  const graphId = await promoImg('Real-time alerts graph', 'Graph.png')

  await payload.updateGlobal({
    slug: 'home-page',
    data: {
      signalsMobileHeader: {
        title: 'Signals',
        subtitle: 'Track emerging trends before they become headlines',
      },
      categorySwitcherHeader: {
        title: 'Explore by Category',
        subtitle: 'The latest articles from our most-followed prediction market topics.',
      },
      sidebarBlocks: [
        {
          blockType: 'signal-feed',
          heading: 'Whale Alert',
          kind: 'whale',
          delayLabel: '30-min delay',
          limit: 3,
          viewAllText: 'View all whale alerts',
          viewAllUrl: '/signals',
          hidden: false,
        },
        {
          blockType: 'signal-feed',
          heading: 'Arbitrage Alert',
          kind: 'arbitrage',
          delayLabel: '30-min delay',
          limit: 3,
          viewAllText: 'View all arbitrage alerts',
          viewAllUrl: '/signals',
          hidden: false,
        },
        {
          blockType: 'summary',
          tabs: [
            {
              title: 'Daily',
              infoTitle: 'Market pulse',
              day: 'Today',
              time: '20:00',
              info: [{ text: 'Markets stayed range-bound ahead of the data print.' }],
            },
          ],
          hidden: false,
        },
        {
          blockType: 'real-card',
          badgeIcon: lightningId,
          badgeText: 'Real-time alerts',
          showLiveDot: true,
          title: 'Want signals in real time?',
          description: 'Get instant alerts with advanced filtering tailored to your interests.',
          buttonText: 'Join Real-time Alerts',
          buttonUrl: '/signals',
          backgroundImage: graphId,
          hidden: false,
        },
      ],
      mainBlocks: [
        {
          blockType: 'analysis',
          heading: 'Analysis',
          subtitle: 'Expert perspectives behind market movements.',
          limit: 5,
          viewAllText: 'All articles',
          viewAllUrl: '/blog',
          hidden: false,
        },
        {
          blockType: 'live-feed-block',
          heading: 'Live Feed',
          limit: 1,
          viewAllText: 'All threads',
          viewAllUrl: '/live-feed',
          hidden: false,
        },
        {
          blockType: 'category-section',
          label: 'Politics',
          category: catId['politics'],
          accent: 'politics',
          limit: 3,
          viewAllText: 'All articles',
          hidden: false,
        },
        {
          blockType: 'category-section',
          label: 'Sports',
          category: catId['sports'],
          accent: 'sports',
          limit: 3,
          viewAllText: 'All articles',
          hidden: false,
        },
        {
          blockType: 'category-section',
          label: 'Crypto',
          category: catId['crypto'],
          accent: 'crypto',
          limit: 3,
          viewAllText: 'All articles',
          hidden: false,
        },
      ],
    } as any,
  })

  await payload.updateGlobal({
    slug: 'about-page',
    data: {
      title: 'About Predictbook',
      body: richText(
        'Predictbook is a prediction-market intelligence desk. We surface arbitrage spreads, whale moves, and value plays across Kalshi and Polymarket, then explain what they mean.',
      ),
      cta: {
        heading: 'Stay in the loop',
        text: 'Never miss the latest market analysis, prediction insights, and emerging opportunities. Delivered straight to your inbox.',
        placeholder: 'Your email',
        buttonText: 'Subscribe',
      },
      sidebarBlocks: [
        {
          blockType: 'live-feed-block',
          heading: 'Live Feed',
          limit: 1,
          viewAllText: 'All threads',
          viewAllUrl: '/live-feed',
          hidden: false,
        },
        {
          blockType: 'real-card',
          badgeIcon: lightningId,
          badgeText: 'Real-time alerts',
          showLiveDot: true,
          title: 'Want signals in real time?',
          description: 'Get instant alerts with advanced filtering tailored to your interests.',
          buttonText: 'Join Real-time Alerts',
          buttonUrl: '/signals',
          backgroundImage: graphId,
          hidden: false,
        },
      ],
    } as any,
  })

  await payload.updateGlobal({
    slug: 'contact-page',
    data: {
      title: 'Contact Us',
      subtitle:
        "Have a question, feedback, or partnership inquiry? We'd love to hear from you. Fill out the form below and our team will get back to you as soon as possible.",
      methods: [
        { title: 'Email', linkText: 'hello@predictbook.io', link: 'mailto:hello@predictbook.io' },
        { title: 'Telegram', linkText: '@predictbook', link: 'https://t.me/predictbook' },
        {
          title: 'Advertising & partnerships',
          linkText: 'partnerships@predictbook.io',
          link: 'mailto:partnerships@predictbook.io',
        },
      ],
      socials: [{ link: 'https://t.me/predictbook' }, { link: 'https://x.com/predictbook' }],
      valueCard: {
        title: 'Other ways to reach us',
        text: 'Your input helps us improve Predictbook and deliver better analysis.',
        buttonText: 'Suggest a topic',
      },
    } as any,
  })

  await payload.updateGlobal({
    slug: 'signals-page',
    data: {
      title: 'Signals',
      subtitle:
        'Hand-picked prediction market opportunities — up to 5 per day, curated from our live alerts system. Arbitrage spreads, whale moves, and value plays.',
      delayText: '10-min delay',
    } as any,
  })

  await payload.updateGlobal({
    slug: 'live-feed-page',
    data: {
      title: 'Live Feed',
      subtitle:
        'Real-time liveblog threads on trending prediction market topics — one carefully selected event per day.',
    } as any,
  })

  await payload.updateGlobal({
    slug: 'blog-page',
    data: {
      title: 'Analysis',
      subtitle:
        'Short-form market analysis — 3 pieces per day, ~300 words each. Our writers take live prediction market signals and give context and directional reasoning.',
      categories: ['All', 'Politics', 'Economics', 'Crypto', 'Technology', 'Sports', 'Science'].map(
        (title) => ({ title }),
      ),
    } as any,
  })

  console.log('\n[seed] predictbook content done.')
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
