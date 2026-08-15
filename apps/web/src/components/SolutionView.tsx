import type { Locale } from '@pttcrm/gtm-core';
import Link from 'next/link';
import { getSolution, solutionSlugs } from '@/lib/content';
import './pages.css';

type Props = { locale: Locale; slug: string };

export function solutionStaticParams(locale: Locale) {
  return solutionSlugs(locale).map((slug) => ({ slug }));
}

export function SolutionView({ locale, slug }: Props) {
  const s = getSolution(locale, slug);
  if (!s) return null;

  const home = locale === 'en' ? '/en' : '/vi';
  const demoHref = `${locale === 'en' ? '/en/request-demo' : '/vi/dang-ky-demo'}?industry=${s.industry}&sku=${s.sku}`;

  return (
    <>
      <section className="mast">
        <div className="wrap page-hero">
          <p className="crumbs">
            <Link href={home}>PTTCRM</Link> / {locale === 'vi' ? 'Giải pháp' : 'Solutions'}
          </p>
          <h1>{s.title}</h1>
          <p className="lead">{s.skuNote}</p>
        </div>
      </section>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <h2>{s.painsLabel}</h2>
          <ul>
            {s.pains.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <h2>{s.proofsLabel}</h2>
          <p className="lead">{s.proofsLead}</p>
          <ul>
            {s.proofs.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <section className="cta-band" style={{ marginTop: 48 }}>
            <h2>{s.ctaTitle}</h2>
            <Link className="btn btn-invert" href={demoHref}>
              {locale === 'vi' ? 'Đăng ký Demo' : 'Request demo'}
            </Link>
          </section>
        </div>
      </section>
    </>
  );
}
