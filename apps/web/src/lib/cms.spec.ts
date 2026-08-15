import { publicCmsPath } from './cms';
import { describe, expect, test } from 'vitest';

describe('cms paths', () => {
  test('paths', () => {
    expect(publicCmsPath('/articles', { locale: 'vi', category: 'insight' })).toBe(
      '/api/v1/public/cms/articles?locale=vi&category=insight',
    );
  });
});
