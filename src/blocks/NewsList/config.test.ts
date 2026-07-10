import { describe, expect, it } from 'vitest'
import { NewsListBlock } from './config'

const names = NewsListBlock.fields.map((f) => ('name' in f ? f.name : undefined))

describe('NewsListBlock', () => {
  it('has slug news-list', () => expect(NewsListBlock.slug).toBe('news-list'))
  it('exposes wrapper fields and hidden', () => {
    for (const n of ['heading', 'subtitle', 'categories', 'limit', 'hidden']) {
      expect(names).toContain(n)
    }
  })
})
