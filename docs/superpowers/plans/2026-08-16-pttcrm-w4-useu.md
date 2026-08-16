# PTTCRM W4 — US/EU (Trust & SLA) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Parent:** [system-implementation](./2026-08-15-pttcrm-system-implementation.md)  
> **Spec:** Master §8 W4 · DEC-06 US/EU · §9 ngoài phạm vi SOC2 trước W4  
> **Prerequisite:** [W3 ASEAN exit](./2026-08-16-pttcrm-w3-asean.md) — 4 playbooks, `market_country`, inbox filter; **≥ 3 demo ASEAN pipeline** (kinh doanh).

**Goal:** Mở cửa bán US/EU bằng **niềm tin kỹ thuật**: Trust Center công khai (SOC2 Type 1, subprocessors, residency Singapore), trang status + cam kết **SLA 99.9%**, và runbook vận hành — **không** dịch 129 màn ops-web trong W4.

**Architecture:** PTTCRM publish `/en/trust` + `/en/status` (JSON + ISR/static). RNOSAI expose **public read-only** status API (health các component GTM/site phụ thuộc) — **không** lộ RNOSAI brand trên UI. SOC2 Type 1 = chủ yếu **docs + evidence** (IT/Compliance/PO); code W4 hỗ trợ **hiển thị** và **đo uptime**, không thay auditor.

**Tech Stack:** Node 20, Next.js 15, Vitest, Playwright, NestJS, Jest, PostgreSQL (existing), optional Prometheus/uptime checker (runbook).

## Global Constraints

- Brand công khai: `PTTCRM`. CI fail nếu `RNOSAI` trong `apps/web` hoặc CMS publish body/alt.
- CTA chính vẫn `Request demo` / `Đăng ký Demo`. Trust/Status **không** thay demo làm CTA chính.
- **Không** trial 30 ngày. **Không** giá/user < `200000` VND hoặc < `15` USD/user/tháng.
- Trust/Status **chỉ EN** (`/en/trust`, `/en/status`). VI site không bắt buộc bản dịch W4.
- SOC2 report PDF / badge URL: **PO + auditor** cung cấp — site chỉ link khi `po_approved: true` (BR-GTM-018 áp dụng: không bịa chứng chỉ).
- Subprocessor list: PO/legal review trước prod — JSON template với placeholder.
- Commit site trong PTTCRM; status API + compliance docs trong `../RNOSAI`. Không trộn hai repo một commit.
- **Cấm** bắt đầu W4 khi W3 chưa có **3 demo ASEAN** trong pipeline (Master §8).

---

## Exit W4 (bắt buộc trước mở rộng W4+)

| # | Tiêu chí | Cách verify |
|---|----------|-------------|
| 1 | `/en/trust` — SOC2 Type 1 section, residency Singapore, link DPA/subprocessors | Playwright + content spec |
| 2 | `/en/status` — component list + SLA 99.9% statement + last updated | Playwright |
| 3 | Public API `GET /api/v1/public/gtm/status` → 200 JSON (no auth) | Jest + curl staging |
| 4 | Runbook SLA 99.9% + region Singapore + SOC2 evidence index | Doc review PO/IT |
| 5 | `vitest` + `build` PTTCRM; Jest public status pass | CI |

**Exit kinh doanh (Master §8):** **SOC2 Type 1** report phát hành (auditor sign-off) — **ngoài repo**, Sales lưu PDF/link; PO xác nhận Trust Center link đúng report.

**Exit vận hành:** Uptime rolling 30 ngày ≥ **99.9%** trên các component public (marketing-web, demo API, CMS read) — đo theo runbook, không chặn merge code nếu chưa đủ 30 ngày prod.

---

## Luồng W4

```mermaid
flowchart LR
  subgraph PTTCRM
    TR[/en/trust]
    ST[/en/status]
    SUB[subprocessors JSON]
  end
  subgraph RNOSAI
    API[GET public/gtm/status]
    HC[health probes]
    DOC[SOC2 evidence docs]
  end
  subgraph PO_IT
    AUD[SOC2 Type 1 report]
    MON[uptime monitor]
  end
  TR --> SUB
  ST -->|poll 60s| API
  API --> HC
  MON --> ST
  AUD --> TR
  DOC --> AUD
```

---

## Traceability (W4 — bổ sung SRS v1.4 draft)

| ID | Mô tả ngắn |
|----|------------|
| FR-WEB-044 | Trust Center EN — SOC2 Type 1, residency, security overview |
| FR-WEB-045 | Trang status công khai + cam kết SLA 99.9% |
| FR-WEB-046 | Danh sách subprocessors công khai (EN) |
| FR-GTM-024 | Public status API (component health, no secrets) |
| FR-CMP-001 | SOC2 Type 1 evidence index + control mapping (docs) |
| GTM-UC-044 | VIS: đọc Trust Center → CTA demo / DPA |
| GTM-UC-045 | VIS: kiểm tra status trước khi ký |
| GTM-UC-046 | IT: thu evidence theo FR-CMP-001 |
| SCR-WEB-020 | Template Trust Center |
| SCR-WEB-021 | Template Status |

