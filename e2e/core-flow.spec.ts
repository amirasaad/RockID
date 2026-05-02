import { expect, test } from '@playwright/test';

test('core flow: review → observations → results → save → collection', async ({ page }) => {
  const imageUri = encodeURIComponent('https://example.com/rock.jpg');

  await page.goto(`/review?imageUri=${imageUri}&source=upload&width=1200&height=900`);
  await expect(page.getByText('Review Photo')).toBeVisible();

  await page.getByText('Use Photo').click();
  await expect(page.getByText('Add Details')).toBeVisible();

  await page.getByText('Analyze Rock').click();
  await page.waitForURL('**/results');
  await expect(page.getByText('Results')).toBeVisible();

  await page.getByText('Save Result').click();
  await page.waitForURL('**/saved/**');
  await expect(page.getByText('Saved Find')).toBeVisible();

  await page.getByText('Collection').click();
  await expect(page.getByText('Collection')).toBeVisible();
  await expect(page.getByText('Granite')).toBeVisible();
});
