# PTTCRM W1 — Tăng close Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Parent:** [system-implementation](./2026-08-15-pttcrm-system-implementation.md)  
> **Spec:** Master / SRS / UX / UC v1.2  
> **Prerequisite:** [W0 v1.2 exit](./2026-08-15-pttcrm-w0-v12.md) — form → lead, CMS publish, inbox, CI xanh.

**Goal:** Tăng tỷ lệ close demo→HĐ bằng case số PO ký, sandbox 14 ngày sau qualify, 2 ngành mới (Education, Pharma), và table stakes Sales (Excel + proposal PDF) trên RNOSAI.

**Architecture:** PTTCRM chỉ thêm trang `/vi/khach-hang` + 2 trang giải pháp (copy JSON `content/cases/`). RNOSAI thêm `POST .../sandbox`, job hết hạn, export/import Excel, PDF proposal — **không** fork CRM. Hai repo, hai commit stream.

**Tech Stack:** Node 20, Next.js 15, Vitest, Playwright, NestJS, Jest, PostgreSQL, nodemailer (hoặc provider hiện có RNOSAI), exceljs, pdfkit (hoặc puppeteer template có sẵn ops-web).

## Global Constraints

- Brand công khai: `PTTCRM`. CI fail nếu `RNOSAI` trong `apps/web` hoặc CMS publish body/alt.
- CTA: `Đăng ký Demo` / `Request demo`. **Không** trial 30 ngày công khai. **Không** giá/user < `200000` VND.
- Case study: **chỉ** file `content/cases/*.json` với `po_signed: true` + số PO cung cấp (`cpl_vnd`, `roas`). **Cấm** số bịa (BR-GTM-018).
- Sandbox: grant **chỉ** khi `status ∈ {qualified, demo_booked}` (FR-SAN-001). User `demo_{requestId}`, tenant `sandbox_{industry}`, +14 ngày dương lịch (BR-GTM-015).
- Grant khi `new` → **409**. Không nút sandbox trên W0 inbox — W1 mới bật.
- Excel/PDF **chỉ** ops-web / ptt-crm-api — **không** trên marketing-web.
- Commit site trong PTTCRM; API/inbox/job trong `../RNOSAI`. Không trộn hai repo một commit.
- `/en/pricing` vẫn ẩn USD (`NEXT_PUBLIC_USD_PRICE=0`) — thuộc W2.

---

## Exit W1 (bắt buộc trước W2)

| # | Tiêu chí | Cách verify |
|---|----------|-------------|
| 1 | **3 case** `po_signed=true` hiển thị `/vi/khach-hang` | Playwright + grep `po_signed` trong JSON |
| 2 | Grant sandbox tạo `demo_*`, email credential, status `sandbox_granted` | Jest API + UAT staging |
| 3 | Sau 14 ngày (mock `sandbox_expires_at`) user **disabled**, login 403 | Jest job + manual |
| 4 | Education + Pharma: trang giải pháp VI/EN + prefill form | Playwright prefill |
| 5 | Export inbox → `.xlsx`; import template → lead; PDF proposal tải được | Jest + ops-web click |
| 6 | `vitest` + `build` PTTCRM pass; Jest GTM sandbox pass | CI |

**KPI doanh số W1** (theo dõi, không chặn exit kỹ thuật): demo/tuần ≥ 15, phản hồi P50 ≤ 2h, close demo→HĐ ≥ 20%.

---

## Luồng W1

```mermaid
flowchart LR
  subgraph PTTCRM
    CASE[content/cases]
    KH[/vi/khach-hang]
    ED[Education/Pharma pages]
  end
  subgraph RNOSAI
    INBOX[/crm/gtm/demos]
    GRANT[POST sandbox]
    JOB[Hourly expiry]
    XLS[Excel in/out]
    PDF[Proposal PDF]
  end
  CASE --> KH
  INBOX --> GRANT
  GRANT --> JOB
  INBOX --> XLS
  INBOX --> PDF
```

---

## File map

**PTTCRM**

| Path | Responsibility |
|------|----------------|
| `packages/gtm-core/src/case-types.ts` | `CaseStudy`, `formatCaseMetrics` |
| `packages/gtm-core/src/paths.ts` | Thêm `/vi/khach-hang`, education/pharma slug pairs |
| `apps/web/content/cases/*.json` | Case PO ký (3 file W1) |
| `apps/web/content/vi|en/solutions.json` | Thêm `education`, `pharma` |
| `apps/web/src/lib/cases.ts` | Load cases, filter `po_signed` |
| `apps/web/src/components/CustomersView.tsx` | SCR-WEB-016 |
| `apps/web/src/app/vi/khach-hang/page.tsx` | Case list |
| `apps/web/src/app/en/customers/page.tsx` | EN mirror (metric chỉ khi PO có en copy) |
| `apps/web/content/cases.spec.ts` | Contract: po_signed, no RNOSAI, no fake trial |
| `.github/workflows/w1-ci.yml` | vitest + build + playwright W1 |

