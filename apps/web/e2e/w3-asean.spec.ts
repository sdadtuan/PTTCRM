import { test, expect } from '@playwright/test';

test.describe('W3 ASEAN', () => {
  test('Thailand playbook WhatsApp and demo CTA', async ({ page }) => {
    await page.goto('/en/markets/th');
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/Thailand/i);
    const wa = page.getByRole('link', { name: 'Chat on WhatsApp' });
    await expect(wa).toHaveAttribute('href', /^https:\/\/wa\.me\/\d+\?text=/);
    await expect(wa).toHaveAttribute('target', '_blank');
    const demo = page.locator('.prose').getByRole('link', { name: 'Request demo' });
    await expect(demo).toHaveAttribute('href', /market=th/);
  });

  test('partners page shows featured partner', async ({ page }) => {
    await page.goto('/en/partners');
    await expect(page.getByRole('heading', { name: 'PO_PARTNER_NAME' })).toBeVisible();
  });

  test('demo form prefills market from query', async ({ page }) => {
    await page.goto('/en/request-demo?market=ph');
    await expect(page.locator('#market_country')).toHaveValue('ph');
  });

  test('markets hub lists four countries', async ({ page }) => {
    await page.goto('/en/markets');
    await expect(page.locator('.resource-tile')).toHaveCount(4);
  });

  test('no RNOSAI on ASEAN pages', async ({ page }) => {
    await page.goto('/en/markets/sg');
    const html = await page.content();
    expect(html).not.toMatch(/RNOSAI/);
  });
});
