import { describe, it, expect } from 'vitest'
import { Project } from 'ts-morph'
import { applyI18nCodemod, type CodemodOptions } from './i18n'

function run(source: string, opts: CodemodOptions): string {
  const project = new Project({ useInMemoryFileSystem: true })
  const file = project.createSourceFile('test.ts', source)
  applyI18nCodemod(file, 'pages', opts)
  return file.getFullText()
}

const baseSource = `
import type { CollectionConfig } from 'payload'
export const Pages: CollectionConfig = {
  slug: 'pages',
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', unique: true },
    { name: 'email', type: 'text' },
    { name: 'content', type: 'richText' },
    { name: 'tagsJoin', type: 'text', unique: true },
  ],
}
`

const baseOpts: CodemodOptions = {
  mode: 'add',
  skipFields: [],
  forceFields: [],
  skipCollections: [],
}

describe('applyI18nCodemod', () => {
  it('adds localized: true to text/richText fields not in denylist', () => {
    const result = run(baseSource, baseOpts)
    expect(result).toMatch(/name: 'title'[^}]*localized: true/)
    expect(result).toMatch(/name: 'content'[^}]*localized: true/)
  })

  it('skips fields whose name is in denylist (slug, email)', () => {
    const result = run(baseSource, baseOpts)
    expect(result).not.toMatch(/name: 'slug',[^}]*localized: true/)
    expect(result).not.toMatch(/name: 'email',[^}]*localized: true/)
  })

  it('skips fields with unique: true', () => {
    const result = run(baseSource, baseOpts)
    expect(result).not.toMatch(/name: 'tagsJoin',[^}]*localized: true/)
  })

  it('respects skipFields override (pages.title)', () => {
    const result = run(baseSource, { ...baseOpts, skipFields: ['pages.title'] })
    expect(result).not.toMatch(/name: 'title',[^}]*localized: true/)
  })

  it('respects forceFields override (pages.email)', () => {
    const result = run(baseSource, { ...baseOpts, forceFields: ['pages.email'] })
    expect(result).toMatch(/name: 'email'[^}]*localized: true/)
  })

  it('skips entire collection in skipCollections', () => {
    const result = run(baseSource, { ...baseOpts, skipCollections: ['pages'] })
    expect(result).not.toContain('localized: true')
  })

  it('removes localized: true in remove mode', () => {
    const withLocal = baseSource.replace(
      `type: 'text', required: true`,
      `type: 'text', required: true, localized: true`,
    )
    const result = run(withLocal, { ...baseOpts, mode: 'remove' })
    expect(result).not.toContain('localized: true')
  })
})
