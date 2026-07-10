import type { JSX } from 'react'

export const ogImageSize = { width: 1200, height: 630 }

/** Layout for `next/og` ImageResponse. Uses the built-in default font (no
 * network fetch) so it works offline and under a strict CSP. */
export function ogImageElement({
  title,
  label,
  siteName,
}: {
  title: string
  label?: string
  siteName: string
}): JSX.Element {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '80px',
        background: 'linear-gradient(135deg, #0b0f1a 0%, #111827 100%)',
        color: '#ffffff',
      }}
    >
      <div style={{ display: 'flex', fontSize: 32, letterSpacing: 2, opacity: 0.8 }}>
        {(label ?? siteName).toUpperCase()}
      </div>
      <div style={{ display: 'flex', fontSize: 72, fontWeight: 700, lineHeight: 1.1 }}>
        {title}
      </div>
      <div style={{ display: 'flex', fontSize: 28, opacity: 0.7 }}>{siteName}</div>
    </div>
  )
}
