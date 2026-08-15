import { describe, expect, test } from 'vitest';
import { assertNoRnosai, isAllowedCmsMarkdown } from './md-allow';

describe('md-allow', () => {
  test('blocks RNOSAI and remote img', () => {
    expect(() => assertNoRnosai('Powered by RNOSAI')).toThrow();
    expect(isAllowedCmsMarkdown('![x](https://evil.test/a.png)', 'https://cdn.pttcrm.com')).toBe(false);
    expect(isAllowedCmsMarkdown('![x](https://cdn.pttcrm.com/m/a.webp)', 'https://cdn.pttcrm.com')).toBe(true);
  });
});
