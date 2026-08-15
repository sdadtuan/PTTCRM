# UX/UI — PTTCRM Commercial Site

> **Document ID:** PTTCRM-UI-20260815  
> **Phiên bản:** 1.2 · **Ngày:** 2026-08-15  
> **Parent:** [Master Spec](./2026-08-15-pttcrm-master-spec.md) · [SRS](./2026-08-15-pttcrm-srs.md)  
> **1.1:** Hệ màu 4 lớp, nav Tài nguyên, tin tức W0, mega đặc, home editorial  
> **1.2:** CMS — tin/sự kiện/media; `/su-kien`; desk ops-web

---

## 1. Nguyên tắc

1. **Sales-led.** Mọi màn có một CTA primary: Demo. Secondary: Đăng nhập.  
2. **Một nền tảng, chuyên biệt từng ngành.** Home và nav đẩy **Giải pháp (3 ngành)** trước **Nền tảng (4 module)**.  
3. **Bốn lớp màu.** Ink / Paper / Surface / Wash. Teal `#0090A0` là accent duy nhất. Header **trắng + chữ ink** (không chữ trắng trên giấy). Mega **trắng đặc**.  
4. **VI và EN cùng layout.** Không ẩn block vì thiếu dịch — thiếu copy EN thì không ship trang đó.  
5. **Không RNOSAI** trên UI.  
6. **Editorial, không slide card.** Home: hàng số + cột chữ. Không 3 card giá trên home.  
7. **CMS là SSoT tin / sự kiện / ảnh.** Trang tĩnh lấy ảnh qua slot. Logo/favicon/legal PDF ở `brand/`.

Tham chiếu cảm giác: Base (nav suite + ngành, demo) + không khí Linear (khoảng trống) — không copy Getfly (trial vàng, giá rẻ, carousel dày).

---

## 2. Design tokens

| Token | Value | Dùng |
|-------|-------|------|
| `--ptt-teal` | `#0090A0` | CTA, link, số 01–03 |
| `--ptt-teal-bright` | `#12C4D4` | Kicker trên ink |
| `--ptt-teal-ink` | `#006B75` | hover / text on paper |
| `--ptt-ink` | `#061418` | hero, mast, dải ngành, CTA, footer, text |
| `--ptt-paper` | `#EEF7F8` | body bg |
| `--ptt-surface` | `#FFFFFF` | header, mega, card, FAQ |
| `--ptt-wash` | `#D4EEF1` | trust, triển khai, price.pop |
| `--ptt-node` | `#FFFFFF` | text on ink |
| `--ptt-line` | `#C5DCE0` | hairline |
| `--ptt-warn` | `#C47A1A` | SLA vàng (ops) |
| `--ptt-danger` | `#B42318` | SLA đỏ / error |

**Nhịp màu home:** Ink (hero) → Wash (trust) → Paper (vị trí) → Surface (module) → Ink (ngành) → Wash (triển khai) → Paper (tin) → Surface (FAQ) → Ink (CTA).

| Type | Size / weight |
|------|----------------|
| Display | 52/58 px · 500 · hero only · Be Vietnam Pro |
| H1 | 40/46 · 500 |
| H2 | 36/44 · 500 |
| Body | 16/26 · 400 |
| Small / kicker | 11/16 · 600 · IBM Plex Mono · tracking 0.16em |
| Button | 14/20 · 600 · height 44px |

Radius 8px. Space scale 4/8/12/16/24/40/64/112 (section). Max content 1120px. Header 68px.

Logo: `brand/pttcrm-logo-monogram.png`. Header: ô 36×36 + wordmark `PTTCRM` 16px. Favicon = crop monogram.

---

## 3. Information architecture