**RNOSAI (`../RNOSAI`)**

| Path | Responsibility |
|------|----------------|
| `docs/specs/2026-08-16-postgresql-ddl-gtm-w1-sandbox.sql` | Index + audit nếu thiếu (cột W0 đã có) |
| `services/ptt-crm-api/src/gtm/gtm-sandbox.service.ts` | Grant + provision user/tenant |
| `services/ptt-crm-api/src/gtm/gtm-sandbox-expiry.job.ts` | Hourly disable |
| `services/ptt-crm-api/src/gtm/gtm-export.service.ts` | Excel export demo rows |
| `services/ptt-crm-api/src/gtm/gtm-import.service.ts` | Excel import → `crm_leads` |
| `services/ptt-crm-api/src/gtm/gtm-proposal.service.ts` | PDF list price + SKU |
| `services/ops-web/src/app/crm/gtm/demos/page.tsx` | Nút Grant + Export + PDF |
| `services/ops-web/src/lib/gtm/sandbox-caps.ts` | `canGrantSandbox(user)` |

---

## Thứ tự triển khai (6 tuần)

| Tuần | PTTCRM | RNOSAI | PO |
|------|--------|--------|-----|
| 1 | Task 1–2: gtm-core cases + schema JSON | Task 6: sandbox service skeleton | Cung cấp 3 bộ số case |
| 2 | Task 3–4: `/khach-hang` + nav | Task 7: Grant API + email | Review copy case |
| 3 | Task 5: Education + Pharma | Task 8: Expiry job | UAT grant 1 lead |
| 4 | — | Task 9–10: Excel export/import | Template import |
| 5 | — | Task 11: Proposal PDF | Legal chốt footer PDF |
| 6 | Task 12: Playwright + CI | Task 12: Jest + UAT script | Sign-off exit W1 |

Luồng PTTCRM Task 1–5 **song song** RNOSAI Task 6–8. Excel/PDF (9–11) **sau** sandbox API xanh.

---

### Task 1: gtm-core — case types + paths W1

**Files:**
- Create: `packages/gtm-core/src/case-types.ts`
- Modify: `packages/gtm-core/src/paths.ts`
- Modify: `packages/gtm-core/src/index.ts`
- Test: `packages/gtm-core/src/case-types.spec.ts`
- Test: `packages/gtm-core/src/paths.spec.ts` (extend)

**Interfaces:**
- Produces:
  - `export type CaseStudy = { slug: string; po_signed: boolean; industry: Industry; title_vi: string; title_en?: string; summary_vi: string; summary_en?: string; cpl_vnd: number; roas: number; sku: SkuInterest }`
  - `export function formatCaseMetrics(c: Pick<CaseStudy, 'cpl_vnd' | 'roas'>, locale: Locale): string` → VI: `CPL 180.000 VND · ROAS 3,2`; EN: `CPL 180,000 VND · ROAS 3.2`
  - `PATH_PAIRS` thêm: `/vi/khach-hang` ↔ `/en/customers`, `/vi/giai-phap/education` ↔ `/en/solutions/education`, `/vi/giai-phap/pharma` ↔ `/en/solutions/pharma`

- [ ] **Step 1: Failing tests**

```ts
// packages/gtm-core/src/case-types.spec.ts
import { formatCaseMetrics } from './case-types';

test('formats VI case line', () => {
  expect(formatCaseMetrics({ cpl_vnd: 180000, roas: 3.2 }, 'vi')).toBe(
    'CPL 180.000 VND · ROAS 3,2',
  );
});
```

```ts
// paths.spec.ts — add
expect(switchLocalePath('/vi/khach-hang', 'en')).toBe('/en/customers');
expect(switchLocalePath('/vi/giai-phap/education', 'en')).toBe('/en/solutions/education');
```

- [ ] **Step 2: Run — expect FAIL**

- [ ] **Step 3: Implement**

- [ ] **Step 4: `npx vitest run packages/gtm-core` PASS**

- [ ] **Step 5: Commit (PTTCRM)**

```bash
git add packages/gtm-core
git commit -m "$(cat <<'EOF'
feat(gtm-core): add case metrics formatter and W1 locale paths

EOF
)"
```

---

### Task 2: Case JSON schema + PO seed (3 case)

