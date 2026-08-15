import { test, expect } from '@playwright/test';

test('home VI no sku cards and has demo cta', async ({ page }) => {
  await page.goto('/vi');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Một nền tảng');
  await expect(page.getByRole('link', { name: /Đăng ký Demo/i }).first()).toBeVisible();
  await expect(page.locator('text=4.900.000')).toHaveCount(0);
});

test('locale switch pricing', async ({ page }) => {
  await page.goto('/vi/bang-gia');
  await page.locator('.locale a').filter({ hasText: 'EN' }).click();
  await expect(page).toHaveURL(/\/en\/pricing/);
  await expect(page.locator('body')).not.toContainText('199');
});

test('news draft 404', async ({ page }) => {
  await page.goto('/vi/tin-tuc/__draft_missing__');
  await expect(page.getByRole('heading', { name: '404' })).toBeVisible();
});
