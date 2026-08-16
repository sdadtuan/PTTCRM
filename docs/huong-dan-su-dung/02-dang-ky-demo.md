# 02 — Đăng ký Demo

> **Đối tượng:** Visitor, Sales  
> **Route:** `/vi/dang-ky-demo` · `/en/request-demo`  
> **Cảm ơn:** `/vi/dang-ky-demo/cam-on` · `/en/request-demo/thanks`

---

## 1. Visitor — gửi form

### Bước

1. Mở **Đăng ký Demo** (header hoặc CTA trang).  
2. Điền đủ trường bắt buộc (bảng dưới).  
3. Gửi. Thành công → trang cảm ơn + (nếu đã đồng ý cookie) Pixel Lead.  
4. Chờ Sales gọi trong giờ hành chính.

### Trường form

| Trường | Bắt buộc | Quy tắc |
|--------|----------|---------|
| Họ tên / Full name | Có | ≥ 2 ký tự |
| Email công ty / Work email | Có | Email hợp lệ |
| Số điện thoại | Có | Có số, không để trống |
| Công ty | Có | ≥ 2 ký tự |
| Ngành | Có | `bds` · `agency` · `fnb` · `education` · `pharma` · `other` |
| Gói quan tâm | Có | `mkt` · `ind` · `agy` |
| Market (EN) | Không | `th` · `id` · `ph` · `sg` hoặc trống |

Honeypot ẩn: bot điền sẽ bị bỏ qua (HTTP 204, không tạo lead).

### Prefill

- Từ trang ngành: `?industry=bds`  
- Từ playbook ASEAN: `?market=sg`  
- SKU popular Industry thường prefill `ind`

---

## 2. Điều hệ thống làm sau khi gửi

| Bước | Hành vi |
|------|---------|
| Origin | Chỉ nhận từ domain site được phép |
| Rate limit | Quá số lần / IP → 429 |
| Dedup | Cùng email trong **7 ngày** → không tạo request mới (visitor vẫn thấy cảm ơn) |
| Lead | `source=pttcrm_web` trên CRM |
| Owner | Round-robin Sales |
| UTM | Gắn first-touch nếu cookie còn |
| Status ban đầu | `new` |

Visitor **không** tự nhận tài khoản sandbox.

---

## 3. Sales — sau khi form vào inbox

Xem [04-sales-inbox.md](./04-sales-inbox.md).

Tóm tắt: mở `/crm/gtm/demos` → gọi ≤ SLA → đổi `qualified` / `demo_booked` / `disqualified` → (nếu qualify) grant sandbox.

---

## 4. Trang cảm ơn

Copy: cảm ơn + «Sales sẽ liên hệ». Không hiện giá. Không nút «tự mở sandbox».

---

## 5. Lỗi form

| Mã / hiện tượng | Ý nghĩa | Visitor làm gì |
|-----------------|---------|----------------|
| 422 + `field_errors` | Thiếu / sai trường | Sửa đúng ô đỏ |
| 429 | Gửi quá nhanh | Đợi vài phút |
| 403 origin | Site/API chưa khớp domain | Báo IT (`NEXT_PUBLIC_GTM_API_BASE`) |
| Không có API | Form không gửi được | IT set `NEXT_PUBLIC_GTM_API_BASE` |
| Gửi lại cùng email | Dedup 7 ngày | Không cần gửi lại — Sales đã có |

---

## 6. Gate nghiệp vụ

- Không trial trên form.  
- Không checkbox «đồng ý nhận sandbox ngay».  
- English form có `market_country` để đếm pipeline ASEAN.
