import { describe, expect, test } from 'vitest';
import { GET, POST } from './route';

describe('cms admin api', () => {
  test('session is false without cookie', async () => {
    const { NextRequest } = await import('next/server');
    const req = new NextRequest('http://localhost/api/cms/admin/session');
    const res = await GET(req, { params: Promise.resolve({ path: ['session'] }) });
    const body = (await res.json()) as { ok: boolean };
    expect(body.ok).toBe(false);
  });

  test('rejects wrong login secret', async () => {
    const { NextRequest } = await import('next/server');
    process.env.CMS_ADMIN_SECRET = 'expected';
    const req = new NextRequest('http://localhost/api/cms/admin/login', {
      method: 'POST',
      body: JSON.stringify({ secret: 'nope' }),
    });
    const res = await POST(req, { params: Promise.resolve({ path: ['login'] }) });
    expect(res.status).toBe(401);
    delete process.env.CMS_ADMIN_SECRET;
  });
});
