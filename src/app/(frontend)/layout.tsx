import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { Header } from '@/app/Header'
import { Footer } from '@/app/Footer'
import { AnalyticsScripts } from '@/app/components/AnalyticsScripts'
import { PageTransition } from '@/app/components/PageTransition'
import { getSiteUrl } from '@/utilities/getSiteUrl'
import { getSiteSettings, getSocialLinks } from '@/utilities/getSiteSettings'
import { getHeaderData } from '@/utilities/getHeaderData'
import { getFooterData } from '@/utilities/getFooterData'
import { getSignalsToday } from '@/utilities/getSignalsToday'
import { getTicker } from '@/utilities/getTicker'
import { siteConfig } from '@/utilities/siteConfig'
import { generateStructuredData, jsonLdScriptContent } from '@/utilities/structuredData'
import { fontMono, fontSans } from './fonts'
import './globals.css'

export async function generateMetadata(): Promise<Metadata> {
  const { faviconUrl, siteName } = await getSiteSettings()
  const name = siteName || siteConfig.name
  return {
    ...(faviconUrl ? { icons: { icon: faviconUrl, shortcut: faviconUrl, apple: faviconUrl } } : {}),
    ...baseMetadata,
    title: { default: name, template: `%s | ${name}` },
    applicationName: name,
    authors: [{ name }],
    creator: name,
    publisher: name,
    openGraph: { ...baseMetadata.openGraph, siteName: name, title: name },
  }
}

const baseMetadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: { default: siteConfig.name, template: `%s | ${siteConfig.name}` },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  formatDetection: { email: false, address: false, telephone: false },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    siteName: siteConfig.name,
    locale: siteConfig.ogLocale,
    title: siteConfig.name,
    description: siteConfig.description,
  },
  twitter: {
    card: 'summary_large_image',
    ...(siteConfig.twitterHandle
      ? { site: siteConfig.twitterHandle, creator: siteConfig.twitterHandle }
      : {}),
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled: draft } = await draftMode()
  const [settings, headerData, footerData, social, signalsToday, ticker] = await Promise.all([
    getSiteSettings(),
    getHeaderData(),
    getFooterData(),
    getSocialLinks(),
    getSignalsToday(),
    getTicker(),
  ])

  return (
    <html lang={siteConfig.locale} className={`${fontSans.variable} ${fontMono.variable}`}>
      <body className={fontSans.className}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScriptContent(generateStructuredData()) }}
        />
        {/* No analytics in draft/preview so editor sessions don't skew metrics. */}
        {!draft && <AnalyticsScripts gtmId={settings.gtmId} ga4Id={settings.ga4Id} />}
        <Header data={headerData} social={social} signalsToday={signalsToday} ticker={ticker} />
        <PageTransition>{children}</PageTransition>
        <Footer data={footerData} social={social} />
      </body>
    </html>
  )
}
