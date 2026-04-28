import { test, expect } from '@playwright/test'

test('sitemap.xml returns 200', async ({ request }) => {
  const res = await request.get('/sitemap.xml')
  expect(res.status()).toBeLessThan(400)
})
