import { describe, expect, it } from 'vitest'
import { visibleBlocks } from './RenderBlockList'

const b = (blockType: string, hidden = false) => ({ blockType, hidden })

describe('visibleBlocks', () => {
  it('returns [] for nullish', () => expect(visibleBlocks(null)).toEqual([]))
  it('drops hidden blocks, preserves order', () => {
    expect(visibleBlocks([b('a'), b('b', true), b('c')])).toEqual([b('a'), b('c')])
  })
})
