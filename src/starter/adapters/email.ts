import { resendAdapter } from '@payloadcms/email-resend'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import type { EmailAdapter } from 'payload'
import type { EmailConfig } from '../types'

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`${name} is required for email provider`)
  return value
}

export function resolveEmailAdapter(
  config: EmailConfig,
): EmailAdapter | Promise<EmailAdapter> {
  if (config.provider === 'console') {
    // Payload email adapters are factory functions `({ payload }) => { ...sendEmail }`.
    return () => ({
      name: 'console',
      defaultFromAddress: config.from,
      defaultFromName: config.from,
      sendEmail: async (message) => {
        console.log('[email:console]', JSON.stringify(message, null, 2))
        return { accepted: Array.isArray(message.to) ? message.to : [message.to] }
      },
    })
  }

  if (config.provider === 'resend') {
    return resendAdapter({
      apiKey: requireEnv('RESEND_API_KEY'),
      defaultFromAddress: config.from,
      defaultFromName: config.from,
    })
  }

  if (config.provider === 'smtp') {
    return nodemailerAdapter({
      defaultFromAddress: config.from,
      defaultFromName: config.from,
      transportOptions: {
        host: requireEnv('SMTP_HOST'),
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        auth: {
          user: requireEnv('SMTP_USER'),
          pass: requireEnv('SMTP_PASSWORD'),
        },
      },
    })
  }

  if (config.provider === 'sendgrid') {
    return nodemailerAdapter({
      defaultFromAddress: config.from,
      defaultFromName: config.from,
      transportOptions: {
        host: 'smtp.sendgrid.net',
        port: 587,
        auth: {
          user: 'apikey',
          pass: requireEnv('SENDGRID_API_KEY'),
        },
      },
    })
  }

  throw new Error(`Unsupported email provider: ${(config as { provider: string }).provider}`)
}
