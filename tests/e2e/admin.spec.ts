import { test, expect } from '@playwright/test'

test('admin login page loads', async ({ page }) => {
  await page.goto('/admin')
  await expect(page).toHaveURL(/\/admin/)
  await expect(page.getByText(/login|create.*first.*user/i)).toBeVisible({ timeout: 10000 })
})
