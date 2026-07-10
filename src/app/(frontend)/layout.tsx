import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Header } from '@/app/Header'
import { Footer } from '@/app/Footer'
import { AnalyticsScripts } from '@/app/components/AnalyticsScripts'
import { getSiteUrl } from '@/utilities/getSiteUrl'
import { getSiteSettings } from '@/utilities/getSiteSettings'
import { getFooterData } from '@/utilities/getFooterData'
import { siteConfig } from '@/utilities/siteConfig'
import { generateStructuredData, jsonLdScriptContent } from '@/utilities/structuredData'
import { fontMono, fontSans } from './fonts'
import './globals.css'

export const metadata: Metadata = {
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
    images: [siteConfig.defaultOgImage],
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
  const [settings, footerData] = await Promise.all([getSiteSettings(), getFooterData()])

  return (
    <html lang={siteConfig.locale} className={`${fontSans.variable} ${fontMono.variable}`}>
      <body className={fontSans.className}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScriptContent(generateStructuredData()) }}
        />
        {/* No analytics in draft/preview so editor sessions don't skew metrics. */}
        {!draft && <AnalyticsScripts gtmId={settings.gtmId} ga4Id={settings.ga4Id} />}
        <Header />
        {children}
        <Footer data={footerData} />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
