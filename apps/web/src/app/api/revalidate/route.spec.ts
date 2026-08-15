import { describe, expect, test, vi } from 'vitest';

vi.mock('next/cache', () => ({
  revalidateTag: vi.fn(),
}));

import { POST } from './route';

describe('revalidate route', () => {
  test('rejects bad secret', async () => {
    const prev = process.env.CMS_REVALIDATE_SECRET;
    process.env.CMS_REVALIDATE_SECRET = 'good-secret';
    const res = await POST(
      new Request('http://localhost/api/revalidate', {
        method: 'POST',
        headers: { 'x-cms-secret': 'nope' },
        body: JSON.stringify({ tags: ['articles'] }),
      }),
    );
    expect(res.status).toBe(401);
    process.env.CMS_REVALIDATE_SECRET = prev;
  });
});
