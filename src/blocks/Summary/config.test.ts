import { describe, expect, it } from 'vitest'
import { SummaryBlock } from './config'
import { RealCardBlock } from '../RealCard/config'

const hasHidden = (b: typeof SummaryBlock) =>
  b.fields.some((f) => 'name' in f && f.name === 'hidden')

describe('Summary/RealCard blocks', () => {
  it('Summary block has a hidden toggle', () => expect(hasHidden(SummaryBlock)).toBe(true))
  it('RealCard block has a hidden toggle', () => expect(hasHidden(RealCardBlock)).toBe(true))
})
