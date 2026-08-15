# Use Case — PTTCRM Commercial Platform

> **Prefix:** GTM · **Phiên bản:** 1.2 · **Ngày:** 2026-08-15  
> **1.1:** Nav Giải pháp/Nền tảng/Tài nguyên, tin tức W0, mega menu  
> **1.2:** CMS media / tin / sự kiện  
> **Master:** [`../specs/2026-08-15-pttcrm-master-spec.md`](../specs/2026-08-15-pttcrm-master-spec.md)  
> **SRS:** [`../specs/2026-08-15-pttcrm-srs.md`](../specs/2026-08-15-pttcrm-srs.md)  
> **UX/UI:** [`../specs/2026-08-15-pttcrm-ui-ux.md`](../specs/2026-08-15-pttcrm-ui-ux.md)

---

## Ma trận

| UC | Tên | Actor | Wave | FR |
|----|-----|-------|------|-----|
| GTM-UC-001 | Chọn locale và duyệt chrome | VIS | W0 | FR-WEB-001…002, 013, 014, 022, 023 |
| GTM-UC-002 | Xem trang chủ | VIS | W0 | FR-WEB-003, 027 |
| GTM-UC-003 | Xem trang sản phẩm (Nền tảng) | VIS | W0 | FR-WEB-004 |
| GTM-UC-004 | Xem trang ngành | VIS | W0 | FR-WEB-005 |
| GTM-UC-005 | Xem bảng giá | VIS | W0 | FR-WEB-006, 007 |
| GTM-UC-006 | Gửi form demo hợp lệ | VIS | W0 | FR-WEB-008, 030…035 |
| GTM-UC-007 | Xem thank-you + Pixel Lead | VIS | W0 | FR-WEB-009, 034 |
| GTM-UC-008 | Xem About — không RNOSAI | VIS | W0 | FR-WEB-010, 021 |
| GTM-UC-009 | Đọc pháp lý | VIS | W0 | FR-WEB-011 |
| GTM-UC-010 | Cookie consent | VIS | W0 | FR-WEB-012, 020 |
| GTM-UC-011 | SEO hreflang / sitemap / JSON-LD | VIS | W0 | FR-WEB-015…017 |
| GTM-UC-012 | Đăng nhập staff | VIS | W0 | FR-WEB-018 |
| GTM-UC-013 | First-touch UTM 30 ngày | VIS | W0 | FR-WEB-019 |
| GTM-UC-014 | Chặn bot honeypot + rate limit | BOT | W0 | FR-WEB-032, FR-GTM-003, 004 |
| GTM-UC-015 | API tạo request + lead | API | W0 | FR-GTM-001…006, 009, 010 |
| GTM-UC-016 | Dedup email 7 ngày | API | W0 | FR-GTM-007 |
| GTM-UC-017 | Round-robin owner | API | W0 | FR-GTM-008 |
| GTM-UC-018 | Sales mở inbox | SAL | W0 | FR-GTM-011…013, 017 |
| GTM-UC-019 | Đổi status demo | SAL | W0 | FR-GTM-014, 015 |
| GTM-UC-020 | SLA badge 2h / 4h | SAL/GDK | W0 | FR-GTM-016 |
| GTM-UC-021 | Grant sandbox | SAL | W1 | FR-SAN-001, 002, 005 |
| GTM-UC-022 | Email credential sandbox | SAL | W1 | FR-SAN-003 |
| GTM-UC-023 | Hết hạn sandbox 14 ngày | SYS | W1 | FR-SAN-004 |
| GTM-UC-024 | Prefill form từ trang ngành | VIS | W0 | FR-WEB-005, 030 |
| GTM-UC-025 | GDKD lọc pipeline demo | GDK | W0 | FR-GTM-013 |
| GTM-UC-026 | Công bố case (po_signed) | MKT | W1 | BR-GTM-018 |
| GTM-UC-027 | Bật giá USD | IT | W2 | FR-WEB-040 |
| GTM-UC-028 | Sandbox shell English | VIS | W2 | FR-SAN-008 |
| GTM-UC-029 | Duyệt tin tức + lọc | VIS | W0 | FR-WEB-024, FR-CMS-013 |
| GTM-UC-030 | Đọc bài tin → CTA Demo | VIS | W0 | FR-WEB-025, FR-CMS-019 |
| GTM-UC-031 | Mở / đóng mega menu | VIS | W0 | FR-WEB-013, 026 |
| GTM-UC-032 | Duyệt sự kiện | VIS | W0 | FR-WEB-028, FR-CMS-013 |
| GTM-UC-033 | Đọc sự kiện → CTA | VIS | W0 | FR-WEB-029, FR-CMS-011 |
| GTM-UC-034 | Upload / quản lý media | MKT | W0 | FR-CMS-001…004, 016 |
| GTM-UC-035 | Soạn và xuất bản bài | MKT | W0 | FR-CMS-005…008, 020 |
| GTM-UC-036 | Soạn và xuất bản sự kiện | MKT | W0 | FR-CMS-009, 010 |
| GTM-UC-037 | Gán ảnh vào slot trang | MKT | W0 | FR-CMS-012 |
| GTM-UC-038 | Gỡ / archive nội dung | MKT | W0 | FR-CMS-006, 010 |
| GTM-UC-039 | Revalidate site sau publish | SYS | W0 | FR-CMS-014 |

