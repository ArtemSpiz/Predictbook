import { describe, expect, it } from 'vitest'
import { BlogListBlock } from './config'

const names = BlogListBlock.fields.map((f) => ('name' in f ? f.name : undefined))

describe('BlogListBlock', () => {
  it('has slug blog-list', () => expect(BlogListBlock.slug).toBe('blog-list'))
  it('exposes wrapper fields and hidden', () => {
    for (const n of ['heading', 'subtitle', 'categories', 'limit', 'hidden']) {
      expect(names).toContain(n)
    }
  })
})
