import { describe, expect, it } from 'vitest'
import { AnalysisBlock } from './config'

const names = AnalysisBlock.fields.map((f) => ('name' in f ? f.name : undefined))

describe('AnalysisBlock', () => {
  it('has slug analysis', () => expect(AnalysisBlock.slug).toBe('analysis'))
  it('exposes wrapper fields and hidden', () => {
    for (const n of ['heading', 'subtitle', 'limit', 'viewAllText', 'viewAllUrl', 'hidden']) {
      expect(names).toContain(n)
    }
  })
})
