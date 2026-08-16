# PTTCRM W3 — D1 ASEAN Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Parent:** [system-implementation](./2026-08-15-pttcrm-system-implementation.md)  
> **Spec:** Master §8 W3 · §10 KPI W3 · Persona P-SEA · DEC-06 D1  
> **Prerequisite:** [W2 D0 exit](./2026-08-16-pttcrm-w2-d0.md) — USD flag, Stripe test, GDPR/DPA, resources hub, sandbox EN.

**Goal:** Mở cửa bán ASEAN (TH / ID / PH / SG): playbook EN có timezone + WhatsApp **link**, trang partner 1 nước, form demo gắn `market_country`, inbox lọc pipeline ASEAN — và runbook `app.pttcrm.com` khi PO cutover.

**Architecture:** PTTCRM thêm 4 trang playbook JSON-driven + `/en/partners` + field `market_country` trên form EN (prefill `?market=`). RNOSAI mở rộng `gtm_demo_request`, validate qua `gtm-core`, hiển thị SLA theo IANA timezone trên inbox, filter + Excel. DNS `app.pttcrm.com` = tài liệu IT + env (không đổi origin W0–W2 cho đến PO sign-off).

**Tech Stack:** Node 20, Next.js 15, Vitest, Playwright, NestJS, Jest, PostgreSQL, exceljs (export có sẵn W1).

## Global Constraints

- Brand công khai: `PTTCRM`. CI fail nếu `RNOSAI` trong `apps/web` hoặc CMS publish body/alt.
- CTA chính vẫn `Request demo` / `Đăng ký Demo`. WhatsApp W3 = **link `wa.me` only** — **không** WhatsApp Business API trừ PO exception.
- **Không** trial 30 ngày. **Không** giá/user < `200000` VND hoặc < `15` USD/user/tháng.
- Playbook **chỉ EN** (`/en/markets/*`). VI site không thêm bản dịch playbook W3.
- Số WhatsApp / partner logo / copy pháp lý partner: PO cung cấp trong JSON — **cấm** bịa case số (BR-GTM-018 vẫn áp dụng cho mọi metric).
- `market_country` nullable — lead W0–W2 không bị break.
- Commit site trong PTTCRM; DDL/API/inbox trong `../RNOSAI`. Không trộn hai repo một commit.
- **Không** dịch 129 màn ops-web. **Không** SOC2 (W4).

---

## Exit W3 (bắt buộc trước W4)

| # | Tiêu chí | Cách verify |
|---|----------|-------------|
| 1 | 4 playbook `/en/markets/{th,id,ph,sg}` — copy EN, timezone label, WhatsApp link mở tab mới | Playwright + vitest content |
| 2 | CTA playbook → `/en/request-demo?market=th` (v.v.) prefill dropdown | Playwright |
| 3 | Form EN gửi `market_country` → API 201 → row DB | Jest + manual staging |
| 4 | Inbox filter `market_country=th` (v.v.) + cột Excel | Jest ops-web |
| 5 | `/en/partners` — 1 partner featured (PO-approved copy) | Playwright |
| 6 | Runbook `app.pttcrm.com` CNAME + checklist PO sign-off | Doc review |
| 7 | `vitest` + `build` PTTCRM; Jest GTM ASEAN pass | CI |

**Exit kinh doanh (Master §8):** ≥ **3 demo ASEAN** trong pipeline (`market_country ∈ {th,id,ph,sg}`), status ≠ `disqualified` — **không** bắt buộc `won`. Sales xác nhận trên inbox staging/prod.

**KPI W3** (theo dõi, không chặn exit kỹ thuật): demo/tuần ≥ 25; close ≥ 22%; ACV deal EN ≥ 399 USD; phản hồi P50 ≤ 2 giờ (GMT+7 hoặc +8 theo market).

---

## Luồng W3

