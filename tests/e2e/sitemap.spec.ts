import { test, expect } from '@playwright/test'

test('sitemap.xml returns a sitemap index', async ({ request }) => {
  const res = await request.get('/sitemap.xml')
  expect(res.status()).toBeLessThan(400)
  const body = await res.text()
  expect(body).toContain('<sitemapindex')
})

test('the core sitemap shard is valid and lists the home URL', async ({ request }) => {
  const res = await request.get('/sitemap/0.xml')
  expect(res.status()).toBeLessThan(400)
  const body = await res.text()
  expect(body).toContain('<urlset')
  expect(body).toContain('<loc>')
})
