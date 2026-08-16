# 00 — Tổng quan & bắt đầu

> **Đối tượng:** Tất cả  
> **Thời gian đọc:** 8 phút

---

## 1. PTTCRM là gì

PTTCRM là **CRM tốt nhất về Marketing**: một nền tảng, chuyên biệt từng ngành.

Câu hỏi chốt với buyer: **ads nào ra hợp đồng — và ROAS khách thấy ở đâu?**

| PTTCRM làm | PTTCRM không làm |
|------------|------------------|
| Closed-loop ads → lead → hợp đồng → ROAS | Trial 30 ngày tự phục vụ |
| Pipeline theo ngành (BĐS, Agency, F&B, Giáo dục, Pharma) | CRM ghi chép giá rẻ / seat |
| Portal ROAS từng client (gói Agency OS) | HRM, ERP, GPS, BHXH |
| Demo 60 phút + sandbox 14 ngày sau qualify | Landing-page builder 1000 mẫu |

Thương hiệu công khai luôn là **PTTCRM**. Slogan VI: *Một nền tảng, chuyên biệt từng ngành.* EN: *One platform, specialized by industry.*

---

## 2. Ba lớp người dùng

```
Visitor (site)     →  form demo  →  Sales inbox
                                      ↓ qualify
                                 Sandbox 14 ngày
                                      ↓ won
                         Staff CRM + Portal khách
```

| Lớp | URL | Ai |
|-----|-----|-----|
| **Marketing site** | `https://pttcrm.com/vi` · `/en` | Khách, IT đọc Trust |
| **CMS tin / sự kiện** | `https://pttcrm.com/cms` | MKT (cùng app site) |
| **Staff console** | `https://rs.pttads.vn` | Sales, CSKH, AM, Admin |
| **Client portal** | `https://portal.pttads.vn` | Khách đã ký (Agency OS) |
| **Sandbox** | `{staff}/sandbox/leads` | Visitor sau grant 14 ngày |

Nút **Đăng nhập** trên site mở staff login (tab hiện tại) — không nhúng form login trên marketing site.

---

## 3. Bốn module nền tảng

| Module | Việc visitor cần hiểu | Việc staff làm sau khi ký |
|--------|----------------------|---------------------------|
| **CRM** | Lead, pipeline, CSKH một nguồn | Inbox, chăm sóc, HĐ |
| **Ads** | Meta / Google / Zalo (VN) vào một lead | Hub spend map, ingest |
| **Portal** | Khách đọc CPL/ROAS theo HĐ | Dashboard portal |
| **AI** | Chấm điểm lead, bước kế tiếp | NBA trên lead (sau onboard) |

---

## 4. Ba gói thương mại (SKU)

| Mã | Tên | Khi nào chọn |
|----|-----|----------------|
| `mkt` | PTTCRM Marketing | Đội ads cần CRM + ingest, chưa cần pack ngành |
| `ind` | PTTCRM Industry | Brand / sàn / chuỗi — 1 pack ngành + attribution ads→HĐ |
| `agy` | PTTCRM Agency OS | Agency  nhiều client + portal + SLA handoff |

Chi tiết giá: [03-bang-gia-sku.md](./03-bang-gia-sku.md).

---

## 5. Hành trình chuẩn (A+)

1. Visitor đọc site → **Đăng ký Demo** (form ~2 phút).
2. Sales gọi trong giờ hành chính (SLA P50: W0 ≤ 4 giờ, W1+ ≤ 2 giờ GMT+7).
3. **Demo 60 phút** trên data mẫu theo ngành — không self-serve trial.
4. Nếu đạt chuẩn (`qualified` hoặc `demo_booked`): Sales **grant sandbox 14 ngày**.
5. Chốt HĐ 12 tháng → onboard theo ngành.

**Cấm:** mở sandbox khi lead còn `new`; quote giá/user dưới sàn; invent số case lên site.

---

## 6. Chọn chương theo vai trò

| Bạn là | Đọc |
|--------|-----|
| Khách / marketer xem site | [01](./01-khach-tham-site.md) → [02](./02-dang-ky-demo.md) → [03](./03-bang-gia-sku.md) |
| Sales / Presales | [02](./02-dang-ky-demo.md) → [04](./04-sales-inbox.md) → [05](./05-sandbox.md) → [06](./06-demo-60-phut.md) |
| Marketing nội dung | [07](./07-cms-marketing.md) |
| IT / Legal / procurement | [08](./08-trust-enterprise.md) |
| Sales ASEAN | [09](./09-asean-markets.md) |
| Mọi người khi lỗi | [10](./10-faq-xu-ly-loi.md) |

---

## 7. Ngôn ngữ & cookie

- Header **VI | EN** đổi locale, giữ loại trang (`/vi/bang-gia` ↔ `/en/pricing`).
- `/` chọn locale theo `Accept-Language`; không khớp → tiếng Việt.
- Banner cookie: chỉ cookie tối cần mặc định (UTM first-touch). Pixel **không** chạy trước khi đồng ý (nếu bật Pixel).

---

## 8. Liên hệ

| Kênh | Giá trị |
|------|---------|
| Email | hello@pttcrm.com |
| Hotline (footer) | +84 24 7307 7979 |
| Demo | `/vi/dang-ky-demo` · `/en/request-demo` |
| WhatsApp ASEAN | Link trên playbook `/en/markets/{th,id,ph,sg}` |
