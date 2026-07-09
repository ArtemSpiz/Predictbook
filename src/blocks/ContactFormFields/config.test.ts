import { describe, expect, it } from 'vitest'
import { ContactFormFieldsBlock } from './config'
import { ContactMethodsBlock } from '../ContactMethods/config'
import { ContactValueBlock } from '../ContactValue/config'

describe('ContactFormFieldsBlock', () => {
  const names = ContactFormFieldsBlock.fields.map((f) => ('name' in f ? f.name : undefined))

  it('has slug contact-form-fields', () =>
    expect(ContactFormFieldsBlock.slug).toBe('contact-form-fields'))
  it('exposes wrapper fields and hidden', () => {
    for (const n of [
      'heading',
      'subtitle',
      'subjectOptions',
      'nameLabel',
      'emailLabel',
      'subjectLabel',
      'messageLabel',
      'buttonText',
      'hidden',
    ]) {
      expect(names).toContain(n)
    }
  })
})

describe('ContactMethodsBlock', () => {
  const names = ContactMethodsBlock.fields.map((f) => ('name' in f ? f.name : undefined))

  it('has slug contact-methods', () => expect(ContactMethodsBlock.slug).toBe('contact-methods'))
  it('exposes heading, methods, socials, hidden', () => {
    for (const n of ['heading', 'methods', 'socials', 'hidden']) {
      expect(names).toContain(n)
    }
  })
})

describe('ContactValueBlock', () => {
  const names = ContactValueBlock.fields.map((f) => ('name' in f ? f.name : undefined))

  it('has slug contact-value', () => expect(ContactValueBlock.slug).toBe('contact-value'))
  it('exposes title, text, buttonText, hidden', () => {
    for (const n of ['title', 'text', 'buttonText', 'hidden']) {
      expect(names).toContain(n)
    }
  })
})
