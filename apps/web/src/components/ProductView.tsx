import type { Locale } from '@pttcrm/gtm-core';
import Link from 'next/link';
import { getProduct, productSlugs } from '@/lib/content';
import './pages.css';

type Props = { locale: Locale; slug: string };

export function productStaticParams() {
  return productSlugs().map((slug) => ({ slug }));
}

export function ProductView({ locale, slug }: Props) {
  const p = getProduct(locale, slug);
  if (!p) return null;

  const home = locale === 'en' ? '/en' : '/vi';
  const demoHref = locale === 'en' ? '/en/request-demo' : '/vi/dang-ky-demo';
  const productBase = locale === 'en' ? '/en/product' : '/vi/san-pham';
  const others = productSlugs().filter((s) => s !== slug);

  return (
    <>
      <section className="mast">
        <div className="wrap page-hero">
          <p className="crumbs">
            <Link href={home}>PTTCRM</Link> / {p.crumb}
          </p>
          <h1>{p.title}</h1>
        </div>
      </section>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <h2>{locale === 'vi' ? 'Vấn đề' : 'Problems'}</h2>
          <ul>
            {p.problems.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <h2>{locale === 'vi' ? 'Khả năng' : 'Capabilities'}</h2>
          <ul>
            {p.capabilities.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          {others.length > 0 && (
            <>
              <h3>{p.relatedTitle}</h3>
              <ul>
                {others.map((s) => (
                  <li key={s}>
                    <Link href={`${productBase}/${s}`}>{s.toUpperCase()}</Link>
                  </li>
                ))}
              </ul>
            </>
          )}
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
