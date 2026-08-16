# 06 — Demo 60 phút (closed-loop)

> **Đối tượng:** Sales, Presales, Solution  
> **Runbook đầy đủ:** [`../runbooks/demo-60-minute-moat.md`](../runbooks/demo-60-minute-moat.md)

---

## 1. Câu chốt cả buổi

**Ads nào ra hợp đồng — ROAS client thấy ở đâu?**

HubSpot dừng ở lead. Salesforce custom mất tuần. PTTCRM phải **chốt trong 60 phút** nếu chạy đủ 5 scene.

---

## 2. Chuẩn bị (5 phút)

| Check | Việc |
|-------|------|
| Ngành | `agency` / `bds` / `fnb` / `education` / `pharma` |
| Locale | VN → staff VI; ASEAN → sandbox EN |
| Không claim | Mọi số board = sample |

URL (thay `{ops}` `{portal}`):

- Meta hub: `{ops}/meta/facebook-ads`  
- Sandbox: `{ops}/sandbox/leads` → `{ops}/sandbox/board/{industry}`  
- Portal: `{portal}/dashboard`  
- Handoff 403: user không cap vào queue Solution  

---

## 3. Năm scene

| # | Phút | Scene | Proof |
|---|------|-------|-------|
| 1 | 8 | Ads ingest — một lead, một nguồn | Campaign trên lead |
| 2 | 12 | Pipeline ngành | Board đúng metric ngành |
| 3 | 15 | Hub spend map ≥80% | Unmapped % + badge Mapped |
| 4 | 10 | HĐ đóng + CPL trên lead | Closed-loop ads→HĐ |
| 5 | 15 | Portal ROAS + attribution footer | Client thấy ROAS, model, freshness |

Buffer 5 phút: IT 80+ NV → `/en/trust/enterprise`. Không claim SSO GA nếu posture `sso_configured=false`.

---

## 4. Talk track ngắn

1. «Lead Meta/Zalo/Google vào một record — không copy inbox.»  
2. «Cùng nền tảng, metric chốt khác: booking / ROAS client / đặt chỗ.»  
3. «≥80% spend map; phần chưa map hiện rõ.»  
4. «Hợp đồng đóng — nguồn ads gắn ngược.»  
5. «Khách đọc ROAS trên portal, footer ghi model và % unmapped.»

---

## 5. Sau demo

| Kết quả | Việc |
|---------|------|
| Qualified | Book follow-up; grant sandbox nếu đạt chuẩn |
| IT block | Gửi security pack + `/en/trust/enterprise` |
| Không fit | `disqualified` + lý do |

**Không:** trial 30 ngày; invent CPL/ROAS; mở 129 route staff cho sandbox visitor.

---

## 6. Objection

| Objection | Đáp |
|-----------|-----|
| HubSpot có workflow email | Không đua 1000 workflow — đua ads→HĐ→portal. |
| Salesforce custom được | Custom mất tháng. Demo này 60 phút trên ngành bạn. |
| Số ROAS demo có thật? | Sample. Case PO-signed trên `/customers` khi verified. |
