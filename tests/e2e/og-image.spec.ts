import { test, expect } from '@playwright/test'

test('homepage og:image resolves to a PNG', async ({ request }) => {
  const html = await (await request.get('/')).text()
  const tag = html.match(/<meta[^>]*property="og:image"[^>]*>/)
  expect(tag, 'homepage should emit an og:image meta tag').toBeTruthy()
  const content = tag![0].match(/content="([^"]+)"/)
  expect(content, 'og:image meta tag should have a content attribute').toBeTruthy()
  const img = await request.get(content![1])
  expect(img.status()).toBe(200)
  expect(img.headers()['content-type']).toContain('image/png')
})
