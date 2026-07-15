#!/usr/bin/env tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * One-off migration for the /news → /analysis, /live-feed → /live URL rename.
 * Rewrites custom link urls stored in the header/footer/home-page globals
 * (code changes alone don't touch DB content). Safe to re-run.
 *
 * Usage: cross-env NODE_OPTIONS=--no-deprecation tsx --env-file=.env scripts/migrate-analysis-urls.ts
 */
import { getPayload } from 'payload'
import config from '../src/payload.config'

function migrateUrl(url: string): string {
  if (url === '/news') return '/analysis'
  if (url.startsWith('/news/category/')) return url.replace('/news/category/', '/analysis/')
  if (url.startsWith('/news/')) return url.replace('/news/', '/analysis/')
  if (url === '/live-feed') return '/live'
  if (url.startsWith('/live-feed/')) return url.replace('/live-feed/', '/live/')
  return url
}

let changes = 0

/** Recursively rewrite every string value under url/viewAllUrl/href keys. */
function rewrite(node: any): any {
  if (Array.isArray(node)) return node.map(rewrite)
  if (node && typeof node === 'object') {
    const out: any = {}
    for (const [key, value] of Object.entries(node)) {
      if (['url', 'viewAllUrl', 'href'].includes(key) && typeof value === 'string') {
        const next = migrateUrl(value)
        if (next !== value) {
          changes++
          console.log(`  ${key}: ${value} → ${next}`)
        }
        out[key] = next
      } else {
        out[key] = rewrite(value)
      }
    }
    return out
  }
  return node
}

async function main() {
  const payload = await getPayload({ config })

  for (const slug of ['header', 'footer', 'home-page'] as const) {
    console.log(`Global: ${slug}`)
    const data = await payload.findGlobal({ slug, depth: 0 })
    const before = changes
    const migrated = rewrite(data)
    if (changes > before) {
      await payload.updateGlobal({ slug, data: migrated })
      console.log(`  updated (${changes - before} link(s))`)
    } else {
      console.log('  no changes')
    }
  }

  console.log(`Done. ${changes} link(s) migrated.`)
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
