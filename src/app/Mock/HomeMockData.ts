import { AlertCard } from '../components/Home/Alert'
import { GridCard } from '../components/Home/ArticlesType'
import Img from '../../../public/gridImg.png'

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

export const politicsCards: GridCard[] = [
  {
    image: Img,
    type: 'politics',
    day: 'Today',
    time: '12:00',
    title: 'Why Kalshi consistently underprices third-party candidates',
    text: '90 days of trading data reveals a systematic bias — and how to trade against it.90 days of trading data reveals a systematic bias — and how to trade against it.',
  },
  {
    image: Img,
    type: 'politics',
    day: 'Today',
    time: '12:00',
    title: 'Why Kalshi consistently underprices third-party candidates',
    text: '90 days of trading data reveals a systematic bias — and how to trade against it.90 days of trading data reveals a systematic bias — and how to trade against it.',
  },
  {
    image: Img,
    type: 'politics',
    day: 'Today',
    time: '12:00',
    title: 'Why Kalshi consistently underprices third-party candidates',
    text: '90 days of trading data reveals a systematic bias — and how to trade against it.90 days of trading data reveals a systematic bias — and how to trade against it.',
  },
]