---

## GTM-UC-001 — Chọn locale và duyệt chrome

**Mục tiêu:** Visitor xem đúng ngôn ngữ, chuyển VI↔EN giữ path tương đương.

**Tiền đề:** Site deploy; DNS `pttcrm.com`.

**Luồng chính:**
1. VIS mở `/` với `Accept-Language: vi` → 200 `/vi`.
2. VIS bấm `EN` → `/en` cùng loại trang (home→home, `bang-gia`→`pricing`, `tin-tuc`→`news`).
3. Header: **Giải pháp ▾ · Nền tảng ▾ · Bảng giá · Tài nguyên ▾** · VI|EN · Đăng nhập · Demo. Không phone.
4. Footer 5 cột gồm Tài nguyên (tin, sự kiện, about, demo) + hotline.

**Ngoại lệ:** `Accept-Language` không `vi`/`en` → `/vi`. Path lạ → 404 locale.

**Hậu điều kiện:** `html[lang]` khớp. `x-default` hreflang = `/vi`. Header chữ ink trên nền trắng.

---

## GTM-UC-002 — Xem trang chủ

**Mục tiêu:** VIS hiểu category + slogan + 2 CTA trong một màn hình đầu.

**Luồng:** Mở `/vi` → hero slogan VI + khung sản phẩm, trust, 3 hàng moat, 4 module, dải ngành ink, 4 bước, teaser 3 tin CMS, 1 sự kiện upcoming nếu có, FAQ, CTA Demo.

**Không:** 3 card giá trên home. Nút «Dùng thử 30 ngày». Chuỗi RNOSAI. Orb / scan / marquee.

---

## GTM-UC-003 — Xem trang sản phẩm (Nền tảng)

**Mục tiêu:** VIS hiểu 1 module / trang.

**Luồng:** Vào mega **Nền tảng** → CRM | Ads | Portal | AI. Ads EN không hứa Zalo.

---

## GTM-UC-004 — Xem trang ngành

**Mục tiêu:** Khớp slogan «chuyên biệt từng ngành».

**Luồng:** Card ngành → nỗi đau + metric tên (không số bịa) + CTA Demo.

---

## GTM-UC-005 — Xem bảng giá

**Mục tiêu:** Neo ACV, không đua Getfly.

**Luồng VI:** 3 cột, số VND Master Spec §6.2, `ind` «Phổ biến».  
**Luồng EN W0:** 3 cột không số USD, CTA Request demo.

**Cấm:** Giá / user < 200.000 VND.

---

## GTM-UC-006 — Gửi form demo hợp lệ

**Actor:** VIS  
**Tiền đề:** Consent privacy check.

**Luồng:**
1. Điền field bắt buộc.
2. Submit → POST API.
3. 201 → redirect thank-you.

**Ngoại lệ:** Thiếu field → 422, ở lại form, focus field đầu lỗi. Mạng lỗi → toast «Thử lại», không mất dữ liệu.

---

## GTM-UC-007 — Thank-you + Pixel Lead

**Luồng:** Trang `noindex`. Nếu consent Quảng cáo = true → `fbq('track','Lead')` một lần. Copy hứa liên hệ giờ hành chính VN.

---

## GTM-UC-008 — About không RNOSAI

**Luồng:** `/vi/ve-chung-toi` kể PTTCRM. CI `rg RNOSAI apps/web/content` = 0.

---

## GTM-UC-009 — Pháp lý

