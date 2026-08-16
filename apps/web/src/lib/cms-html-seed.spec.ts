import path from 'node:path';
import { describe, expect, test } from 'vitest';
import { parseArticleHtml, resolveDemoHtmlDir } from './cms-html-seed';

describe('cms-html-seed', () => {
  test('parses closed-loop bilingual article', () => {
    const dir = resolveDemoHtmlDir();
    expect(dir).toBeTruthy();
    const parsed = parseArticleHtml(path.join(dir as string, 'closed-loop.html'));
    expect(parsed.title_vi).toMatch(/Closed-loop/);
    expect(parsed.title_en).toMatch(/which ads become contracts/i);
    expect(parsed.body_vi).toMatch(/## /);
    expect(parsed.published_at).toBe('2026-08-12T00:00:00.000Z');
    expect(JSON.stringify(parsed)).not.toMatch(/RNOSAI/i);
  });
});