```mermaid
flowchart LR
  subgraph PTTCRM
    PB[/en/markets/th|id|ph|sg]
    WA[WhatsApp wa.me link]
    PART[/en/partners]
    FORM[DemoForm market_country]
  end
  subgraph RNOSAI
    API[POST demo + market_country]
    DB[(gtm_demo_request)]
    INB[/crm/gtm/demos filter]
    SLA[SLA hint by timezone]
  end
  PB --> WA
  PB -->|CTA| FORM
  PART --> FORM
  FORM --> API --> DB --> INB
  INB --> SLA
```

---

## Traceability (W3 — bổ sung SRS v1.3 draft)

| ID | Mô tả ngắn |
|----|------------|
| FR-WEB-041 | Playbook ASEAN EN: timezone, WhatsApp link, CTA demo |
| FR-WEB-042 | Trang `/en/partners` — 1 partner nước (SG hoặc TH, PO chọn) |
| FR-WEB-043 | Form EN: field `market_country` + prefill query |
| FR-GTM-021 | Lưu `market_country` trên `gtm_demo_request` |
| FR-GTM-022 | Inbox lọc + export Excel theo `market_country`; SLA hiển thị theo timezone |
| GTM-UC-040 | VIS: đọc playbook → WhatsApp link |
| GTM-UC-041 | VIS: playbook → CTA demo prefill market |
| GTM-UC-042 | VIS: gửi demo kèm `market_country` |
| GTM-UC-043 | SAL: lọc pipeline ASEAN trên inbox |
| SCR-WEB-018 | Template playbook market |
| SCR-WEB-019 | Template partners |

---

## File map

**PTTCRM**

| Path | Responsibility |
|------|----------------|
| `packages/gtm-core/src/asean-markets.ts` | `AseanMarket`, timezone IANA, WhatsApp URL builder |
| `packages/gtm-core/src/paths.ts` | `/en/markets/*`, `/en/partners` (EN-only, no VI pair) |
| `packages/gtm-core/src/validate-demo.ts` | Optional `market_country` when `locale === 'en'` |
| `apps/web/content/en/markets/{th,id,ph,sg}.json` | Playbook copy PO/MKT |
| `apps/web/content/en/partners.json` | 1 featured partner |
| `apps/web/src/components/MarketPlaybookView.tsx` | Render playbook + WA + CTA |
| `apps/web/src/components/PartnersView.tsx` | Partner card + CTA |
| `apps/web/src/app/en/markets/[market]/page.tsx` | Dynamic route |
| `apps/web/src/app/en/partners/page.tsx` | Static partners |
| `apps/web/src/components/DemoForm.tsx` | EN market dropdown + `?market=` prefill |
| `apps/web/src/lib/nav.ts` (or SiteChrome) | EN nav tile «Markets» |
| `apps/web/e2e/w3-asean.spec.ts` | Playwright W3 |
| `.github/workflows/w3-ci.yml` | CI gate W3 |
| `docs/runbooks/app-pttcrm-cname.md` | DNS + env cutover checklist |

**RNOSAI**

| Path | Responsibility |
|------|----------------|
| `docs/specs/2026-08-16-postgresql-ddl-gtm-w3-asean.sql` | `ALTER TABLE gtm_demo_request ADD market_country` |
| `scripts/apply_pg_ddl_gtm_w3_asean.sh` | Apply DDL staging |
| `packages/gtm-core` (sync hoặc copy validate) | Same `market_country` enum |
| `ptt-crm-api/.../gtm-demo*.ts` | Persist + list filter |
| `ptt-crm-api/.../gtm-sla.util.ts` | `formatSlaDeadline(createdAt, market)` |
| `ops-web/.../gtm/demos/page.tsx` | Filter dropdown ASEAN |
| `ops-web/.../gtm/demos/export` | Excel column `market_country` |

---

## Task 1: gtm-core — ASEAN markets + validate extension

