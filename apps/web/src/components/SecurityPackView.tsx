import Link from 'next/link';
import type { SecurityPackContent } from '@/lib/trust-content';
import './pages.css';

type Props = {
  content: SecurityPackContent;
};

export function SecurityPackView({ content }: Props) {
  return (
    <>
      <section className="mast">
        <div className="wrap page-hero">
          <p className="crumbs">
            <Link href="/en">PTTCRM</Link> / <Link href="/en/trust">Trust</Link> / Security
          </p>
          <h1>{content.title}</h1>
          <p className="lead">{content.lead}</p>
        </div>
      </section>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap prose">
          {content.sections.map((section) => (
            <div key={section.title}>
              <h2>{section.title}</h2>
              <p>{section.body}</p>
            </div>
          ))}
          <p style={{ marginTop: 28 }}>
            <Link href="/en/trust">← Back to Trust Center</Link>
            {' · '}
            <Link href="/en/legal/dpa">Data Processing Agreement</Link>
            {' · '}
            <Link href="/en/trust/enterprise">Enterprise IT questionnaire</Link>
          </p>
        </div>
      </section>
    </>
  );
}
