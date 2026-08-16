import { NextResponse } from 'next/server';
import { getPublicArticle, getPublicEvent, listPublicArticles, listPublicEvents, listPublicSlots } from '@/lib/cms-store';
import type { Locale } from '@pttcrm/gtm-core';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function localeOf(url: URL): Locale {
  return url.searchParams.get('locale') === 'en' ? 'en' : 'vi';
}

export async function GET(request: Request, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;
  const url = new URL(request.url);
  const locale = localeOf(url);
  const [head, slug] = path;

  if (head === 'articles' && !slug) {
    return NextResponse.json(listPublicArticles(locale, url.searchParams.get('category') ?? undefined));
  }
  if (head === 'articles' && slug) {
    const article = getPublicArticle(locale, slug);
    if (!article) return NextResponse.json({ error: 'not_found' }, { status: 404 });
    return NextResponse.json(article);
  }
  if (head === 'events' && !slug) {
    return NextResponse.json(listPublicEvents(locale, url.searchParams.get('when') ?? undefined));
  }
  if (head === 'events' && slug) {
    const event = getPublicEvent(locale, slug);
    if (!event) return NextResponse.json({ error: 'not_found' }, { status: 404 });
    return NextResponse.json(event);
  }
  if (head === 'slots') {
    const keys = (url.searchParams.get('keys') ?? '')
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean);
    return NextResponse.json(listPublicSlots(locale, keys));
  }
  return NextResponse.json({ error: 'not_found' }, { status: 404 });
}
