import sharp from 'sharp'
import path from 'path'
import fs from 'fs/promises'

const BLOCKS = [
  'hero',
  'call-to-action',
  'rich-text-block',
  'media-with-text',
  'content-media',
  'text-columns',
  'feature-grid',
  'image-grid',
  'logo-cloud',
  'testimonials',
  'faq',
  'stats',
  'stats-chart',
  'contact-form-block',
]

const dir = path.resolve('public/blocks')
await fs.mkdir(dir, { recursive: true })

for (const slug of BLOCKS) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="120">
    <rect width="100%" height="100%" fill="#f5f5f5" stroke="#ccc"/>
    <text x="50%" y="50%" font-family="sans-serif" font-size="14" fill="#444"
          text-anchor="middle" dominant-baseline="middle">${slug}</text>
  </svg>`
  await sharp(Buffer.from(svg)).png().toFile(path.join(dir, `${slug}.png`))
  console.log('wrote', slug + '.png')
}