**Files:**
- Create: `apps/web/content/cases/agency-portal-roas.json`
- Create: `apps/web/content/cases/bds-booking-cpl.json`
- Create: `apps/web/content/cases/fnb-reservation.json`
- Create: `apps/web/content/cases.spec.ts`
- Create: `apps/web/src/lib/cases.ts`

**Interfaces:**
- Produces:
  - `export function listSignedCases(): CaseStudy[]` — chỉ `po_signed === true`
  - `export function getCase(slug: string): CaseStudy | null`

**Schema mẫu** (PO thay số thật trước publish):

```json
{
  "slug": "agency-portal-roas",
  "po_signed": true,
  "industry": "agency",
  "sku": "agy",
  "title_vi": "Agency đa client — portal ROAS theo hợp đồng",
  "title_en": "Multi-client agency — contract-level ROAS portal",
  "summary_vi": "Một portal cho khách, không Excel tuần.",
  "summary_en": "One client portal instead of weekly spreadsheets.",
  "cpl_vnd": 0,
  "roas": 0
}
```

`cpl_vnd` và `roas` **phải > 0** khi `po_signed=true` — test enforce.

- [ ] **Step 1: Contract test**

```ts
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

test('signed cases have PO metrics and no RNOSAI', () => {
  const dir = join(__dirname);
  for (const f of readdirSync(dir).filter((x) => x.endsWith('.json'))) {
    const c = JSON.parse(readFileSync(join(dir, f), 'utf8'));
    if (c.po_signed) {
      expect(c.cpl_vnd).toBeGreaterThan(0);
      expect(c.roas).toBeGreaterThan(0);
    }
    expect(JSON.stringify(c)).not.toMatch(/RNOSAI/);
  }
});
```

- [ ] **Step 2: FAIL until JSON filled by PO**

- [ ] **Step 3: PO cung cấp số → update 3 file**

- [ ] **Step 4: `npx vitest run apps/web/content/cases.spec.ts` PASS**

- [ ] **Step 5: Commit**

---

### Task 3: SCR-WEB-016 — `/vi/khach-hang` + EN customers

**Files:**
- Create: `apps/web/src/components/CustomersView.tsx`
- Create: `apps/web/src/app/vi/khach-hang/page.tsx`
- Create: `apps/web/src/app/en/customers/page.tsx`
- Modify: `apps/web/src/components/nav.ts` — Tài nguyên → thêm Khách hàng / Customers
- Modify: `apps/web/src/components/pages.css` — `.case-grid`, `.case-metrics` (mono teal)

**Interfaces:**
- Consumes: `listSignedCases()`, `formatCaseMetrics()`
- Produces: Trang mast ink; card: industry chip, title, summary, metrics line, CTA Demo prefill `?industry=&sku=`
- Empty state: không file `po_signed` → copy «Case đang cập nhật» + CTA Demo (không placeholder số)

- [ ] **Step 1: Render test** (vitest component smoke hoặc Playwright Task 12)

- [ ] **Step 2: Implement CustomersView** — port rhythm từ `demo-html` nếu có; không ảnh bịa

- [ ] **Step 3: `npm run build` PASS**

- [ ] **Step 4: Commit**

---

### Task 4: Nav + sitemap + hreflang W1

**Files:**
- Modify: `apps/web/src/app/sitemap.ts`
- Modify: `apps/web/src/components/SiteChrome.tsx` footer (optional link Khách hàng)
- Test: `apps/web/src/components/nav.spec.ts` — assert customers link exists

- [ ] **Step 1: Extend nav.spec**

- [ ] **Step 2: sitemap static routes + cases pages**

- [ ] **Step 3: vitest PASS**

- [ ] **Step 4: Commit**

---

### Task 5: Education + Pharma industry pages

**Files:**
- Modify: `apps/web/content/vi/solutions.json` — keys `education`, `pharma`
- Modify: `apps/web/content/en/solutions.json`
- Modify: `apps/web/content/vi/home.json` — `industries.items` +2 (hoặc note W1 trong lead)
- Modify: `apps/web/content/en/home.json`
- Modify: `apps/web/src/lib/content.ts` — `solutionSlugForLocale` map EN slugs
- Routes: auto via existing `[slug]` pages + `generateStaticParams`

**Prefill (GTM-UC-024):**

| Trang | industry | sku |
|-------|----------|-----|
| Education | `education` | `ind` |
| Pharma | `pharma` | `ind` |

- [ ] **Step 1: content.spec — solutions include education/pharma keys**

- [ ] **Step 2: JSON copy (pain/proof giống SCR-WEB-006 pattern, không số case)**

