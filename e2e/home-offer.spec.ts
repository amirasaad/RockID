import { expect, test } from '@playwright/test';

test('home shows market offer messaging near the primary CTA', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByText('Rock ID', { exact: true })).toBeVisible();
  await expect(page.getByText(/identify rocks from a photo/i)).toBeVisible();

  await expect(page.getByText('Take Photo', { exact: true })).toBeVisible();
  await expect(page.getByText('Upload Photo', { exact: true })).toBeVisible();
});
