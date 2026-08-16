# Runbook: Staff SSO + MFA production (W4D)

> **Scope:** WIN R-09 — SAML/OIDC via Keycloak + MFA for privileged positions.  
> **Prerequisite:** PostgreSQL staff (`PTT_CRM_STAFF_PG=1`), Permission Sets module.

## 1. Keycloak (IT)

1. Create realm (or use existing) with client `ptt-ops-web` — public client, PKCE S256.
2. Valid redirect URIs:
   - `https://rs.pttads.vn/login/callback`
   - `https://app.pttcrm.com/login/callback` (after CNAME)
3. Enable OTP credential type for MFA.
4. Map groups → positions via RNOSAI `/admin/crm/sso` (group map table).

## 2. RNOSAI API env

```env
STAFF_AUTH_MODE=dual
# keycloak-only after cutover: STAFF_AUTH_MODE=keycloak

PTT_STAFF_KEYCLOAK_ISSUER=https://auth.example.com/realms/ptt
PTT_STAFF_KEYCLOAK_FETCH_ISSUER=
PTT_STAFF_KEYCLOAK_AUDIENCE=ptt-ops-web
PTT_STAFF_KEYCLOAK_CLIENT_ID=ptt-ops-web

STAFF_MFA_REQUIRED_POSITIONS=gdkd,super-admin
STAFF_SCOPE_PILOT=1

PTT_CRM_STAFF_PG=1
```

Public GTM (enterprise-readiness):

```env
GTM_PUBLIC_STAFF_LOGIN_URL=https://rs.pttads.vn/login
GTM_PUBLIC_BRANDED_LOGIN_URL=https://app.pttcrm.com/login
```

## 3. ops-web env

```env
NEXT_PUBLIC_PTT_API_URL=https://api.example.com
# Optional label on login card (defaults to window hostname):
NEXT_PUBLIC_STAFF_APP_HOST=app.pttcrm.com
```

**W4D:** SSO button appears when API returns `mode ≠ nest` and issuer is set — **no** `NEXT_PUBLIC_WIN_SSO=1` required.

Optional WIN flags (admin UI only):

```env
NEXT_PUBLIC_WIN_PERMISSION_SETS=1
NEXT_PUBLIC_WIN_SCOPE_PILOT=1
```

## 4. PTTCRM marketing env

```env
NEXT_PUBLIC_GTM_API_BASE=https://api.example.com
NEXT_PUBLIC_LOGIN_URL=https://app.pttcrm.com/login
```

See [app.pttcrm.com CNAME](./app-pttcrm-cname.md) for DNS cutover.

## 5. Smoke tests

| Step | Expected |
|------|----------|
| `GET /api/v1/public/gtm/enterprise-readiness` | `sso_configured=true`, `mfa_enforced=true` when MFA positions set |
| `/login` | SSO button visible in dual/keycloak mode |
| SSO login (non-MFA user) | Session + `/` redirect |
| SSO login (gdkd without OTP) | 403 → redirect `/login/mfa` |
| `/en/trust/enterprise` | Live posture shows MFA enforced |
| Sandbox `demo_*` | Password login still works (nest path) |

## 6. Rollback

1. Set `STAFF_AUTH_MODE=nest`
2. Remove `PTT_STAFF_KEYCLOAK_ISSUER`
3. SSO button hides; password login restored
4. Revert `NEXT_PUBLIC_LOGIN_URL` if CNAME rolled back

## Honest posture

- `sso_configured=false` → enterprise page must **not** claim SSO GA.
- Permission Sets require `PTT_CRM_STAFF_PG=1` — API reports `permission_sets` from that flag.
