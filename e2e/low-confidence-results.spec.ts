import { expect, test } from '@playwright/test';

test('low-confidence results emphasize uncertainty and route Add Another Photo to capture tips', async ({ page }) => {
  await page.goto('/results');
  await expect(page.getByRole('heading', { name: 'Results' })).toBeVisible();
  await expect(page.getByText(/mocked data/i)).toHaveCount(0);

  await expect(page.getByText(/low confidence/i)).toBeVisible();
  await expect(page.getByText(/from one photo/i)).toBeVisible();
  await expect(page.getByText(/add another photo/i)).toBeVisible();

  await expect(page.getByText('Useful', { exact: true })).toBeVisible();
  await expect(page.getByText('Save Result', { exact: true })).toBeVisible();

  await page.getByText('Add Another Photo', { exact: true }).click();
  await page.waitForURL('**/capture-tips');
  await expect(page.getByRole('heading', { name: 'Before You Snap' })).toBeVisible();
});