```
/vi                              SCR-WEB-001
/vi/san-pham/crm                 SCR-WEB-002
/vi/san-pham/ads                 SCR-WEB-003
/vi/san-pham/portal              SCR-WEB-004
/vi/san-pham/ai                  SCR-WEB-005
/vi/giai-phap/bds                SCR-WEB-006
/vi/giai-phap/agency             SCR-WEB-007
/vi/giai-phap/fnb                SCR-WEB-008
/vi/bang-gia                     SCR-WEB-009
/vi/dang-ky-demo                 SCR-WEB-010
/vi/dang-ky-demo/cam-on          SCR-WEB-011
/vi/ve-chung-toi                 SCR-WEB-012
/vi/phap-ly/bao-mat              SCR-WEB-013
/vi/phap-ly/dieu-khoan           SCR-WEB-014
/vi/phap-ly/cookie               SCR-WEB-015
/vi/tin-tuc                      SCR-WEB-018
/vi/tin-tuc/{slug}               SCR-WEB-019
/vi/su-kien                      SCR-WEB-020
/vi/su-kien/{slug}               SCR-WEB-021
/vi/khach-hang                   SCR-WEB-016   W1
/vi/tai-nguyen                   SCR-WEB-017   W2 — hub; W0 = tin + sự kiện
```

EN map 1-1:

| VI | EN |
|----|-----|
| `/vi` | `/en` |
| `/vi/san-pham/*` | `/en/product/{crm,ads,portal,ai}` |
| `/vi/giai-phap/*` | `/en/solutions/{real-estate,agency,fnb}` |
| `/vi/bang-gia` | `/en/pricing` |
| `/vi/dang-ky-demo` | `/en/request-demo` |
| `/vi/ve-chung-toi` | `/en/about` |
| `/vi/phap-ly/*` | `/en/legal/{privacy,terms,cookies}` |
| `/vi/tin-tuc` | `/en/news` |
| `/vi/tin-tuc/{slug}` | `/en/news/{slug}` (cùng slug) |
| `/vi/su-kien` | `/en/events` |
| `/vi/su-kien/{slug}` | `/en/events/{slug}` |

W0 **không** có `/partners`, `/customers`, `/blog` generic. Tin + sự kiện từ CMS published.

---

## 4. Chrome

### Header (sticky, 68px)

Nền `--ptt-surface` đặc. Chữ `--ptt-ink`. Border `--ptt-line`. **Cấm** chữ trắng trên header (hero không kéo dưới header).

Trái: logo 36×36 + wordmark `PTTCRM`.  
Giữa (desktop, thứ tự bán): **Giải pháp ▾ · Nền tảng ▾ · Bảng giá · Tài nguyên ▾**.  
Phải: `VI | EN` · Đăng nhập (ghost, chữ ink) · Đăng ký Demo (teal solid).  
**Không** hotline trên header (chỉ footer).

**Mega (desktop):** panel full-width, `position: fixed` dưới header, **nền `#FFFFFF` đặc**, không `backdrop-filter`, không `opacity < 1`.  
Cột trái: link + icon mono. Cột phải: panel ink «Xem nhanh» — đổi title/body/CTA khi hover item.  
Lớp dim `rgba(6,20,24,0.45)` phủ trang **dưới** mega (z-index header+mega > dim).  
Đóng: Esc, click dim, rời header, hover Bảng giá / brand / cụm CTA.

| Mega | Mục | Featured mặc định |
|------|-----|-------------------|
| Giải pháp | BĐS, Agency, F&B | Chuyên biệt từng ngành |
| Nền tảng | CRM, Ads, Portal, AI | Closed-loop trên một hệ |
| Tài nguyên | Tin tức, Sự kiện, Về chúng tôi, Đăng ký Demo | Demo 60 phút |

Mobile: hamburger. Accordion cùng 3 nhóm. Ẩn panel «Xem nhanh». CTA Demo pinned đáy.

### Footer (nền `--ptt-ink`)

5 cột: Nền tảng · Giải pháp · Pháp lý · Tài nguyên (tin, sự kiện, about, demo) · liên hệ (`hello@pttcrm.com`, `+84 24 7307 7979`). Copyright `© 2026 PTTCRM`.

### Cookie bar

1 hàng đáy: copy ngắn + Tùy chọn + Đồng ý cần thiết + Đồng ý tất cả. Không modal full-screen.

---

## 5. Screen details

### SCR-WEB-001 Home

