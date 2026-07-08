import { AlertCard } from '../components/Home/Alert'
import Img from '../../../public/gridImg.png'
import { Article } from './BlogMockData'

export const whaleCards: AlertCard[] = [
  {
    type: 'whale',
    underTitle: 'whale alert',
    time: '14:37',
    title: '$240K placed on Republican Senate win — 48 min after closed briefing',
    size: '$240K',
    odds: '2.1×',
  },
  {
    type: 'whale',
    underTitle: 'whale alert',
    time: '13:46',
    title: '$180K on EU AI Act approval before September',
    size: '$180K',
    odds: '1.7×',
  },
  {
    type: 'whale',
    underTitle: 'whale alert',
    time: '13:46',
    title: '$95K on Bitcoin above $120K by year end',
    size: '$95K',
    odds: '3.4×',
  },
]

export const arbitrageCards: AlertCard[] = [
  {
    type: 'arbitrage',
    underTitle: 'ARBITRAGE',
    time: '15:20',
    title: 'Polymarket vs Kalshi: 8pp spread on Biden 2026 candidacy',
    poly: '34¢',
    kalshi: '26¢',
    spread: '+8PP',
  },
  {
    type: 'whale',
    underTitle: 'ARBITRAGE',
    time: '15:20',
    title: '$180K on EU AI Act approval before September',
    size: '$180K',
    odds: '1.7×',
  },
  {
    type: 'whale',
    underTitle: 'ARBITRAGE',
    time: '15:20',
    title: '$95K on Bitcoin above $120K by year end',
    size: '$95K',
    odds: '3.4×',
  },
]

export const FeedContent = [
  {
    slug: 'congress-crypto-hearing-how-odds-moved-in-real-time',
    title: 'Congress crypto hearing: how odds moved in real time',
    subtitle: 'Tracking live odds movements as news develops on the tariff negotiations.',
    categories: ['crypto'],
    updates: 12,
    day: 'June 22, 2026',
    time: '11:33 AM',
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
    slug: 'after-supreme-courts-TPS-decision',
    title:
      'After Supreme Court’s TPS decision, more than a million immigrants face scramble to stay in US',
    subtitle:
      'Until Thursday morning, hundreds of thousands of Haitians were legally living and working in the United States, along with thousands of Syrians. ',
    categories: ['POLITICS'],
    updates: 12,
    day: 'June 22, 2026',
    time: '11:33 AM',
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

export type FeedArticle = (typeof FeedContent)[number]
