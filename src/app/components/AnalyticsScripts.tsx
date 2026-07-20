import Script from 'next/script'

/**
 * Google Tag Manager / GA4 with Consent Mode v2. A single `beforeInteractive`
 * bootstrap runs before hydration and in a guaranteed order: set consent
 * defaults to *denied* FIRST, then queue GA4/GTM config, then inject the gtag.js
 * loader into <head>. Ordering matters — the consent default must be pushed
 * before the tag initialises. The cookie banner later grants consent via
 * `gtag('consent','update', ...)`. Renders nothing when no IDs are configured.
 */
export function AnalyticsScripts({ gtmId, ga4Id }: { gtmId?: string; ga4Id?: string }) {
  if (!gtmId && !ga4Id) return null

  const lines: string[] = [
    "window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}",
    "gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',wait_for_update:500});",
  ]
  if (ga4Id) {
    lines.push("gtag('js',new Date());")
    lines.push(`gtag('config','${ga4Id}');`)
  }
  if (gtmId) {
    lines.push(
      `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`,
    )
  }
  if (ga4Id) {
    lines.push(
      `(function(){var s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id=${ga4Id}';document.head.appendChild(s);})();`,
    )
  }

  return (
    <Script
      id="ga-consent-bootstrap"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{ __html: lines.join('\n') }}
    />
  )
}
