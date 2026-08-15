# SRS — PTTCRM Commercial Platform

**Tài liệu:** Software Requirements Specification  
**Document ID:** PTTCRM-SRS-20260815  
**Phiên bản:** 1.2 · **Ngày:** 2026-08-15  
**Trạng thái:** Draft — đủ để lập trình W0  
**1.1:** Tin tức W0, nav Giải pháp/Nền tảng/Tài nguyên, mega menu, contrast header  
**1.2:** CMS W0 — media, tin, sự kiện, slot ảnh; public chỉ published  
**Parent:** [Master Spec](./2026-08-15-pttcrm-master-spec.md)  
**UX/UI:** [2026-08-15-pttcrm-ui-ux.md](./2026-08-15-pttcrm-ui-ux.md)  
**Use cases:** [01-PTTCRM-COMMERCIAL.md](../use-cases/01-PTTCRM-COMMERCIAL.md)

---

## Phần 1. Phạm vi & mục tiêu

### 1.1. Vấn đề

Không có site thương mại PTTCRM. Lead demo không có API công khai. ops-web không có hàng «demo request». Site PTT (`pttads.vn`) bán dịch vụ agency, không bán phần mềm.

### 1.2. Mục tiêu W0

1. Site `pttcrm.com` VI/EN giới thiệu và bán 3 SKU.
2. Form demo tạo `gtm_demo_request` + `crm_leads`.
3. Sales xử lý trên `/crm/gtm/demos` trong 4 giờ giờ hành chính.
4. MKT xuất bản tin / sự kiện / ảnh trên `/crm/gtm/cms`; site đọc bản published.

### 1.3. Hệ thống liên quan

| Hệ thống | Quan hệ |
|----------|---------|
| RNOSAI `ptt-crm-api` | Host `PublicGtmModule` + `GtmCmsModule` |
| RNOSAI `ops-web` | Demo inbox + CMS desk |
| RNOSAI `crm_leads` | Lead SSoT |
| Object storage | File media (S3-compatible) |
| Meta Pixel | PageView + Lead |
| `rs.pttads.vn` | Đăng nhập staff |

### 1.4. Ngoài phạm vi SRS này

Stripe, SOC2, trial công khai, i18n 129 màn ops-web, WhatsApp Business API, LP builder.

---

## Phần 2. Vai trò

| Role | Ký hiệu | Việc |
|------|---------|------|
| Visitor | VIS | Đọc site, đổi ngôn ngữ, gửi demo |
| Sales | SAL | Inbox, qualify, book, grant sandbox (W1) |
| GDKD | GDK | Xem SLA, phân lead |
| Marketing ops | MKT | Soạn / xuất bản tin, sự kiện, ảnh trên CMS desk |
| Admin IT | IT | Domain, env, Pixel ID, bucket media |
| Bot | BOT | Bị honeypot / rate limit chặn |

Copy **cố định** (SKU, pháp lý, slogan, chrome) = file repo. Tin / sự kiện / ảnh / slot = CMS. Seed W0: 6 bài demo.

---

## Phần 3. Yêu cầu chức năng

### 3.1. Site (W0)

