# 03 — Bảng giá & SKU

> **Đối tượng:** Visitor, Sales  
> **Route:** `/vi/bang-gia` · `/en/pricing`

---

## 1. Nguyên tắc

- Hợp đồng **tối thiểu 12 tháng**.  
- Giá in dạng **retainer / tháng + setup một lần** — không niêm yết «giá/user» dưới 200.000 VND.  
- Sales được chiết khấu **tối đa 15%** retainer tháng.  
- Thanh toán năm: **−10%** retainer (nếu áp dụng trên báo giá).  
- USD trên `/en/pricing` chỉ hiện khi IT bật `NEXT_PUBLIC_USD_PRICE=1`.

---

## 2. Ba gói (list price v1)

### PTTCRM Marketing (`mkt`)

| | VND | USD (khi bật) |
|--|-----|----------------|
| Retainer / tháng | 4.900.000 | 199 |
| Setup | 8.000.000 | 400 |
| Band | 1–10 user | |

**Có:** CRM lead/KH/CSKH, ingest Meta/Zalo, KPI cơ bản, UTM, form→inbox.  
**Không:** playbook ngành, portal nhiều client.

### PTTCRM Industry (`ind`) — gói chốt phổ biến

| | VND | USD |
|--|-----|-----|
| Retainer / tháng | 9.900.000 | 399 |
| Setup | 12.000.000 | 600 |
| Band | 1 industry pack | |

**Có:** toàn bộ Marketing + 1 pack (BĐS / Agency / F&B / Education / Pharma) + attribution ads→HĐ.  
**Không:** portal nhiều client. **Đổi pack = change order.**

### PTTCRM Agency OS (`agy`)

| | VND | USD |
|--|-----|-----|
| Retainer / tháng | 19.900.000 | 799 |
| Setup | 20.000.000 | 1.200 |
| Band | 5 client workspace | |

**Có:** Industry + multi-client + portal ROAS + SLA handoff Sales→Solution.  
**Không:** payroll / BHXH / ERP.

---

## 3. Phụ trội

| Vượt | Phụ phí |
|------|---------|
| User > 10 (`mkt`/`ind`) | +490.000 VND / user / tháng |
| Client workspace > 5 (`agy`) | +3.900.000 VND / client / tháng |

---

## 4. Sales — báo giá

1. Chọn SKU trên demo (không chốt giá trên điện thoại lần đầu nếu chưa thấy ngành).  
2. Proposal PDF / Excel trên staff app (không làm trên marketing site).  
3. Stripe Checkout USD (test/staging) chỉ khi W2 flag + visitor chủ động — **CTA chính vẫn Request demo**.  
4. Không soạn giá/user kiểu Getfly trên slide khách.

---

## 5. Bảng so sánh (site)

| Năng lực | Marketing | Industry | Agency OS |
|----------|-----------|----------|-----------|
| CRM lead / CSKH | Có | Có | Có |
| Ingest ads | Có | Có | Có |
| Industry pack | — | 1 | 1+ |
| Attribution ads→HĐ | — | Có | Có |
| Portal multi-client | — | — | Có |
| SLA handoff | — | — | Có |

---

## 6. Câu trả lời nhanh

| Câu khách | Trả lời |
|-----------|---------|
| «Có gói theo user không?» | Retainer tháng + band user. Không niêm yết seat rẻ. |
| «Dùng thử 30 ngày?» | Không. Demo 60 phút; sandbox 14 ngày sau qualify. |
| «Chỉ cần CRM?» | Gói Marketing. Attribution ngành = Industry. |
| «30 client agency?» | Agency OS + phụ trội workspace. |