**Files:**
- Create: `packages/gtm-core/src/asean-markets.ts`
- Modify: `packages/gtm-core/src/validate-demo.ts`
- Modify: `packages/gtm-core/src/index.ts`
- Test: `packages/gtm-core/src/asean-markets.spec.ts`
- Test: `packages/gtm-core/src/validate-demo.spec.ts` (extend)

**Interfaces:**
- Produces:
  - `export type AseanMarket = 'th' | 'id' | 'ph' | 'sg'`
  - `export const ASEAN_MARKETS: Record<AseanMarket, { name: string; timezone: string; whatsapp_e164: string }>`
    - `th`: `Asia/Bangkok` (GMT+7)
    - `id`: `Asia/Jakarta` (GMT+7)
    - `ph`: `Asia/Manila` (GMT+8)
    - `sg`: `Asia/Singapore` (GMT+8)
  - `export function whatsappLink(market: AseanMarket, text: string): string` → `https://wa.me/{digits}?text=encodeURIComponent(text)`
  - `DemoPayload` thêm `market_country?: AseanMarket | null`
  - Validate: nếu `market_country` có giá trị → phải thuộc enum; `locale === 'vi'` → ignore/reject nếu client gửi (reject an toàn hơn)

- [ ] **Step 1: Failing tests**

```ts
// asean-markets.spec.ts
import { whatsappLink, ASEAN_MARKETS } from './asean-markets';

test('WhatsApp link encodes text', () => {
  const url = whatsappLink('sg', 'Hello PTTCRM');
  expect(url).toMatch(/^https:\/\/wa\.me\/\d+\?text=/);
});

test('timezones defined for all four markets', () => {
  expect(Object.keys(ASEAN_MARKETS).sort()).toEqual(['id', 'ph', 'sg', 'th']);
});
```

```ts
// validate-demo.spec.ts — add
test('EN demo accepts market_country th', () => {
  const r = validateDemoPayload({ /* valid base */, locale: 'en', market_country: 'th' });
  expect(r.ok).toBe(true);
});

test('invalid market_country rejected', () => {
  const r = validateDemoPayload({ /* valid base */, locale: 'en', market_country: 'vn' });
  expect(r.ok).toBe(false);
});
```

- [ ] **Step 2: Run — expect FAIL**

Run: `npm test -- packages/gtm-core`

- [ ] **Step 3: Implement**

- [ ] **Step 4: PASS**

- [ ] **Step 5: Commit (PTTCRM)**

```bash
git add packages/gtm-core
git commit -m "$(cat <<'EOF'
feat(gtm-core): ASEAN market types and demo market_country validation

EOF
)"
```

---

### Task 2: Playbook content JSON (4 markets)

**Files:**
- Create: `apps/web/content/en/markets/th.json`
- Create: `apps/web/content/en/markets/id.json`
- Create: `apps/web/content/en/markets/ph.json`
- Create: `apps/web/content/en/markets/sg.json`
- Modify: `apps/web/content/content.spec.ts`

**Schema mỗi file:**
```json
{
  "market": "th",
  "hero_title": "…",
  "hero_sub": "…",
  "pain_points": ["…"],
  "persona": "P-SEA — performance agency",
  "timezone_label": "GMT+7 · Asia/Bangkok",
  "business_hours_en": "Mon–Fri 9:00–18:00 local",
  "whatsapp_prefill": "Hi PTTCRM — I'm interested in Agency OS for Thailand.",
  "recommended_sku": "agy",
  "recommended_industry": "agency",
  "seo": { "title": "…", "description": "…" }
}
```

- PO placeholder: `whatsapp_e164` lấy từ `ASEAN_MARKETS` trong code — JSON chỉ `whatsapp_prefill` text.
- Copy EN agency/multi-client ROAS (Master persona P-SEA). **Không** số CPL/ROAS trừ PO `po_signed`.

- [ ] **Step 1: content.spec — 4 files parse, `market` khớp filename**

- [ ] **Step 2: Draft copy (MKT review trước merge prod)**

- [ ] **Step 3: vitest PASS**

