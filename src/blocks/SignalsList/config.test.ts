import { describe, expect, it } from 'vitest'
import { SignalsListBlock } from './config'

const names = SignalsListBlock.fields.map((f) => ('name' in f ? f.name : undefined))

describe('SignalsListBlock', () => {
  it('has slug signals-list', () => expect(SignalsListBlock.slug).toBe('signals-list'))
  it('exposes wrapper fields and hidden', () => {
    for (const n of ['heading', 'subtitle', 'delayText', 'limit', 'hidden']) {
      expect(names).toContain(n)
    }
  })
})
