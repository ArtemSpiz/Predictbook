import { test, expect } from '@playwright/test'

test('homepage og:image resolves to a PNG', async ({ request }) => {
  const html = await (await request.get('/')).text()
  const m = html.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/)
  expect(m, 'homepage should emit an og:image meta tag').toBeTruthy()
  const img = await request.get(m![1])
  expect(img.status()).toBe(200)
  expect(img.headers()['content-type']).toContain('image/png')
})
