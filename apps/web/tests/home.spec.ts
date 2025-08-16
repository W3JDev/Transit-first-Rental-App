import { test, expect } from '@playwright/test';

test('home page has title', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('text=Transit Rentals')).toBeVisible();
});
