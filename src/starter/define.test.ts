import { describe, expect, it, expectTypeOf } from 'vitest'
import { defineStarterConfig } from './define'
import type { StarterConfig } from './types'

describe('defineStarterConfig', () => {
  it('returns the input unchanged at runtime', () => {
    const config = defineStarterConfig({
      database: { provider: 'sqlite' },
      storage: { provider: 'local' },
      email: { provider: 'console', from: 'test@example.com' },
      i18n: { locales: ['en'], defaultLocale: 'en' },
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
      collections: { blog: true, categories: true, tags: true },
    })
    expect(config.database.provider).toBe('sqlite')
    expectTypeOf(config).toEqualTypeOf<StarterConfig>()
  })
})
