import Link from 'next/link';
import type { SubprocessorsContent } from '@/lib/trust-content';
import './pages.css';

type Props = {
  content: SubprocessorsContent;
};

export function SubprocessorsView({ content }: Props) {
  return (
    <>
      <section className="mast">
        <div className="wrap page-hero">
          <p className="crumbs">
            <Link href="/en">PTTCRM</Link> / <Link href="/en/trust">Trust</Link> / Sub-processors
          </p>
          <h1>{content.title}</h1>
          <p className="lead">{content.lead}</p>
        </div>
      </section>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="data-table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Purpose</th>
                  <th>Region</th>
                  <th>DPA</th>
                </tr>
              </thead>
              <tbody>
                {content.rows.map((row) => (
                  <tr key={row.name}>
                    <td>{row.name}</td>
                    <td>{row.purpose}</td>
                    <td>{row.region}</td>
                    <td>
                      {row.dpa_url ? (
                        <a href={row.dpa_url} target="_blank" rel="noopener noreferrer">
                          Link
                        </a>
                      ) : (
                        '—'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ marginTop: 24 }}>
            <Link href="/en/trust">← Back to Trust Center</Link>
          </p>
        </div>
      </section>
    </>
  );
}
