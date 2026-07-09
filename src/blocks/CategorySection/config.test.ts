import { describe, expect, it } from 'vitest'
import { CategorySectionBlock } from './config'

const names = CategorySectionBlock.fields.map((f) => ('name' in f ? f.name : undefined))

describe('CategorySectionBlock', () => {
  it('has slug category-section', () => expect(CategorySectionBlock.slug).toBe('category-section'))
  it('exposes label, category, accent, limit, viewAllText, hidden', () => {
    for (const n of ['label', 'category', 'accent', 'limit', 'viewAllText', 'hidden']) {
      expect(names).toContain(n)
    }
  })
})
