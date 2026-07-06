import { Archivo, DM_Mono } from 'next/font/google'

/**
 * Default sans font, self-hosted and optimized by `next/font` (no layout shift,
 * no render-blocking request). Swap for a different Google font or `next/font/local`
 * per project. Exposed as both a `className` and the `--font-sans` CSS variable.
 */
export const fontSans = Archivo({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
})

export const fontMono = DM_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
  weight: ['300', '400', '500'],
})
