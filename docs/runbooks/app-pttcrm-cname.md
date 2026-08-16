# Runbook: app.pttcrm.com CNAME cutover

> **Scope:** W3 — public staff app URL per Master §4. Default W0–W2 remains `https://rs.pttads.vn/login`.

## Preconditions (PO sign-off)

- [ ] PO approves cutover date and rollback owner
- [ ] W3 technical exit green (ASEAN playbooks, `market_country` pipeline)
- [ ] TLS certificate covers `app.pttcrm.com`
- [ ] Sales notified of new login URL in comms templates

## DNS

1. Create CNAME: `app.pttcrm.com` → same origin as `rs.pttads.vn` (PO/IT confirm target hostname).
2. Wait for propagation; verify with `dig app.pttcrm.com`.
3. Smoke HTTPS: `curl -I https://app.pttcrm.com/login`

## Application config

**PTTCRM marketing-web** (after cutover only):

```env
NEXT_PUBLIC_LOGIN_URL=https://app.pttcrm.com/login
```

**RNOSAI** (if cookie/CORS domain restricted):

- Add `https://app.pttcrm.com` to allowed origins / redirect URIs per existing auth config.
- No schema change required for W3.

## Smoke tests post-cutover

1. Marketing site header «Log in» opens `app.pttcrm.com/login`.
2. Staff login succeeds; session persists.
3. Sandbox EN (`/sandbox/leads`) unchanged on same origin.
4. Demo form + inbox still receive leads with `market_country`.

## Rollback

1. Revert CNAME or point to previous target.
2. Set `NEXT_PUBLIC_LOGIN_URL=https://rs.pttads.vn/login` on marketing-web.
3. Confirm header login and staff bookmarks work on `rs.pttads.vn`.

## Out of scope

- Migrating `portal.pttads.vn` branding
- SOC2 / region SLA (W4)
