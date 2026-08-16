import type { Locale } from '@pttcrm/gtm-core';
import Link from 'next/link';
import { getResourcesHub } from '@/lib/resources';
import './pages.css';

type Props = { locale: Locale };

export function ResourcesHubView({ locale }: Props) {
  const hub = getResourcesHub(locale);
  const home = locale === 'en' ? '/en' : '/vi';

  return (
    <>
      <section className="mast">
        <div className="wrap page-hero">
          <p className="crumbs">
            <Link href={home}>PTTCRM</Link> / {hub.title}
          </p>
          <h1>{hub.title}</h1>
          <p className="lead">{hub.lead}</p>
        </div>
      </section>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="resource-grid">
            {hub.tiles.map((tile) => (
              <Link key={tile.id} href={tile.href} className="resource-tile">
                <h2>{tile.title}</h2>
                <p>{tile.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
