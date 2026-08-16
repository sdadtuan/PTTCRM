import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, test } from 'vitest';
import {
  archiveArticle,
  getPublicArticle,
  listPublicArticles,
  listPublicCustomers,
  publishArticle,
  publishCustomer,
  readStore,
  upsertArticle,
  upsertCustomer,
} from './cms-store';

const dirs: string[] = [];

function tmpCms(): string {
  const dir = mkdtempSync(path.join(tmpdir(), 'pttcrm-cms-'));
  dirs.push(dir);
  process.env.PTTCRM_CMS_DIR = dir;
  return dir;
}

afterEach(() => {
  delete process.env.PTTCRM_CMS_DIR;
  for (const dir of dirs.splice(0)) {
    rmSync(dir, { recursive: true, force: true });
  }
});

describe('cms-store', () => {
  test('seeds six published articles from demo-html', () => {
    const dir = tmpCms();
    const store = readStore(dir);
    expect(store.seeded).toBe(true);
    expect(store.articles).toHaveLength(6);
    const vi = listPublicArticles('vi', undefined, store);
    expect(vi.map((a) => a.slug)).toContain('closed-loop');
    expect(getPublicArticle('vi', 'closed-loop', store)?.title).toMatch(/Closed-loop/);
    expect(JSON.stringify(store)).not.toMatch(/RNOSAI/i);
  });

  test('draft is hidden until publish; archive drops from public list', () => {
    const dir = tmpCms();
    const draft = upsertArticle(
      {
        slug: 'draft-loop',
        category: 'insight',
        title_vi: 'Bài nháp',
        dek_vi: 'Dek',
        body_vi: 'Nội dung nháp.',
      },
      dir,
    );
    expect(draft.status).toBe('draft');
    expect(listPublicArticles('vi').some((a) => a.slug === 'draft-loop')).toBe(false);
    publishArticle(draft.id, dir);
    expect(listPublicArticles('vi').some((a) => a.slug === 'draft-loop')).toBe(true);
    archiveArticle(draft.id, dir);
    expect(listPublicArticles('vi').some((a) => a.slug === 'draft-loop')).toBe(false);
  });

  test('seeds signed customer cases without showing unverified metrics', () => {
    const dir = tmpCms();
    const store = readStore(dir);
    expect(store.customers.length).toBeGreaterThanOrEqual(3);
    const cards = listPublicCustomers('vi', store);
    expect(cards.map((c) => c.slug)).toContain('agency-portal-roas');
    expect(cards.every((c) => c.metrics_label === undefined)).toBe(true);
  });

  test('cannot verify metrics without PO and cannot publish without PO', () => {
    tmpCms();
    expect(() =>
      upsertCustomer({
        slug: 'no-po-metrics',
        title_vi: 'Case nháp',
        summary_vi: 'Dek',
        po_signed: false,
        metrics_verified: true,
      }),
    ).toThrow(/CMS_METRICS_NEED_PO/);
    const draft = upsertCustomer({
      slug: 'wait-po',
      title_vi: 'Case chờ PO',
      summary_vi: 'Dek',
      po_signed: false,
    });
    expect(() => publishCustomer(draft.id)).toThrow(/CMS_CUSTOMER_NEED_PO/);
  });

  test('rejects forbidden engine name on save', () => {
    tmpCms();
    expect(() =>
      upsertArticle({
        slug: 'bad-name',
        title_vi: 'Powered by RNOSAI',
        body_vi: 'x',
      }),
    ).toThrow(/RNOSAI_FORBIDDEN/);
  });
});