---

## File map

**PTTCRM**

| Path | Responsibility |
|------|----------------|
| `packages/gtm-core/src/trust-types.ts` | `TrustContent`, `Subprocessor`, `StatusComponent` types |
| `apps/web/content/en/trust.json` | Trust copy PO/legal |
| `apps/web/content/en/subprocessors.json` | Subprocessor table |
| `apps/web/content/en/status.json` | Static fallback labels + SLA text |
| `apps/web/src/components/TrustCenterView.tsx` | Render trust + SOC2 block |
| `apps/web/src/components/StatusPageView.tsx` | Poll public status API |
| `apps/web/src/lib/trust-content.ts` | Load JSON |
| `apps/web/src/lib/public-status.ts` | Fetch `NEXT_PUBLIC_GTM_API_BASE/.../status` |
| `apps/web/src/app/en/trust/page.tsx` | Trust page |
| `apps/web/src/app/en/status/page.tsx` | Status page |
| `apps/web/src/app/en/trust/subprocessors/page.tsx` | Optional dedicated subprocessors |
| `apps/web/src/components/nav.ts` | Footer EN: Trust, Status |
| `apps/web/e2e/w4-trust.spec.ts` | Playwright W4 |
| `.github/workflows/w4-ci.yml` | CI gate W4 |

**RNOSAI**

| Path | Responsibility |
|------|----------------|
| `services/ptt-crm-api/src/gtm/gtm-public-status.controller.ts` | `GET /api/v1/public/gtm/status` |
| `services/ptt-crm-api/src/gtm/gtm-public-status.service.ts` | Aggregate DB ping, CMS ping, version |
| `docs/compliance/soc2-type1/README.md` | Evidence index + control map |
| `docs/compliance/soc2-type1/control-matrix.csv` | TSC mapping template |
| `docs/runbooks/region-singapore-data-residency.md` | Residency statement for legal |
| `docs/runbooks/sla-999-uptime-monitoring.md` | 99.9% formula + tooling |

---

## Task 1: gtm-core — trust & status types

**Files:**
- Create: `packages/gtm-core/src/trust-types.ts`
- Modify: `packages/gtm-core/src/index.ts`
- Test: `packages/gtm-core/src/trust-types.spec.ts`

**Interfaces:**
- `export type PublicStatusComponent = { id: string; name: string; status: 'operational' | 'degraded' | 'outage'; region?: string }`
- `export type PublicStatusResponse = { updated_at: string; sla_target_pct: 99.9; components: PublicStatusComponent[] }`
- `export type SubprocessorRow = { name: string; purpose: string; region: string; dpa_url?: string }`

- [ ] **Step 1: Failing tests** — parse sample JSON fixtures
- [ ] **Step 2: Implement types + guards**
- [ ] **Step 3: `npm test -- packages/gtm-core` PASS**
- [ ] **Step 4: Commit (PTTCRM)**

---

### Task 2: Trust + subprocessors content JSON

**Files:**
- Create: `apps/web/content/en/trust.json`
- Create: `apps/web/content/en/subprocessors.json`
- Modify: `apps/web/content/content.spec.ts`

**Schema `trust.json` (rút gọn):**
```json
{
  "soc2": {
    "type": "SOC 2 Type I",
    "status": "in_progress",
    "report_url": null,
    "po_approved": false,
    "period_end": "TBD"
  },
  "data_residency": {
    "primary_region": "Singapore (AWS ap-southeast-1)",
    "statement_en": "Production CRM and portal data for PTTCRM customers is hosted in Singapore unless contractually agreed otherwise."
  },
  "sla": {
    "availability_pct": 99.9,
    "status_page_href": "/en/status"
  },
  "seo": { "title": "...", "description": "..." }
}
```

- PO flip `po_approved: true` + `report_url` khi auditor xong — **không** ship URL giả.
- Subprocessors: Stripe, email provider, cloud host — PO/legal điền tên thật.

- [ ] **Step 1: content.spec — no RNOSAI, soc2 không claim «certified» khi `po_approved: false`**
- [ ] **Step 2: Draft JSON**
- [ ] **Step 3: vitest PASS**
- [ ] **Step 4: Commit (PTTCRM)**

---

### Task 3: TrustCenterView + `/en/trust` (FR-WEB-044)

**Files:**
- Create: `apps/web/src/components/TrustCenterView.tsx`
- Create: `apps/web/src/lib/trust-content.ts`
- Create: `apps/web/src/app/en/trust/page.tsx`
- Test: component spec — SOC2 block hidden link when `report_url` null

