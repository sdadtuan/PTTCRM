# PTTCRM W4C — Moat Demo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Demo closed-loop moat trong 60 phút — hub spend map ≥80%, portal attribution footer, sandbox board theo ngành — không thêm trang marketing.

**Architecture:** RNOSAI ops-web sandbox board dày hơn (pipeline ngành, hub map badge, portal ROAS preview + attribution footer). API `GET /api/v1/gtm/sandbox/board` trả cùng payload cho sandbox visitor JWT. PTTCRM thêm runbook sales + `gtm-core` parse types. Meta hub KPI grid hiện badge ≥80% khi unmapped ≤20%.

**Prerequisite:** [W4B enterprise IT](./2026-08-16-pttcrm-w4b-enterprise.md), W2 sandbox EN shell.

**Tech Stack:** TypeScript, Vitest, Jest, React 19, NestJS.

## Global Constraints

- Brand công khai: `PTTCRM`. CI fail nếu `RNOSAI` trong `apps/web`.
- BR-GTM-018: sandbox board luôn `sample_data: true` — không in số PO-signed.
- Hub map demo: `hub_mapped_pct ≥ 80` trên sample data; không claim production coverage.
- Commit site PTTCRM; sandbox board API + ops-web trong `../RNOSAI`. Không trộn một commit.

## Exit

| # | Exit | Verify |
|---|------|--------|
| 1 | Sandbox board có pipeline ngành + hub map badge + portal preview | Manual UAT `/sandbox/board/agency` |
| 2 | `GET /api/v1/gtm/sandbox/board` trả moat payload cho sandbox JWT | Jest |
| 3 | Meta hub KPI grid badge ≥80% khi unmapped ≤20% | Visual / unit |
| 4 | Runbook 60 phút moat với staging URLs | PO/Sales review |
| 5 | `gtm-core` parse `SandboxMoatBoard` | Vitest |

---

## File map

| Repo | Path | Change |
|------|------|--------|
| PTTCRM | `packages/gtm-core/src/sandbox-types.ts` | Types + parse |
| PTTCRM | `docs/runbooks/demo-60-minute-moat.md` | Sales runbook |
| RNOSAI | `services/ptt-crm-api/src/gtm/gtm-sandbox-board.service.ts` | Rich moat board |
| RNOSAI | `services/ptt-crm-api/src/gtm/gtm-sandbox-board.controller.ts` | GET board |
| RNOSAI | `services/ops-web/src/components/sandbox/SandboxBoardView.tsx` | Rich UI |
| RNOSAI | `services/ops-web/src/lib/sandbox/board-data.ts` | Mirror payload |
| RNOSAI | `services/ops-web/src/lib/sandbox/leads-seed.ts` | Industry scenarios |
| RNOSAI | `services/ops-web/src/components/meta/HubMapCoverageBadge.tsx` | ≥80% badge |
| RNOSAI | `services/ops-web/src/components/meta/MetaHubKpiGrid.tsx` | Wire badge |

---

## Tasks

### Task 1: gtm-core sandbox moat types

- [ ] **Step 1:** `sandbox-types.ts` — `SandboxMoatBoard`, attribution, pipeline, portal preview
- [ ] **Step 2:** `sandbox-types.spec.ts` — parse valid/invalid JSON
- [ ] **Step 3:** Export from `index.ts`

### Task 2: RNOSAI board service + API

- [ ] **Step 1:** Extend `gtm-sandbox-board.service.ts` with industry moat configs
- [ ] **Step 2:** `gtm-sandbox-board.controller.ts` — JWT sandbox visitor only
- [ ] **Step 3:** Register controller + guard in `gtm.module.ts`
- [ ] **Step 4:** Jest spec for agency/bds/fnb boards + 403 non-sandbox

### Task 3: ops-web sandbox UI

- [ ] **Step 1:** `SandboxBoardView.tsx` — KPI, pipeline, spend map table, portal card, attribution footer
- [ ] **Step 2:** Wire `sandbox/board/[industry]/page.tsx`
- [ ] **Step 3:** Industry-specific leads in `leads-seed.ts`
- [ ] **Step 4:** Vitest caps + board-data tests

### Task 4: Meta hub ≥80% badge

- [ ] **Step 1:** `HubMapCoverageBadge.tsx`
- [ ] **Step 2:** Render in `MetaHubKpiGrid` when unmapped ≤20%

### Task 5: Sales runbook

- [ ] **Step 1:** `docs/runbooks/demo-60-minute-moat.md` — 5 scenes, URLs, talk track, proof checkpoints
- [ ] **Step 2:** Link from parent plan W4C section

---

## Out of scope

- Full WIN-1 spend map sankey visualization
- Sandbox visitor access to portal-web (separate wave)
- Named case + logo (Wave D / PO)
