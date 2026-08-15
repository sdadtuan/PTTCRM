# PTTCRM Commercial Platform — Design Index

> **Document ID:** PTTCRM-DESIGN-20260815  
> **Phiên bản:** 1.2 · **Ngày:** 2026-08-15  
> **Trạng thái:** Draft — plan triển khai đã có  
> **Plan hệ thống:** [2026-08-15-pttcrm-system-implementation.md](../plans/2026-08-15-pttcrm-system-implementation.md)  
> **Plan W0 (chạy):** [2026-08-15-pttcrm-w0-v12.md](../plans/2026-08-15-pttcrm-w0-v12.md)  
> **Quyết định đã khóa:** A+ (VN) → D0 (English site) → D1 (ASEAN) → US/EU sau  
> **1.1:** HTML demo đã duyệt — nav, tin tức W0, hệ màu 4 lớp  
> **1.2:** CMS nội bộ W0 — media, tin, sự kiện (xem Spec / SRS / UX / UC)

Bộ thiết kế gồm bốn tài liệu. Đọc theo thứ tự:

1. [Master Spec](../../specs/2026-08-15-pttcrm-master-spec.md) — tầm nhìn, GTM, SKU, kiến trúc, wave, cấm làm
2. [SRS](../../specs/2026-08-15-pttcrm-srs.md) — FR/NFR, DDL, API, acceptance
3. [UX/UI](../../specs/2026-08-15-pttcrm-ui-ux.md) — IA, token, màn hình, i18n
4. [Use Case](../../use-cases/01-PTTCRM-COMMERCIAL.md) — GTM-UC-001…039

**Phạm vi W0:** marketing-web Next.js + `PublicGtmModule` + `GtmCmsModule` + inbox `/crm/gtm/demos` + desk `/crm/gtm/cms`.  
**Không** nằm trong W0: Stripe, sandbox grant, SOC2, i18n toàn bộ ops-web, WhatsApp.