| ID | Yêu cầu | UC | Priority |
|----|---------|-----|----------|
| FR-WEB-001 | App Router Next.js; locale prefix `/vi` `/en` | GTM-UC-001 | P0 |
| FR-WEB-002 | `/` detect `Accept-Language`; fallback `vi` | GTM-UC-001 | P0 |
| FR-WEB-003 | Trang chủ editorial: hero slogan, 3 moat hàng số, 4 module, 3 ngành (dải ink), 4 bước triển khai, teaser 3 tin **published** (CMS `featured_home` hoặc mới nhất), 1 sự kiện sắp tới nếu có, FAQ, CTA Demo. **Không** 3 card giá trên home | GTM-UC-002 | P0 |
| FR-WEB-004 | 4 trang sản phẩm: `/san-pham/crm` `/san-pham/ads` `/san-pham/portal` `/san-pham/ai` và EN `/en/product/*` | GTM-UC-003 | P0 |
| FR-WEB-005 | 3 trang ngành: `bds` `agency` `fnb` | GTM-UC-004 | P0 |
| FR-WEB-006 | `/bang-gia` in list price VND §6.2 Master Spec; không quy về user < 200.000 VND | GTM-UC-005 | P0 |
| FR-WEB-007 | `/en/pricing` ẩn số USD W0; hiện «Contact sales — USD list from W2» + form demo `locale=en` | GTM-UC-005 | P0 |
| FR-WEB-008 | `/dang-ky-demo` + `/en/request-demo` cùng schema form | GTM-UC-006 | P0 |
| FR-WEB-009 | Thank-you `/dang-ky-demo/cam-on` không index (`noindex`) | GTM-UC-007 | P0 |
| FR-WEB-010 | `/ve-chung-toi` 1 trang; không dùng tên RNOSAI | GTM-UC-008 | P0 |
| FR-WEB-011 | `/phap-ly/bao-mat` `/phap-ly/dieu-khoan` `/phap-ly/cookie` + EN `/en/legal/*` | GTM-UC-009 | P0 |
| FR-WEB-012 | Cookie banner: Tối cần / Phân tích / Quảng cáo; mặc định chỉ Tối cần | GTM-UC-010 | P0 |
| FR-WEB-013 | Header sticky: logo, **Giải pháp ▾ · Nền tảng ▾ · Bảng giá · Tài nguyên ▾** (Tin tức, Sự kiện, About, Demo), VI\|EN, Đăng nhập, Demo. Không phone trên header. Chữ ink trên nền trắng đặc — contrast WCAG AA | GTM-UC-001, 031 | P0 |
| FR-WEB-014 | Footer 5 cột: Nền tảng (4 module) · Giải pháp · Pháp lý · Tài nguyên (tin, sự kiện, about, demo) · liên hệ `hello@pttcrm.com` `+84 24 7307 7979` | GTM-UC-001 | P0 |
| FR-WEB-015 | Canonical + hreflang `vi`/`en`/`x-default` (`x-default` = `/vi`) | GTM-UC-011 | P0 |
| FR-WEB-016 | JSON-LD `Organization` + `SoftwareApplication` + `Offer` trên giá | GTM-UC-011 | P0 |
| FR-WEB-017 | Sitemap `/sitemap.xml` gồm tin + sự kiện **published**; không thank-you, không draft | GTM-UC-011 | P0 |
| FR-WEB-018 | Đăng nhập mở `https://rs.pttads.vn/login` tab hiện tại | GTM-UC-012 | P0 |
| FR-WEB-019 | UTM `source,medium,campaign,content,term` persist first-touch cookie 30 ngày `ptt_utm` | GTM-UC-013 | P0 |
| FR-WEB-020 | Meta Pixel PageView chỉ khi consent Phân tích hoặc Quảng cáo = true | GTM-UC-010 | P0 |
| FR-WEB-021 | Copy không chứa chuỗi `RNOSAI` (CI grep) | GTM-UC-008 | P0 |
| FR-WEB-022 | 404 locale-aware | GTM-UC-001 | P0 |
| FR-WEB-023 | `pttcrm.vn` 301 → `pttcrm.com/vi` (cấu hình host, không trong Next rewrite nội bộ) | GTM-UC-001 | P0 |
| FR-WEB-024 | `/tin-tuc` + `/en/news`: danh sách bài **published** từ CMS, lọc `insight` \| `nganh` \| `huong-dan` | GTM-UC-029 | P0 |
| FR-WEB-025 | `/tin-tuc/{slug}` + `/en/news/{slug}`: cùng slug; body CMS; cover từ media; CTA Demo; 404 nếu draft / archived | GTM-UC-030 | P0 |
| FR-WEB-026 | Mega desktop: panel **trắng đặc** (không backdrop-filter, không opacity < 1). Lớp dim **dưới** mega. Esc / click dim / rời header đóng. Hover item đổi panel «Xem nhanh» | GTM-UC-031 | P0 |
| FR-WEB-027 | Mast tối (ink) cho bảng giá, tin, sự kiện, về chúng tôi. Hero chỉ 1 canvas mạng; `prefers-reduced-motion` tắt motion | GTM-UC-002 | P1 |
| FR-WEB-028 | `/su-kien` + `/en/events`: danh sách sự kiện published; tab Sắp tới / Đã diễn ra | GTM-UC-032 | P0 |
| FR-WEB-029 | `/su-kien/{slug}` + `/en/events/{slug}`: chi tiết; CTA Demo hoặc URL đăng ký; 404 nếu không published | GTM-UC-033 | P0 |