**Hero (ink + 1 vệt teal):** kicker `Marketing CRM` · H1 slogan · sub 1 câu · Demo / Bảng giá. Khung sản phẩm (mock dashboard) bên phải. Tối đa 1 canvas mạng; không orb/scan/marquee.  
**Trust (wash):** 1 câu.  
**Vị trí (paper):** H2 «Không phải CRM ghi chép…» · 3 hàng số 01–03 (Closed-loop · Theo ngành · Agency OS).  
**Nền tảng (surface):** 4 cột module → trang sản phẩm.  
**Ngành (ink):** 3 cột BĐS / Agency / F&B → giải pháp.  
**Triển khai (wash):** 4 bước — Đăng ký · Demo · Chốt gói · Vận hành.  
**Tin (paper):** 3 bài CMS `featured_home` hoặc mới nhất + «Tất cả tin tức».  
**Sự kiện (optional):** 1 card upcoming nếu có published `start_at > now()` — không hiện khối rỗng.  
**FAQ (surface):** tối đa 5 câu; mở đầu: không trial 30 ngày.  
**CTA (ink):** 1 câu + Demo.  
**Không** 3 card giá trên home — giá chỉ `/bang-gia`.

### SCR-WEB-012 About

Mast ink. 1 trang: vị trí category, 3 ngành W0, CTA Demo. Không tên RNOSAI. Không timeline nội bộ.

### SCR-WEB-002…005 Product

Template chung: H1 module · problem 3 bullet · 3 capability · screenshot slot 16:10 (ảnh ops-web crop, xóa data thật) · CTA Demo.  
Ads page nêu Zalo là *Vietnam pack*; EN page Ads chỉ Meta + Google.

### SCR-WEB-006…008 Industry

H1 «PTTCRM cho {ngành}» · 3 nỗi đau ngành · 3 proof demo (tên metric, không bịa số) · SKU đề xuất (`ind` hoặc `agy`) · CTA Demo prefill `industry` + `sku_interest`.

| Trang | Prefill industry | Prefill SKU |
|-------|------------------|-------------|
| BĐS | `bds` | `ind` |
| Agency | `agency` | `agy` |
| F&B | `fnb` | `ind` |

### SCR-WEB-018 News list

Mast ink. H1 Tin tức. Filter chip: Tất cả / Góc nhìn / Theo ngành / Hướng dẫn.  
Card: cover CMS (16:10) + category + ngày + title + dek. Fallback thumb số nếu slot cover lỗi.  
Nguồn: `GET /public/cms/articles`. Trống → empty state + CTA Demo, không bài giả.

### SCR-WEB-019 News article

Mast/crumbs. Cover. Title + meta ngày · category. Body MD (ảnh chỉ URL media). CTA Demo.  
404 draft. Cấm số case trừ `po_signed`.

### SCR-WEB-020 Events list

Mast ink. H1 Sự kiện. Tab Sắp tới / Đã diễn ra.  
Card: cover, kind, ngày giờ GMT+7, location, title. Nguồn CMS.

### SCR-WEB-021 Event detail

Cover, kind, lịch, địa điểm / link online, body, CTA (`demo` hoặc `url`). Badge Đã hủy nếu `cancelled`.

### SCR-WEB-009 Pricing

Mast ink. 3 cột SKU. Cột giữa `ind` đánh dấu «Phổ biến».  
Mỗi cột: tên, retainer, setup, 5 dòng include, 2 dòng exclude, CTA Demo.  
Ghi chú nhỏ: HĐ 12 tháng · band user §6.2 · không giá / user.

`/en/pricing` W0: 3 cột không số, 1 câu «USD pricing from wave 2», CTA Request demo.

### SCR-WEB-010 Demo

1 cột max 560px. Thứ tự field:

1. Họ tên  
2. Email  
3. Số điện thoại  
4. Công ty  
5. Ngành (select: `bds` `agency` `fnb` `education` `pharma` `other`)  
6. Gói quan tâm (select: `mkt` / `ind` / `agy`)  
7. Quy mô (select, optional)  
8. Nhu cầu (textarea, optional)  
9. Checkbox «Tôi đồng ý Chính sách bảo mật»  
10. Submit

Honeypot `website` `position:absolute; left:-9999px`.  
Lỗi dưới field, màu `--ptt-danger`.  
Prefill từ query `?industry=&sku=`.

### SCR-WEB-011 Thank you

`noindex`. «Sales liên hệ trong giờ hành chính (08:30–18:00 GMT+7).» Không upsell trial.

### SCR-OPS-001 Demo inbox

Nằm trong ops-web, không theo token site. Bảng dense, badge SLA, filter hàng trên. Pattern hiện có RNOSAI (lead list). Cột theo FR-GTM-012.

