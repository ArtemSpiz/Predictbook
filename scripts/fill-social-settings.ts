#!/usr/bin/env tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * One-off, idempotent backfill: populate SiteSettings.social after social links
 * moved out of the Header/Footer globals. Reuses existing icon media (tg.webp /
 * x.webp) so it does not create duplicate uploads. Safe to run against prod:
 * it no-ops when SiteSettings.social is already set.
 *
 *   pnpm dlx tsx --env-file=.env scripts/fill-social-settings.ts
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { getPayload } from 'payload'
import config from '../src/payload.config'
import { uploadIconWebp } from './lib/uploadIcon'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PUBLIC = path.resolve(__dirname, '../public')

const SOCIALS = [
  { pngName: 'tg.png', alt: 'Telegram', url: 'https://t.me/predictbook' },
  { pngName: 'x.png', alt: 'X', url: 'https://x.com/predictbook' },
]

async function main() {
  const payload = await getPayload({ config })

  const current = (await payload.findGlobal({ slug: 'site-settings' })) as any
  if (Array.isArray(current.social) && current.social.length > 0) {
    console.log(`[fill-social] SiteSettings.social already has ${current.social.length} item(s) — skipping.`)
    process.exit(0)
  }

  const social = []
  for (const s of SOCIALS) {
    if (!fs.existsSync(path.join(PUBLIC, s.pngName))) {
      console.warn(`[fill-social] missing source icon public/${s.pngName} — skipping ${s.alt}`)
      continue
    }
    social.push({ icon: await uploadIconWebp(payload, PUBLIC, s.pngName, s.alt), url: s.url })
  }

  await payload.updateGlobal({ slug: 'site-settings', data: { social } as any })
  console.log(`[fill-social] set SiteSettings.social with ${social.length} link(s).`)
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
