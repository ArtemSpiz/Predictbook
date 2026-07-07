export type DatabaseProvider = 'postgres' | 'sqlite' | 'mongodb'
export type StorageProvider = 'local' | 's3' | 'gcs' | 'vercel-blob'
export type EmailProvider = 'console' | 'resend' | 'smtp' | 'sendgrid'

export interface DatabaseConfig {
  provider: DatabaseProvider
}

export interface StorageConfig {
  provider: StorageProvider
}

export interface CdnConfig {
  url?: string
}

export interface EmailConfig {
  provider: EmailProvider
  from: string
}

export interface I18nConfig {
  locales: string[]
  defaultLocale: string
  /** Field paths in form `<collectionSlug>.<fieldName>` to skip during codemod. */
  skipFields?: string[]
  /** Field paths to force-mark as `localized: true`. */
  forceFields?: string[]
  /** Collection slugs to skip entirely. */
  skipCollections?: string[]
}

export interface FeaturesConfig {
  gsap: boolean
  swiper: boolean
  charts: boolean
  livePreview: boolean
  seo: boolean
  redirects: boolean
  search: boolean
  formBuilder: boolean
  nestedDocs: boolean
  importExport: boolean
  auditLog: boolean
}

export interface CollectionsConfig {
  blog: boolean
  caseStudies: boolean
  categories: boolean
  tags: boolean
}

export interface StarterConfig {
  database: DatabaseConfig
  storage: StorageConfig
  cdn?: CdnConfig
  email: EmailConfig
  i18n: I18nConfig
  features: FeaturesConfig
  collections: CollectionsConfig
}
