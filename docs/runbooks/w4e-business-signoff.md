# Wave kinh doanh — checklist PO / Sales / IT

> **Không code.** W4A–D đã có gate kỹ thuật. Wave này đóng **exit kinh doanh** Master Spec (W3 pipeline ASEAN, W4 SOC2 Type I, CNAME, proof công khai).  
> **Owner:** PO. **Hỗ trợ:** Sales / GDKD, IT, Legal, MKT.  
> **Cấm:** số case / partner / SOC2 bịa (BR-GTM-018). Flip flag chỉ khi artifact thật đã có.

**Code đã sẵn (không làm lại):** Trust Center, `metrics_verified`, ẩn partner placeholder, enterprise questionnaire, status page, sandbox moat, SSO/MFA *path*, runbook CNAME + SSO.

**Repo RNOSAI:** W4A–D API/login vẫn **local chưa push** — IT không flip prod cho đến khi Eng merge + deploy (mục 0).

---

## 0. Eng unblock (trước mọi flip prod)

| # | Việc | Ai | Xong khi |
|---|------|-----|----------|
| 0.1 | Commit + push RNOSAI W4A/B/C/D **tách** khỏi `feat/market-research-os-p31` | Eng | `enterprise-readiness`, status history, sandbox board, login SSO trên `main`/staging |
| 0.2 | Staging: `NEXT_PUBLIC_GTM_API_BASE` trỏ API thật | IT + Eng | Form demo → inbox; `/en/status` và `/en/trust/enterprise` poll API |
| 0.3 | Apply DDL GTM W0–W3 trên staging | IT | Lead `source=pttcrm_web`, `market_country` lưu được |

**Gate:** 0.2 xanh trước khi Sales đếm pipeline ASEAN trên inbox thật.

---

## 1. PO — proof công khai (P0, 30 ngày)

Một proof thật mạnh hơn ba số template. Site **đã ẩn** CPL/ROAS khi `metrics_verified=false` và ẩn `PO_PARTNER_NAME`.

| # | Việc | Artifact | Flip / hành động | Xong khi |
|---|------|----------|------------------|----------|
| 1.1 | **1 case named** — logo + số PO ký | HĐ / PO scan + logo SVG/PNG | MKT set `metrics_verified: true` trên **một** file `apps/web/content/cases/*.json`; ẩn hoặc giữ `false` hai case còn lại | `/en/customers` in CPL/ROAS **chỉ** case đã verify |
| 1.2 | **Partner ASEAN** (SG hoặc TH) | HĐ intro / website thật | Thay `PO_PARTNER_NAME` + `example.com` trong `partners.json`; `po_approved: true` chỉ khi tên + URL thật | `/en/partners` không còn placeholder |
| 1.3 | **Không partner** (nếu chưa ký) | Quyết định PO ghi ngày | Giữ draft; **không** publish tên giả | Trang partners chỉ CTA «Become a partner» |
| 1.4 | **DPA PDF ký** + SCC (nếu bán EU) | PDF Legal + chữ ký | Upload / link trên `/en/legal/dpa` khi Legal OK | Buyer EU nhận file, không HTML draft |
| 1.5 | **Subprocessors** đã public (AWS, Stripe) | Xác nhận Legal | Không thêm vendor cho đến khi có HĐ | Không `PO_*` trên prod |
| 1.6 | **SOC2 Type I — thuê auditor** | SOW + kickoff date | **Không** set `po_approved` / `report_url` | Calendar + owner Compliance |
| 1.7 | **SOC2 report phát hành** | PDF auditor | `trust.json`: `po_approved: true`, `report_url`, `period_end` | `/en/trust` hiện «View SOC 2 Type I report» |
| 1.8 | Ngày cutover `app.pttcrm.com` + rollback owner | Email / ticket | Ký [app-pttcrm-cname.md](./app-pttcrm-cname.md) | Sales biết URL login mới |

**Cấm PO:** flip `metrics_verified` / `po_approved` / partner name trước artifact.

---

## 2. Sales / GDKD — pipeline & demo (P0, song song PO)

| # | Việc | Ai | Xong khi |
|---|------|-----|----------|
| 2.1 | **≥ 3 demo ASEAN** `market_country ∈ {th,id,ph,sg}`, status ≠ `disqualified` | Sales | Inbox filter ASEAN ≥ 3 (gate W3 / Master §8) |
| 2.2 | Định nghĩa nội bộ «demo ASEAN» = form EN + market + cuộc gọi / họp lịch | GDKD | 1 dòng trong playbook Sales |
| 2.3 | Chạy [demo 60 phút moat](./demo-60-minute-moat.md) trên **staging** (5 scene) | Presales | 1 buổi rehearsal ≤ 60 phút, ghi ngày |
| 2.4 | Grant sandbox **chỉ** `qualified` \| `demo_booked` | SAL | Không grant khi `new` |
| 2.5 | SLA phản hồi P50 ≤ 2 giờ (GMT+7 / timezone playbook) | GDKD | Đo 2 tuần trên inbox |
| 2.6 | KPI kiểm soát (không chặn ship): demo/tuần ≥ 25, close ≥ 22%, ACV EN ≥ 399 USD | GDKD | Board tuần — **không** bịa số lên site |
| 2.7 | Template comms: login URL hiện tại `rs.pttads.vn`; sau cutover → `app.pttcrm.com` | Sales | Template cập nhật **ngày** CNAME |
| 2.8 | Enterprise 80+ NV: gửi `/en/trust/enterprise` + security pack — **không** claim SSO GA nếu posture `sso_configured=false` | Sales | 1 deal IT không đóng tab vì thiếu questionnaire |

