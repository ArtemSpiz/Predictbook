import { describe, expect, it } from 'vitest'
import { SignalFeedBlock } from './config'

const names = SignalFeedBlock.fields.map((f) => ('name' in f ? f.name : undefined))

describe('SignalFeedBlock', () => {
  it('has slug signal-feed', () => {
    expect(SignalFeedBlock.slug).toBe('signal-feed')
  })
  it('exposes the editable wrapper fields and hidden toggle', () => {
    for (const n of ['heading', 'kind', 'delayLabel', 'limit', 'viewAllText', 'viewAllUrl', 'hidden']) {
      expect(names).toContain(n)
    }
  })
})