### SCR-OPS-002 CMS — Media

`/crm/gtm/cms?tab=media`. Grid ảnh, upload, alt VI/EN, archive. Không hiện trên site công khai.

### SCR-OPS-003 CMS — Tin tức

`/crm/gtm/cms?tab=articles`. List + form 2 cột VI|EN, cover picker, category, featured home, Publish / Gỡ.

### SCR-OPS-004 CMS — Sự kiện

`/crm/gtm/cms?tab=events`. List + form lịch, kind, location, CTA demo/url, Publish / Hủy / Gỡ.

### SCR-OPS-005 CMS — Slot ảnh

`/crm/gtm/cms?tab=slots`. Bảng `slot_key` → chọn media + caption. Preview 16:10.

---

## 6. Copy rules

| Rule | VI | EN |
|------|----|----|
| CTA primary | Đăng ký Demo | Request demo |
| CTA login | Đăng nhập | Log in |
| Category line | CRM tốt nhất về Marketing | The marketing CRM, specialized by industry |
| Cấm | Dùng thử 30 ngày, chỉ từ 31.000đ, RNOSAI | Free 30-day trial, $1/user |

Số case W1: format `CPL 180.000 VND · ROAS 3.2` — nguồn file `content/cases/*.json` field `po_signed=true`.

---

## 7. Responsive & a11y

- Breakpoint: 640 / 880 / 1120.  
- Hero stack CTA full-width dưới 640.  
- Bảng giá: 1 cột stack dưới 880.  
- Focus ring 2px teal.  
- `html lang` theo locale.  
- Skip link «Tới nội dung».  
- Không auto-play video W0 (không dùng video).  
- Header: contrast chữ ink trên trắng ≥ 4.5:1.  
- Mega: đóng bằng Esc; dim không chặn đọc panel.

---

## 7.1. Motion

- Hero / mast: tối đa **một** canvas mạng + một vệt teal. Cấm orb, scan line, marquee, footer canvas.  
- `prefers-reduced-motion: reduce` → tắt canvas và reveal.  
- Mega: không fade/scale làm panel trong suốt.

---

## 8. Ảnh & slot

Mọi ảnh trang (hero, module, ngành, cover tin/sự kiện) lấy từ CMS media / slot.  
W0 seed: screenshot crop staging (lead list, attribution, portal ROAS, board BĐS) — xóa tên khách. Alt mô tả chức năng, không «screenshot».  
Logo + favicon + PDF pháp lý: `brand/` trong repo, không upload CMS.

---

## 9. Inventory

| SCR | Route VI | W0 |
|-----|----------|----|
| SCR-WEB-001 | `/vi` | Yes |
| SCR-WEB-002 | `/vi/san-pham/crm` | Yes |
| SCR-WEB-003 | `/vi/san-pham/ads` | Yes |
| SCR-WEB-004 | `/vi/san-pham/portal` | Yes |
| SCR-WEB-005 | `/vi/san-pham/ai` | Yes |
| SCR-WEB-006 | `/vi/giai-phap/bds` | Yes |
| SCR-WEB-007 | `/vi/giai-phap/agency` | Yes |
| SCR-WEB-008 | `/vi/giai-phap/fnb` | Yes |
| SCR-WEB-009 | `/vi/bang-gia` | Yes |
| SCR-WEB-010 | `/vi/dang-ky-demo` | Yes |
| SCR-WEB-011 | `/vi/dang-ky-demo/cam-on` | Yes |
| SCR-WEB-012 | `/vi/ve-chung-toi` | Yes |
| SCR-WEB-013…015 | `/vi/phap-ly/*` | Yes |
| SCR-WEB-016 | `/vi/khach-hang` | W1 |
| SCR-WEB-017 | `/vi/tai-nguyen` | W2 |
| SCR-WEB-018 | `/vi/tin-tuc` | Yes |
| SCR-WEB-019 | `/vi/tin-tuc/{slug}` | Yes |
| SCR-WEB-020 | `/vi/su-kien` | Yes |
| SCR-WEB-021 | `/vi/su-kien/{slug}` | Yes |
| SCR-OPS-001 | `/crm/gtm/demos` | Yes |
| SCR-OPS-002…005 | `/crm/gtm/cms` | Yes |