**Behavior:**
- Sections: Security overview, Data residency (Singapore), SOC2 Type 1, SLA link → `/en/status`
- CTA secondary: Request demo, link DPA `/en/legal/dpa`
- SOC2 badge/link chỉ render khi `soc2.po_approved && soc2.report_url`

- [ ] **Step 1: Component test**
- [ ] **Step 2: Implement**
- [ ] **Step 3: `npm run build` PASS**
- [ ] **Step 4: Commit (PTTCRM)**

---

### Task 4: Subprocessors page (FR-WEB-046)

**Files:**
- Create: `apps/web/src/app/en/trust/subprocessors/page.tsx` (or `/en/legal/subprocessors` — chọn ** một**, link từ Trust)
- Reuse table component in TrustCenterView optional

- [ ] **Step 1: Table renders rows from JSON**
- [ ] **Step 2: Cross-link Trust ↔ Subprocessors**
- [ ] **Step 3: Commit (PTTCRM)**

---

### Task 5: StatusPageView + `/en/status` (FR-WEB-045)

**Files:**
- Create: `apps/web/content/en/status.json` — SLA copy, component labels
- Create: `apps/web/src/lib/public-status.ts`
- Create: `apps/web/src/components/StatusPageView.tsx`
- Create: `apps/web/src/app/en/status/page.tsx`

**Behavior:**
- Client poll `GET {NEXT_PUBLIC_GTM_API_BASE}/api/v1/public/gtm/status` mỗi 60s
- Hiển thị «99.9% monthly availability target» + per-component chip (operational/degraded/outage)
- API fail → show static degraded + last fetch time (không crash page)
- JSON-LD `WebPage` — **không** fake uptime numbers in schema

- [ ] **Step 1: Mock fetch unit test**
- [ ] **Step 2: Implement StatusPageView**
- [ ] **Step 3: build PASS**
- [ ] **Step 4: Commit (PTTCRM)**

---

### Task 6: Nav, footer, sitemap, legal cross-links

**Files:**
- Modify: `apps/web/src/components/nav.ts` — EN footer/resources: Trust, System status
- Modify: `apps/web/src/app/sitemap.ts` — `/en/trust`, `/en/status`, subprocessors path
- Modify: `apps/web/content/en/legal.json` — DPA section link subprocessors + Singapore residency one-liner

- [ ] **Step 1: nav.spec + sitemap**
- [ ] **Step 2: Implement**
- [ ] **Step 3: Commit (PTTCRM)**

---

### Task 7: Playwright W4 + CI

**Files:**
- Create: `apps/web/e2e/w4-trust.spec.ts`
- Create: `.github/workflows/w4-ci.yml`

**Cases:**
1. `/en/trust` — residency Singapore text, link to status
2. `/en/status` — SLA 99.9% visible; mock API returns operational
3. Subprocessors page loads table
4. No `RNOSAI` in HTML
5. SOC2 external link **absent** when `po_approved: false` (staging default)

- [ ] **Step 1: Write spec (route mock via Playwright `page.route`)**
- [ ] **Step 2: Local PASS**
- [ ] **Step 3: w4-ci.yml**
- [ ] **Step 4: Commit (PTTCRM)**

---

### Task 8: RNOSAI — Public status API (FR-GTM-024)

**Files:**
- Create: `gtm-public-status.service.ts` + controller on `PublicGtmModule`
- Register route: `GET /api/v1/public/gtm/status`
- Test: Jest — 200, shape matches `PublicStatusResponse`, no internal hostnames/secrets

**Components (minimum):**
| id | probe |
|----|--------|
| `marketing_site` | static operational (config) |
| `demo_api` | DB `SELECT 1` via existing pool |
| `cms_read` | optional: count `gtm_cms_article` or S3 head — degrade gracefully |

- `updated_at`: ISO8601
- `sla_target_pct`: 99.9
- CORS: same origins as public demo (`gtmCorsOrigins`)

- [ ] **Step 1: Jest contract test**
- [ ] **Step 2: Implement service + controller**
- [ ] **Step 3: Commit (RNOSAI)**

---

### Task 9: SOC2 Type 1 evidence pack (FR-CMP-001) — docs

**Files (RNOSAI):**
- Create: `docs/compliance/soc2-type1/README.md`
- Create: `docs/compliance/soc2-type1/control-matrix.csv`

**Nội dung README:**
- Scope: PTTCRM GTM path (marketing → demo API → ops inbox) — **không** claim full 129 màn ops-web unless PO expands
- Evidence folders: access control, change management, logging, vendor list
- Link subprocessors JSON on site
- Checklist PO/IT tick before auditor

- [ ] **Step 1: Write docs (no code)**
- [ ] **Step 2: Commit (RNOSAI)**

---

### Task 10: Runbooks — region Singapore + SLA 99.9%

