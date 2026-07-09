import { describe, expect, it } from 'vitest'
import { LiveFeedListBlock } from './config'

const names = LiveFeedListBlock.fields.map((f) => ('name' in f ? f.name : undefined))

describe('LiveFeedListBlock', () => {
  it('has slug live-feed-list', () => expect(LiveFeedListBlock.slug).toBe('live-feed-list'))
  it('exposes wrapper fields and hidden', () => {
    for (const n of ['heading', 'subtitle', 'limit', 'hidden']) {
      expect(names).toContain(n)
    }
  })
})
