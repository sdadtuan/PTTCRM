import { describe, expect, test } from 'vitest';
import { buildNav } from './nav';

describe('buildNav', () => {
  test('sales-led order and resources', () => {
    const nav = buildNav('vi');
    expect(nav.map((n) => n.id)).toEqual(['solutions', 'platform', 'pricing', 'resources']);
    const res = nav.find((n) => n.id === 'resources');
    expect(res?.items?.map((i) => i.id)).toEqual(['hub', 'news', 'events', 'customers', 'about', 'demo']);
  });
});
