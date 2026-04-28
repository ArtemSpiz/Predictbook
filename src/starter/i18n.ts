import type { I18nConfig } from './types'

export function resolveLocalization(config: I18nConfig) {
  if (config.locales.length <= 1) return undefined
  return {
    locales: config.locales,
    defaultLocale: config.defaultLocale,
    fallback: true,
  }
}
