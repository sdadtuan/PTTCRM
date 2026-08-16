# Demo 60 phút — Moat closed-loop (W4C)

> **Audience:** Sales, Presales, Solution  
> **Prerequisite:** Staging ops-web + portal-web running; sandbox grant after `qualified` or `demo_booked`  
> **Motion:** Demo-led A+ — không trial tự phục vụ

## North-star question

**“Ads nào ra hợp đồng — và ROAS client thấy ở đâu?”**

HubSpot dừng ở lead. Salesforce cần tuần custom. PTTCRM chốt trong một buổi nếu bạn chạy đúng 5 scene dưới.

---

## Trước buổi demo (5 phút)

| Check | Action |
|-------|--------|
| Industry | Xác nhận ngành buyer: `agency` \| `bds` \| `fnb` \| `education` \| `pharma` |
| Locale | VN buyer → ops-web VI routes; ASEAN/EN → sandbox EN shell |
| Sandbox | Nếu post-qualify: grant 14 ngày, gửi credential email |
| Không claim | Mọi số trên board = **sample data** — nói rõ trước scene 2 |

**Staging URLs (thay `{ops}` / `{portal}` theo env):**

- Meta hub: `{ops}/meta/facebook-ads`
- Sandbox EN: `{ops}/sandbox/leads` → `{ops}/sandbox/board/{industry}`
- Portal ROAS: `{portal}/dashboard`
- Handoff AM (403 demo): `{ops}/crm/solution/queue` với user không có cap

---

## Scene 1 — Ads ingest (8 phút)

**Talk track:** “Lead từ Meta / Zalo / Google vào một record — không copy-paste inbox.”

1. Mở lead list (sandbox EN hoặc CRM lead list staging).
2. Click một lead — show UTM / campaign chip nếu có.
3. **Proof checkpoint:** một nguồn ads gắn trên lead row.

**Không làm:** mở 129 route ops-web với sandbox visitor.

---

## Scene 2 — Industry pipeline (12 phút)

**Talk track:** “Cùng một nền tảng — metric chốt khác theo ngành.”

| Industry | Board URL | Headline metric |
|----------|-----------|-----------------|
| Agency | `/sandbox/board/agency` | Client ROAS |
| BĐS | `/sandbox/board/bds` | Booking rate |
| F&B | `/sandbox/board/fnb` | Reservation fill |
| Education | `/sandbox/board/education` | Enrollment CPL |
| Pharma | `/sandbox/board/pharma` | HCP demo booked |

1. Mở industry board — show pipeline stages (counts).
2. Chỉ 3 KPI cards + funnel — không deep config.
3. **Proof checkpoint:** buyer thấy pipeline **của ngành họ**, không generic CRM.

---

## Scene 3 — Hub spend map ≥80% (15 phút) ★ Moat

**Talk track:** “≥80% spend map vào client/campaign — phần còn lại hiện rõ, không giấu.”

1. Meta Ads hub `{ops}/meta/facebook-ads`.
2. Chỉ **Unmapped spend** KPI + badge **Hub map ≥80%** (khi unmapped ≤20%).
3. Mở 1–2 campaign rows — badge Mapped / Chưa map.
4. Sandbox board cũng show hub map % + sample campaign→client table.
5. **Proof checkpoint:** buyer trả lời được “bao nhiêu % spend chưa map”.

**Honest line:** “Production % phụ thuộc onboarding map campaign — sandbox dùng sample ≥80%.”

---

## Scene 4 — Contract close + attribution (10 phút)

**Talk track:** “Hợp đồng đóng — nguồn ads gắn ngược, CPL trên lead.”

1. Lead detail hoặc closed-loop panel (staging).
2. Show CPL + campaign attribution on lead.
3. **Proof checkpoint:** closed-loop từ ads → lead → contract status.

---

## Scene 5 — Portal ROAS + attribution footer (15 phút) ★ Moat

**Talk track:** “Client (hoặc chủ dự án) đọc ROAS theo HĐ — footer ghi model và % unmapped.”

1. Portal `{portal}/dashboard` — performance table.
2. Scroll **attribution footer**: model, unmapped spend %, spend source, freshness.
3. Sandbox board **portal preview card** mirrors footer fields (sample).
4. **Proof checkpoint:** buyer thấy client-facing ROAS, không export Excel.

---

## Handoff IT (nếu 80+ NV) — 5 phút buffer

- Link `/en/trust/enterprise` — SIG Lite Q&A + live SSO posture API.
- Không claim SSO GA nếu `sso_configured=false`.

---

## Sau demo

| Outcome | Next step |
|---------|-----------|
| Qualified | Book follow-up; offer sandbox 14 ngày |
| Enterprise IT block | Send security pack + enterprise questionnaire link |
| Not fit | `disqualified` + reason in inbox |

**Không:** mở trial 30 ngày; quote giá/user dưới sàn; invent case CPL/ROAS.

---

## Objection cheat sheet

| Objection | Response |
|-----------|----------|
| “HubSpot có workflow email” | “Chúng tôi không đua 1000 workflow — đua ads→HĐ→portal ROAS.” |
| “Salesforce custom được” | “Custom mất tháng. Demo này 60 phút trên ngành bạn.” |
| “Số ROAS demo có thật?” | “Sample data — PO-signed cases on `/customers` when verified.” |

---

## Sign-off

| Role | Criteria |
|------|----------|
| Sales lead | Chạy được 5 scene liên tục ≤60 phút |
| Presales | Hub map + portal footer không bịa production % |
| PO | Không số case mới trên sandbox board |
