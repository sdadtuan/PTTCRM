import type { Locale } from '@pttcrm/gtm-core';
import Link from 'next/link';
import {
  articleHref,
  CATEGORY_LABELS,
  fetchArticles,
  formatArticleDate,
  newsListHref,
} from '@/lib/cms';
import './pages.css';

type Props = { locale: Locale; category?: string };

export async function NewsListView({ locale, category }: Props) {
  const items = await fetchArticles(locale, category);
  const title = locale === 'vi' ? 'Tin tức' : 'News';
  const empty =
    locale === 'vi'
      ? 'Chưa có bài published — tạo trong CMS hoặc chạy seed.'
      : 'No published articles yet — use CMS or run seed.';
  const demoHref = locale === 'en' ? '/en/request-demo' : '/vi/dang-ky-demo';

  return (
    <>
      <section className="mast">
        <div className="wrap page-hero">
          <h1>{title}</h1>
        </div>
      </section>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          {items.length === 0 ? (
            <>
              <p className="lead">{empty}</p>
              <Link className="btn btn-solid" href={demoHref}>
                {locale === 'vi' ? 'Đăng ký Demo' : 'Request demo'}
              </Link>
            </>
          ) : (
            <div className="news-grid">
              {items.map((a, i) => (
                <Link key={a.slug} className={`news-card${i === 0 ? ' feature' : ''}`} href={articleHref(locale, a.slug)}>
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
          )}
        </div>
      </section>
    </>
  );
}

export { newsListHref };
