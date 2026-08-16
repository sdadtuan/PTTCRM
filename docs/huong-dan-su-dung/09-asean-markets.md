# 09 — ASEAN & English

> **Đối tượng:** Sales ASEAN, visitor EN  
> **Hub:** `/en/markets`  
> **Playbook:** `/en/markets/th` · `/id` · `/ph` · `/sg`

---

## 1. Playbook từng nước

Mỗi trang EN có: timezone, pain local, CTA Demo, **WhatsApp link** (`wa.me`) — không nhúng WhatsApp Business API.

| Code | Thị trường | Form `market_country` |
|------|------------|------------------------|
| `th` | Thailand | `th` |
| `id` | Indonesia | `id` |
| `ph` | Philippines | `ph` |
| `sg` | Singapore | `sg` |

CTA Demo prefill `?market=`.

---

## 2. Form EN

- Thêm **Market (optional)**.  
- Zalo **không** nằm English core (Meta + Google). Nói rõ trên FAQ.  
- Giá USD: chỉ khi flag IT — CTA chính vẫn Request demo.

---

## 3. Inbox

GDKD lọc `market_country` ∈ {th,id,ph,sg}, status ≠ `disqualified`.  
**Exit W3:** ≥ 3 demo ASEAN trong pipeline (không bắt buộc `won`).

---

## 4. Partners

`/en/partners` — 1 partner featured khi PO đã thay tên/URL thật.  
Draft `PO_PARTNER_NAME` **không** hiện trên UI. Chỉ CTA «Become a partner» nếu chưa ký.

---

## 5. Sandbox EN

Visitor ASEAN login `demo_*` → lead list EN + 1 industry board.  
Không dịch 129 màn staff. Route lạ → Not in sandbox.

---

## 6. WhatsApp

- Dùng số trong playbook (E.164).  
- Sales không đổi số trên site — PO/MKT sửa JSON market.  
- Không gửi broadcast WhatsApp từ PTTCRM (ngoài scope).

---

## 7. CNAME app

Login brand `app.pttcrm.com` = cutover DNS + env — xem [`../runbooks/app-pttcrm-cname.md`](../runbooks/app-pttcrm-cname.md).  
Trước cutover: luôn `rs.pttads.vn`.
