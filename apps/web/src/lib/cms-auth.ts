import { NextResponse, type NextRequest } from 'next/server';

export const CMS_COOKIE = 'ptt_cms';

export function cmsAdminSecret(): string | null {
  const configured = process.env.CMS_ADMIN_SECRET?.trim();
  if (configured) return configured;
  if (process.env.NODE_ENV === 'production') return null;
  return 'dev-cms';
}

export function isCmsAuthed(request: NextRequest): boolean {
  const secret = cmsAdminSecret();
  if (!secret) return false;
  return request.cookies.get(CMS_COOKIE)?.value === secret;
}

export function cmsLoginResponse(): NextResponse {
  const secret = cmsAdminSecret();
  if (!secret) {
    return NextResponse.json({ error: 'CMS_ADMIN_SECRET missing' }, { status: 503 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(CMS_COOKIE, secret, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 12,
  });
  return res;
}

export function cmsLogoutResponse(): NextResponse {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(CMS_COOKIE, '', { httpOnly: true, path: '/', maxAge: 0 });
  return res;
}

export function unauthorized(): NextResponse {
  return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
}
