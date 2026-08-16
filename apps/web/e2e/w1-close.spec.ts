import { test, expect } from '@playwright/test';

test('customers page withholds unverified metrics', async ({ page }) => {
  await page.goto('/vi/khach-hang');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Khách hàng');
  await expect(page.getByText(/không hiển thị CPL\/ROAS/i).first()).toBeVisible();
  await expect(page.locator('.case-metrics')).toHaveCount(0);
});

test('education demo prefill', async ({ page }) => {
  await page.goto('/vi/giai-phap/education');
  await page.locator('main').getByRole('link', { name: /Đăng ký Demo/i }).click();
  await expect(page.locator('#industry')).toHaveValue('education');
  await expect(page.locator('#sku_interest')).toHaveValue('ind');
});
