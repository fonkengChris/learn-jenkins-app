// @ts-check
const { test, expect } = require('@playwright/test');

test('has title', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Learn Jenkins/);
});

test('has Jenkins in the body', async ({ page }) => {
  await page.goto('/');

  const isVisible = await page.locator('a:has-text("Learn Jenkins on Udemy")').isVisible();
  expect(isVisible).toBeTruthy();
});

test('has expected app version', async ({ page }) => {
  await page.goto('/');

  const { env } = require('process');
  const expectedAppVersion = env.REACT_APP_VERSION ? env.REACT_APP_VERSION : '1';

  console.log(expectedAppVersion);

  const isVisible = await page.locator(`p:has-text("Application version: ${expectedAppVersion}")`).isVisible();
  expect(isVisible).toBeTruthy();
});