- [ ] **Step 4: Commit (PTTCRM)**

---

### Task 3: MarketPlaybookView + dynamic routes (FR-WEB-041)

**Files:**
- Create: `apps/web/src/components/MarketPlaybookView.tsx`
- Create: `apps/web/src/app/en/markets/[market]/page.tsx`
- Create: `apps/web/src/lib/market-content.ts` — load JSON by slug
- Test: `apps/web/src/components/market-playbook-view.spec.tsx`

**Behavior:**
- Valid slug → render hero, pain list, timezone + business hours, primary CTA «Request demo» → `/en/request-demo?market={slug}&sku={recommended}&industry={recommended}`
- Secondary «Chat on WhatsApp» → `whatsappLink()` **target `_blank` rel `noopener`**
- Invalid slug → `notFound()`
- JSON-LD `WebPage` + `areaServed` country code

- [ ] **Step 1: Component test — CTA href contains `market=th`**

- [ ] **Step 2: Implement pages**

- [ ] **Step 3: `npm run build` PASS**

- [ ] **Step 4: Commit (PTTCRM)**

---

### Task 4: Partners page (FR-WEB-042)

**Files:**
- Create: `apps/web/content/en/partners.json`
- Create: `apps/web/src/components/PartnersView.tsx`
- Create: `apps/web/src/app/en/partners/page.tsx`
- Modify: `apps/web/content/content.spec.ts`

**Schema `partners.json`:**
```json
{
  "featured": {
    "country_code": "sg",
    "name": "PO_PARTNER_NAME",
    "logo_path": "/partners/po-partner.svg",
    "description_en": "…",
    "website_url": "https://…",
    "po_approved": true
  },
  "cta": { "label": "Become a partner", "href": "/en/request-demo?market=sg" }
}
```

- W3 ship **1** featured block. PO chọn SG **hoặc** TH — cập nhật JSON, không code branch.
- Logo SVG placeholder trong `apps/web/public/partners/` — PO thay file.

- [ ] **Step 1: content.spec + Playwright stub**

- [ ] **Step 2: Implement PartnersView**

- [ ] **Step 3: build PASS**

- [ ] **Step 4: Commit (PTTCRM)**

---

### Task 5: DemoForm — market_country EN (FR-WEB-043)

**Files:**
- Modify: `apps/web/src/components/DemoForm.tsx`
- Modify: `apps/web/src/lib/gtm-api.ts`
- Test: extend component or gtm-api unit test

**Behavior:**
- `locale === 'en'`: dropdown «Market» — `Thailand`, `Indonesia`, `Philippines`, `Singapore`, `Other / not listed` (values `th|id|ph|sg|''`)
- `useSearchParams().get('market')` → set initial value if valid
- Submit gửi `market_country` chỉ khi chọn 4 nước (omit hoặc null khi Other)
- `locale === 'vi'`: **không** hiện field (unchanged payload)

- [ ] **Step 1: Test prefill `?market=sg`**

- [ ] **Step 2: Implement**

- [ ] **Step 3: vitest PASS**

- [ ] **Step 4: Commit (PTTCRM)**

---

### Task 6: Nav, sitemap, resources cross-link

**Files:**
- Modify: `apps/web/src/components/SiteChrome.tsx` or `nav.ts`
- Modify: `apps/web/src/app/sitemap.ts`
- Modify: `apps/web/content/en/resources.json` (optional tile «ASEAN markets»)

**Behavior:**
- EN mega/footer: link «Markets» → `/en/markets/sg` (hub) hoặc mini-list 4 nước
- Optional index: `apps/web/src/app/en/markets/page.tsx` — grid 4 cards (nếu không có, nav link trực tiếp SG + dropdown)
- Sitemap thêm `/en/markets/{th,id,ph,sg}`, `/en/partners`
- VI nav **không** thêm partners/markets

- [ ] **Step 1: sitemap unit test / snapshot**

