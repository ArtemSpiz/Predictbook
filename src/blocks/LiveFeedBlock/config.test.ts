import { describe, expect, it } from 'vitest'
import { LiveFeedBlock } from './config'

const names = LiveFeedBlock.fields.map((f) => ('name' in f ? f.name : undefined))

describe('LiveFeedBlock', () => {
  it('has slug live-feed-block', () => expect(LiveFeedBlock.slug).toBe('live-feed-block'))
  it('exposes wrapper fields and hidden', () => {
    for (const n of ['heading', 'limit', 'viewAllText', 'viewAllUrl', 'hidden']) {
      expect(names).toContain(n)
    }
  })
})
