import { describe, expect, it } from 'vitest'
import { SponsoredCardBlock } from './config'

const names = SponsoredCardBlock.fields.map((f) => ('name' in f ? f.name : undefined))

describe('SponsoredCardBlock', () => {
  it('has slug sponsored-card', () => expect(SponsoredCardBlock.slug).toBe('sponsored-card'))
  it('exposes heading, infoIcon, sponsors, footerText and hidden', () => {
    for (const n of ['heading', 'infoIcon', 'sponsors', 'footerText', 'hidden']) {
      expect(names).toContain(n)
    }
  })
})