### 3.2. Form demo (W0)

| ID | Yêu cầu | UC |
|----|---------|-----|
| FR-WEB-030 | Field bắt buộc: `full_name` ≥ 2 ký tự, `email` RFC, `phone` E.164 hoặc 0xxxxxxxxx VN, `company` ≥ 2, `industry`, `sku_interest`, `consent_privacy=true` | GTM-UC-006 |
| FR-WEB-031 | Field tùy chọn: `company_size`, `message` ≤ 1000 | GTM-UC-006 |
| FR-WEB-032 | Hidden: `locale`, `landing_path`, UTM, `website` honeypot phải rỗng | GTM-UC-014 |
| FR-WEB-033 | Client validate + server 422 `field_errors` | GTM-UC-006 |
| FR-WEB-034 | Success → thank-you; Pixel `Lead` nếu consent Quảng cáo | GTM-UC-007 |
| FR-WEB-035 | Disable submit khi đang gửi; không double-post | GTM-UC-006 |

### 3.3. API & lead (W0)

| ID | Yêu cầu | UC |
|----|---------|-----|
| FR-GTM-001 | `POST /api/v1/public/gtm/demo-requests` không auth | GTM-UC-015 |
| FR-GTM-002 | CORS chỉ origin `https://pttcrm.com` `https://www.pttcrm.com` `http://localhost:3300` | GTM-UC-015 |
| FR-GTM-003 | Rate limit 10 POST / IP / giờ → 429 | GTM-UC-014 |
| FR-GTM-004 | Honeypot khác rỗng → 204 không tạo lead (im lặng) | GTM-UC-014 |
| FR-GTM-005 | Insert `gtm_demo_request` status=`new` | GTM-UC-015 |
| FR-GTM-006 | Tạo `crm_leads` `source=pttcrm_web` `full_name` `email` `phone` `company`; gán `lead_id` | GTM-UC-015 |
| FR-GTM-007 | Dedup: cùng email trong 7 ngày → insert request mới cùng `lead_id`, **không** tạo lead thứ hai; trả `deduped=true` | GTM-UC-016 |
| FR-GTM-008 | Gán owner round-robin nhóm `sales_gtm` (config `GTM_SALES_USER_IDS`) | GTM-UC-017 |
| FR-GTM-009 | Audit `gtm.demo_request.created` | GTM-UC-015 |
| FR-GTM-010 | Response 201 `{ id, lead_id, deduped }` không lộ owner | GTM-UC-015 |

### 3.4. Demo inbox (W0)

| ID | Yêu cầu | UC |
|----|---------|-----|
| FR-GTM-011 | Route ops-web `/crm/gtm/demos` role Sales, GDKD, Admin | GTM-UC-018 |
| FR-GTM-012 | Cột: thời điểm, tên, công ty, ngành, SKU, locale, UTM campaign, status, owner, tuổi lead | GTM-UC-018 |
| FR-GTM-013 | Filter status, industry, locale, owner | GTM-UC-018 |
| FR-GTM-014 | Status: `new` → `qualified` \| `disqualified` → `demo_booked` → `won` \| `lost` | GTM-UC-019 |
| FR-GTM-015 | `qualified` bắt buộc `note` ≥ 10 ký tự | GTM-UC-019 |
| FR-GTM-016 | Badge SLA: vàng > 2 giờ, đỏ > 4 giờ khi status=`new` trong 08:30–18:00 GMT+7 T2–T6 | GTM-UC-020 |
| FR-GTM-017 | Click tên mở `/crm/leads/[lead_id]` | GTM-UC-018 |

