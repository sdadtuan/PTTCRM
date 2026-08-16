# PTTCRM W4B — Enterprise IT Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Mở cửa checklist IT enterprise: questionnaire SIG Lite công khai + live SSO/RBAC posture từ API — không claim SSO GA khi deployment chưa bật Keycloak.

**Architecture:** PTTCRM `/en/trust/enterprise` (JSON Q&A + client poll). RNOSAI `GET /api/v1/public/gtm/enterprise-readiness` (mode, MFA positions, permission sets, scope pilot, login URLs — no secrets). `gtm-core` parse types.

**Prerequisite:** [W4A credibility](./2026-08-16-pttcrm-w4a-credibility.md).

## Global Constraints

- Brand công khai: `PTTCRM`. No `RNOSAI` on marketing UI.
- Không lộ issuer URL, client secret, JWT, hoặc PostgreSQL connection trên public API.
- Honest posture: `sso_configured=false` khi chưa set `PTT_STAFF_KEYCLOAK_ISSUER`.
- Commit site PTTCRM; public API RNOSAI. Không trộn một commit.

---
