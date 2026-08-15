import { test, expect } from '@playwright/test';

test('customers page shows signed metrics only', async ({ page }) => {
  await page.goto('/vi/khach-hang');
  await expect(page.locator('.case-metrics').first()).toContainText('CPL');
  await expect(page.locator('.case-metrics').first()).toContainText('ROAS');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Khách hàng');
});

test('education demo prefill', async ({ page }) => {
  await page.goto('/vi/giai-phap/education');
  await page.locator('main').getByRole('link', { name: /Đăng ký Demo/i }).click();
  await expect(page.locator('#industry')).toHaveValue('education');
  await expect(page.locator('#sku_interest')).toHaveValue('ind');
});