- [ ] **Step 2: Implement**

- [ ] **Step 3: Commit (PTTCRM)**

---

### Task 7: Playwright W3 + CI

**Files:**
- Create: `apps/web/e2e/w3-asean.spec.ts`
- Create: `.github/workflows/w3-ci.yml`

**Cases:**
1. `/en/markets/th` — hero, WhatsApp href `wa.me`, demo CTA query `market=th`
2. `/en/partners` — featured name visible
3. `/en/request-demo?market=ph` — select prefilled
4. Submit demo mock API (hoặc MSW) includes `market_country: 'ph'`
5. Brand guard: page source không chứa `RNOSAI`

- [ ] **Step 1: Write spec (may need `NEXT_PUBLIC_USD_PRICE=1` from W2 build — reuse W2 CI env)**

- [ ] **Step 2: `npx playwright test w3-asean` PASS locally**

- [ ] **Step 3: w3-ci.yml — vitest + build + playwright**

- [ ] **Step 4: Commit (PTTCRM)**

---

### Task 8: RNOSAI DDL — market_country

**Files (RNOSAI repo):**
- Create: `docs/specs/2026-08-16-postgresql-ddl-gtm-w3-asean.sql`
- Create: `scripts/apply_pg_ddl_gtm_w3_asean.sh`
- Modify: in-memory repo fallback nếu có pattern W2

**DDL:**
```sql
ALTER TABLE gtm_demo_request
  ADD COLUMN IF NOT EXISTS market_country text
  CHECK (market_country IS NULL OR market_country IN ('th', 'id', 'ph', 'sg'));

CREATE INDEX IF NOT EXISTS gtm_demo_request_market_created_idx
  ON gtm_demo_request (market_country, created_at DESC)
  WHERE market_country IS NOT NULL;
```

- [ ] **Step 1: Apply script idempotent on staging**

- [ ] **Step 2: Commit (RNOSAI)**

---

### Task 9: PublicGtmModule — accept market_country (FR-GTM-021)

**Files (RNOSAI):**
- Sync `validateDemoPayload` / types from PTTCRM `gtm-core` (hoặc duplicate tạm nếu monorepo khác — giữ contract identical)
- Modify: demo create handler + repository insert/select
- Test: Jest POST `/api/v1/public/gtm/demo` with `market_country`

- [ ] **Step 1: Jest — 201 with `market_country: 'id'`**

- [ ] **Step 2: Jest — 400 invalid market**

- [ ] **Step 3: Jest — VI locale ignores extra field**

- [ ] **Step 4: Commit (RNOSAI)**

---

### Task 10: SLA timezone hint (FR-GTM-022 partial)

**Files (RNOSAI):**
- Create: `ptt-crm-api/src/gtm/gtm-sla.util.ts` (path theo repo thực tế)
- Modify: inbox list DTO — thêm `sla_deadline_local`, `sla_timezone_label`
- Test: Jest fixed `created_at` + market `sg` → deadline +2h wall clock Singapore

**Logic:**
- P50 target 2 giờ (Master §10) — `deadline = created_at + 2h` displayed in market timezone via `Intl.DateTimeFormat`
- Lead không có `market_country` → fallback `Asia/Ho_Chi_Minh` (GMT+7)

- [ ] **Step 1: Unit tests timezone edges (Bangkok vs Singapore)**

- [ ] **Step 2: Wire inbox API**

- [ ] **Step 3: Commit (RNOSAI)**

---

### Task 11: Inbox filter + Excel column (FR-GTM-022)

**Files (RNOSAI ops-web):**
- Modify: demos list page — filter «Market: All | TH | ID | PH | SG | Unspecified»
- Modify: Excel export — column `market_country`
- Test: Jest/React testing library filter query param

- [ ] **Step 1: Filter returns only `th` rows**

- [ ] **Step 2: Export header includes `market_country`**

- [ ] **Step 3: Commit (RNOSAI)**

---

