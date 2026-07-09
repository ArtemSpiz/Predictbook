import { test, expect } from '@playwright/test'

test.describe('home page blocks', () => {
  test('renders sidebar and main region blocks', async ({ page }) => {
    await page.goto('/')
    // Sidebar signal feeds
    await expect(page.getByText('Whale Alert', { exact: false }).first()).toBeVisible()
    await expect(page.getByText('Arbitrage Alert', { exact: false }).first()).toBeVisible()
    // Main region
    await expect(page.getByText('Analysis', { exact: false }).first()).toBeVisible()
    await expect(page.getByText('Live Feed', { exact: false }).first()).toBeVisible()
  })

  test('promo card CTA is present and editable-sourced', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Want signals in real time?', { exact: false })).toBeVisible()
  })
})
