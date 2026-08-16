import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { revalidateTag } from 'next/cache';
import { NextResponse, type NextRequest } from 'next/server';
import {
  cmsAdminSecret,
  cmsLoginResponse,
  cmsLogoutResponse,
  isCmsAuthed,
  unauthorized,
} from '@/lib/cms-auth';
import {
  addMedia,
  archiveArticle,
  archiveCustomer,
  archiveEvent,
  errorStatus,
  listArticlesAdmin,
  listCustomersAdmin,
  listEventsAdmin,
  listMediaAdmin,
  listSlotsAdmin,
  publishArticle,
  publishCustomer,
  publishEvent,
  putSlot,
  upsertArticle,
  upsertCustomer,
  upsertEvent,
} from '@/lib/cms-store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ALLOWED_MIMES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']);
const MAX_BYTES = 5_000_000;

function jsonError(err: unknown): NextResponse {
  const message = err instanceof Error ? err.message : 'CMS_ERROR';
  return NextResponse.json({ error: message }, { status: errorStatus(err) });
}

function bump(tags: string[]): void {
  for (const tag of tags) revalidateTag(tag);
}

function extForMime(mime: string): string {
  if (mime === 'image/jpeg') return 'jpg';
  if (mime === 'image/png') return 'png';
  if (mime === 'image/webp') return 'webp';
  if (mime === 'image/svg+xml') return 'svg';
  return 'bin';
}

export async function GET(request: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path: segs } = await ctx.params;
  if (segs[0] === 'session') {
    return NextResponse.json({ ok: isCmsAuthed(request) });
  }
  if (!isCmsAuthed(request)) return unauthorized();
  const [head] = segs;
  if (head === 'articles') return NextResponse.json(listArticlesAdmin());
  if (head === 'events') return NextResponse.json(listEventsAdmin());
  if (head === 'customers') return NextResponse.json(listCustomersAdmin());
  if (head === 'media') return NextResponse.json(listMediaAdmin());
  if (head === 'slots') return NextResponse.json(listSlotsAdmin());
  return NextResponse.json({ error: 'not_found' }, { status: 404 });
}

export async function POST(request: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path: segs } = await ctx.params;
  if (segs[0] === 'login') {
    const body = (await request.json().catch(() => ({}))) as { secret?: string };
    const secret = cmsAdminSecret();
    if (!secret || body.secret !== secret) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }
    return cmsLoginResponse();
  }
  if (segs[0] === 'logout') return cmsLogoutResponse();
  if (!isCmsAuthed(request)) return unauthorized();

  try {
    if (segs[0] === 'articles' && segs[1] && segs[2] === 'publish') {
      const row = publishArticle(segs[1]);
      bump(['articles', 'sitemap']);
      return NextResponse.json(row);
    }
    if (segs[0] === 'articles' && segs[1] && segs[2] === 'archive') {
      const row = archiveArticle(segs[1]);
      bump(['articles', 'sitemap']);
      return NextResponse.json(row);
    }
    if (segs[0] === 'articles' && !segs[1]) {
      const body = await request.json();
      return NextResponse.json(upsertArticle(body), { status: 201 });
    }
    if (segs[0] === 'events' && segs[1] && segs[2] === 'publish') {
      const row = publishEvent(segs[1]);
      bump(['events', 'sitemap']);
      return NextResponse.json(row);
    }
    if (segs[0] === 'events' && segs[1] && segs[2] === 'archive') {
      const row = archiveEvent(segs[1]);
      bump(['events', 'sitemap']);
      return NextResponse.json(row);
    }
    if (segs[0] === 'events' && !segs[1]) {
      const body = await request.json();
      return NextResponse.json(upsertEvent(body), { status: 201 });
    }
    if (segs[0] === 'customers' && segs[1] && segs[2] === 'publish') {
      const row = publishCustomer(segs[1]);
      bump(['customers', 'sitemap']);
      return NextResponse.json(row);
    }
    if (segs[0] === 'customers' && segs[1] && segs[2] === 'archive') {
      const row = archiveCustomer(segs[1]);
      bump(['customers', 'sitemap']);
      return NextResponse.json(row);
    }
    if (segs[0] === 'customers' && !segs[1]) {
      const body = await request.json();
      return NextResponse.json(upsertCustomer(body), { status: 201 });
    }
    if (segs[0] === 'media' && !segs[1]) {
      const form = await request.formData();
      const file = form.get('file');
      if (!(file instanceof File)) return NextResponse.json({ error: 'file_required' }, { status: 400 });
      if (!ALLOWED_MIMES.has(file.type)) return NextResponse.json({ error: 'invalid_mime' }, { status: 400 });
      if (file.size > MAX_BYTES) return NextResponse.json({ error: 'file_too_large' }, { status: 400 });
      const buf = Buffer.from(await file.arrayBuffer());
      const id = `up_${Date.now().toString(36)}`;
      const filename = `${id}.${extForMime(file.type)}`;
      const mediaDir = path.join(process.cwd(), 'public', 'cms-media');
      mkdirSync(mediaDir, { recursive: true });
      writeFileSync(path.join(mediaDir, filename), buf);
      const row = addMedia({
        filename: file.name || filename,
        mime: file.type,
        bytes: file.size,
        public_url: `/cms-media/${filename}`,
        alt_vi: String(form.get('alt_vi') ?? ''),
        alt_en: form.get('alt_en') ? String(form.get('alt_en')) : undefined,
      });
      return NextResponse.json(row, { status: 201 });
    }
  } catch (err) {
    return jsonError(err);
  }
  return NextResponse.json({ error: 'not_found' }, { status: 404 });
}

export async function PATCH(request: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  if (!isCmsAuthed(request)) return unauthorized();
  const { path: segs } = await ctx.params;
  try {
    const body = await request.json();
    if (segs[0] === 'articles' && segs[1] && !segs[2]) {
      return NextResponse.json(upsertArticle({ ...body, id: segs[1] }));
    }
    if (segs[0] === 'events' && segs[1] && !segs[2]) {
      return NextResponse.json(upsertEvent({ ...body, id: segs[1] }));
    }
    if (segs[0] === 'customers' && segs[1] && !segs[2]) {
      return NextResponse.json(upsertCustomer({ ...body, id: segs[1] }));
    }
  } catch (err) {
    return jsonError(err);
  }
  return NextResponse.json({ error: 'not_found' }, { status: 404 });
}

export async function PUT(request: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  if (!isCmsAuthed(request)) return unauthorized();
  const { path: segs } = await ctx.params;
  try {
    if (segs[0] === 'slots' && segs[1]) {
      const body = await request.json();
      const row = putSlot(segs[1], body);
      bump(['articles']);
      return NextResponse.json(row);
    }
  } catch (err) {
    return jsonError(err);
  }
  return NextResponse.json({ error: 'not_found' }, { status: 404 });
}
