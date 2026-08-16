# 10 — FAQ & xử lý sự cố

> **Đối tượng:** Tất cả

---

## 1. FAQ visitor (đúng copy site)

**Có dùng thử miễn phí không?**  
Không. Demo 60 phút. Sau demo đạt chuẩn, Sales có thể mở sandbox 14 ngày.

**Khác CRM giá rẻ ở chỗ nào?**  
CRM giá rẻ lưu khách. PTTCRM đo ads nào ra hợp đồng và portal từng client.

**Zalo có trên bản tiếng Anh không?**  
Zalo là gói Việt Nam. English core: Meta + Google.

---

## 2. FAQ Sales

| Câu | Đáp |
|-----|-----|
| Khách đòi trial | Demo + sandbox sau qualify. Không bật self-serve. |
| Khách đòi giá/user | Retainer + band. Không in seat < 200k VND. |
| Grant nhầm `new` | API 409/chặn — đổi `qualified` rồi grant. |
| Hết sandbox | 14 ngày dương lịch; disable user; data còn. |
| Case không có số | Đúng — chờ `metrics_verified`. |

---

## 3. Sự cố site

| Triệu chứng | Kiểm tra | Ai |
|-------------|----------|-----|
| Form không gửi | `NEXT_PUBLIC_GTM_API_BASE`, CORS, API 3000 | IT |
| Status / enterprise trống | Cùng API + `/api/v1/public/gtm/status` · `enterprise-readiness` | IT |
| Trang trắng :3300 | `docker ps` `ptt-crm-web`; `bash /var/www/pttcrm/deploy/restart.sh` | IT VPS |
| Domain gomira.vn không vào | A record → `45.76.157.102`; nginx `server_name` | PO DNS + IT |
| HTTPS gomira lỗi | Chưa có cert — dùng HTTP hoặc chạy certbot sau DNS | IT |
| Tin không lên | Desk `/cms` — bài `published`; hard-refresh `/vi/tin-tuc` | MKT |
| Login staff 401 | Mật khẩu / SSO issuer / sandbox expired | Admin |

---

## 4. Sự cố sandbox

| Triệu chứng | Việc |
|-------------|------|
| `sandbox_expired` | Hết hạn — Sales xử lý exception |
| Not in sandbox | Đúng whitelist — không «mở full CRM» |
| Board generic | Sai industry tenant |

---

## 5. Sự cố SSO

| Triệu chứng | Việc |
|-------------|------|
| Không thấy nút SSO | API `mode=nest` hoặc chưa issuer |
| `mfa_required` | Vào `/login/mfa` OTP Keycloak |
| `user_not_provisioned` | Map group Keycloak → position |
| Rollback | `STAFF_AUTH_MODE=nest`, gỡ issuer |

---

## 6. Việc không hỗ trợ (khóa spec)

- Trial 30 ngày  
- LP builder  
- Dịch toàn bộ 129 màn staff trước Trust thật  
- In HRM/ERP trên site  
- Số case / SOC2 / partner giả  
- WhatsApp Business API (chỉ link `wa.me`)

---

## 7. Liên hệ leo thang

| Việc | Ai |
|------|-----|
| Lead không ai gọi | GDKD inbox |
| Site down | IT VPS + status page |
| Legal / DPA | Legal + `/en/legal/dpa` |
| Bug sản phẩm | Eng — kèm URL, locale, screenshot, giờ GMT+7 |
