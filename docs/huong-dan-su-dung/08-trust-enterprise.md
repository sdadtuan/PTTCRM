# 08 — Trust, pháp lý, IT enterprise

> **Đối tượng:** IT buyer, Legal, Sales enterprise  
> **EN:** `/en/trust` · `/en/trust/security` · `/en/trust/subprocessors` · `/en/trust/enterprise` · `/en/status`  
> **Pháp lý VI:** `/vi/phap-ly/{bao-mat,dieu-khoan,cookie,dpa}`  
> **Pháp lý EN:** `/en/legal/{privacy,terms,cookie,dpa}`

---

## 1. Trust Center

`/en/trust` gồm:

- Security overview  
- Data residency: **Singapore (AWS ap-southeast-1)**  
- SOC 2 Type I: status `in_progress` cho đến khi PO + auditor  
- Link SLA → `/en/status`  
- Link DPA, subprocessors, enterprise questionnaire  

**Link «View SOC 2 Type I report»** chỉ hiện khi `po_approved=true` **và** có `report_url`. Sales không gửi PDF giả.

---

## 2. Security pack

`/en/trust/security` — gói câu trả lời bảo mật (mã hóa TLS, audit, SOC2 in progress, trỏ enterprise IT). Dùng khi procurement gửi questionnaire dài: trả pack này + SIG Lite.

---

## 3. Subprocessors

`/en/trust/subprocessors` — bảng vendor đã publish (ví dụ AWS, Stripe).  
Không hiện `PO_*` / `example.com`. Thêm vendor = Legal + HĐ rồi mới đưa vào JSON.

---

## 4. Enterprise IT (SIG Lite)

`/en/trust/enterprise`

1. **Live posture** (nếu site đã `NEXT_PUBLIC_GTM_API_BASE`): SSO mode, Keycloak configured, MFA enforced, Permission Sets, row-level scope, URL login / branded.  
2. **Q&A tĩnh:** SSO, MFA, DPA/SCC, SOC2, SLA, scope.

**Cách đọc posture**

| Field | Ý nghĩa |
|-------|---------|
| `sso_configured=false` | Chưa bật Keycloak — **không** nói «SSO GA» |
| `mfa_enforced=true` | Có issuer + danh sách position MFA |
| `nest_password_login` | Còn login mật khẩu (mode `nest`/`dual`) |
| `branded_staff_url` | `app.pttcrm.com` sau CNAME |

Chi tiết bật SSO: [`../runbooks/staff-sso-mfa-deploy.md`](../runbooks/staff-sso-mfa-deploy.md).

---

## 5. Status & SLA

`/en/status`

- Mục tiêu **99.9%**  
- Component: marketing site, demo API…  
- Incidents + lịch 90 ngày: **trống / uptime null** nếu chưa đo — không giả 100%  

Poll API mỗi ~60s khi đã wire API.

---

## 6. Cookie / DPA / Privacy

| Trang | Dùng khi |
|-------|----------|
| Cookie policy | Visitor hỏi tracking |
| Privacy | EU/UK / nhân sự |
| Terms | Trước HĐ |
| DPA | Buyer EU — HTML; PDF ký là việc Legal (W4E) |

GDPR banner trên `/en` khi áp dụng.

---

## 7. Sales — gửi cho IT

Checklist một email:

1. `/en/trust`  
2. `/en/trust/security`  
3. `/en/trust/enterprise`  
4. `/en/trust/subprocessors`  
5. `/en/legal/dpa`  
6. Không đính «SOC2 certified» nếu Trust chưa có report  

---

## 8. Staff login (IT nội bộ)

1. `https://rs.pttads.vn/login` (hoặc `app.pttcrm.com` sau cutover).  
2. Mode `dual`: SSO Keycloak **hoặc** mật khẩu Nest.  
3. Mode `keycloak`: chỉ SSO.  
4. GDKD / super-admin: OTP → `/login/mfa` nếu chưa thỏa ACR.  
5. Sandbox `demo_*` vẫn login mật khẩu trên dual.
