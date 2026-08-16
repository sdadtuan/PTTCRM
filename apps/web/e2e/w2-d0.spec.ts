import { test, expect } from '@playwright/test';

test.describe('W2 D0', () => {
  test('EN pricing shows USD when flag on', async ({ page }) => {
    test.skip(process.env.NEXT_PUBLIC_USD_PRICE !== '1', 'USD flag off in build');
    await page.goto('/en/pricing');
    await expect(page.getByText('$199')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Pay setup (test)' }).first()).toBeVisible();
  });

  test('resources hub links news', async ({ page }) => {
    await page.goto('/vi/tai-nguyen');
    await page.locator('.resource-tile').filter({ hasText: 'Tin tức' }).click();
    await expect(page).toHaveURL(/\/vi\/tin-tuc/);
  });

  test('cookie bar links DPA on EN home', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.removeItem('ptt_consent');
    });
    await page.goto('/en');
    await expect(page.locator('.cookie-bar')).toBeVisible();
    await expect(page.locator('.cookie-bar').getByRole('link', { name: /Data Processing Agreement/i })).toBeVisible();
  });

  test('DPA PDF is reachable', async ({ request }) => {
    const res = await request.get('/legal/pttcrm-dpa-en.pdf');
    expect(res.status()).toBe(200);
    expect(res.headers()['content-type']).toContain('pdf');
  });
});
