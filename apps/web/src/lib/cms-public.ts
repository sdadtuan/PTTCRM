import type { CmsArticleCategory } from '@pttcrm/gtm-core';

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
