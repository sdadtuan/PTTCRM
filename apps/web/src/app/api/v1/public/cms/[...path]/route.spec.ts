import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, test } from 'vitest';
import { GET } from './route';

const dirs: string[] = [];

afterEach(() => {
  delete process.env.PTTCRM_CMS_DIR;
  for (const dir of dirs.splice(0)) rmSync(dir, { recursive: true, force: true });
});

describe('public cms api', () => {
  test('lists seeded published articles', async () => {
    const dir = mkdtempSync(path.join(tmpdir(), 'pttcrm-cms-api-'));
    dirs.push(dir);
    process.env.PTTCRM_CMS_DIR = dir;
    const res = await GET(new Request('http://localhost/api/v1/public/cms/articles?locale=vi'), {
      params: Promise.resolve({ path: ['articles'] }),
    });
    expect(res.status).toBe(200);
    const rows = (await res.json()) as Array<{ slug: string }>;
    expect(rows.map((r) => r.slug)).toContain('closed-loop');
  });

  test('404 for unknown slug', async () => {
    const dir = mkdtempSync(path.join(tmpdir(), 'pttcrm-cms-api-'));
    dirs.push(dir);
    process.env.PTTCRM_CMS_DIR = dir;
    const res = await GET(new Request('http://localhost/api/v1/public/cms/articles/no-such'), {
      params: Promise.resolve({ path: ['articles', 'no-such'] }),
    });
    expect(res.status).toBe(404);
  });
});
