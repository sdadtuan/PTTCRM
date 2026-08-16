# PTTCRM W4A — Credibility Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Gỡ placeholder công khai (partner, subprocessors, số case chưa verify), thêm status incident/history trung thực, và security pack — không bịa SOC2/case/partner.

**Architecture:** `gtm-core` thêm gate `metrics_verified`, `isPublishablePartner`, `isPlaceholderVendor`, parse status history/incidents. Site chỉ render dữ liệu qua gate. RNOSAI status API trả `incidents` + `history` (rỗng / `uptime_90d_pct=null` khi chưa có `GTM_STATUS_HISTORY_START`).

**Tech Stack:** TypeScript, Vitest, Playwright, NestJS, Jest.

## Global Constraints

- Brand công khai: `PTTCRM`. CI fail nếu `RNOSAI` trong `apps/web`.
- BR-GTM-018: không số case / chứng chỉ bịa. `metrics_verified=false` → không in CPL/ROAS.
- Không hiện `PO_*` hoặc `example.com` trên UI công khai.
- SOC2 report vẫn chỉ khi `po_approved && report_url`.
- Status history không giả 90 ngày 100% khi chưa đo.
- Commit site trong PTTCRM; status API trong `../RNOSAI`.

---
