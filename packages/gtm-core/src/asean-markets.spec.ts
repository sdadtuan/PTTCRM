import { describe, expect, test } from 'vitest';
import { ASEAN_MARKETS, isAseanMarket, whatsappLink } from './asean-markets';

describe('asean-markets', () => {
  test('WhatsApp link encodes text', () => {
    const url = whatsappLink('sg', 'Hello PTTCRM');
    expect(url).toMatch(/^https:\/\/wa\.me\/\d+\?text=/);
    expect(url).toContain(encodeURIComponent('Hello PTTCRM'));
  });

  test('timezones defined for all four markets', () => {
    expect(Object.keys(ASEAN_MARKETS).sort()).toEqual(['id', 'ph', 'sg', 'th']);
  });

  test('isAseanMarket', () => {
    expect(isAseanMarket('th')).toBe(true);
    expect(isAseanMarket('vn')).toBe(false);
  });
});
