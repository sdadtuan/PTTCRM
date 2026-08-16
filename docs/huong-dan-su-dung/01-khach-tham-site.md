# 01 — Duyệt website công khai

> **Đối tượng:** Visitor  
> **URL:** `https://pttcrm.com/vi` · `https://pttcrm.com/en`

---

## 1. Thanh điều hướng

Header (không hiện số điện thoại):

**Giải pháp ▾ · Nền tảng ▾ · Bảng giá · Khách hàng · Tài nguyên ▾ · VI|EN · Đăng nhập · Đăng ký Demo**

| Nhóm | Việc | Ví dụ path VI | Path EN |
|------|------|---------------|---------|
| Giải pháp | Ngành | `/vi/giai-phap/bds` | `/en/solutions/bds` |
| Nền tảng | 4 module | `/vi/san-pham/crm` | `/en/product/crm` |
| Bảng giá | 3 SKU | `/vi/bang-gia` | `/en/pricing` |
| Khách hàng | Case PO ký | `/vi/khach-hang` | `/en/customers` |
| Tài nguyên | Hub | `/vi/tai-nguyen` | `/en/resources` |
| Đăng nhập | Staff | `https://rs.pttads.vn/login` | cùng |
| Demo | Form | `/vi/dang-ky-demo` | `/en/request-demo` |

Mega menu (desktop): hover/click nhóm → panel ngành hoặc module + ô «xem nhanh». Đóng bằng click ra ngoài hoặc Esc.

**Mobile:** header gọn (logo · VI|EN · Demo · menu). Nút menu mở drawer đầy chiều cao — nhóm Giải pháp / Nền tảng / Tài nguyên bung accordion. Login và Đăng ký Demo nằm đáy drawer.

---

## 2. Trang chủ

Mở `/vi` hoặc `/en`. Một màn hình đầu phải thấy slogan + 2 CTA (Demo, Bảng giá).

Thứ tự khối:

1. Hero + slogan  
2. Trust line  
3. Ba hàng moat: Closed-loop · Theo ngành · Agency OS  
4. Bốn module  
5. Dải ngành (BĐS, Agency, F&B; Education/Pharma trên mega)  
6. Bốn bước triển khai (đăng ký → demo → chốt gói → vận hành)  
7. Teaser tin **published** (tối đa 3)  
8. Một sự kiện upcoming nếu CMS có  
9. Teaser khách hàng **published + PO ký** (tối đa 3)  
10. FAQ  
11. CTA Demo  

**Không** có 3 card giá trên home.

---

## 3. Trang ngành (Giải pháp)

| Slug | Ngành | Metric chốt trên trang |
|------|-------|------------------------|
| `bds` | Bất động sản | Lead → booking, CPL kênh |
| `agency` | Agency | ROAS từng client, SLA handoff |
| `fnb` | F&B | Campaign → đặt chỗ / cửa hàng |
| `education` | Giáo dục | Lead → ghi danh |
| `pharma` | Pharma | HCP / OTC gắn campaign |

**Prefill form:** CTA trên trang ngành mở demo với `?industry=` và SKU gợi ý (`ind` hoặc `agy`).

---

## 4. Trang sản phẩm (Nền tảng)

| Slug | Module |
|------|--------|
| `crm` | Lead, pipeline, CSKH |
| `ads` | Ingest Meta / Google / Zalo (Zalo = gói Việt Nam) |
| `portal` | Cổng khách CPL/ROAS theo HĐ |
| `ai` | Lead score, bước kế tiếp |

Mỗi trang: vấn đề hay gặp → PTTCRM làm gì → CTA Demo. Không mock số case.

---

## 5. Tài nguyên

Hub `/vi/tai-nguyen` · `/en/resources` gồm tin, sự kiện, khách hàng, about, (EN) markets / partners / demo script.

| Trang | Path VI | Path EN | Ghi chú |
|-------|---------|---------|---------|
| Tin tức | `/vi/tin-tuc` | `/en/news` | Chỉ bài `published` |
| Bài viết | `/vi/tin-tuc/{slug}` | `/en/news/{slug}` | Draft = 404 |
| Sự kiện | `/vi/su-kien` | `/en/events` | |
| Khách hàng | `/vi/khach-hang` | `/en/customers` | CPL/ROAS chỉ khi `metrics_verified` |
| Về chúng tôi | `/vi/ve-chung-toi` | `/en/about` | Không tên engine nội bộ |
| Partners | — | `/en/partners` | Ẩn placeholder `PO_*` |

---

## 6. Cookie & UTM

1. Lần đầu vào site: banner cookie.  
2. **Chấp nhận tối cần:** giữ UTM first-touch (`ptt_utm`) tối đa 30 ngày — phục vụ attribution lead.  
3. **Pixel** (nếu IT đã set `NEXT_PUBLIC_META_PIXEL_ID`): chỉ sau khi visitor đồng ý cookie không tối cần.  
4. Form demo gửi kèm UTM đã lưu — Sales thấy campaign nguồn.

---

## 7. SEO visitor cần biết

- Mỗi trang có `hreflang` vi / en / x-default (`/vi`).  
- Sitemap không chứa draft.  
- JSON-LD Organization trên chrome.

---

## 8. Lỗi thường gặp

| Hiện tượng | Nguyên nhân | Cách xử lý |
|------------|-------------|------------|
| Bấm EN ra 404 | Path không có cặp VI↔EN | Về home EN `/en` |
| Không thấy tin | CMS PTTCRM chưa publish (`/cms`) | MKT publish + hard-refresh |
| Case không có số CPL | `metrics_verified=false` (đúng spec) | Không phải lỗi — chờ PO verify |
| Đăng nhập không phải site | Đúng — mở staff app | Dùng email staff, không email form demo |
