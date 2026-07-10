import { test, expect } from '@playwright/test'

const pages: [string, string][] = [
  ['/signals', 'Signals'],
  ['/live-feed', 'Live Feed'],
  ['/news', 'Analysis'],
  ['/about', 'About Predictbook'],
  ['/contact', 'Contact'],
]

for (const [path, marker] of pages) {
  test(`renders ${path}`, async ({ page }) => {
    await page.goto(path)
    await expect(page.getByText(marker, { exact: false }).first()).toBeVisible()
  })
}

test('about rail renders live feed + promo blocks', async ({ page }) => {
  await page.goto('/about')
  await expect(page.getByText('Want signals in real time', { exact: false })).toBeVisible()
})

test('contact form submits to /api/contact', async ({ page }) => {
  await page.goto('/contact')
  await page.locator('#fullName').fill('E2E Tester')
  await page.locator('#email').fill('e2e@example.com')
  await page.locator('#subject').selectOption({ index: 1 })
  await page.locator('#message').fill('Automated end-to-end submission check.')
  await page.getByRole('button', { name: /send message/i }).click()
  // ContactCard flips status to 'sent' on a 2xx from POST /api/contact
  await expect(page.getByText('Message sent successfully')).toBeVisible({ timeout: 10_000 })
})
