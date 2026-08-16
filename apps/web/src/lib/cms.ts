import type { Locale } from '@pttcrm/gtm-core';
import type { CmsArticleCategory } from '@pttcrm/gtm-core';
import { unstable_cache } from 'next/cache';
import type { ArticleCard, ArticleDetail, EventCard, EventDetail } from './cms-public';
import { getPublicArticle, getPublicEvent, listPublicArticles, listPublicEvents } from './cms-store';

export type { ArticleCard, ArticleDetail, EventCard, EventDetail } from './cms-public';

export function publicCmsPath(path: string, params: Record<string, string>): string {
  const q = new URLSearchParams(params);
  return `/api/v1/public/cms${path}?${q.toString()}`;
}

const cachedArticles = unstable_cache(
  async (locale: Locale, category?: string) => listPublicArticles(locale, category),
  ['cms-articles'],
  { tags: ['articles'], revalidate: 60 },
);

const cachedArticle = unstable_cache(
  async (locale: Locale, slug: string) => getPublicArticle(locale, slug),
  ['cms-article'],
  { tags: ['articles'], revalidate: 60 },
);

const cachedEvents = unstable_cache(
  async (locale: Locale, when?: string) => listPublicEvents(locale, when),
  ['cms-events'],
  { tags: ['events'], revalidate: 60 },
);

const cachedEvent = unstable_cache(
  async (locale: Locale, slug: string) => getPublicEvent(locale, slug),
  ['cms-event'],
  { tags: ['events'], revalidate: 60 },
);

export async function fetchArticles(locale: Locale, category?: string): Promise<ArticleCard[]> {
  return cachedArticles(locale, category);
}

export async function fetchArticle(locale: Locale, slug: string): Promise<ArticleDetail | null> {
  return cachedArticle(locale, slug);
}

export async function fetchEvents(locale: Locale, when?: string): Promise<EventCard[]> {
  return cachedEvents(locale, when);
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
  vi: { insight: 'INSIGHT', nganh: 'NGÀNH', 'huong-dan': 'HƯỚNG DẪN' },
  en: { insight: 'INSIGHT', nganh: 'INDUSTRY', 'huong-dan': 'GUIDE' },
};
