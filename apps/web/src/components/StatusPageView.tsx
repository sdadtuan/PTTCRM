'use client';

import type { PublicStatusComponent, PublicStatusResponse } from '@pttcrm/gtm-core';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { fetchPublicStatus } from '@/lib/public-status';
import type { StatusCopyContent } from '@/lib/trust-content';
import './pages.css';

type Props = {
  copy: StatusCopyContent;
};

function statusClass(status: PublicStatusComponent['status']): string {
  if (status === 'operational') return 'badge';
  if (status === 'degraded') return 'badge warn';
  return 'badge danger';
}

function statusLabel(status: PublicStatusComponent['status']): string {
  if (status === 'operational') return 'Operational';
  if (status === 'degraded') return 'Degraded';
  return 'Outage';
}

export function StatusPageView({ copy }: Props) {
  const [data, setData] = useState<PublicStatusResponse | null>(null);
  const [lastFetch, setLastFetch] = useState<Date | null>(null);
  const [live, setLive] = useState(true);

  const refresh = useCallback(async () => {
    const next = await fetchPublicStatus();
    setData(next);
    setLastFetch(new Date());
    setLive(next != null);
  }, []);

  useEffect(() => {
    void refresh();
    const id = window.setInterval(() => void refresh(), 60_000);
    return () => window.clearInterval(id);
  }, [refresh]);

  const slaPct = data?.sla_target_pct ?? copy.availability_pct;

  return (
    <>
      <section className="mast">
        <div className="wrap page-hero">
          <p className="crumbs">
            <Link href="/en">PTTCRM</Link> / Status
          </p>
          <h1>{copy.title}</h1>
          <p className="lead">{copy.lead}</p>
        </div>
      </section>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap prose">
          <p>{copy.sla_statement}</p>
          <p>
            Target: <strong>{slaPct}%</strong> monthly availability
            {data?.updated_at ? (
              <>
                {' '}
                · Updated {new Date(data.updated_at).toLocaleString('en-GB', { timeZone: 'UTC' })} UTC
              </>
            ) : null}
          </p>
          {!live ? <p className="muted">{copy.fallback_degraded_message}</p> : null}
          {lastFetch ? (
            <p className="muted" style={{ fontSize: 13 }}>
              Last checked: {lastFetch.toLocaleString()}
            </p>
          ) : null}

          <div className="resource-grid" style={{ marginTop: 24 }}>
            {(data?.components ?? []).map((c) => (
              <div key={c.id} className="resource-tile">
                <h2>{c.name}</h2>
                <p>
                  <span className={statusClass(c.status)}>{statusLabel(c.status)}</span>
                </p>
                {c.region ? <p className="muted">{c.region}</p> : null}
              </div>
            ))}
          </div>

          <p style={{ marginTop: 28 }}>
            <Link href="/en/trust">Trust Center</Link> · <Link href="/en/request-demo">Request demo</Link>
          </p>
        </div>
      </section>
    </>
  );
}
