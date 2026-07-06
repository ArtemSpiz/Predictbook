'use client'

import Script from 'next/script'

/**
 * Google Tag Manager / GA4 with Consent Mode v2. Consent defaults to *denied*
 * (privacy-first); grant it from your CMP by calling
 * `gtag('consent','update',{ analytics_storage:'granted', ... })`.
 * Renders nothing when no IDs are configured. Do not render in draft/preview.
 */
export function AnalyticsScripts({ gtmId, ga4Id }: { gtmId?: string; ga4Id?: string }) {
  if (!gtmId && !ga4Id) return null

  return (
    <>
      {/* Consent Mode v2 defaults — must execute before GTM/GA load. */}
      <script
        id="consent-default"
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',wait_for_update:500});`,
        }}
      />

      {gtmId && (
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`}
        </Script>
      )}

      {ga4Id && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`}
            strategy="afterInteractive"
          />
          <Script id="ga4" strategy="afterInteractive">
            {`gtag('js', new Date()); gtag('config', '${ga4Id}');`}
          </Script>
        </>
      )}
    </>
  )
}
