import { describe, expect, it } from 'vitest'
import { ACCENT_VALUES, accentClasses } from './accent'

describe('accentClasses', () => {
  it('returns full literal Tailwind classes for a known accent', () => {
    expect(accentClasses('sports')).toBe(
      'border-cat-sports-border text-cat-sports-text bg-cat-sports-bg',
    )
  })

  it('falls back to politics for an unknown accent', () => {
    expect(accentClasses('nope')).toBe(
      'border-cat-politics-border text-cat-politics-text bg-cat-politics-bg',
    )
  })

  it('exposes all selectable accent values', () => {
    expect(ACCENT_VALUES).toEqual(['politics', 'sports', 'crypto', 'tech', 'science'])
  })
})