**Files:**
- Create: `docs/runbooks/region-singapore-data-residency.md` (RNOSAI or PTTCRM — prefer RNOSAI infra truth, link from PTTCRM trust)
- Create: `docs/runbooks/sla-999-uptime-monitoring.md`

**SLA runbook:**
- Formula: `(total_minutes - downtime_minutes) / total_minutes >= 0.999`
- Components in scope: `pttcrm.com`, `POST /api/v1/public/gtm/demo-requests`, CMS public read
- Tooling options: UptimeRobot / Pingdom / self-hosted — PO chọn
- Incident comms: update status page + hello@pttcrm.com
- Monthly review owner: IT

- [ ] **Step 1: Write runbooks**
- [ ] **Step 2: Link from `trust.json` internal refs / plan**
- [ ] **Step 3: Commit (split: RNOSAI infra, PTTCRM link in trust copy if needed)**

---

### Task 11: Wire PTTCRM status client to RNOSAI staging

**Files:**
- Modify: `apps/web/.env.example` — document status poll URL
- Manual UAT checklist in plan (below)

- [ ] **Step 1: Staging env `NEXT_PUBLIC_GTM_API_BASE` → status 200**
- [ ] **Step 2: `/en/status` shows green on staging**
- [ ] **Step 3: Note in W4 plan UAT section — no commit unless env example change**

---

## Thứ tự triển khai (Subagent-Driven)

| Order | Task | Repo | Song song |
|-------|------|------|-----------|
| 1 | Task 1 types | PTTCRM | — |
| 2 | Task 2 JSON | PTTCRM | sau Task 1 |
| 3 | Task 3 trust UI | PTTCRM | sau Task 2 |
| 4 | Task 4 subprocessors | PTTCRM | ∥ Task 3 |
| 5 | Task 5 status UI | PTTCRM | sau Task 1 |
| 6 | Task 6 nav/sitemap | PTTCRM | sau Task 3–5 |
| 7 | Task 7 Playwright | PTTCRM | cuối luồng A |
| 8 | Task 8 status API | RNOSAI | ∥ Task 1–5 |
| 9 | Task 9 SOC2 docs | RNOSAI | ∥ Task 8 |
| 10 | Task 10 runbooks | RNOSAI (+PTTCRM link) | ∥ Task 9 |
| 11 | Task 11 staging wire | both | sau Task 8 |

Luồng A (PTTCRM) và B (RNOSAI Task 8–10) **song song** sau Task 1. Task 5 có thể dùng Playwright mock cho đến khi Task 8 staging xanh.

---

## UAT script (PO / Legal / IT)

1. Legal: duyệt `trust.json`, `subprocessors.json`, residency statement Singapore.
2. IT: `curl` public status — không lộ connection strings / internal URLs.
3. PO: xác nhận **không** hiển thị SOC2 «certified» khi chưa có report.
4. Sales: Trust Center link gửi prospect US/EU — demo flow unchanged.
5. IT: walkthrough SLA runbook — dry-run incident → status page degraded.
6. Auditor (ngoài repo): evidence pack `docs/compliance/soc2-type1/` đủ sampling.

---

## Out of W4

- SOC2 **Type II** / continuous monitoring program
- Dịch toàn bộ **129 màn ops-web** sang EN (W4+ / wave riêng)
- Playbook `/en/markets/us` hoặc `/eu` (optional PO — không trong Master §8 bullet)
- WhatsApp Business API
- Multi-region active-active failover ngoài Singapore
- Pen test công khai / bug bounty
- `status.pttcrm.com` subdomain — optional; `/en/status` đủ exit kỹ thuật W4 (subdomain = PO DNS follow-up)
- Stripe production live (W2 test mode đủ cho trust narrative)

---

## Sign-off trước khi code W4

| Role | Cần chốt |
|------|----------|
| PO | W3 exit kinh doanh ✓ (3 demo ASEAN); auditor SOC2 Type 1 engaged; subprocessors list thật |
| Legal | Residency copy Singapore; subprocessors; không claim SOC2 sớm |
| IT | Region prod/staging document; uptime tool; public status endpoint host |
| GDKD | SLA 99.9% in-scope components; incident comms owner |

**Prerequisite kỹ thuật:** W3 exit xanh — PTTCRM `3ab733c`+; RNOSAI W3 committed + DDL `market_country` applied staging.

---

## KPI theo dõi (W4+, không chặn exit code)

| KPI | Mục tiêu |
|-----|----------|
| Uptime 30 ngày lăn | ≥ 99.9% |
| EN demo / tuần (US/EU UTM) | PO set baseline post-Trust launch |
| Time-to-Trust (prospect opens `/en/trust` → demo) | MKT đo |

North star vẫn: **retainer tháng mới ký** — Trust/SLA là table stakes US/EU, không thay demo motion.
