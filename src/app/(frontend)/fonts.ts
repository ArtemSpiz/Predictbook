import { Inter } from 'next/font/google'

/**
 * Default sans font, self-hosted and optimized by `next/font` (no layout shift,
 * no render-blocking request). Swap for a different Google font or `next/font/local`
 * per project. Exposed as both a `className` and the `--font-sans` CSS variable.
 */
export const fontSans = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
})
