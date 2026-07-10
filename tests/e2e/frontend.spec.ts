import { test, expect } from '@playwright/test'

test('home renders', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('main')).toBeVisible()
})

test('blog list renders', async ({ page }) => {
  await page.goto('/blog')
  await expect(page.getByRole('heading', { name: 'Blog' })).toBeVisible()
})