- [ ] **Step 3: nav mega Giải pháp +2 item**

- [ ] **Step 4: build + Playwright prefill test**

- [ ] **Step 5: Commit**

---

### Task 6: RNOSAI — sandbox provision util (pure)

Work in `/Users/quoctuan/Documents/CursorAI/RNOSAI`.

**Files:**
- Create: `services/ptt-crm-api/src/gtm/gtm-sandbox.util.ts`
- Create: `services/ptt-crm-api/src/gtm/gtm-sandbox.util.spec.ts`

**Interfaces:**
- Produces:
  - `sandboxUsername(requestId: string): string` → `demo_{requestId}` (uuid rút gọn 8 ký tự nếu dài)
  - `sandboxTenant(industry: string): string` → `sandbox_{industry}`
  - `sandboxExpiresAt(from: Date): Date` → `from + 14 days`
  - `canGrantSandbox(status: string): boolean`
  - `oneTimePassword(): string` — 16 char alphanumeric

- [ ] **Step 1: Jest tests**

```ts
test('grant allowed only for qualified or demo_booked', () => {
  expect(canGrantSandbox('qualified')).toBe(true);
  expect(canGrantSandbox('new')).toBe(false);
});
```

- [ ] **Step 2: FAIL → implement → PASS**

- [ ] **Step 3: Commit (RNOSAI)**

---

### Task 7: Grant sandbox API + email (FR-SAN-001…005)

**Files:**
- Create: `services/ptt-crm-api/src/gtm/gtm-sandbox.service.ts`
- Create: `services/ptt-crm-api/src/gtm/gtm-sandbox.controller.ts`
- Modify: `services/ptt-crm-api/src/gtm/gtm.module.ts`
- Test: `services/ptt-crm-api/src/gtm/gtm-sandbox.service.spec.ts`

**API:** `POST /api/v1/gtm/demo-requests/:id/sandbox`  
Guard: `gtm.sandbox.grant`

**Behavior:**
1. 409 nếu status không qualify
2. 409 nếu đã `sandbox_granted` (idempotent: trả 200 + existing nếu chưa hết hạn — chọn một, document trong test)
3. Tạo user role `sandbox_visitor`, tenant `sandbox_{industry}`
4. Set `sandbox_expires_at`, `sandbox_user_id`, `status=sandbox_granted`
5. Gửi email FR-SAN-003: login URL `https://rs.pttads.vn/login`, user, OTP password, expiry date VN
6. Email bounce → status giữ `demo_booked`, `status_note=sandbox_email_failed`

- [ ] **Step 1: Jest integration với mock mailer + mock user repo**

- [ ] **Step 2: Implement**

- [ ] **Step 3: Commit (RNOSAI)**

---

### Task 8: ops-web Grant button + cap

**Files:**
- Create: `services/ops-web/src/lib/gtm/sandbox-caps.ts`
- Modify: `services/ops-web/src/app/crm/gtm/demos/page.tsx`
- Test: `services/ops-web/src/lib/gtm/sandbox-caps.spec.ts`

**UI:**
- Cột «Sandbox» — nút **Grant 14 ngày** enabled khi `qualified|demo_booked` và user có cap
- Sau grant: badge «Sandbox đến {date}», disabled button
- Toast lỗi 409 / email failed

- [ ] **Step 1: cap test `canGrantSandbox(user)`**

- [ ] **Step 2: Wire PATCH không đổi — chỉ POST sandbox**

- [ ] **Step 3: Commit (RNOSAI)**

---

### Task 9: Sandbox expiry job (FR-SAN-004, GTM-UC-023)

**Files:**
- Create: `services/ptt-crm-api/src/gtm/gtm-sandbox-expiry.job.ts`
- Modify: app scheduler module (Nest `@Cron('0 * * * *')`)
- Test: `gtm-sandbox-expiry.job.spec.ts`

**Behavior:** `sandbox_expires_at < now()` → disable auth user; **không** xóa tenant data; login trả 403 body `{ code: 'sandbox_expired' }`

- [ ] **Step 1: Jest với frozen clock**

- [ ] **Step 2: Implement + log audit**

- [ ] **Step 3: Commit (RNOSAI)**

---

### Task 10: Excel export demo inbox (table stakes)