### 3.5. CMS (W0)

| ID | Yêu cầu | UC | Priority |
|----|---------|-----|----------|
| FR-CMS-001 | Desk ops-web `/crm/gtm/cms` — 4 tab: Media · Tin tức · Sự kiện · Slot ảnh. Guard `gtm.cms.view` | GTM-UC-034…037 | P0 |
| FR-CMS-002 | Upload media: `image/jpeg` `image/png` `image/webp` `image/svg+xml`; ≤ 5 MB; lưu object storage; tạo `gtm_cms_media` | GTM-UC-034 | P0 |
| FR-CMS-003 | Media bắt buộc `alt_vi` trước khi gán cover / slot. `alt_en` bắt buộc nếu bài/sự kiện xuất bản locale `en` | GTM-UC-034 | P0 |
| FR-CMS-004 | SVG sanitize (cấm script). Không PDF/video W0 | GTM-UC-034 | P0 |
| FR-CMS-005 | CRUD bài: slug (unique, `[a-z0-9-]`), category, title/dek/body VI+EN (MD), cover_media_id, `featured_home`, SEO title/desc | GTM-UC-035 | P0 |
| FR-CMS-006 | Status bài: `draft` → `published` \| `archived`. `published` → `draft` (gỡ site) hoặc `archived` | GTM-UC-035, 038 | P0 |
| FR-CMS-007 | Publish bài: title+body locale đó, cover, alt cover. CI/API từ chối body chứa `RNOSAI` | GTM-UC-035 | P0 |
| FR-CMS-008 | Publish EN: `title_en` + `body_en` + `alt_en` cover. Thiếu → chỉ `/vi` index; `/en/news/{slug}` 404 | GTM-UC-035 | P0 |
| FR-CMS-009 | CRUD sự kiện: slug, kind, start/end, timezone, location_type, title/dek/body VI+EN, cover, `cta_type` `demo`\|`url` | GTM-UC-036 | P0 |
| FR-CMS-010 | Status sự kiện: `draft` \| `published` \| `cancelled` \| `archived`. Cancelled vẫn 200, badge Đã hủy | GTM-UC-036, 038 | P0 |
| FR-CMS-011 | `cta_type=url` bắt buộc https; `demo` → `/dang-ky-demo?utm_campaign=event-{slug}` | GTM-UC-033 | P0 |
| FR-CMS-012 | Slot ảnh: khóa cố định (`home.hero`, `home.module.crm`…); mỗi slot 1 `media_id` + caption optional | GTM-UC-037 | P0 |
| FR-CMS-013 | Public GET chỉ `published` (sự kiện: published + cancelled). Draft 404. Không list id nội bộ thừa | GTM-UC-029, 032 | P0 |
| FR-CMS-014 | Publish/unpublish gọi revalidate Next (`x-cms-secret`) tag `articles` `events` `slots` `sitemap` | GTM-UC-039 | P0 |
| FR-CMS-015 | Audit `gtm.cms.{media,article,event,slot}.{created,updated,published,archived}` | GTM-UC-035 | P1 |
| FR-CMS-016 | Soft-delete media: `archived` nếu đang được cover/slot tham chiếu — cấm hard delete | GTM-UC-034 | P0 |
| FR-CMS-017 | Seed W0: 6 bài Phụ lục C + 1 sự kiện mẫu «Demo ngày ngành» draft (không published) | GTM-UC-035 | P0 |
| FR-CMS-018 | Rate limit public CMS GET: 120 / IP / phút | GTM-UC-029 | P1 |
| FR-CMS-019 | Body MD: chỉ heading, p, ul/ol, a, strong, em, img (src phải là URL media cùng origin/CDN) | GTM-UC-030 | P0 |
| FR-CMS-020 | Guard `gtm.cms.write` soạn; `gtm.cms.publish` mới được `published`. MKT có cả hai W0 | GTM-UC-035 | P0 |

