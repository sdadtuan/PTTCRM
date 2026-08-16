import { describe, expect, test } from 'vitest';
import { getResourcesHub } from '../../src/lib/resources';

describe('resources hub', () => {
  test('VI hub has four tiles', () => {
    const hub = getResourcesHub('vi');
    expect(hub.tiles).toHaveLength(4);
    expect(hub.tiles[0].href).toBe('/vi/tin-tuc');
  });

  test('EN hub mirrors paths', () => {
    const hub = getResourcesHub('en');
    expect(hub.tiles.find((t) => t.id === 'customers')?.href).toBe('/en/customers');
  });
});