### Task 12: Runbook app.pttcrm.com (IT / PO)

**Files:**
- Create: `docs/runbooks/app-pttcrm-cname.md`

**Checklist nội dung:**
1. PO sign-off cutover date
2. DNS: `app.pttcrm.com` CNAME → same origin as `rs.pttads.vn` (Master §4)
3. TLS cert covers `app.pttcrm.com`
4. RNOSAI env: allow redirect URI / cookie domain nếu cần
5. PTTCRM optional: `NEXT_PUBLIC_LOGIN_URL=https://app.pttcrm.com/login` **chỉ** sau cutover — W3 doc-only, default vẫn `rs.pttads.vn`
6. Smoke: login staff + sandbox EN unchanged
7. Rollback: revert CNAME + env

- [ ] **Step 1: Write runbook**

- [ ] **Step 2: Link from parent system plan + W3 plan**

- [ ] **Step 3: Commit (PTTCRM)** — docs only

---

## Thứ tự triển khai (Subagent-Driven)

| Order | Task | Repo | Song song |
|-------|------|------|-----------|
| 1 | Task 1 gtm-core | PTTCRM | — |
| 2 | Task 2 content JSON | PTTCRM | sau Task 1 |
| 3 | Task 3 playbook UI | PTTCRM | sau Task 2 |
| 4 | Task 4 partners | PTTCRM | ∥ Task 3 |
| 5 | Task 5 DemoForm | PTTCRM | sau Task 1 |
| 6 | Task 6 nav/sitemap | PTTCRM | sau Task 3–4 |
| 7 | Task 7 Playwright CI | PTTCRM | cuối luồng A |
| 8 | Task 8 DDL | RNOSAI | ∥ Task 1–5 PTTCRM |
| 9 | Task 9 API | RNOSAI | sau Task 8 + gtm-core sync |
| 10 | Task 10 SLA util | RNOSAI | sau Task 9 |
| 11 | Task 11 inbox | RNOSAI | sau Task 9 |
| 12 | Task 12 runbook | PTTCRM | bất kỳ lúc nào |

Luồng A (PTTCRM Task 1–7) và B (RNOSAI Task 8–11) **song song** sau Task 1. E2E Task 7 **sau** Task 9 staging URL xanh (hoặc mock API).

---

## UAT script (PO / GDKD / MKT)

1. MKT: duyệt copy 4 playbook + partners JSON trên staging.
2. GDKD: gửi demo từ `/en/markets/id` → inbox thấy `market_country=id`, SLA label WIB.
3. Sales: lọc TH only → export Excel có cột market.
4. PO: xác nhận WhatsApp link mở đúng số (staging dùng số test).
5. IT: walkthrough runbook CNAME — **không** cutover prod cho đến checklist ✓.
6. KPI board: đếm pipeline ASEAN ≥ 3 trong 8 tuần W3.

---

## Out of W3

- WhatsApp Business API / webhook inbound
- SOC2, region SLA 99.9% (W4)
- Full ops-web i18n EN
- Playbook VI; thêm nước ASEAN ngoài TH/ID/PH/SG
- `/vi/partners` hoặc `/vi/markets`
- Stripe multi-currency ngoài USD (W2 đủ)
- Tự động routing lead theo geo-IP (chỉ explicit form + UTM)

---

## Sign-off trước khi code W3

| Role | Cần chốt |
|------|----------|
| PO | Partner nước (SG vs TH); số WhatsApp sales ASEAN; ngày cutover `app.pttcrm.com` (có thể sau exit kỹ thuật) |
| MKT | Copy EN 4 playbook + partner bio |
| GDKD | SLA 2h hiển thị theo timezone; định nghĩa «3 demo ASEAN pipeline» |
| IT | Staging DDL W3; DNS runbook reviewer |

**Prerequisite kỹ thuật:** W2 exit xanh (PTTCRM `0e7124d`+; RNOSAI W2 committed + DDL payment applied staging).
