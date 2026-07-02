/* eslint-disable no-console */
/**
 * Lighthouse performance/SEO baseline runner.
 *
 * Usage:
 *   pnpm build && pnpm start      # in one terminal (or point BASE_URL elsewhere)
 *   pnpm lighthouse               # in another
 *
 * Runs mobile Lighthouse audits against a set of paths and prints a summary
 * table (Performance / Accessibility / Best-Practices / SEO + core web vitals).
 * Requires the `lighthouse` dev dependency and a local Chrome/Chromium.
 */
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

const run = promisify(execFile)

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'
const PATHS = (process.env.LH_PATHS || '/,/blog,/case-studies').split(',').map((p) => p.trim())

type Summary = {
  path: string
  performance: number
  accessibility: number
  bestPractices: number
  seo: number
  lcp?: string
  cls?: string
  tbt?: string
}

async function audit(path: string): Promise<Summary | null> {
  const url = `${BASE_URL}${path}`
  try {
    const { stdout } = await run(
      'lighthouse',
      [
        url,
        '--quiet',
        '--output=json',
        '--only-categories=performance,accessibility,best-practices,seo',
        '--form-factor=mobile',
        '--screenEmulation.mobile',
        '--chrome-flags=--headless=new --no-sandbox',
      ],
      { maxBuffer: 64 * 1024 * 1024 },
    )
    const lhr = JSON.parse(stdout)
    const pct = (id: string) => Math.round((lhr.categories[id]?.score ?? 0) * 100)
    const audits = lhr.audits ?? {}
    return {
      path,
      performance: pct('performance'),
      accessibility: pct('accessibility'),
      bestPractices: pct('best-practices'),
      seo: pct('seo'),
      lcp: audits['largest-contentful-paint']?.displayValue,
      cls: audits['cumulative-layout-shift']?.displayValue,
      tbt: audits['total-blocking-time']?.displayValue,
    }
  } catch (e) {
    console.error(`[lighthouse] failed for ${url}:`, (e as Error).message)
    return null
  }
}

async function main() {
  console.log(`Lighthouse baseline against ${BASE_URL}\n`)
  const results: Summary[] = []
  for (const path of PATHS) {
    console.log(`→ auditing ${path} ...`)
    const s = await audit(path)
    if (s) results.push(s)
  }

  if (results.length === 0) {
    console.error('No successful audits. Is the server running at BASE_URL?')
    process.exit(1)
  }

  console.log('\n| Path | Perf | A11y | BP | SEO | LCP | CLS | TBT |')
  console.log('|------|------|------|----|-----|-----|-----|-----|')
  for (const r of results) {
    console.log(
      `| ${r.path} | ${r.performance} | ${r.accessibility} | ${r.bestPractices} | ${r.seo} | ${r.lcp ?? '-'} | ${r.cls ?? '-'} | ${r.tbt ?? '-'} |`,
    )
  }
}

void main()
