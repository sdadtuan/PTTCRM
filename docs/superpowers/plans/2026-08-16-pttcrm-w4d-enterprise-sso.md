# PTTCRM W4D — Enterprise SSO/MFA Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Production path cho SSO SAML/OIDC + MFA — login ops-web server-driven (không phụ thuộc WIN flag), enterprise-readiness API honest, branded login URL — không claim GA khi Keycloak chưa set.

**Architecture:** RNOSAI đã có Keycloak PKCE, MFA gate, Permission Sets. W4D bật SSO UI khi `GET /staff/auth/sso/config` trả `mode ≠ nest` + issuer. Public API thêm `mfa_enforced`. PTTCRM enterprise page + runbook deploy. CNAME `app.pttcrm.com` = env + [runbook CNAME](../runbooks/app-pttcrm-cname.md).

**Prerequisite:** [W4B enterprise IT](./2026-08-16-pttcrm-w4b-enterprise.md).

**Tech Stack:** TypeScript, Vitest, Jest, NestJS, Next.js ops-web.

## Global Constraints

- Không lộ Keycloak issuer URL trên marketing UI nếu PO chưa publish — API enterprise chỉ boolean `sso_configured`.
- `mfa_enforced=true` chỉ khi SSO configured **và** `STAFF_MFA_REQUIRED_POSITIONS` non-empty.
- Nest password login disabled khi `STAFF_AUTH_MODE=keycloak`.
- Commit site PTTCRM; staff SSO wiring RNOSAI. Không trộn một commit.

## Exit

| # | Exit | Verify |
|---|------|--------|
| 1 | Login ops-web hiện SSO khi API `mode=dual\|keycloak` + issuer | Staging UAT |
| 2 | `enterprise-readiness` có `mfa_enforced` | Jest + Vitest |
| 3 | Runbook deploy SSO/MFA + CNAME | IT review |
| 4 | `GtmPublicEnterpriseService` registered in GtmModule | API boot |

---

## Tasks

### Task 1: RNOSAI — register enterprise service + mfa_enforced

- [ ] `gtm.module.ts` — provider `GtmPublicEnterpriseService`
- [ ] `gtm-public-enterprise.service.ts` — `identity.mfa_enforced`
- [ ] Jest spec

### Task 2: RNOSAI — login server-driven SSO

- [ ] `login/page.tsx` — show SSO from `/staff/auth/sso/config`, not `WIN_SSO` only
- [ ] Branded subtitle via `NEXT_PUBLIC_STAFF_APP_HOST`
- [ ] `.env.example` — `STAFF_AUTH_MODE`, Keycloak, MFA, branded host

### Task 3: PTTCRM — types + enterprise UI + runbook

- [ ] `enterprise-types.ts` — `mfa_enforced`
- [ ] `EnterpriseTrustView.tsx` — display MFA enforced
- [ ] `docs/runbooks/staff-sso-mfa-deploy.md`
- [ ] Parent plan W4D link

---

## Out of scope

- Keycloak realm provisioning (IT)
- Permission Sets seed data
- SOC2 Type II
