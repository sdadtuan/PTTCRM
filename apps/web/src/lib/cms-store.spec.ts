import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, test } from 'vitest';
import {
  archiveArticle,
  getPublicArticle,
  listPublicArticles,
  publishArticle,
  readStore,
  upsertArticle,
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
