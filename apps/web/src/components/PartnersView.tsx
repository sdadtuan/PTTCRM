import Link from 'next/link';
import Image from 'next/image';
import type { PartnersContent } from '@/lib/market-content';
import './pages.css';

type Props = {
  content: PartnersContent;
};

export function PartnersView({ content }: Props) {
  const { featured, cta } = content;

  return (
    <>
      <section className="mast">
        <div className="wrap page-hero">
          <p className="crumbs">
            <Link href="/en">PTTCRM</Link> / Partners
          </p>
          <h1>PTTCRM partners</h1>
          <p className="lead">Regional introductions for ASEAN performance agencies.</p>
        </div>
      </section>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <article className="resource-tile" style={{ maxWidth: 560 }}>
            <Image
              src={featured.logo_path}
              alt={`${featured.name} logo`}
              width={120}
              height={48}
              style={{ marginBottom: 16 }}
            />
            <h2>{featured.name}</h2>
            <p>{featured.description_en}</p>
            {featured.website_url ? (
              <p>
                <a href={featured.website_url} target="_blank" rel="noopener noreferrer">
                  {featured.website_url.replace(/^https?:\/\//, '')}
                </a>
              </p>
            ) : null}
          </article>
          <p style={{ marginTop: 24 }}>
            <Link className="btn btn-solid" href={cta.href}>
              {cta.label}
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
