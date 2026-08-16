import { describe, expect, test } from 'vitest';
import { USD_LIST_PRICE, formatUsd, minUsdPerUser } from './usd-prices';

describe('USD list price', () => {
  test('USD list matches master spec 6.3', () => {
    expect(USD_LIST_PRICE.mkt).toEqual({ retainer_usd: 199, setup_usd: 400 });
    expect(USD_LIST_PRICE.ind.retainer_usd).toBe(399);
    expect(USD_LIST_PRICE.agy.setup_usd).toBe(1200);
  });

  test('formatUsd', () => {
    expect(formatUsd(199)).toBe('$199');
    expect(formatUsd(1200)).toBe('$1,200');
  });

  test('minUsdPerUser floor', () => {
    expect(minUsdPerUser()).toBe(15);
  });
});
