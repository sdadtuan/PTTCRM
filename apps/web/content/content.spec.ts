import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';

const root = join(__dirname);

describe('content contract', () => {
  test('no RNOSAI and no trial CTA in content', () => {
    for (const loc of ['vi', 'en']) {
      for (const f of readdirSync(join(root, loc))) {
        const raw = readFileSync(join(root, loc, f), 'utf8');
        expect(raw).not.toMatch(/RNOSAI/);
        expect(raw.toLowerCase()).not.toMatch(/30 ngày|30-day trial|dùng thử 30/);
      }
    }
  });

  test('VI pricing amounts match list price v1', () => {
    const p = JSON.parse(readFileSync(join(root, 'vi/pricing.json'), 'utf8'));
    expect(p.skus.find((s: { id: string }) => s.id === 'mkt').retainer_vnd).toBe(4900000);
    expect(p.skus.find((s: { id: string }) => s.id === 'ind').retainer_vnd).toBe(9900000);
    expect(p.skus.find((s: { id: string }) => s.id === 'agy').retainer_vnd).toBe(19900000);
  });

  test('EN pricing hides amounts', () => {
    const p = JSON.parse(readFileSync(join(root, 'en/pricing.json'), 'utf8'));
    expect(p.showAmounts).toBe(false);
    expect(JSON.stringify(p)).not.toMatch(/199|399|799/);
  });

  test('home has no sku teaser key', () => {
    const h = JSON.parse(readFileSync(join(root, 'vi/home.json'), 'utf8'));
    expect(h.skus).toBeUndefined();
    expect(h.slogan).toBe('Một nền tảng, chuyên biệt từng ngành');
  });
});
