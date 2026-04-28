import { describe, it, expect } from 'vitest'
import { slugField } from './slug'

describe('slugField', () => {
  it('returns a Field with hooks', () => {
    const field = slugField('title') as { name: string; hooks?: { beforeValidate?: unknown[] } }
    expect(field.name).toBe('slug')
    expect(field.hooks?.beforeValidate).toHaveLength(1)
  })
})