### 3.6. Sandbox (W1 — đặc tả đủ, không code W0)

| ID | Yêu cầu | UC |
|----|---------|-----|
| FR-SAN-001 | Nút Grant chỉ khi status=`demo_booked` hoặc `qualified` | GTM-UC-021 |
| FR-SAN-002 | Tạo user `demo_{requestId}` role hạn chế, tenant `sandbox_{industry}`, hết hạn `now()+14d` | GTM-UC-021 |
| FR-SAN-003 | Email login + mật khẩu một lần tới email form | GTM-UC-022 |
| FR-SAN-004 | Job hourly disable user khi `sandbox_expires_at < now()` | GTM-UC-023 |
| FR-SAN-005 | Status → `sandbox_granted` | GTM-UC-021 |

### 3.7. W2+ (ghi FR, không implement W0)

| ID | Yêu cầu |
|----|---------|
| FR-WEB-040 | `/en/pricing` hiện USD list §6.3 khi `NEXT_PUBLIC_USD_PRICE=1` |
| FR-GTM-020 | Stripe Checkout cho SKU USD; webhook ghi `gtm_payment` |
| FR-SAN-008 | Sandbox shell EN: login, `/crm/leads` |

---

## Phần 4. Mô hình dữ liệu

DDL chạy trên Postgres RNOSAI (không tạo DB riêng).

```sql
CREATE TABLE gtm_demo_request (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  locale          text NOT NULL CHECK (locale IN ('vi', 'en')),
  full_name       text NOT NULL,
  email           text NOT NULL,
  phone           text NOT NULL,
  company         text NOT NULL,
  industry        text NOT NULL CHECK (industry IN (
                    'bds', 'agency', 'fnb', 'education', 'pharma', 'other')),
  sku_interest    text NOT NULL CHECK (sku_interest IN ('mkt', 'ind', 'agy')),
  company_size    text CHECK (company_size IN ('1-10', '11-30', '31-80', '81+')),
  message         text,
  landing_path    text NOT NULL,
  utm_source      text,
  utm_medium      text,
  utm_campaign    text,
  utm_content     text,
  utm_term        text,
  status          text NOT NULL DEFAULT 'new' CHECK (status IN (
                    'new', 'qualified', 'disqualified',
                    'demo_booked', 'sandbox_granted', 'won', 'lost')),
  status_note     text,
  owner_user_id   text,
  lead_id         text,
  sandbox_expires_at timestamptz,
  sandbox_user_id text,
  ip_hash         text NOT NULL
);

CREATE INDEX gtm_demo_request_email_created_idx
  ON gtm_demo_request (lower(email), created_at DESC);
CREATE INDEX gtm_demo_request_status_created_idx
  ON gtm_demo_request (status, created_at DESC);
```

`ip_hash` = SHA-256(`ip` + `GTM_IP_SALT`). Không lưu IP thô.

