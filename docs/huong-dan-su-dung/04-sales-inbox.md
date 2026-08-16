# 04 — Inbox demo (Sales)

> **Đối tượng:** SAL, GDKD  
> **Route staff:** `/crm/gtm/demos`  
> **Cap:** `gtm_demos.view` hoặc `crm_leads.view` · ghi: `gtm.demos` write · grant: `gtm.sandbox.grant`

---

## 1. Mở inbox

1. Đăng nhập `https://rs.pttads.vn/login`.  
2. Vào **GTM / Demo requests** (`/crm/gtm/demos`).  
3. Bảng dense: tên, công ty, ngành, SKU, locale, `market_country`, status, SLA, owner, sandbox.

Không thấy menu → thiếu cap — nhờ Admin.

---

## 2. Trạng thái (`GtmStatus`)

```
new → qualified | disqualified
qualified → demo_booked | lost
demo_booked → sandbox_granted | won | lost
sandbox_granted → won | lost
```

| Status | Ý nghĩa | Việc Sales |
|--------|---------|------------|
| `new` | Vừa vào | Gọi, qualify — **cấm grant sandbox** |
| `qualified` | Đúng persona / ngân sách | Book lịch demo |
| `disqualified` | Không fit | Ghi lý do, dừng |
| `demo_booked` | Đã hẹn | Chạy [06](./06-demo-60-phut.md) |
| `sandbox_granted` | Đã mở 14 ngày | Follow UAT |
| `won` | Ký HĐ | Onboard |
| `lost` | Không chốt | Lý do lose |

---

## 3. Đổi status

1. Click dòng hoặc dùng select status.  
2. PATCH lưu.  
3. Badge SLA: xanh / vàng / đỏ theo phút làm việc GMT+7 (mốc 2h / 4h tùy wave).

**GDKD:** lọc pipeline, lọc ASEAN (`market_country` ∈ th, id, ph, sg).

---

## 4. SLA phản hồi

| Wave | P50 mục tiêu |
|------|----------------|
| W0 nội bộ | ≤ 4 giờ làm việc |
| W1+ | ≤ 2 giờ làm việc |

Ngoài giờ: tính ngày làm việc tiếp theo. Không để `new` qua ngày không owner.

---

## 5. Excel & proposal

- Export / import Excel lead+demo trên staff (không trên site).  
- Proposal PDF: SKU, retainer, setup, hạn 12 tháng.  
- Không nhúng số case chưa verify vào PDF gửi khách.

---

## 6. Lỗi thường gặp

| Hiện tượng | Xử lý |
|------------|--------|
| Form site không vào inbox | IT: API base + CORS + DDL |
| Trùng email | Dedup 7 ngày — mở request cũ |
| Nút sandbox xám | Status phải `qualified` hoặc `demo_booked` + đủ cap |
| Grant 409 | Đã grant còn hạn — dùng credential cũ |
