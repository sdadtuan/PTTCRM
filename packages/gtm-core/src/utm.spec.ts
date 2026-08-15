import { describe, expect, test } from 'vitest';
import { mergeFirstTouchUtm, parseUtmSearch } from './utm';

describe('mergeFirstTouchUtm', () => {
  test('first touch wins', () => {
    const first = mergeFirstTouchUtm(null, parseUtmSearch('?utm_source=google&utm_campaign=w0'));
    const second = mergeFirstTouchUtm(first, parseUtmSearch('?utm_source=facebook'));
    expect(JSON.parse(second).utm_source).toBe('google');
    expect(JSON.parse(second).utm_campaign).toBe('w0');
  });
});
