import type { Locale } from '@pttcrm/gtm-core';
import Link from 'next/link';
import { getLegalPage, legalSlugs } from '@/lib/content';
import './pages.css';

type Props = { locale: Locale; slug: string };

export function legalStaticParams(locale: Locale) {
  return legalSlugs(locale).map((slug) => ({ slug }));
}

export function LegalView({ locale, slug }: Props) {
  const page = getLegalPage(locale, slug);
  if (!page) return null;

  const home = locale === 'en' ? '/en' : '/vi';

  return (
    <>
      <section className="mast">
        <div className="wrap page-hero">
          <p className="crumbs">
            <Link href={home}>PTTCRM</Link> / {page.title}
          </p>
          <h1>{page.title}</h1>
          <p className="lead">{page.lead}</p>
        </div>
      </section>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap article-body">
          {page.sections.map((sec) => (
            <div key={sec.title || sec.body.slice(0, 24)}>
              {sec.title && <h2>{sec.title}</h2>}
              <p>{sec.body}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
