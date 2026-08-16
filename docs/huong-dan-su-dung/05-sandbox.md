# 05 — Sandbox 14 ngày

> **Đối tượng:** SAL (grant), visitor sandbox  
> **API grant:** `POST /api/v1/gtm/demo-requests/:id/sandbox`  
> **Login:** cùng trang staff — username `demo_{id}`  
> **Shell EN:** `/sandbox/leads` · `/sandbox/board/{industry}`

---

## 1. Sales — mở sandbox

### Gate

- Status ∈ `{qualified, demo_booked}`.  
- User có cap `gtm.sandbox.grant`.  
- Chưa grant còn hạn (hoặc idempotent trả credential cũ).

### Bước

1. Inbox → dòng lead → **Grant 14 ngày**.  
2. Hệ thống tạo user `demo_{requestId}`, tenant `sandbox_{industry}`, hết hạn `now()+14` ngày dương lịch.  
3. Status → `sandbox_granted`.  
4. Email: URL login, user, mật khẩu một lần, ngày hết hạn.  
5. Email bounce → status giữ `demo_booked`, note `sandbox_email_failed` — gửi lại / gọi điện.

**Cấm** grant khi `new`.

---

## 2. Visitor — đăng nhập sandbox

1. Mở link trong email (thường `{staff}/login`).  
2. Username bắt đầu `demo_` + mật khẩu email.  
3. Vào **Sandbox leads** (tiếng Anh).  
4. Click lead → panel đọc (không sửa).  
5. **Open your industry board** → pipeline ngành + hub map mẫu + portal preview.

### Route được phép

`/login` · `/sandbox/*` · một số `/api/*`

Mọi route staff khác → **Not in sandbox**:

> This area is not included in your sandbox. Contact sales for full access.

---

## 3. Industry board (moat)

Mọi số trên board là **sample data** — badge vàng. Không phải số PO-signed.

| Industry | Headline |
|----------|----------|
| `agency` | Client ROAS |
| `bds` | Booking rate |
| `fnb` | Reservation fill |
| `education` | Enrollment CPL |
| `pharma` | HCP demos booked |

Board gồm: KPI, pipeline stages, bảng hub spend map (Mapped / Unmapped), badge **Hub map ≥80%** khi unmapped ≤20%, portal ROAS preview + attribution footer (model, % unmapped, nguồn spend, ngày).

---

## 4. Hết hạn

- Job hourly: `sandbox_expires_at < now()` → disable user, **không xóa** data tenant.  
- Login sau hạn → 403 `{ code: sandbox_expired }`.  
- Sales muốn gia hạn: quy trình nội bộ (wave hiện tại = grant mới / exception PO) — không tự gia hạn trên site.

---

## 5. Lỗi visitor

| Hiện tượng | Ý nghĩa |
|------------|---------|
| 403 `sandbox_expired` | Hết 14 ngày |
| Sai mật khẩu | Dùng mật khẩu email một lần; nhờ Sales reset |
| Vào `/crm/...` | Đúng — bị chặn whitelist |
| Board không đúng ngành | Tenant `sandbox_{industry}` — báo Sales grant lại đúng ngành |
