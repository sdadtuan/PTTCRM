'use client';

import type { CmsArticleCategory } from '@pttcrm/gtm-core';
import type { Locale } from '@pttcrm/gtm-core';
import Link from 'next/link';
import { useState } from 'react';
import {
  articleHref,
  CATEGORY_LABELS,
  formatArticleDate,
  type ArticleCard,
} from '@/lib/cms';

const FILTERS: { id: 'all' | CmsArticleCategory; vi: string; en: string }[] = [
  { id: 'all', vi: 'Tất cả', en: 'All' },
  { id: 'insight', vi: 'Góc nhìn', en: 'Insight' },
  { id: 'nganh', vi: 'Theo ngành', en: 'Industry' },
  { id: 'huong-dan', vi: 'Hướng dẫn', en: 'Guide' },
];

type Props = {
  locale: Locale;
  articles: ArticleCard[];
  demoHref: string;
};

export function NewsList({ locale, articles, demoHref }: Props) {
  const [cat, setCat] = useState<'all' | CmsArticleCategory>('all');
  const t = locale === 'vi';
  const visible = cat === 'all' ? articles : articles.filter((a) => a.category === cat);

  if (articles.length === 0) {
    return (
      <div className="empty-state">
        <p>{t ? 'Chưa có bài viết.' : 'No articles yet.'}</p>
        <Link className="btn btn-solid" href={demoHref} style={{ marginTop: 16 }}>
          {t ? 'Đăng ký Demo' : 'Request demo'}
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="filters" role="tablist">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            className="filter"
            type="button"
            aria-selected={cat === f.id}
            onClick={() => setCat(f.id)}
          >
            {t ? f.vi : f.en}
          </button>
        ))}
      </div>
      <div className="news-grid" style={{ marginTop: 36 }}>
        {visible.map((a, i) => (
          <Link
            key={a.slug}
            className={`news-card${i === 0 && cat === 'all' ? ' feature' : ''}`}
            href={articleHref(locale, a.slug)}
          >
            <div className="news-thumb">
              <b>{String(i + 1).padStart(2, '0')}</b>
              <span>{CATEGORY_LABELS[locale][a.category]}</span>
            </div>
            <div className="news-body">
              <time dateTime={a.published_at}>{formatArticleDate(a.published_at, locale)}</time>
              <h3>{a.title}</h3>
              <p>{a.dek}</p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
