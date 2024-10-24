import { test, expect } from '@playwright/test'

test('sends a chat message', async ({ page }) => {
  await page.goto('/')

  // 1. Sign in.
  await page
    .getByRole('button', { name: 'Randomize' })
    .click()
  await page
    .getByRole('button', { name: 'Join chat' })
    .click()
  await page
    .getByText('Log out')
    .waitFor({ state: 'visible' })

  // 2. Send the message.
  await page
    .getByLabel('Chat message')
    .fill('Hello world')
  await page
    .getByRole('button', { name: 'Send' })
    .click()

  // 3. Assert the message in the UI.
  await expect(
    page.getByRole('log'),
  ).toContainText('Hello world')
})
