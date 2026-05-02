import { expect, test } from '@playwright/test';

test('low-confidence results emphasize uncertainty and route Add Another Photo to capture tips', async ({ page }) => {
  const imageUri = encodeURIComponent('https://example.com/rock.jpg');

  await page.goto(`/review?imageUri=${imageUri}&source=upload&width=1200&height=900`);
  await page.getByText('Use Photo', { exact: true }).click();
  await page.getByText('Analyze Rock', { exact: true }).click();
  await page.waitForURL('**/results');

  await expect(page.getByText('Low confidence', { exact: true })).toBeVisible();
  await expect(
    page.getByText('One photo may not be enough. Add another photo to improve confidence before saving.', { exact: true })
  ).toBeVisible();

  await expect(page.getByText('Useful', { exact: true })).toBeVisible();
  await expect(page.getByText('Save Result', { exact: true })).toBeVisible();

  await page.getByText('Add Another Photo', { exact: true }).click();
  await page.waitForURL('**/capture-tips');
  await expect(page.getByRole('heading', { name: 'Before You Snap' })).toBeVisible();
});