**Files:**
- Create: `services/ptt-crm-api/src/gtm/gtm-export.service.ts`
- Add route: `GET /api/v1/gtm/demo-requests/export` → `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- Modify: ops-web demos page — nút **Export Excel**

**Columns:** created_at, full_name, email, phone, company, industry, sku_interest, locale, status, utm_campaign, owner, sandbox_expires_at

**Filters:** same query as list (`status`, `industry`, `locale`)

- [ ] **Step 1: Jest — export 2 rows → buffer parses with exceljs**

- [ ] **Step 2: Implement + cap `gtm.demos.export` (fallback `gtm.demos.view` W1)**

- [ ] **Step 3: Commit (RNOSAI)**

---

### Task 11: Excel import leads + proposal PDF

**Files:**
- Create: `services/ptt-crm-api/src/gtm/gtm-import.service.ts`
- Create: `services/ptt-crm-api/src/gtm/gtm-proposal.service.ts`
- Create: `services/ptt-crm-api/templates/gtm-proposal-vi.hbs` (hoặc PDF layout code)
- Routes:
  - `POST /api/v1/gtm/demo-requests/import` multipart `file`
  - `GET /api/v1/gtm/demo-requests/:id/proposal.pdf`

**Import rules:**
- Template cột: `full_name,email,phone,company,industry,sku_interest,notes`
- Validate giống `validateDemoPayload` where applicable
- `source=pttcrm_import`, dedup email 7 ngày
- Row lỗi → report sheet «errors» trong response JSON `{ imported, skipped, errors[] }`

**Proposal PDF:**
- Header PTTCRM logo từ brand asset RNOSAI
- SKU name + retainer/setup VND từ list price v1 (hardcode map W1 — **không** sửa CMS)
- Footer: HĐ tối thiểu 12 tháng, chiết khấu ≤ 15%
- **Không** RNOSAI trong PDF

- [ ] **Step 1: Jest import happy path + 1 bad row**

- [ ] **Step 2: Jest PDF contains SKU name, no RNOSAI**

- [ ] **Step 3: ops-web: Import dialog + PDF icon per row**

- [ ] **Step 4: Commit (RNOSAI)**

---

### Task 12: Playwright W1 + CI + UAT

**Files:**
- Create: `apps/web/e2e/w1-close.spec.ts`
- Create: `.github/workflows/w1-ci.yml` (hoặc extend w0-ci job matrix)
- Create: `docs/superpowers/plans/2026-08-16-pttcrm-w1-uat.md` checklist

**E2E:**

```ts
test('customers page shows signed metrics only', async ({ page }) => {
  await page.goto('/vi/khach-hang');
  await expect(page.locator('.case-metrics').first()).toContainText('CPL');
  await expect(page.locator('.case-metrics').first()).toContainText('ROAS');
});

test('education demo prefill', async ({ page }) => {
  await page.goto('/vi/giai-phap/education');
  await page.getByRole('link', { name: /Đăng ký Demo/i }).click();
  await expect(page.locator('#industry')).toHaveValue('education');
});
```

**UAT script (manual):**
1. PO xác nhận 3 số case trên staging
2. SAL grant sandbox → email nhận → login OK
3. Mock expiry → login 403
4. Export 50 row → mở Excel
5. Import 5 lead → inbox thấy row
6. PDF proposal tải → legal OK

- [ ] **Step 1: Playwright PASS local**

- [ ] **Step 2: CI green on push**

- [ ] **Step 3: PO sign-off exit table**

- [ ] **Step 4: Commit PTTCRM (e2e + ci + uat doc)**

---

## Traceability W1

| Artifact | Task |
|----------|------|
| FR-SAN-001…005 | 6–9 |
| FR-WEB-016 / SCR-WEB-016 / GTM-UC-026 | 2–4 |
| GTM-UC-021…023 | 6–9 |
| GTM-UC-024 (education/pharma) | 5 |
| BR-GTM-014, 015, 018 | All |
| Master W1 Excel/PDF | 10–11 |

**Out of W1:** Stripe USD (W2), `/vi/tai-nguyen` hub (W2), sandbox EN shell (W2), ASEAN (W3).

---

## Rủi ro & phụ thuộc PO

| Rủi ro | Mitigation |
|--------|------------|
| PO chưa ký số case | Block Task 2 exit; dùng số internal staging **không** deploy prod |
| Auth RNOSAI chưa API tạo user | Spike tuần 1: wrap service hiện có `UserService` |
| Mail deliverability | Dùng provider prod; bounce → note FR-SAN-003 |
| Excel import sai template | Ship template `.xlsx` tải từ ops-web + validate header row |

---

## Self-review (spec coverage)

- [x] 3 case po_signed → Task 2–3
- [x] Sandbox grant + 14d + email → Task 6–8
- [x] Expiry job → Task 9
- [x] Education/Pharma → Task 5
- [x] Excel/PDF RNOSAI → Task 10–11
- [x] No trial / no fake numbers / no RNOSAI → Global constraints + tests
- [x] Two-repo commit rule → noted per task
