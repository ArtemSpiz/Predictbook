import { defineStarterConfig } from './src/starter/define'

export default defineStarterConfig({
  database: { provider: 'mongodb' },
  storage: { provider: 'local' },
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
