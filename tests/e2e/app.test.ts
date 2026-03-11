import { test, expect } from './helpers/electron'

test.describe('Navigation', () => {
  test('opens HomePage', async ({ page }) => {
    await expect(page.getByText('Treine seu ouvido musical')).toBeVisible()
    await expect(page.getByText('Intervalos')).toBeVisible()
    await expect(page.getByText('Acordes')).toBeVisible()
    await expect(page.getByText('Progressões')).toBeVisible()
  })

  test('navigates to HistoryPage', async ({ page }) => {
    await page.getByText('Histórico').click()
    await expect(page.getByText('Sessões anteriores')).toBeVisible()
  })

  test('returns to HomePage from HistoryPage', async ({ page }) => {
    await page.getByText('Histórico').click()
    await page.getByText('← Voltar').click()
    await expect(page.getByText('Escolha um modo')).toBeVisible()
  })
})

test.describe('Exercises', () => {
  test('starts interval exercises', async ({ page }) => {
    await page.getByText('Intervalos').click()
    await expect(page.getByText('1 / 10')).toBeVisible()
    await expect(page.getByText('Toque para ouvir novamente')).toBeVisible()
  })

  test('exhibits 4 answer options in Intervals exercises', async ({ page }) => {
    await page.getByText('Intervalos').click()
    const options = page.locator('button.btn-ghost')
    await expect(options).toHaveCount(4)
  })

  test('exiting Exercise page goes to HomePage', async ({ page }) => {
    await page.getByText('Intervalos').click()
    await page.getByText('← Sair').click()
    await expect(page.getByText('Escolha um modo')).toBeVisible()
  })
})
