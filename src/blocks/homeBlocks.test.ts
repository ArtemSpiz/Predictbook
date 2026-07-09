import { describe, expect, it } from 'vitest'
import { planRegion } from './homeBlocks'

const b = (blockType: string, hidden = false) => ({ blockType, hidden })

describe('planRegion', () => {
  it('returns [] for empty/nullish input', () => {
    expect(planRegion([], 'signal-feed')).toEqual([])
    expect(planRegion(null, 'signal-feed')).toEqual([])
  })

  it('drops hidden blocks', () => {
    expect(planRegion([b('summary', true)], 'signal-feed')).toEqual([])
  })

  it('wraps a non-group block as single', () => {
    expect(planRegion([b('summary')], 'signal-feed')).toEqual([
      { kind: 'single', block: b('summary') },
    ])
  })

  it('merges consecutive group-type blocks into one group', () => {
    const res = planRegion([b('signal-feed'), b('signal-feed'), b('summary')], 'signal-feed')
    expect(res).toEqual([
      { kind: 'group', blocks: [b('signal-feed'), b('signal-feed')] },
      { kind: 'single', block: b('summary') },
    ])
  })

  it('starts a new group when the run is interrupted', () => {
    const res = planRegion([b('signal-feed'), b('summary'), b('signal-feed')], 'signal-feed')
    expect(res.map((s) => s.kind)).toEqual(['group', 'single', 'group'])
  })
})
