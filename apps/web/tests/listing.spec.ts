import { test, expect } from '@playwright/test';

test('listing page shows price', async ({ page }) => {
  await page.goto('/listing/1');
  await expect(page.locator('text=Price')).toBeVisible();
});
