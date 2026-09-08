import { test, expect } from '@playwright/test'
import { login } from '../helpers/login'
import { seedAdmin } from '../helpers/seedUser'

// Requires NODE_ENV=test or TOTP_FORCE_SETUP=false so the seeded admin can log
// in with a password alone (payload-totp forceSetup is otherwise on).
test.describe('admin panel', () => {
  test('logs in and shows the dashboard + stat panel', async ({ page }) => {
    const user = await seedAdmin()
    await login({ page, user })
    await expect(page.locator('.before-dashboard')).toBeVisible()
    await expect(page.getByText('Unread messages')).toBeVisible()
  })

  test('creates a Project from the admin UI', async ({ page }) => {
    const user = await seedAdmin()
    await login({ page, user })
    await page.goto('http://localhost:3000/admin/collections/projects/create')
    await page.fill('#field-title', `E2E Project ${Date.now()}`)
    await page.fill('#field-description', 'Created by the e2e smoke test')
    await page.click('#action-save')
    await expect(page.getByText('successfully')).toBeVisible()
  })
})