Ba trang Privacy, Terms, Cookie mỗi locale. Link từ footer và checkbox form (Privacy).

---

## GTM-UC-010 — Cookie consent

**Mặc định:** chỉ cookie tối cần (`ptt_utm` sau khi vào landing có UTM được coi tối cần cho attribution first-touch; Pixel **không** tối cần).

**Luồng:** Đồng ý tất cả → Pixel PageView. Từ chối quảng cáo → không load Pixel.

---

## GTM-UC-011 — SEO kỹ thuật

Mỗi trang marketing (không thank-you): canonical, hreflang vi/en/x-default, title ≤ 60, description ≤ 155. Sitemap không chứa `/cam-on`. JSON-LD Organization trên mọi trang; Offer trên giá VI.

---

## GTM-UC-012 — Đăng nhập

Bấm Đăng nhập → `https://rs.pttads.vn/login` cùng tab. Không embed login trên site.

---

## GTM-UC-013 — First-touch UTM

VIS vào `/?utm_source=google&utm_campaign=w0` → cookie `ptt_utm` 30 ngày. Vào lại không UTM → cookie giữ. Form gửi UTM first-touch, không last-touch.

---

## GTM-UC-014 — Chặn bot

Honeypot `website` khác rỗng → 204, 0 row. IP > 10 POST/giờ → 429.

---

## GTM-UC-015 — Tạo request + lead

**Luồng:** POST hợp lệ → `gtm_demo_request` `new` + `crm_leads` `source=pttcrm_web` + audit + 201 `{id,lead_id,deduped:false}`.

**Ngoại lệ:** Origin lạ → trình duyệt chặn CORS; server không ghi.

---

## GTM-UC-016 — Dedup 7 ngày

Cùng `lower(email)` request trong 7 ngày → insert request mới trỏ cùng `lead_id`, `deduped=true`, không tạo lead thứ hai. History giữ đủ hàng.

---

## GTM-UC-017 — Round-robin owner

`GTM_SALES_USER_IDS=a,b`. Request 1 → a, 2 → b, 3 → a. User không tồn tại trong list bị bỏ qua. List rỗng → `owner_user_id` null, GDKD thấy Unassigned.

---

## GTM-UC-018 — Inbox

SAL mở `/crm/gtm/demos`. Thấy cột FR-GTM-012. Click tên → `/crm/leads/{lead_id}`. Không quyền → 403.

---

## GTM-UC-019 — Đổi status

SAL: `new` → `qualified` với note ≥ 10 ký tự. `new` → `disqualified` với note. `qualified` → `demo_booked`. `demo_booked` → `won` | `lost`.  
Nhảy `new` → `won` → 409.

---

## GTM-UC-020 — SLA

Trong 08:30–18:00 GMT+7 T2–T6, status=`new`: tuổi > 2h badge vàng; > 4h đỏ. Ngoài giờ hành chính đồng hồ SLA đóng băng (không cộng).

---

## GTM-UC-021 — Grant sandbox (W1)

SAL trên `qualified` hoặc `demo_booked` bấm Grant. Hệ thống tạo user `demo_{id}`, tenant `sandbox_{industry}`, `sandbox_expires_at = now()+14d`, status `sandbox_granted`.  
Grant khi `new` → 409.

---

## GTM-UC-022 — Email sandbox (W1)

Hệ thống gửi 1 email: URL login, user, mật khẩu một lần, ngày hết hạn. Không gửi nếu email bounce; status giữ `demo_booked`, note `sandbox_email_failed`.

---

## GTM-UC-023 — Hết hạn sandbox (W1)

Job mỗi giờ: `sandbox_expires_at < now()` → disable user, không xóa data. VIS login → 403 «Sandbox expired».

---

## GTM-UC-024 — Prefill ngành

VIS từ `/vi/giai-phap/agency` bấm Demo → form `industry=agency` `sku_interest=agy`. Đổi select vẫn được.

---

## GTM-UC-025 — GDKD lọc

GDK filter `status=new` `locale=en` → chỉ row EN mới. Export không có ở W0.

---

## GTM-UC-026 — Case W1

MKT thêm `content/cases/{slug}.json` với `po_signed=true` và các field `cpl_vnd`, `roas`. Trang `/vi/khach-hang` chỉ render file `po_signed=true`. Thiếu flag → không hiện.

---

## GTM-UC-027 — USD flag W2

IT set `NEXT_PUBLIC_USD_PRICE=1` → `/en/pricing` in §6.3 Master Spec. Flag `0` → copy W0.

