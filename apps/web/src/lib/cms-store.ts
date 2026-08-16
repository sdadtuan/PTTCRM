import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import {
  assertNoRnosai,
  CMS_SLOT_KEYS,
  isAllowedCmsMarkdown,
  type CmsArticleCategory,
  type CmsArticleStatus,
  type CmsEventStatus,
  type CmsSlotKey,
  type Locale,
} from '@pttcrm/gtm-core';
import { parseArticleHtml, resolveDemoHtmlDir, SEED_ARTICLES } from './cms-html-seed';
import type { ArticleCard, ArticleDetail, EventCard, EventDetail } from './cms-public';

const SLUG_RE = /^[a-z0-9-]+$/;
const MEDIA_BASE = '/cms-media';

export type StoredArticle = {
  id: string;
  slug: string;
  status: CmsArticleStatus;
  category: CmsArticleCategory;
  featured_home: boolean;
  title_vi: string;
  title_en: string | null;
  dek_vi: string;
  dek_en: string | null;
  body_vi: string;
  body_en: string | null;
  cover_url: string | null;
  alt_vi: string;
  alt_en: string | null;
  published_at: string | null;
  updated_at: string;
};

export type StoredEvent = {
  id: string;
  slug: string;
  status: CmsEventStatus;
  title_vi: string;
  title_en: string | null;
  dek_vi: string;
  dek_en: string | null;
  body_vi: string;
  body_en: string | null;
  start_at: string;
  end_at: string;
  location_vi: string | null;
  location_en: string | null;
  cover_url: string | null;
  cta_type: string | null;
  cta_url: string | null;
  updated_at: string;
};

export type StoredMedia = {
  id: string;
  filename: string;
  public_url: string;
  mime: string;
  bytes: number;
  alt_vi: string;
  alt_en: string | null;
  created_at: string;
};

export type StoredSlot = {
  slot_key: CmsSlotKey;
  media_url: string | null;
  caption_vi: string | null;
  caption_en: string | null;
  updated_at: string;
};

export type CmsStore = {
  version: 1;
  seeded: boolean;
  articles: StoredArticle[];
  events: StoredEvent[];
  media: StoredMedia[];
  slots: StoredSlot[];
};

export type ArticleDraft = Partial<StoredArticle> & { slug?: string; category?: CmsArticleCategory };
export type EventDraft = Partial<StoredEvent> & { slug?: string; start_at?: string; end_at?: string };

function emptyStore(): CmsStore {
  return { version: 1, seeded: false, articles: [], events: [], media: [], slots: [] };
}

export function resolveCmsDir(cwd = process.cwd()): string {
  if (process.env.PTTCRM_CMS_DIR) return process.env.PTTCRM_CMS_DIR;
  const nested = path.join(cwd, 'apps/web/data/cms');
  const local = path.join(cwd, 'data/cms');
  if (existsSync(path.join(nested, 'store.json')) || existsSync(path.join(cwd, 'apps/web'))) {
    if (existsSync(path.join(cwd, 'apps/web'))) return nested;
  }
  if (existsSync(path.join(local, 'store.json'))) return local;
  return local;
}

function storePath(dir: string): string {
  return path.join(dir, 'store.json');
}

