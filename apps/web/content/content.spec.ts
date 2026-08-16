import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';
import { showUsdPrices } from '../src/lib/pricing-env';
import { MARKET_SLUGS, getMarketPlaybook } from '../src/lib/market-content';

const root = join(__dirname);

describe('content contract', () => {
  test('no RNOSAI and no trial CTA in content', () => {
    for (const loc of ['vi', 'en']) {
      for (const f of readdirSync(join(root, loc))) {
        const path = join(root, loc, f);
        if (statSync(path).isDirectory()) continue;
        const raw = readFileSync(path, 'utf8');
        expect(raw).not.toMatch(/RNOSAI/);
        expect(raw.toLowerCase()).not.toMatch(/30 ngày|30-day trial|dùng thử 30/);
      }
    }
    for (const slug of MARKET_SLUGS) {
      const raw = readFileSync(join(root, 'en/markets', `${slug}.json`), 'utf8');
      expect(raw).not.toMatch(/RNOSAI/);
    }
  });

  test('ASEAN market JSON matches slug', () => {
    for (const slug of MARKET_SLUGS) {
      const content = getMarketPlaybook(slug);
      expect(content?.market).toBe(slug);
    }
  });

  test('VI pricing amounts match list price v1', () => {
    const p = JSON.parse(readFileSync(join(root, 'vi/pricing.json'), 'utf8'));
    expect(p.skus.find((s: { id: string }) => s.id === 'mkt').retainer_vnd).toBe(4900000);
    expect(p.skus.find((s: { id: string }) => s.id === 'ind').retainer_vnd).toBe(9900000);
    expect(p.skus.find((s: { id: string }) => s.id === 'agy').retainer_vnd).toBe(19900000);
  });

  test('EN pricing USD in JSON; UI gated by env flag', () => {
    const p = JSON.parse(readFileSync(join(root, 'en/pricing.json'), 'utf8'));
    expect(p.showAmounts).toBe(false);
    expect(p.skus.find((s: { id: string }) => s.id === 'mkt').retainer_usd).toBe(199);
    expect(p.skus.find((s: { id: string }) => s.id === 'agy').setup_usd).toBe(1200);
    expect(showUsdPrices()).toBe(process.env.NEXT_PUBLIC_USD_PRICE === '1');
  });

  test('home has no sku teaser key', () => {
    const h = JSON.parse(readFileSync(join(root, 'vi/home.json'), 'utf8'));
    expect(h.skus).toBeUndefined();
    expect(h.slogan).toBe('Một nền tảng, chuyên biệt từng ngành');
  });
});