---

## GTM-UC-028 — Sandbox EN W2

VIS nhận credential, `Accept-Language`/toggle EN → lead list tiếng Anh. Các màn ngoài whitelist sandbox → «Not in sandbox» EN, không lộ 129 route.

---

## GTM-UC-029 — Duyệt tin tức + lọc

**Mục tiêu:** VIS đọc góc nhìn / hướng dẫn mà không bịa số case.

**Luồng:**
1. VIS mở `/vi/tin-tuc` (Tài nguyên → Tin tức, hoặc teaser home).
2. Site gọi CMS public; chỉ bài `published`. Filter 3 category.
3. EN: `/en/news` — bài thiếu `title_en`/`body_en` không có trong list EN.

**Không:** Draft. Số ROAS/CPL bịa. Nút trial 30 ngày.

---

## GTM-UC-030 — Đọc bài tin → CTA Demo

**Mục tiêu:** Bài giáo dục dẫn về form demo.

**Luồng:** VIS mở `/vi/tin-tuc/{slug}` → title, meta, body, CTA Demo. Đổi EN giữ bài tương đương.

**Không:** Chuỗi RNOSAI. Số case trừ `po_signed` (W1).

---

## GTM-UC-031 — Mở / đóng mega menu

**Mục tiêu:** VIS chọn ngành / module / tài nguyên mà panel không mờ, không bị dim đè.

**Luồng desktop:**
1. Hover Giải pháp | Nền tảng | Tài nguyên → mega trắng đặc + dim dưới panel.
2. Hover item → cột «Xem nhanh» đổi copy.
3. Đóng: Esc, click dim, rời header, hover Bảng giá / brand / CTA.

**Luồng mobile:** hamburger → accordion 3 nhóm; ẩn «Xem nhanh».

**Không:** `backdrop-filter`, opacity < 1 trên mega. Dim z-index cao hơn mega.

---

## GTM-UC-032 — Duyệt sự kiện

**Mục tiêu:** VIS thấy lịch webinar / workshop đã xuất bản.

**Luồng:** `/vi/su-kien` → tab Sắp tới / Đã diễn ra. EN `/en/events`.

**Không:** Draft. Sự kiện không published.

---

## GTM-UC-033 — Đọc sự kiện → CTA

**Luồng:** `/vi/su-kien/{slug}` → lịch, địa điểm, body, CTA Demo hoặc URL https. `cancelled` → badge Đã hủy, CTA ẩn.

---

## GTM-UC-034 — Upload / quản lý media

**Mục tiêu:** MKT đưa ảnh vào thư viện trước khi gán cover/slot.

**Luồng:** `/crm/gtm/cms?tab=media` → upload ≤ 5 MB → điền `alt_vi` → Active. Archive nếu không còn dùng.

**Không:** Hard delete khi bài/sự kiện/slot đang tham chiếu. Video/PDF W0.

---

## GTM-UC-035 — Soạn và xuất bản bài

**Luồng:** Tab Tin tức → draft slug + VI → chọn cover → Publish. EN chỉ khi đủ `title_en` `body_en` `alt_en`. Body chứa `RNOSAI` → 422.

**Hậu điều kiện:** Bài trên `/vi/tin-tuc/{slug}`; sitemap cập nhật sau revalidate.

---

## GTM-UC-036 — Soạn và xuất bản sự kiện

**Luồng:** Tab Sự kiện → lịch, kind, location, CTA → Publish. `end_at` > `start_at`.

---

## GTM-UC-037 — Gán ảnh vào slot trang

**Luồng:** Tab Slot → chọn `home.hero` (hoặc slot W0 khác) → media active có alt → Lưu → home hiện ảnh mới sau revalidate.

---

## GTM-UC-038 — Gỡ / archive nội dung

**Luồng:** Publish → Gỡ (`draft`) → URL public 404, ra khỏi sitemap. Archive ẩn khỏi desk mặc định.

---

## GTM-UC-039 — Revalidate site sau publish

**Luồng:** API publish thành công → POST marketing-web `/api/revalidate` với `x-cms-secret` → tag `articles` | `events` | `slots` | `sitemap`. Secret sai → 401, nội dung DB vẫn published (retry job).

---

## Business rules (module)

Xem SRS Phụ lục B BR-GTM-001…026. Mọi UC W0 phải thỏa BR-GTM-001, 002, 013, 019–026.
