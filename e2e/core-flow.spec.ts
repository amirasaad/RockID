import { expect, test } from '@playwright/test';

test('core flow: review → observations → results → save', async ({ page }) => {
  const imageUri = encodeURIComponent('https://example.com/rock.jpg');

  await page.goto(`/review?imageUri=${imageUri}&source=upload&width=1200&height=900`);
  await expect(page.getByRole('heading', { name: 'Review Photo' })).toBeVisible();

  await page.getByText('Use Photo', { exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Add Details' })).toBeVisible();

  await page.getByText('Analyze Rock', { exact: true }).click();
  await page.waitForURL('**/results');
  await expect(page.getByRole('heading', { name: 'Results' })).toBeVisible();

  await page.getByText('Save Result', { exact: true }).click();
  await page.waitForURL('**/saved/**');
  await expect(page.getByRole('heading', { name: 'Saved Find' })).toBeVisible();
  await expect(page.getByText('Saved Metadata', { exact: true })).toBeVisible();
  await expect(page.getByText('Local saved find', { exact: true })).toBeVisible();
});
