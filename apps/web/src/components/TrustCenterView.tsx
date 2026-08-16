import Link from 'next/link';
import type { TrustContent } from '@/lib/trust-content';
import './pages.css';

type Props = {
  content: TrustContent;
};

export function TrustCenterView({ content }: Props) {
  const showSoc2Link = content.soc2.po_approved && Boolean(content.soc2.report_url);

  return (
    <>
      <section className="mast">
        <div className="wrap page-hero">
          <p className="crumbs">
            <Link href="/en">PTTCRM</Link> / Trust
          </p>
          <h1>{content.title}</h1>
          <p className="lead">{content.lead}</p>
        </div>
      </section>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap prose">
          <h2>Security overview</h2>
          <p>{content.security_overview}</p>

          <h2>Data residency</h2>
          <p>
            <strong>{content.data_residency.primary_region}</strong>
          </p>
          <p>{content.data_residency.statement_en}</p>

          <h2>{content.soc2.type}</h2>
          <p>
            Status: <strong>{content.soc2.status.replace(/_/g, ' ')}</strong>
            {content.soc2.period_end !== 'TBD' ? ` · Period end ${content.soc2.period_end}` : null}
          </p>
          {showSoc2Link ? (
            <p>
              <a href={content.soc2.report_url!} target="_blank" rel="noopener noreferrer">
                View SOC 2 Type I report
              </a>
            </p>
          ) : (
            <p className="muted">Report link will appear here after PO and auditor sign-off.</p>
          )}

          <h2>Availability</h2>
          <p>
            Target: <strong>{content.sla.availability_pct}%</strong> monthly uptime.{' '}
            <Link href={content.sla.status_page_href}>System status →</Link>
          </p>

          <h2>Sub-processors</h2>
          <p>
            <Link href="/en/trust/subprocessors">View sub-processor list →</Link>
          </p>

          <h2>Security pack</h2>
          <p>
            <Link href="/en/trust/security">Encryption, DPA/SCCs, and IT FAQ →</Link>
          </p>

          <h2>Enterprise IT</h2>
          <p>
            <Link href="/en/trust/enterprise">SIG Lite–style questionnaire + live SSO/RBAC posture →</Link>
          </p>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 28 }}>
            <Link className="btn btn-solid" href="/en/request-demo">
              Request demo
            </Link>
            <Link className="btn btn-ghost" href="/en/legal/dpa">
              Data Processing Agreement
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
