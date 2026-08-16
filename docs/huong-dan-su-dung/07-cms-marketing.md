# 07 — CMS tin tức & sự kiện

> **Đối tượng:** MKT  
> **Desk:** `https://pttcrm.com/cms` (cùng app marketing, 4 tab)  
> **Site chỉ đọc** bản `published`  
> CMS **nằm trong PTTCRM**. Không soạn tin trên sản phẩm khác.

---

## 1. Đăng nhập desk

1. Mở `/cms` trên domain site (prod: `pttcrm.com/cms`, local: `http://localhost:3300/cms`).  
2. Nhập `CMS_ADMIN_SECRET` (IT đặt trên VPS / `.env`).  
3. Cookie 12 giờ, httpOnly.

**Cấm** WordPress / Sanity / Contentful. **Cấm** in tên engine nội bộ trong title/body/alt.

---

## 2. Bốn tab

| Tab | Việc |
|-----|------|
| Articles | Soạn tin, category (`insight` / `nganh` / `huong-dan`), slug, VI/EN |
| Events | Sự kiện, ngày bắt đầu/kết thúc, CTA (thường `/vi/dang-ky-demo`) |
| Media | Upload ảnh vào `/cms-media/` trên disk site (jpeg/png/webp/svg, ≤ 5MB) |
| Slots | Gán URL ảnh + caption vào slot trang (home / product / solution) |

Kho: `apps/web/data/cms/store.json`. Ảnh: `apps/web/public/cms-media/`.

---

## 3. Xuất bản bài

1. Tab Media — upload (nếu cần cover). Copy URL `/cms-media/…`.  
2. Articles → **+ Bài mới**: slug, category, title/dek/body VI (EN nếu xuất bản EN).  
3. **Lưu draft** — không có URL public, không sitemap.  
4. Review → **Publish**.  
5. Hard-refresh `/vi/tin-tuc`. Bài EN chỉ hiện khi có `title_en` + `body_en`.

Gỡ bài: **Archive** — list/sitemap bỏ; URL cũ 404.

Seed W0 (6 bài từ `demo-html/tin-tuc`) tự nạp lần đầu nếu store trống.

---

## 4. Sự kiện

- Upcoming hiện 1 slot trên home nếu `end_at` ≥ hôm nay và status `published`.  
- CTA sự kiện trỏ Demo, không form đăng ký hội thảo riêng (W0).

---

## 5. Case khách hàng

Case nằm JSON repo (`apps/web/content/cases/`), không CMS tự do.

| Gate | Hành vi site |
|------|----------------|
| `po_signed` + chưa `metrics_verified` | Hiện case, **ẩn** CPL/ROAS |
| `metrics_verified=true` | In số |
| PO chưa ký | Không đưa lên `/khach-hang` |

MKT không tự bịa số. PO cung cấp HĐ + logo rồi Eng/MKT flip flag.

---

## 6. Markdown

Heading `##`, đoạn văn, ảnh `![](/cms-media/…)`. Script / iframe / ảnh ngoài `/cms-media` bị chặn. Lưu/publish fail nếu body chứa tên engine nội bộ.

---

## 7. Lỗi

| Hiện tượng | Xử lý |
|------------|--------|
| `/cms` hỏi login mãi | Sai `CMS_ADMIN_SECRET`; production bắt buộc có env |
| Publish rồi site cũ | Hard-refresh; kiểm tra status `published` trong desk |
| Tin trống trên `/vi/tin-tuc` | Store chưa seed / chưa publish — mở `/cms` |
| Ảnh gãy | File chưa nằm `public/cms-media` hoặc sai URL |
| `RNOSAI_FORBIDDEN` | Xóa chuỗi cấm trong title/body/alt |
| Draft lộ Google | Không được — `/cms` có `noindex`; draft không vào sitemap |
