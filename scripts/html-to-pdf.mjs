#!/usr/bin/env node
import { chromium } from 'playwright'
import { fileURLToPath, pathToFileURL } from 'node:url'
import path from 'node:path'
import { existsSync } from 'node:fs'

const [, , inputArg, outputArg] = process.argv
if (!inputArg || !outputArg) {
  console.error('Usage: node scripts/html-to-pdf.mjs <input.html> <output.pdf>')
  process.exit(1)
}

const input = path.resolve(process.cwd(), inputArg)
const output = path.resolve(process.cwd(), outputArg)

if (!existsSync(input)) {
  console.error(`Input file not found: ${input}`)
  process.exit(1)
}

const browser = await chromium.launch({ channel: 'chrome' })
const page = await browser.newPage()
await page.goto(pathToFileURL(input).href, { waitUntil: 'networkidle' })
await page.pdf({
  path: output,
  format: 'A4',
  printBackground: true,
  margin: { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' },
})
await browser.close()

console.log(`PDF generated: ${output}`)
