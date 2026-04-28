import starterConfig from '../../starter.config'

export type Locale = string

export const locales = starterConfig.i18n.locales
export const defaultLocale = starterConfig.i18n.defaultLocale
export const isMultiLocale = locales.length > 1