function nid(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function nowIso(): string {
  return new Date().toISOString();
}

function assertSlug(slug: string): void {
  if (!SLUG_RE.test(slug)) throw new Error('CMS_INVALID_SLUG');
}

function assertTextClean(...values: Array<string | null | undefined>): void {
  for (const value of values) {
    if (typeof value === 'string' && value.length > 0) assertNoRnosai(value);
  }
}

function assertMarkdown(body: string | null | undefined): void {
  if (!body) return;
  if (!isAllowedCmsMarkdown(body, MEDIA_BASE)) throw new Error('CMS_UNSAFE_MARKDOWN');
}

export function readStore(dir = resolveCmsDir()): CmsStore {
  mkdirSync(dir, { recursive: true });
  const file = storePath(dir);
  if (!existsSync(file)) {
    const seeded = seedStore(dir);
    writeStore(seeded, dir);
    return seeded;
  }
  const parsed = JSON.parse(readFileSync(file, 'utf8')) as CmsStore;
  if (!parsed.seeded && parsed.articles.length === 0) {
    const seeded = seedStore(dir, parsed);
    writeStore(seeded, dir);
    return seeded;
  }
  return parsed;
}

export function writeStore(store: CmsStore, dir = resolveCmsDir()): void {
  mkdirSync(dir, { recursive: true });
  const dest = storePath(dir);
  const tmp = `${dest}.${process.pid}.tmp`;
  writeFileSync(tmp, `${JSON.stringify(store, null, 2)}\n`, 'utf8');
  renameSync(tmp, dest);
}

export function seedStore(dir = resolveCmsDir(), base = emptyStore()): CmsStore {
  const htmlDir = resolveDemoHtmlDir();
  const articles: StoredArticle[] = [];
  if (htmlDir) {
    for (const spec of SEED_ARTICLES) {
      const parsed = parseArticleHtml(path.join(htmlDir, spec.htmlFile));
      articles.push({
        id: nid('art'),
        slug: spec.slug,
        status: 'published',
        category: spec.category,
        featured_home: Boolean(spec.featured_home),
        title_vi: parsed.title_vi,
        title_en: parsed.title_en,
        dek_vi: parsed.dek_vi,
        dek_en: parsed.dek_en,
        body_vi: parsed.body_vi,
        body_en: parsed.body_en,
        cover_url: null,
        alt_vi: parsed.title_vi,
        alt_en: parsed.title_en,
        published_at: parsed.published_at ?? nowIso(),
        updated_at: nowIso(),
      });
    }
  }
  void dir;
  return { ...base, version: 1, seeded: true, articles };
}

function pickLocale<T>(locale: Locale, vi: T, en: T | null | undefined): T {
  if (locale === 'en') return (en ?? vi) as T;
  return vi;
}

export function listPublicArticles(
  locale: Locale,
  category?: string,
  store = readStore(),
): ArticleCard[] {
  return store.articles
    .filter((a) => a.status === 'published')
    .filter((a) => (category ? a.category === category : true))
    .filter((a) => (locale === 'en' ? Boolean(a.title_en && a.body_en) : Boolean(a.title_vi && a.body_vi)))
    .sort((a, b) => String(b.published_at).localeCompare(String(a.published_at)))
    .map((a) => ({
      slug: a.slug,
      title: pickLocale(locale, a.title_vi, a.title_en),
      dek: pickLocale(locale, a.dek_vi, a.dek_en),
      category: a.category,
      published_at: a.published_at ?? a.updated_at,
      cover_url: a.cover_url ?? undefined,
      alt: pickLocale(locale, a.alt_vi, a.alt_en),
    }));
}

export function getPublicArticle(
  locale: Locale,
  slug: string,
  store = readStore(),
): ArticleDetail | null {
  const a = store.articles.find((row) => row.slug === slug && row.status === 'published');
  if (!a) return null;
  if (locale === 'en' && !(a.title_en && a.body_en)) return null;
  return {
    slug: a.slug,
    title: pickLocale(locale, a.title_vi, a.title_en),
    dek: pickLocale(locale, a.dek_vi, a.dek_en),
    category: a.category,
    published_at: a.published_at ?? a.updated_at,
    cover_url: a.cover_url ?? undefined,
    alt: pickLocale(locale, a.alt_vi, a.alt_en),
    body: pickLocale(locale, a.body_vi, a.body_en),
  };
}

export function listPublicEvents(locale: Locale, when?: string, store = readStore()): EventCard[] {
  const now = Date.now();
  return store.events
    .filter((e) => e.status === 'published' || e.status === 'cancelled')
    .filter((e) => {
      if (when === 'upcoming') return new Date(e.end_at).getTime() >= now && e.status === 'published';
      if (when === 'past') return new Date(e.end_at).getTime() < now;
      return true;
    })
    .sort((a, b) => a.start_at.localeCompare(b.start_at))
    .map((e) => ({
      slug: e.slug,
      title: pickLocale(locale, e.title_vi, e.title_en),
      dek: pickLocale(locale, e.dek_vi, e.dek_en),
      start_at: e.start_at,
      end_at: e.end_at,
      status: e.status === 'cancelled' ? 'cancelled' : 'published',
      cover_url: e.cover_url ?? undefined,
      location: pickLocale(locale, e.location_vi, e.location_en) ?? undefined,
      cta_type: e.cta_type ?? undefined,
      cta_url: e.cta_url ?? undefined,
    }));
}

export function getPublicEvent(locale: Locale, slug: string, store = readStore()): EventDetail | null {
  const e = store.events.find((row) => row.slug === slug);
  if (!e || (e.status !== 'published' && e.status !== 'cancelled')) return null;
  return {
    slug: e.slug,
    title: pickLocale(locale, e.title_vi, e.title_en),
    dek: pickLocale(locale, e.dek_vi, e.dek_en),
    start_at: e.start_at,
    end_at: e.end_at,
    status: e.status === 'cancelled' ? 'cancelled' : 'published',
    cover_url: e.cover_url ?? undefined,
    location: pickLocale(locale, e.location_vi, e.location_en) ?? undefined,
    cta_type: e.cta_type ?? undefined,
    cta_url: e.cta_url ?? undefined,
    body: pickLocale(locale, e.body_vi, e.body_en),
  };
}

export function listPublicSlots(
  locale: Locale,
  keys?: string[],
  store = readStore(),
): Array<{ slot_key: string; media_url: string; media_alt: string | null; caption: string | null }> {
  const wanted = keys?.length ? new Set(keys) : null;
  return store.slots
    .filter((s) => s.media_url)
    .filter((s) => (wanted ? wanted.has(s.slot_key) : true))
    .map((s) => ({
      slot_key: s.slot_key,
      media_url: s.media_url as string,
      media_alt: null,
      caption: pickLocale(locale, s.caption_vi, s.caption_en),
    }));
}

export function listArticlesAdmin(store = readStore()): StoredArticle[] {
  return [...store.articles].sort((a, b) => b.updated_at.localeCompare(a.updated_at));
}

export function listEventsAdmin(store = readStore()): StoredEvent[] {
  return [...store.events].sort((a, b) => b.updated_at.localeCompare(a.updated_at));
}

export function upsertArticle(draft: ArticleDraft, dir = resolveCmsDir()): StoredArticle {
  const store = readStore(dir);
  const existing = draft.id ? store.articles.find((a) => a.id === draft.id) : undefined;
  const slug = (draft.slug ?? existing?.slug ?? '').trim();
  assertSlug(slug);
  if (store.articles.some((a) => a.slug === slug && a.id !== existing?.id)) {
    throw new Error('CMS_SLUG_TAKEN');
  }
  const next: StoredArticle = {
    id: existing?.id ?? nid('art'),
    slug,
    status: existing?.status ?? 'draft',
    category: draft.category ?? existing?.category ?? 'insight',
    featured_home: draft.featured_home ?? existing?.featured_home ?? false,
    title_vi: draft.title_vi ?? existing?.title_vi ?? '',
    title_en: draft.title_en !== undefined ? draft.title_en : (existing?.title_en ?? null),
    dek_vi: draft.dek_vi ?? existing?.dek_vi ?? '',
    dek_en: draft.dek_en !== undefined ? draft.dek_en : (existing?.dek_en ?? null),
    body_vi: draft.body_vi ?? existing?.body_vi ?? '',
    body_en: draft.body_en !== undefined ? draft.body_en : (existing?.body_en ?? null),
    cover_url: draft.cover_url !== undefined ? draft.cover_url : (existing?.cover_url ?? null),
    alt_vi: draft.alt_vi ?? existing?.alt_vi ?? draft.title_vi ?? existing?.title_vi ?? slug,
    alt_en: draft.alt_en !== undefined ? draft.alt_en : (existing?.alt_en ?? null),
    published_at: existing?.published_at ?? null,
    updated_at: nowIso(),
  };
  assertTextClean(next.title_vi, next.title_en, next.dek_vi, next.dek_en, next.body_vi, next.body_en, next.alt_vi, next.alt_en);
  assertMarkdown(next.body_vi);
  assertMarkdown(next.body_en);
  if (existing) {
    store.articles = store.articles.map((a) => (a.id === existing.id ? next : a));
  } else {
    store.articles.unshift(next);
  }
  writeStore(store, dir);
  return next;
}

export function publishArticle(id: string, dir = resolveCmsDir()): StoredArticle {
  const store = readStore(dir);
  const article = store.articles.find((a) => a.id === id);
  if (!article) throw new Error('CMS_NOT_FOUND');
  if (!article.title_vi.trim() || !article.body_vi.trim()) throw new Error('CMS_PUBLISH_MISSING_VI');
  assertTextClean(article.title_vi, article.title_en, article.dek_vi, article.dek_en, article.body_vi, article.body_en);
  assertMarkdown(article.body_vi);
  assertMarkdown(article.body_en);
  article.status = 'published';
  article.published_at = article.published_at ?? nowIso();
  article.updated_at = nowIso();
  writeStore(store, dir);
  return article;
}

export function archiveArticle(id: string, dir = resolveCmsDir()): StoredArticle {
  const store = readStore(dir);
  const article = store.articles.find((a) => a.id === id);
  if (!article) throw new Error('CMS_NOT_FOUND');
  article.status = 'archived';
  article.updated_at = nowIso();
  writeStore(store, dir);
  return article;
}

export function upsertEvent(draft: EventDraft, dir = resolveCmsDir()): StoredEvent {
  const store = readStore(dir);
  const existing = draft.id ? store.events.find((e) => e.id === draft.id) : undefined;
  const slug = (draft.slug ?? existing?.slug ?? '').trim();
  assertSlug(slug);
  if (store.events.some((e) => e.slug === slug && e.id !== existing?.id)) {
    throw new Error('CMS_SLUG_TAKEN');
  }
  const start_at = draft.start_at ?? existing?.start_at ?? nowIso();
  const end_at = draft.end_at ?? existing?.end_at ?? nowIso();
  if (new Date(end_at) <= new Date(start_at)) throw new Error('CMS_EVENT_INVALID_DATES');
  const next: StoredEvent = {
    id: existing?.id ?? nid('evt'),
    slug,
    status: existing?.status ?? 'draft',
    title_vi: draft.title_vi ?? existing?.title_vi ?? '',
    title_en: draft.title_en !== undefined ? draft.title_en : (existing?.title_en ?? null),
    dek_vi: draft.dek_vi ?? existing?.dek_vi ?? '',
    dek_en: draft.dek_en !== undefined ? draft.dek_en : (existing?.dek_en ?? null),
    body_vi: draft.body_vi ?? existing?.body_vi ?? '',
    body_en: draft.body_en !== undefined ? draft.body_en : (existing?.body_en ?? null),
    start_at,
    end_at,
    location_vi: draft.location_vi !== undefined ? draft.location_vi : (existing?.location_vi ?? null),
    location_en: draft.location_en !== undefined ? draft.location_en : (existing?.location_en ?? null),
    cover_url: draft.cover_url !== undefined ? draft.cover_url : (existing?.cover_url ?? null),
    cta_type: draft.cta_type !== undefined ? draft.cta_type : (existing?.cta_type ?? 'demo'),
    cta_url: draft.cta_url !== undefined ? draft.cta_url : (existing?.cta_url ?? null),
    updated_at: nowIso(),
  };
  assertTextClean(next.title_vi, next.title_en, next.dek_vi, next.dek_en, next.body_vi, next.body_en);
  if (existing) {
    store.events = store.events.map((e) => (e.id === existing.id ? next : e));
  } else {
    store.events.unshift(next);
  }
  writeStore(store, dir);
  return next;
}

export function publishEvent(id: string, dir = resolveCmsDir()): StoredEvent {
  const store = readStore(dir);
  const event = store.events.find((e) => e.id === id);
  if (!event) throw new Error('CMS_NOT_FOUND');
  if (!event.title_vi.trim() || !event.body_vi.trim()) throw new Error('CMS_PUBLISH_MISSING_VI');
  if (new Date(event.end_at) <= new Date(event.start_at)) throw new Error('CMS_EVENT_INVALID_DATES');
  assertTextClean(event.title_vi, event.title_en, event.dek_vi, event.dek_en, event.body_vi, event.body_en);
  event.status = 'published';
  event.updated_at = nowIso();
  writeStore(store, dir);
  return event;
}

export function archiveEvent(id: string, dir = resolveCmsDir()): StoredEvent {
  const store = readStore(dir);
  const event = store.events.find((e) => e.id === id);
  if (!event) throw new Error('CMS_NOT_FOUND');
  event.status = 'archived';
  event.updated_at = nowIso();
  writeStore(store, dir);
  return event;
}

export function addMedia(
  file: { filename: string; mime: string; bytes: number; public_url: string; alt_vi?: string; alt_en?: string },
  dir = resolveCmsDir(),
): StoredMedia {
  const store = readStore(dir);
  const row: StoredMedia = {
    id: nid('med'),
    filename: file.filename,
    public_url: file.public_url,
    mime: file.mime,
    bytes: file.bytes,
    alt_vi: file.alt_vi ?? file.filename,
    alt_en: file.alt_en ?? null,
    created_at: nowIso(),
  };
  assertTextClean(row.alt_vi, row.alt_en);
  store.media.unshift(row);
  writeStore(store, dir);
  return row;
}

export function listMediaAdmin(store = readStore()): StoredMedia[] {
  return store.media;
}

export function putSlot(
  slot_key: string,
  patch: { media_url?: string | null; caption_vi?: string | null; caption_en?: string | null },
  dir = resolveCmsDir(),
): StoredSlot {
  if (!(CMS_SLOT_KEYS as readonly string[]).includes(slot_key)) throw new Error('CMS_INVALID_SLOT');
  const store = readStore(dir);
  const existing = store.slots.find((s) => s.slot_key === slot_key);
  const next: StoredSlot = {
    slot_key: slot_key as CmsSlotKey,
    media_url: patch.media_url !== undefined ? patch.media_url : (existing?.media_url ?? null),
    caption_vi: patch.caption_vi !== undefined ? patch.caption_vi : (existing?.caption_vi ?? null),
    caption_en: patch.caption_en !== undefined ? patch.caption_en : (existing?.caption_en ?? null),
    updated_at: nowIso(),
  };
  assertTextClean(next.caption_vi, next.caption_en);
  if (existing) {
    store.slots = store.slots.map((s) => (s.slot_key === slot_key ? next : s));
  } else {
    store.slots.push(next);
  }
  writeStore(store, dir);
  return next;
}

export function listSlotsAdmin(store = readStore()): StoredSlot[] {
  return store.slots;
}

export function errorStatus(err: unknown): number {
  const code = err instanceof Error ? err.message : '';
  if (code === 'CMS_NOT_FOUND') return 404;
  if (code === 'CMS_SLUG_TAKEN') return 409;
  if (code.startsWith('CMS_') || code === 'RNOSAI_FORBIDDEN') return 422;
  return 500;
}
