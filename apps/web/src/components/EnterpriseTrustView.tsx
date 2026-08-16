'use client';

import type { PublicEnterpriseReadiness } from '@pttcrm/gtm-core';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { fetchPublicEnterpriseReadiness } from '@/lib/public-enterprise';
import type { EnterpriseQuestionnaireContent } from '@/lib/trust-content';
import './pages.css';

type Props = {
  content: EnterpriseQuestionnaireContent;
};

function yesNo(v: boolean): string {
  return v ? 'Yes' : 'No (not enabled in this deployment)';
}

export function EnterpriseTrustView({ content }: Props) {
  const [live, setLive] = useState<PublicEnterpriseReadiness | null>(null);

  const refresh = useCallback(async () => {
    setLive(await fetchPublicEnterpriseReadiness());
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return (
    <>
      <section className="mast">
        <div className="wrap page-hero">
          <p className="crumbs">
            <Link href="/en">PTTCRM</Link> / <Link href="/en/trust">Trust</Link> / Enterprise
          </p>
          <h1>{content.title}</h1>
          <p className="lead">{content.lead}</p>
        </div>
      </section>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap prose">
          {live ? (
            <>
              <h2>Live deployment posture</h2>
              <p className="muted" style={{ fontSize: 13 }}>
                Updated {new Date(live.updated_at).toLocaleString('en-GB', { timeZone: 'UTC' })} UTC
              </p>
              <ul>
                <li>
                  SSO mode: <strong>{live.identity.sso_mode}</strong> · Keycloak configured:{' '}
                  <strong>{yesNo(live.identity.sso_configured)}</strong>
                </li>
                <li>
                  Nest password login: <strong>{yesNo(live.identity.nest_password_login)}</strong>
                </li>
                <li>
                  MFA enforced (SSO + OTP positions):{' '}
                  <strong>{yesNo(live.identity.mfa_enforced)}</strong>
                </li>
                <li>
                  MFA required positions:{' '}
                  <strong>
                    {live.identity.mfa_required_positions.length > 0
                      ? live.identity.mfa_required_positions.join(', ')
                      : 'none configured'}
                  </strong>
                </li>
                <li>
                  Permission Sets (PostgreSQL staff):{' '}
                  <strong>{yesNo(live.rbac.permission_sets)}</strong>
                </li>
                <li>
                  Row-level scope pilot: <strong>{yesNo(live.rbac.row_level_scope_pilot)}</strong>
                </li>
                <li>
                  Staff login:{' '}
                  <a href={live.login.staff_url} target="_blank" rel="noopener noreferrer">
                    {live.login.staff_url.replace(/^https:\/\//, '')}
                  </a>
                  {live.login.branded_staff_url ? (
                    <>
                      {' '}
                      · Branded:{' '}
                      <a
                        href={live.login.branded_staff_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {live.login.branded_staff_url.replace(/^https:\/\//, '')}
                      </a>
                    </>
                  ) : null}
                </li>
              </ul>
            </>
          ) : (
            <p className="muted">
              Live posture unavailable — set NEXT_PUBLIC_GTM_API_BASE to load SSO/RBAC flags from
              staging or production.
            </p>
          )}

          {content.categories.map((cat) => (
            <div key={cat.id}>
              <h2>{cat.title}</h2>
              {cat.items.map((item) => (
                <div key={item.question}>
                  <h3>{item.question}</h3>
                  <p>{item.answer}</p>
                </div>
              ))}
            </div>
          ))}

          <p style={{ marginTop: 28 }}>
            <Link href="/en/trust">← Trust Center</Link>
            {' · '}
            <Link href="/en/trust/security">Security pack</Link>
            {' · '}
            <Link href="/en/legal/dpa">DPA</Link>
          </p>
        </div>
      </section>
    </>
  );
}