```sql
CREATE TABLE gtm_cms_media (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),
  storage_key   text NOT NULL UNIQUE,
  public_url    text NOT NULL,
  mime          text NOT NULL,
  bytes         int NOT NULL,
  width         int,
  height        int,
  alt_vi        text,
  alt_en        text,
  credit        text,
  status        text NOT NULL DEFAULT 'active'
                  CHECK (status IN ('active', 'archived')),
  uploaded_by   text NOT NULL
);

CREATE TABLE gtm_cms_article (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  slug            text NOT NULL UNIQUE,
  category        text NOT NULL CHECK (category IN ('insight', 'nganh', 'huong-dan')),
  status          text NOT NULL DEFAULT 'draft'
                    CHECK (status IN ('draft', 'published', 'archived')),
  published_at    timestamptz,
  cover_media_id  uuid REFERENCES gtm_cms_media(id),
  title_vi        text NOT NULL,
  title_en        text,
  dek_vi          text NOT NULL,
  dek_en          text,
  body_vi         text NOT NULL,
  body_en         text,
  seo_title_vi    text,
  seo_title_en    text,
  seo_desc_vi     text,
  seo_desc_en     text,
  featured_home   boolean NOT NULL DEFAULT false,
  created_by      text NOT NULL,
  updated_by      text NOT NULL
);

CREATE TABLE gtm_cms_event (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  slug            text NOT NULL UNIQUE,
  kind            text NOT NULL CHECK (kind IN (
                    'webinar', 'workshop', 'meetup', 'conference', 'other')),
  status          text NOT NULL DEFAULT 'draft'
                    CHECK (status IN ('draft', 'published', 'cancelled', 'archived')),
  start_at        timestamptz NOT NULL,
  end_at          timestamptz NOT NULL,
  timezone        text NOT NULL DEFAULT 'Asia/Ho_Chi_Minh',
  location_type   text NOT NULL CHECK (location_type IN ('online', 'offline', 'hybrid')),
  location_vi     text,
  location_en     text,
  title_vi        text NOT NULL,
  title_en        text,
  dek_vi          text NOT NULL,
  dek_en          text,
  body_vi         text NOT NULL,
  body_en         text,
  cover_media_id  uuid REFERENCES gtm_cms_media(id),
  cta_type        text NOT NULL CHECK (cta_type IN ('demo', 'url')),
  cta_url         text,
  published_at    timestamptz,
  created_by      text NOT NULL,
  updated_by      text NOT NULL,
  CHECK (end_at > start_at),
  CHECK (cta_type <> 'url' OR cta_url ~ '^https://')
);

CREATE TABLE gtm_cms_slot (
  slot_key      text PRIMARY KEY,
  media_id      uuid NOT NULL REFERENCES gtm_cms_media(id),
  caption_vi    text,
  caption_en    text,
  updated_at    timestamptz NOT NULL DEFAULT now(),
  updated_by    text NOT NULL
);

CREATE INDEX gtm_cms_article_status_pub_idx
  ON gtm_cms_article (status, published_at DESC);
CREATE INDEX gtm_cms_event_status_start_idx
  ON gtm_cms_event (status, start_at);
```

Slot key W0 (bắt buộc có hàng, media có thể placeholder):  
`home.hero` · `home.module.crm` · `home.module.ads` · `home.module.portal` · `home.module.ai` · `product.crm` · `product.ads` · `product.portal` · `product.ai` · `solution.bds` · `solution.agency` · `solution.fnb`.

---

## Phần 5. API

Base: `https://api.pttads.vn` (staging: env `NEXT_PUBLIC_GTM_API_BASE`).

### `POST /api/v1/public/gtm/demo-requests`

Request:

```json
{
  "full_name": "Nguyen An",
  "email": "an@agency.vn",
  "phone": "0901234567",
  "company": "An Agency",
  "industry": "agency",
  "sku_interest": "agy",
  "company_size": "11-30",
  "message": "Can demo portal ROAS",
  "locale": "vi",
  "landing_path": "/vi/giai-phap/agency",
  "utm_source": "google",
  "utm_medium": "cpc",
  "utm_campaign": "w0-agency",
  "utm_content": null,
  "utm_term": null,
  "consent_privacy": true,
  "website": ""
}
```

| HTTP | Khi |
|------|-----|
| 201 | Tạo mới hoặc dedup |
| 204 | Honeypot |
| 422 | Validate |
| 429 | Rate limit |
| 403 | Origin CORS |

### `GET /api/v1/gtm/demo-requests` (staff JWT)

Query: `status`, `industry`, `locale`, `owner_user_id`, `limit=50`, `offset=0`.  
Guard: `gtm.demos.view`.

### `PATCH /api/v1/gtm/demo-requests/:id` (staff JWT)

Body: `{ "status", "status_note", "owner_user_id" }`.  
Guard: `gtm.demos.write`. Transition không hợp lệ → 409.

### `POST /api/v1/gtm/demo-requests/:id/sandbox` (W1)

Guard: `gtm.sandbox.grant`.

### Public CMS (không auth)

