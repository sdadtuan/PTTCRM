import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';

const root = join(__dirname, 'cases');

describe('case study contract', () => {
  test('signed cases have PO metrics and no RNOSAI', () => {
    for (const f of readdirSync(root).filter((x) => x.endsWith('.json'))) {
      const raw = readFileSync(join(root, f), 'utf8');
      const c = JSON.parse(raw) as {
        po_signed?: boolean;
        metrics_verified?: boolean;
        cpl_vnd?: number;
        roas?: number;
      };
      expect(raw).not.toMatch(/RNOSAI/);
      expect(raw.toLowerCase()).not.toMatch(/30 ngày|30-day trial|dùng thử 30/);
      expect(typeof c.metrics_verified).toBe('boolean');
      if (c.metrics_verified) {
        expect(c.po_signed).toBe(true);
        expect(c.cpl_vnd).toBeGreaterThan(0);
        expect(c.roas).toBeGreaterThan(0);
      }
    }
  });
});