**Exit Sales:** 2.1 + 2.3. KPI 2.6 là north-star, không phải checkbox kỹ thuật.

---

## 3. IT — staging / prod / identity (P0–P1)

Chi tiết env: [staff-sso-mfa-deploy.md](./staff-sso-mfa-deploy.md), [app-pttcrm-cname.md](./app-pttcrm-cname.md).

### 3a. Staging (làm trước CNAME / SSO prod)

| # | Việc | Xong khi |
|---|------|----------|
| 3.1 | `NEXT_PUBLIC_GTM_API_BASE` + CORS origin `pttcrm.com` | Form + status + enterprise poll |
| 3.2 | Pixel ID prod (nếu MKT bật) | Event demo page, không trên localhost |
| 3.3 | Stripe **test** — 1 checkout/tuần (W2) | Webhook `gtm_payment` ghi được |
| 3.4 | `GTM_STATUS_HISTORY_START` **chỉ** khi monitor đã đo ≥ 1 ngày | Status không giả 90 ngày 100% |
| 3.5 | Sandbox grant email tới inbox thật | Login `demo_*` → `/sandbox/leads` → board ngành |

### 3b. CNAME `app.pttcrm.com` (sau PO 1.8)

| # | Việc | Xong khi |
|---|------|----------|
| 3.6 | TLS cover `app.pttcrm.com` | `curl -I https://app.pttcrm.com/login` 200 |
| 3.7 | CNAME → cùng origin `rs.pttads.vn` | `dig` khớp |
| 3.8 | PTTCRM `NEXT_PUBLIC_LOGIN_URL=https://app.pttcrm.com/login` | Header «Log in» đúng host |
| 3.9 | RNOSAI: origin + Keycloak redirect URI `/login/callback` | SSO callback không fail |
| 3.10 | `GTM_PUBLIC_BRANDED_LOGIN_URL` + `NEXT_PUBLIC_STAFF_APP_HOST` | Enterprise page hiện branded URL |

### 3c. SSO + MFA prod (sau rehearsal staging)

| # | Việc | Xong khi |
|---|------|----------|
| 3.11 | Keycloak realm + client `ptt-ops-web` PKCE | Issuer set, **không** lộ secret trên public API |
| 3.12 | `STAFF_AUTH_MODE=dual` → sau ổn định có thể `keycloak` | Nút SSO trên `/login` |
| 3.13 | OTP bật; `STAFF_MFA_REQUIRED_POSITIONS=gdkd,super-admin` | GDKD không OTP → `/login/mfa` |
| 3.14 | Map group → position trên admin SSO | User provisioned, không `user_not_provisioned` |
| 3.15 | Rollback đã viết: `STAFF_AUTH_MODE=nest` + gỡ issuer | PO ký rollback owner |

**Cấm IT:** claim SSO GA trên sales deck khi `sso_configured=false`.

---

## 4. Legal / Compliance (song song PO 1.4–1.7)

| # | Việc | Xong khi |
|---|------|----------|
| 4.1 | DPA + SCC wording khớp subprocessors (AWS, Stripe) | Legal sign |
| 4.2 | SOC2 evidence pack (control matrix đã có trong RNOSAI docs) giao auditor | Kickoff 1.6 |
| 4.3 | Không dùng chữ «certified» / badge trên site trước 1.7 | Review `/en/trust` |

---

## 5. Thứ tự đề xuất (8 tuần)

```text
Tuần 1–2   Eng 0.1–0.3 + IT 3.1–3.5 + Sales rehearsal 2.3
Tuần 2–6   Sales 2.1 (3 ASEAN) ∥ PO 1.1–1.4 ∥ Legal 4.1
Tuần 4     PO 1.6 thuê auditor (không chờ 3 ASEAN nếu đã kickoff nội bộ)
Tuần 6     Gate: 2.1 xanh → PO 1.8 + IT 3.6–3.10 CNAME
Tuần 7–8   IT 3.11–3.15 SSO dual trên staging rồi prod
W4 exit    1.7 report_url — có thể sau 8 tuần (auditor)
```

**Không chặn nhau:** 1.1 case thật và 2.1 ASEAN chạy song song. **CNAME không** trước 1.8. **SOC2 link** không trước 1.7.

---

## 6. Sign-off

| Role | Ký khi | Ngày / tên |
|------|--------|------------|
| Eng | 0.1–0.3 | |
| IT | 3.1–3.5 staging; sau đó 3.6–3.15 | |
| Sales / GDKD | 2.1 + 2.3 | |
| Legal | 4.1 (và 4.2 khi auditor) | |
| PO | 1.1 hoặc 1.3; 1.8; 1.6 started | |

**Wave kinh doanh xong (tối thiểu):** 0.2 + 1.1 **hoặc** 1.3 + 2.1 + 3.1.  
**W4 Master exit:** thêm 1.7 (SOC2 Type I issued).  
**Enterprise IT exit:** thêm 3.12–3.13 (`sso_configured` + `mfa_enforced` trên prod).

---

## 7. Không làm trong wave này

- Code trang marketing mới, dịch 129 màn ops-web, trial 30 ngày, LP builder
- Thêm ngành trên site khi chưa có case 1.1
- Gộp RNOSAI P31 + GTM W4 một PR
- Invent CPL/ROAS / partner / uptime 90 ngày
