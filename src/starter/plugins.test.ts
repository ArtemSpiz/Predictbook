import { describe, it, expect, vi } from 'vitest'

vi.mock('@payloadcms/plugin-seo', () => ({ seoPlugin: vi.fn(() => ({ __k: 'seo' })) }))
vi.mock('@payloadcms/plugin-redirects', () => ({ redirectsPlugin: vi.fn(() => ({ __k: 'redirects' })) }))
vi.mock('@payloadcms/plugin-search', () => ({ searchPlugin: vi.fn(() => ({ __k: 'search' })) }))
vi.mock('@payloadcms/plugin-form-builder', () => ({ formBuilderPlugin: vi.fn(() => ({ __k: 'form' })) }))
vi.mock('@payloadcms/plugin-nested-docs', () => ({ nestedDocsPlugin: vi.fn(() => ({ __k: 'nested' })) }))
vi.mock('@payloadcms/plugin-import-export', () => ({ importExportPlugin: vi.fn(() => ({ __k: 'ie' })) }))

import { buildPlugins } from './plugins'

const allOn = {
  gsap: false,
  swiper: false,
  charts: false,
  livePreview: false,
  auditLog: false,
  seo: true,
  redirects: true,
  search: true,
  formBuilder: true,
  nestedDocs: true,
  importExport: true,
}

describe('buildPlugins', () => {
  it('includes all plugins when all toggles are on', () => {
    const plugins = buildPlugins(allOn)
    const kinds = plugins.map((p) => (p as unknown as { __k: string }).__k)
    expect(kinds).toEqual(expect.arrayContaining(['seo', 'redirects', 'search', 'form', 'nested', 'ie']))
  })

  it('omits a plugin when its toggle is off', () => {
    const plugins = buildPlugins({ ...allOn, seo: false, search: false })
    const kinds = plugins.map((p) => (p as unknown as { __k: string }).__k)
    expect(kinds).not.toContain('seo')
    expect(kinds).not.toContain('search')
    expect(kinds).toContain('redirects')
  })
})