| Method | Path | Ghi chú |
|--------|------|---------|
| GET | `/api/v1/public/cms/articles` | Query `locale` `category` `limit` `offset`. Chỉ published |
| GET | `/api/v1/public/cms/articles/:slug` | 404 draft/archived |
| GET | `/api/v1/public/cms/events` | Query `locale` `when=upcoming\|past\|all` |
| GET | `/api/v1/public/cms/events/:slug` | published hoặc cancelled |
| GET | `/api/v1/public/cms/slots` | Query `keys=home.hero,home.module.crm` |

ISR: marketing-web `revalidateTag` khi nhận `POST /api/revalidate` header `x-cms-secret`.

### Staff CMS (JWT)

| Method | Path | Guard |
|--------|------|-------|
| GET/POST | `/api/v1/gtm/cms/media` | view / write |
| POST | `/api/v1/gtm/cms/media` multipart `file` | write |
| PATCH | `/api/v1/gtm/cms/media/:id` | write (alt, credit, archive) |
| GET/POST | `/api/v1/gtm/cms/articles` | view / write |
| PATCH | `/api/v1/gtm/cms/articles/:id` | write |
| POST | `/api/v1/gtm/cms/articles/:id/publish` | publish |
| POST | `/api/v1/gtm/cms/articles/:id/unpublish` | publish |
| GET/POST | `/api/v1/gtm/cms/events` | view / write |
| PATCH | `/api/v1/gtm/cms/events/:id` | write |
| POST | `/api/v1/gtm/cms/events/:id/publish` | publish |
| GET/PUT | `/api/v1/gtm/cms/slots/:slot_key` | view / write |

---

## Phần 6. Yêu cầu phi chức năng

