import { test as base, expect } from '@playwright/test'
import { ElectronApplication, Page, _electron as electron } from 'playwright'
import path from 'path'

interface ElectronFixtures {
  electronApp: ElectronApplication
  page: Page
}

/**
 * Helper to open app in tests
 */
export const test = base.extend<ElectronFixtures>({
  electronApp: async ({}, use) => {
    const app = await electron.launch({
      args: [path.join(process.cwd(), 'dist-electron/main.js')],
    })

    await use(app)
    await app.close()
  },
  page: async ({ electronApp }, use) => {
    const page = await electronApp.firstWindow()
    await page.waitForLoadState('domcontentloaded')
    await use(page)
  },
})

export { expect }
