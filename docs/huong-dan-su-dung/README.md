# PTTCRM — Hướng dẫn sử dụng

> **Phiên bản:** 1.0 · **Cập nhật:** 2026-08-16  
> **Đối tượng:** Khách thăm site, Sales, GDKD, Marketing, IT buyer, visitor sandbox  
> **Site công khai:** `https://pttcrm.com` (VI `/vi`, EN `/en`)  
> **CMS marketing:** `https://pttcrm.com/cms`  
> **Đăng nhập staff:** `https://rs.pttads.vn/login`  
> **Portal khách:** `https://portal.pttads.vn`  
> **Alias VPS (khi DNS đã trỏ):** `https://gomira.vn` — cùng ứng dụng marketing-web

Tài liệu mô tả **cách dùng từng chức năng** — bước thao tác, vai trò, điều kiện (gate) và lỗi thường gặp.  
Không in tên engine nội bộ trên tài liệu gửi khách.

## Mục lục

| # | Chủ đề | File | Đối tượng |
|---|--------|------|-----------|
| — | Tổng quan & bắt đầu | [00-tong-quan.md](./00-tong-quan.md) | Tất cả |
| 1 | Duyệt website công khai | [01-khach-tham-site.md](./01-khach-tham-site.md) | Visitor |
| 2 | Đăng ký demo | [02-dang-ky-demo.md](./02-dang-ky-demo.md) | Visitor, Sales |
| 3 | Bảng giá & SKU | [03-bang-gia-sku.md](./03-bang-gia-sku.md) | Visitor, Sales |
| 4 | Inbox demo (Sales) | [04-sales-inbox.md](./04-sales-inbox.md) | SAL, GDKD |
| 5 | Sandbox 14 ngày | [05-sandbox.md](./05-sandbox.md) | SAL, visitor sandbox |
| 6 | Demo 60 phút (moat) | [06-demo-60-phut.md](./06-demo-60-phut.md) | Sales, Presales |
| 7 | CMS tin / sự kiện | [07-cms-marketing.md](./07-cms-marketing.md) | MKT |
| 8 | Trust, pháp lý, IT enterprise | [08-trust-enterprise.md](./08-trust-enterprise.md) | IT, Legal, Sales |
| 9 | ASEAN & English | [09-asean-markets.md](./09-asean-markets.md) | Sales ASEAN |
| 10 | FAQ & xử lý sự cố | [10-faq-xu-ly-loi.md](./10-faq-xu-ly-loi.md) | Tất cả |

## Tài liệu kỹ thuật liên quan

| Loại | Đường dẫn |
|------|-----------|
| Master Spec | [`../specs/2026-08-15-pttcrm-master-spec.md`](../specs/2026-08-15-pttcrm-master-spec.md) |
| Use case | [`../use-cases/01-PTTCRM-COMMERCIAL.md`](../use-cases/01-PTTCRM-COMMERCIAL.md) |
| Demo 60 phút (runbook) | [`../runbooks/demo-60-minute-moat.md`](../runbooks/demo-60-minute-moat.md) |
| Sign-off kinh doanh | [`../runbooks/w4e-business-signoff.md`](../runbooks/w4e-business-signoff.md) |
| SSO / MFA deploy | [`../runbooks/staff-sso-mfa-deploy.md`](../runbooks/staff-sso-mfa-deploy.md) |
| Engine staff (nội bộ) | RNOSAI `docs/huong-dan-su-dung/` |

## Quy ước

- **Route** = đường dẫn sau domain (`/vi/dang-ky-demo`).
- **Gate** = điều kiện bắt buộc trước bước tiếp.
- **VIS** = khách thăm site. **SAL** = Sales. **GDK** = Giám đốc kinh doanh. **MKT** = Marketing. **IT** = IT buyer / triển khai.
- Số case / chứng chỉ trên site chỉ hiện khi đã **xác minh** — không bịa (BR-GTM-018).