| ID | Yêu cầu |
|----|---------|
| NFR-001 | LCP trang chủ < 2.5s 4G; Lighthouse Performance ≥ 85, SEO ≥ 90 |
| NFR-002 | Form P95 submit < 800ms (API staging) |
| NFR-003 | WCAG 2.2 AA: contrast logo/CTA/**header nav trên nền trắng**, focus ring, label mọi input |
| NFR-004 | CSP: không `unsafe-inline` script trừ JSON-LD nonce |
| NFR-005 | Secrets chỉ env: `GTM_IP_SALT`, `META_PIXEL_ID`, `GTM_SALES_USER_IDS`, `CMS_REVALIDATE_SECRET`, storage keys |
| NFR-006 | marketing-web port local **3300** |
| NFR-007 | Node 20, Next.js 15, TypeScript strict |
| NFR-008 | Unit test: validate form, honeypot, dedup 7 ngày, SLA badge |
| NFR-009 | CI fail nếu `rg -n 'RNOSAI' apps/web` (copy repo). API publish fail nếu body/alt chứa `RNOSAI` |

---

## Phần 7. Tiêu chí chấp nhận W0

1. `pnpm --filter web build` pass.  
2. Playwright: home VI, switch EN, submit demo → 201 + row DB + lead.  
3. Honeypot → 204, 0 lead.  
4. Email lặp trong 7 ngày → `deduped=true`, 1 lead.  
5. `/crm/gtm/demos` hiện row; SLA đỏ sau 4 giờ mocked.  
6. `hreflang` có trên home và giá.  
7. Grep `RNOSAI` trong `content/` = 0.  
8. `/vi/tin-tuc` đọc CMS published; draft slug → 404; filter 3 category.  
9. Home **không** có 3 card giá; teaser tin từ CMS; dải ngành ink.  
10. Mega: panel `#FFFFFF` đặc; dim không đè panel; header chữ ink trên trắng.  
11. MKT upload ảnh + publish 1 bài + 1 sự kiện trên `/crm/gtm/cms` → hiện site sau revalidate.  
12. `/vi/su-kien` list upcoming; draft sự kiện 404.

---

## Phụ lục A. Glossary

| Thuật ngữ | Nghĩa |
|-----------|--------|
| A+ | Demo-led + sandbox sau qualify |
| D0 | Cửa English trên site |
| D1 | Bán ASEAN |
| Industry pack | Bộ copy + demo data + playbook một ngành |
| First-touch UTM | UTM cookie 30 ngày, không overwrite nếu đã có |
| CMS desk | ops-web `/crm/gtm/cms` — soạn tin, sự kiện, media |
| Slot ảnh | Khóa cố định gắn 1 media cho trang tĩnh (vd. `home.hero`) |

## Phụ lục B. Business rules

| ID | Rule |
|----|------|
| BR-GTM-001 | CTA chính mọi trang: Đăng ký Demo / Request demo |
| BR-GTM-002 | Không trial công khai |
| BR-GTM-003 | Không giá / user < 200.000 VND |
| BR-GTM-004 | `/en/pricing` không in USD cho đến flag W2 |
| BR-GTM-005 | Consent privacy bắt buộc để POST |
| BR-GTM-006 | Pixel chỉ sau consent |
| BR-GTM-007 | Dedup email 7 ngày |
| BR-GTM-008 | Honeypot im lặng 204 |
| BR-GTM-009 | SLA 4 giờ chỉ giờ hành chính VN |
| BR-GTM-010 | Chiết khấu sales ≤ 15% retainer |
| BR-GTM-011 | HĐ tối thiểu 12 tháng |
| BR-GTM-012 | `ind` đúng 1 industry pack |
| BR-GTM-013 | Cấm chữ RNOSAI trên UI công khai |
| BR-GTM-014 | Sandbox chỉ sau qualified/demo_booked |
| BR-GTM-015 | Sandbox 14 ngày dương lịch |
| BR-GTM-016 | Owner mặc định nhóm `sales_gtm` |
| BR-GTM-017 | `x-default` hreflang = `/vi` |
| BR-GTM-018 | Case study W1: chỉ số PO ký; cấm số bịa |
| BR-GTM-019 | Tin / sự kiện: giáo dục; cấm ROAS/CPL bịa; cấm hứa trial 30 ngày |
| BR-GTM-020 | Mega menu không trong suốt, không blur; dim không đè panel |
| BR-GTM-021 | Nav đẩy **Giải pháp (ngành)** trước **Nền tảng (module)** |
| BR-GTM-022 | Public chỉ `published` (sự kiện: + `cancelled`) |
| BR-GTM-023 | Ảnh site (trừ `brand/` logo/favicon/legal) phải là `gtm_cms_media` active |
| BR-GTM-024 | Không publish khi thiếu cover + alt locale |
| BR-GTM-025 | CMS không sửa list price, pháp lý, slogan — các field đó ở repo |
| BR-GTM-026 | Không dùng `SeoCmsModule` / WordPress / CMS SaaS cho pttcrm.com |

## Phụ lục C. Seed tin tức W0 (CMS)

| Slug (VI = EN) | Category |
|----------------|----------|
| `closed-loop` | insight |
| `crm-theo-nganh` | nganh |
| `portal-agency` | insight |
| `demo-60-phut` | huong-dan |
| `khong-dua-gia-seat` | insight |
| `zalo-vietnam-pack` | nganh |

Seed vào `gtm_cms_article` `status=published`. Cùng slug `/vi/tin-tuc/{slug}` ↔ `/en/news/{slug}`. Thiếu `title_en`/`body_en` thì không publish EN.

## Phụ lục D. Env

```
NEXT_PUBLIC_GTM_API_BASE=https://api.pttads.vn
NEXT_PUBLIC_LOGIN_URL=https://rs.pttads.vn/login
NEXT_PUBLIC_META_PIXEL_ID=
NEXT_PUBLIC_USD_PRICE=0
NEXT_PUBLIC_CMS_API_BASE=https://api.pttads.vn
CMS_REVALIDATE_SECRET=
GTM_CMS_S3_BUCKET=
GTM_CMS_S3_REGION=
GTM_CMS_S3_ACCESS_KEY=
GTM_CMS_S3_SECRET_KEY=
GTM_CMS_PUBLIC_BASE=https://cdn.pttcrm.com
GTM_IP_SALT=
GTM_SALES_USER_IDS=user-a,user-b
```
