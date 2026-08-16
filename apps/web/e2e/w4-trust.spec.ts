import { test, expect } from '@playwright/test';

test.describe('W4 Trust & Status', () => {
  test('trust center shows Singapore residency and status link', async ({ page }) => {
    await page.goto('/en/trust');
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/Trust/i);
    await expect(page.getByText('Singapore (AWS ap-southeast-1)')).toBeVisible();
    await expect(page.locator('.prose').getByRole('link', { name: /System status/i })).toHaveAttribute(
      'href',
      '/en/status',
    );
    await expect(page.getByRole('link', { name: /View SOC 2 Type I report/i })).toHaveCount(0);
  });

  test('subprocessors table loads', async ({ page }) => {
    await page.goto('/en/trust/subprocessors');
    await expect(page.getByRole('columnheader', { name: 'Name' })).toBeVisible();
    await expect(page.getByText('Stripe, Inc.')).toBeVisible();
  });

  test('status page shows SLA 99.9% with mocked API', async ({ page }) => {
    await page.route('**/api/v1/public/gtm/status', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          updated_at: '2026-08-16T07:00:00.000Z',
          sla_target_pct: 99.9,
          components: [
            { id: 'marketing_site', name: 'Marketing site', status: 'operational', region: 'Global CDN' },
            { id: 'demo_api', name: 'Demo API', status: 'operational', region: 'Singapore' },
          ],
        }),
      });
    });
    await page.goto('/en/status');
    await expect(page.locator('.prose').getByText('99.9%', { exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Marketing site' })).toBeVisible();
    await expect(page.locator('.resource-tile').first()).toContainText('Operational');
  });

  test('no RNOSAI on trust pages', async ({ page }) => {
    await page.goto('/en/trust');
    expect(await page.content()).not.toMatch(/RNOSAI/);
  });
});
