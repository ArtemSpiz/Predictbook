import { test, expect } from '@playwright/test'

test('home renders', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('main')).toBeVisible()
})

test('news list renders', async ({ page }) => {
  await page.goto('/news')
  await expect(page.getByRole('heading', { name: 'News' })).toBeVisible()
})
