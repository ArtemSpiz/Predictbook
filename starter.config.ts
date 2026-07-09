import { defineStarterConfig } from './src/starter/define'
import type { StorageProvider } from './src/starter/types'

// Local dev stays on the filesystem; production sets STORAGE_PROVIDER=s3 (R2).
const storageProvider = (process.env.STORAGE_PROVIDER as StorageProvider) || 'local'

export default defineStarterConfig({
  database: { provider: 'mongodb' },
  storage: { provider: storageProvider },
  cdn: { url: process.env.NEXT_PUBLIC_CDN_URL },
  email: { provider: 'console', from: 'noreply@example.com' },
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
    skipFields: [],
    forceFields: [],
    skipCollections: [],
  },
  features: {
    gsap: false,
    swiper: true,
    charts: true,
    livePreview: true,
    seo: true,
    redirects: true,
    search: true,
    formBuilder: true,
    nestedDocs: true,
    importExport: true,
    auditLog: false,
  },
  collections: {
    blog: true,
    caseStudies: true,
    categories: true,
    tags: true,
  },
})
