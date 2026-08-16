import type { Locale } from '@pttcrm/gtm-core';
import Link from 'next/link';
import { CmsBody } from '@/lib/cms-body';
import { formatArticleDate } from '@/lib/cms';
import type { ArticleDetail } from '@/lib/cms';
import './pages.css';

type Props = {
  locale: Locale;
  article: ArticleDetail;
  listHref: string;
  listLabel: string;
};

export function ArticleView({ locale, article, listHref, listLabel }: Props) {
  const demoHref = locale === 'en' ? '/en/request-demo' : '/vi/dang-ky-demo';

  return (
    <>
      <section className="mast">
        <div className="wrap page-hero">
          <p className="crumbs">
            <Link href={listHref}>{listLabel}</Link> / {article.title}
          </p>
          <time dateTime={article.published_at}>{formatArticleDate(article.published_at, locale)}</time>
          <h1>{article.title}</h1>
          <p className="lead">{article.dek}</p>
        </div>
      </section>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap article-body">
          <CmsBody body={article.body} />
          <p style={{ marginTop: 32 }}>
            <Link className="btn btn-solid" href={demoHref}>
              {locale === 'vi' ? 'Đăng ký Demo' : 'Request demo'}
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
