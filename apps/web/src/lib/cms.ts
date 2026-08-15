import type { Locale } from '@pttcrm/gtm-core';
import type { CmsArticleCategory } from '@pttcrm/gtm-core';
import { unstable_cache } from 'next/cache';

export type ArticleCard = {
  slug: string;
  title: string;
  dek: string;
  category: CmsArticleCategory;
  published_at: string;
  cover_url?: string;
  alt?: string;
};

export type ArticleDetail = ArticleCard & {
  body: string;
  alt: string;
};

export type EventCard = {
  slug: string;
  title: string;
  dek: string;
  start_at: string;
  end_at: string;
  status: 'published' | 'cancelled';
  cover_url?: string;
  location?: string;
  cta_type?: string;
  cta_url?: string;
};

export type EventDetail = EventCard & {
  body: string;
};

function cmsBase(): string | null {
  const base = process.env.NEXT_PUBLIC_CMS_API_BASE;
  if (!base?.trim()) return null;
  return base.replace(/\/$/, '');
}

export function publicCmsPath(path: string, params: Record<string, string>): string {
  const q = new URLSearchParams(params);
  return `/api/v1/public/cms${path}?${q.toString()}`;
}

async function cmsFetch<T>(path: string): Promise<T | null> {
  const base = cmsBase();
  if (!base) return null;
  try {
    const res = await fetch(`${base}${path}`, {
      next: { revalidate: 300, tags: ['articles', 'events', 'sitemap'] },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

const cachedArticles = unstable_cache(
  async (locale: Locale, category?: string) => {
    const params: Record<string, string> = { locale };
    if (category) params.category = category;
    return cmsFetch<ArticleCard[]>(publicCmsPath('/articles', params));
  },
  ['cms-articles'],
  { tags: ['articles'], revalidate: 300 },
);

const cachedArticle = unstable_cache(
  async (locale: Locale, slug: string) => {
    return cmsFetch<ArticleDetail>(publicCmsPath(`/articles/${slug}`, { locale }));
  },
  ['cms-article'],
  { tags: ['articles'], revalidate: 300 },
);

const cachedEvents = unstable_cache(
  async (locale: Locale, when?: string) => {
    const params: Record<string, string> = { locale };
    if (when) params.when = when;
    return cmsFetch<EventCard[]>(publicCmsPath('/events', params));
  },
  ['cms-events'],
  { tags: ['events'], revalidate: 300 },
);

const cachedEvent = unstable_cache(
  async (locale: Locale, slug: string) => {
    return cmsFetch<EventDetail>(publicCmsPath(`/events/${slug}`, { locale }));
  },
  ['cms-event'],
  { tags: ['events'], revalidate: 300 },
);

export async function fetchArticles(locale: Locale, category?: string): Promise<ArticleCard[]> {
  const rows = await cachedArticles(locale, category);
  return rows ?? [];
}

export async function fetchArticle(locale: Locale, slug: string): Promise<ArticleDetail | null> {
  return cachedArticle(locale, slug);
}

export async function fetchEvents(locale: Locale, when?: string): Promise<EventCard[]> {
  const rows = await cachedEvents(locale, when);
  return rows ?? [];
}

export async function fetchEvent(locale: Locale, slug: string): Promise<EventDetail | null> {
  return cachedEvent(locale, slug);
}

export function articleHref(locale: Locale, slug: string): string {
  return locale === 'en' ? `/en/news/${slug}` : `/vi/tin-tuc/${slug}`;
}

export function eventHref(locale: Locale, slug: string): string {
  return locale === 'en' ? `/en/events/${slug}` : `/vi/su-kien/${slug}`;
}

export function newsListHref(locale: Locale): string {
  return locale === 'en' ? '/en/news' : '/vi/tin-tuc';
}

export function eventsListHref(locale: Locale): string {
  return locale === 'en' ? '/en/events' : '/vi/su-kien';
}

export function formatArticleDate(iso: string, locale: Locale): string {
  const d = new Date(iso);
  if (locale === 'vi') {
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '.');
  }
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export const CATEGORY_LABELS: Record<Locale, Record<CmsArticleCategory, string>> = {
  vi: { insight: 'INSIGHT', 'nganh': 'NGÀNH', 'huong-dan': 'HƯỚNG DẪN' },
  en: { insight: 'INSIGHT', 'nganh': 'INDUSTRY', 'huong-dan': 'GUIDE' },
};
