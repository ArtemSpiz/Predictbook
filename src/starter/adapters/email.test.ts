import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@payloadcms/email-resend', () => ({
  resendAdapter: vi.fn((opts) => ({ __kind: 'resend', opts })),
}))
vi.mock('@payloadcms/email-nodemailer', () => ({
  nodemailerAdapter: vi.fn((opts) => ({ __kind: 'nodemailer', opts })),
}))

import { resolveEmailAdapter } from './email'

const EMAIL_ENV = ['RESEND_API_KEY', 'SMTP_HOST', 'SMTP_USER', 'SMTP_PASSWORD', 'SMTP_PORT', 'SENDGRID_API_KEY']

describe('resolveEmailAdapter', () => {
  const baseCfg = { from: 'test@example.com' as const }

  beforeEach(() => {
    for (const k of EMAIL_ENV) delete process.env[k]
  })

  it('returns console adapter for console provider', async () => {
    const adapter = resolveEmailAdapter({ ...baseCfg, provider: 'console' })
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    await adapter.sendEmail({ to: 'x@y.z', subject: 'hi', html: '<p>body</p>' })
    expect(consoleSpy).toHaveBeenCalled()
    consoleSpy.mockRestore()
  })

  it('returns resend adapter for resend provider', () => {
    process.env.RESEND_API_KEY = 'k'
    const a = resolveEmailAdapter({ ...baseCfg, provider: 'resend' })
    expect((a as { __kind: string }).__kind).toBe('resend')
  })

  it('returns nodemailer adapter for smtp provider', () => {
    process.env.SMTP_HOST = 'h'
    process.env.SMTP_USER = 'u'
    process.env.SMTP_PASSWORD = 'p'
    process.env.SMTP_PORT = '587'
    const a = resolveEmailAdapter({ ...baseCfg, provider: 'smtp' })
    expect((a as { __kind: string }).__kind).toBe('nodemailer')
  })

  it('returns nodemailer adapter for sendgrid provider', () => {
    process.env.SENDGRID_API_KEY = 'k'
    const a = resolveEmailAdapter({ ...baseCfg, provider: 'sendgrid' })
    expect((a as { __kind: string }).__kind).toBe('nodemailer')
  })

  it('throws when resend api key missing', () => {
    expect(() => resolveEmailAdapter({ ...baseCfg, provider: 'resend' })).toThrow(/RESEND_API_KEY/)
  })
})
