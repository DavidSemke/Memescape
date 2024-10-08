import { test, expect } from '@playwright/test';

// create private meme and view it under memes, then fail to view it publicly
// create 2 public memes; search for one privately such that the other is not shown, then search for the other one publicly such that the other other is not shown
// add bookmark and view it under bookmarks
// change username and view new username displayed

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});
