# PTTCRM W0 Commercial Site Implementation Plan

> **SUPERSEDED 2026-08-15.** Không chạy plan này. Dùng [system-implementation](./2026-08-15-pttcrm-system-implementation.md) + [w0-v12](./2026-08-15-pttcrm-w0-v12.md) (CMS, sự kiện, nav 1.2).
>
> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the PTTCRM marketing site (VI/EN) plus public demo API and Sales inbox so a visitor can request a demo and Sales can work the lead within 4 business hours.

**Architecture:** `apps/web` (Next.js 15) posts to RNOSAI `PublicGtmModule` (`POST /api/v1/public/gtm/demo-requests`). The API writes `gtm_demo_request` and `crm_leads` (`source=pttcrm_web`). ops-web `/crm/gtm/demos` lists and transitions status. Two git repos: this repo (site) and `../RNOSAI` (API + inbox).

**Tech Stack:** Node 20, Next.js 15 App Router, TypeScript strict, Vitest, Playwright, NestJS, Jest, PostgreSQL, pnpm.

## Global Constraints

- Brand name on all public UI: `PTTCRM`. CI fails if `RNOSAI` appears under `apps/web/content` or `apps/web/src`.
- Slogan VI: `Một nền tảng, chuyên biệt từng ngành`. EN: `One platform, specialized by industry`.
- Primary CTA: `Đăng ký Demo` / `Request demo`. No public 30-day trial. No per-user price below `200000` VND.
- `/en/pricing` must not print USD amounts while `NEXT_PUBLIC_USD_PRICE=0`.
- marketing-web local port `3300`. Login URL `https://rs.pttads.vn/login`.
- Teal `#0090A0`. Logo `brand/pttcrm-logo-monogram.png`.
- W0 only: no Stripe, no sandbox grant, no SOC2, no ops-web i18n, no blog/customers/partners pages.
- List price VI: Marketing `4900000` + setup `8000000`; Industry `9900000` + setup `12000000`; Agency OS `19900000` + setup `20000000`.
- Commits in PTTCRM for site tasks; commits in `../RNOSAI` for API/inbox tasks. Do not mix repos in one commit.

---

## File map

**PTTCRM**

| Path | Responsibility |
|------|----------------|
| `packages/gtm-core/src/*.ts` | Pure functions: paths, validate, UTM, SLA (site-side) |
| `apps/web/src/app/page.tsx` | Accept-Language → `/vi` or `/en` |
| `apps/web/src/app/vi/**` · `apps/web/src/app/en/**` | Locale routes matching UX IA |
| `apps/web/src/components/*` | SiteChrome, DemoForm, CookieBar, JsonLd |
| `apps/web/content/{vi,en}/*.json` | Copy only — no RNOSAI string |
| `apps/web/src/lib/gtm-api.ts` | POST client |
| `.github/workflows/w0-ci.yml` | grep RNOSAI + vitest + build |

**RNOSAI (`../RNOSAI`)**

| Path | Responsibility |
|------|----------------|
| `docs/specs/2026-08-15-postgresql-ddl-gtm-w0.sql` | `gtm_demo_request` |
| `services/ptt-crm-api/src/gtm/*` | Public + staff GTM module |
| `services/ops-web/src/app/crm/gtm/demos/page.tsx` | Inbox |
| `services/ops-web/src/components/OpsNav.tsx` | Nav link |

---

### Task 1: gtm-core — paths, validate, UTM, SLA

**Files:**
- Create: `packages/gtm-core/package.json`
- Create: `packages/gtm-core/tsconfig.json`
- Create: `packages/gtm-core/src/paths.ts`
- Create: `packages/gtm-core/src/validate-demo.ts`
- Create: `packages/gtm-core/src/utm.ts`
- Create: `packages/gtm-core/src/sla.ts`
- Create: `packages/gtm-core/src/index.ts`
- Test: `packages/gtm-core/src/paths.spec.ts`
- Test: `packages/gtm-core/src/validate-demo.spec.ts`
- Test: `packages/gtm-core/src/utm.spec.ts`
- Test: `packages/gtm-core/src/sla.spec.ts`
- Create: `package.json` (pnpm workspace root)
- Create: `pnpm-workspace.yaml`

**Interfaces:**
- Consumes: nothing
- Produces:
  - `export type Locale = 'vi' | 'en'`
  - `export function detectLocale(acceptLanguage: string | null): Locale`
  - `export function switchLocalePath(pathname: string, to: Locale): string`
  - `export type DemoPayload` (fields in SRS POST body except server-only)
  - `export function validateDemoPayload(input: unknown): { ok: true; value: DemoPayload } | { ok: false; field_errors: Record<string, string> }`
  - `export function parseUtmSearch(search: string): { utm_source?: string; utm_medium?: string; utm_campaign?: string; utm_content?: string; utm_term?: string }`
  - `export function mergeFirstTouchUtm(existing: string | null, incoming: ReturnType<typeof parseUtmSearch>): string`
  - `export type SlaTone = 'none' | 'warn' | 'danger'`
  - `export function slaTone(createdAt: Date, now: Date, status: string): SlaTone`

- [ ] **Step 1: Write failing tests**

```ts
// packages/gtm-core/src/paths.spec.ts
import { detectLocale, switchLocalePath } from './paths';

test('detectLocale falls back to vi', () => {
  expect(detectLocale(null)).toBe('vi');
  expect(detectLocale('fr-FR,fr;q=0.9')).toBe('vi');
  expect(detectLocale('en-US,en;q=0.8')).toBe('en');
  expect(detectLocale('vi-VN,vi;q=0.9,en;q=0.8')).toBe('vi');
});

test('switchLocalePath maps bang-gia to pricing', () => {
  expect(switchLocalePath('/vi/bang-gia', 'en')).toBe('/en/pricing');
  expect(switchLocalePath('/en/request-demo', 'vi')).toBe('/vi/dang-ky-demo');
  expect(switchLocalePath('/vi/giai-phap/agency', 'en')).toBe('/en/solutions/agency');
});
```

```ts
// packages/gtm-core/src/validate-demo.spec.ts
import { validateDemoPayload } from './validate-demo';

test('rejects short name and missing consent', () => {
  const r = validateDemoPayload({
    full_name: 'A',
    email: 'bad',
    phone: '123',
    company: 'X',
    industry: 'agency',
    sku_interest: 'agy',
    consent_privacy: false,
    locale: 'vi',
    landing_path: '/vi',
    website: '',
  });
  expect(r.ok).toBe(false);
  if (!r.ok) {
    expect(r.field_errors.full_name).toBeTruthy();
    expect(r.field_errors.email).toBeTruthy();
    expect(r.field_errors.phone).toBeTruthy();
    expect(r.field_errors.consent_privacy).toBeTruthy();
  }
});

test('accepts VN phone and honeypot empty', () => {
  const r = validateDemoPayload({
    full_name: 'Nguyen An',
    email: 'an@agency.vn',
    phone: '0901234567',
    company: 'An Agency',
    industry: 'agency',
    sku_interest: 'agy',
    company_size: '11-30',
    message: 'Can demo portal ROAS',
    consent_privacy: true,
    locale: 'vi',
    landing_path: '/vi/giai-phap/agency',
    website: '',
  });
  expect(r.ok).toBe(true);
});
```

```ts
// packages/gtm-core/src/utm.spec.ts
import { mergeFirstTouchUtm, parseUtmSearch } from './utm';

test('first touch wins', () => {
  const first = mergeFirstTouchUtm(null, parseUtmSearch('?utm_source=google&utm_campaign=w0'));
  const second = mergeFirstTouchUtm(first, parseUtmSearch('?utm_source=facebook'));
  expect(JSON.parse(second).utm_source).toBe('google');
  expect(JSON.parse(second).utm_campaign).toBe('w0');
});
```

```ts
// packages/gtm-core/src/sla.spec.ts
import { slaTone } from './sla';

test('freezes outside VN business hours', () => {
  const created = new Date('2026-08-14T11:00:00+07:00'); // Friday 11:00
  const sat = new Date('2026-08-15T12:00:00+07:00');
  expect(slaTone(created, sat, 'new')).toBe('none');
});

test('danger after 4 business hours', () => {
  const created = new Date('2026-08-14T09:00:00+07:00');
  const now = new Date('2026-08-14T13:30:00+07:00');
  expect(slaTone(created, now, 'new')).toBe('danger');
  expect(slaTone(created, now, 'qualified')).toBe('none');
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd /Users/quoctuan/Documents/CursorAI/PTTCRM && pnpm exec vitest run packages/gtm-core --reporter=dot`  
Expected: FAIL — workspace / files not found or `detectLocale` not exported.

- [ ] **Step 3: Write workspace + implementation**

`pnpm-workspace.yaml`:

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

Root `package.json`:

```json
{
  "name": "pttcrm",
  "private": true,
  "packageManager": "pnpm@9.15.0",
  "scripts": {
    "test": "vitest run",
    "forbidden": "rg -n 'RNOSAI' apps/web/content apps/web/src && exit 1 || exit 0"
  },
  "devDependencies": {
    "typescript": "^5.7.3",
    "vitest": "^3.0.5"
  }
}
```

`packages/gtm-core/package.json`:

```json
{
  "name": "@pttcrm/gtm-core",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "main": "src/index.ts",
  "types": "src/index.ts"
}
```

Implement `paths.ts`: `detectLocale` checks `en` before defaulting `vi` (spec: no match → vi; `en-US` → en; `vi` first in q → vi).

`PATH_PAIRS` exact:

```ts
export const PATH_PAIRS: Array<[string, string]> = [
  ['/vi', '/en'],
  ['/vi/san-pham/crm', '/en/product/crm'],
  ['/vi/san-pham/ads', '/en/product/ads'],
  ['/vi/san-pham/portal', '/en/product/portal'],
  ['/vi/san-pham/ai', '/en/product/ai'],
  ['/vi/giai-phap/bds', '/en/solutions/real-estate'],
  ['/vi/giai-phap/agency', '/en/solutions/agency'],
  ['/vi/giai-phap/fnb', '/en/solutions/fnb'],
  ['/vi/bang-gia', '/en/pricing'],
  ['/vi/dang-ky-demo', '/en/request-demo'],
  ['/vi/dang-ky-demo/cam-on', '/en/request-demo/thanks'],
  ['/vi/ve-chung-toi', '/en/about'],
  ['/vi/phap-ly/bao-mat', '/en/legal/privacy'],
  ['/vi/phap-ly/dieu-khoan', '/en/legal/terms'],
  ['/vi/phap-ly/cookie', '/en/legal/cookies'],
];
```

`validate-demo.ts` rules: `full_name.trim().length >= 2`; email `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`; phone `/^(\+?[1-9]\d{7,14}|0\d{9})$/`; `company.trim().length >= 2`; industry in `bds|agency|fnb|education|pharma|other`; sku in `mkt|ind|agy`; `consent_privacy === true`; locale `vi|en`; `landing_path` starts with `/`; `website` must be `''` or omitted (if non-empty, still `ok: true` — honeypot is enforced only on the server so bots are not taught the rule); `message` length ≤ 1000.

`utm.ts`: JSON cookie payload `{ utm_source, utm_medium, utm_campaign, utm_content, utm_term }`. `mergeFirstTouchUtm` returns `existing` when `existing` parses and has any utm_* key.

`sla.ts`: count business minutes Mon–Fri 08:30–18:00 Asia/Bangkok (GMT+7, no DST). `warn` if status=`new` and minutes > 120; `danger` if > 240; else `none`.

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm exec vitest run packages/gtm-core`  
Expected: PASS all 4 files.

- [ ] **Step 5: Commit (PTTCRM)**

```bash
git add pnpm-workspace.yaml package.json packages/gtm-core
git commit -m "$(cat <<'EOF'
feat: add gtm-core locale, validate, UTM, SLA

EOF
)"
```

---

### Task 2: Next.js marketing-web scaffold

**Files:**
- Create: `apps/web/package.json`
- Create: `apps/web/tsconfig.json`
- Create: `apps/web/next.config.ts`
- Create: `apps/web/src/app/layout.tsx`
- Create: `apps/web/src/app/page.tsx`
- Create: `apps/web/src/app/not-found.tsx`
- Create: `apps/web/src/app/globals.css`
- Test: `apps/web/src/app/page.spec.ts`

**Interfaces:**
- Consumes: `detectLocale` from `@pttcrm/gtm-core`
- Produces: Next app on port 3300; `/` redirects 307 to `/vi` or `/en`

- [ ] **Step 1: Write failing test**

```ts
// apps/web/src/app/page.spec.ts
import { detectLocale } from '@pttcrm/gtm-core';

test('root uses detectLocale for redirect target', () => {
  expect(`/${detectLocale('en')}`).toBe('/en');
  expect(`/${detectLocale(null)}`).toBe('/vi');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest run apps/web/src/app/page.spec.ts`  
Expected: FAIL until workspace links `@pttcrm/gtm-core`.

- [ ] **Step 3: Scaffold Next app**

`apps/web/package.json`:

```json
{
  "name": "web",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3300",
    "build": "next build",
    "start": "next start -p 3300"
  },
  "dependencies": {
    "@pttcrm/gtm-core": "workspace:*",
    "next": "^15.2.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.17.0",
    "@types/react": "^19.0.0",
    "typescript": "^5.7.3"
  }
}
```

`apps/web/next.config.ts`:

```ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@pttcrm/gtm-core'],
};

export default nextConfig;
```

`apps/web/src/app/page.tsx`:

```tsx
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { detectLocale } from '@pttcrm/gtm-core';

export default async function RootPage() {
  const h = await headers();
  redirect(`/${detectLocale(h.get('accept-language'))}`);
}
```

Root `layout.tsx`: `<html><body>{children}</body></html>` only (locale layouts set `lang`).

`globals.css` tokens from UX spec:

```css
:root {
  --ptt-teal: #0090A0;
  --ptt-teal-ink: #006F7A;
  --ptt-ink: #0B0F10;
  --ptt-paper: #F7FBFB;
  --ptt-hero: #0B0F10;
  --ptt-node: #FFFFFF;
  --ptt-line: #D5E3E4;
  --ptt-warn: #B45309;
  --ptt-danger: #B42318;
}
html, body { margin: 0; background: var(--ptt-paper); color: var(--ptt-ink); font: 400 16px/26px ui-sans-serif, system-ui, sans-serif; }
a { color: var(--ptt-teal-ink); }
```

- [ ] **Step 4: Install, test, build**

Run: `pnpm install && pnpm exec vitest run apps/web/src/app/page.spec.ts && pnpm --filter web build`  
Expected: PASS · build succeeds (empty routes OK except `/`).

- [ ] **Step 5: Commit (PTTCRM)**

```bash
git add apps/web pnpm-lock.yaml
git commit -m "$(cat <<'EOF'
feat: scaffold marketing-web on port 3300

EOF
)"
```

---

### Task 3: SiteChrome + cookie bar + locale layouts

**Files:**
- Create: `apps/web/src/components/SiteChrome.tsx`
- Create: `apps/web/src/components/CookieBar.tsx`
- Create: `apps/web/src/lib/consent.ts`
- Create: `apps/web/src/app/vi/layout.tsx`
- Create: `apps/web/src/app/en/layout.tsx`
- Create: `apps/web/public/pttcrm-logo-monogram.png` (copy from `brand/pttcrm-logo-monogram.png`)
- Test: `apps/web/src/lib/consent.spec.ts`

**Interfaces:**
- Consumes: `switchLocalePath`, `Locale`
- Produces: `SiteChrome({ locale, pathname, children })`; cookie `ptt_consent` JSON `{ analytics: boolean; ads: boolean }` default both false

- [ ] **Step 1: Write failing consent test**

```ts
import { parseConsent, defaultConsent } from './consent';

test('default is essential only', () => {
  expect(defaultConsent()).toEqual({ analytics: false, ads: false });
  expect(parseConsent(null)).toEqual({ analytics: false, ads: false });
  expect(parseConsent('{"analytics":true,"ads":false}')).toEqual({ analytics: true, ads: false });
});
```

- [ ] **Step 2: Run — expect FAIL** (`consent` not found)

- [ ] **Step 3: Implement consent + chrome**

`consent.ts`:

```ts
export type Consent = { analytics: boolean; ads: boolean };
export function defaultConsent(): Consent { return { analytics: false, ads: false }; }
export function parseConsent(raw: string | null): Consent {
  if (!raw) return defaultConsent();
  try {
    const j = JSON.parse(raw) as Partial<Consent>;
    return { analytics: j.analytics === true, ads: j.ads === true };
  } catch {
    return defaultConsent();
  }
}
```

`SiteChrome.tsx`: header 64px, logo 36×36 in black square + wordmark `PTTCRM`, mega links from UX, ghost Log in → `process.env.NEXT_PUBLIC_LOGIN_URL || 'https://rs.pttads.vn/login'`, solid Demo → `/vi/dang-ky-demo` or `/en/request-demo`. Locale toggle calls `switchLocalePath(pathname, other)`. Footer four columns, email `hello@pttcrm.com`, phone `+84 24 7307 7979`, `© 2026 PTTCRM`. No trial label.

`CookieBar.tsx`: three buttons set cookie `ptt_consent` max-age 180 days: essential-only / accept-all (`analytics`+`ads` true) / open options (two checkboxes).

Layouts wrap children in `SiteChrome` and set `<html lang={locale}>`.

- [ ] **Step 4: `pnpm exec vitest run apps/web/src/lib/consent.spec.ts` — PASS**

- [ ] **Step 5: Commit**

```bash
git add apps/web brand
git commit -m "$(cat <<'EOF'
feat: add PTTCRM chrome, consent cookie, locale layouts

EOF
)"
```

---

### Task 4: Content JSON + marketing pages

**Files:**
- Create: `apps/web/content/vi/home.json` and `apps/web/content/en/home.json`
- Create: `apps/web/content/vi/products.json` · `en/products.json`
- Create: `apps/web/content/vi/solutions.json` · `en/solutions.json`
- Create: `apps/web/content/vi/pricing.json` · `en/pricing.json`
- Create: `apps/web/content/vi/about.json` · `en/about.json`
- Create: `apps/web/content/vi/legal.json` · `en/legal.json`
- Create: `apps/web/src/components/HomeView.tsx`
- Create: `apps/web/src/components/ArticleView.tsx`
- Create: `apps/web/src/components/PricingView.tsx`
- Create: `apps/web/src/app/vi/page.tsx`
- Create: `apps/web/src/app/en/page.tsx`
- Create: `apps/web/src/app/vi/san-pham/[slug]/page.tsx`
- Create: `apps/web/src/app/en/product/[slug]/page.tsx`
- Create: `apps/web/src/app/vi/giai-phap/[slug]/page.tsx`
- Create: `apps/web/src/app/en/solutions/[slug]/page.tsx`
- Create: `apps/web/src/app/vi/bang-gia/page.tsx`
- Create: `apps/web/src/app/en/pricing/page.tsx`
- Create: `apps/web/src/app/vi/ve-chung-toi/page.tsx`
- Create: `apps/web/src/app/en/about/page.tsx`
- Create: `apps/web/src/app/vi/phap-ly/[slug]/page.tsx`
- Create: `apps/web/src/app/en/legal/[slug]/page.tsx`
- Test: `apps/web/content/content.spec.ts`

**Interfaces:**
- Consumes: SiteChrome routes
- Produces: All SCR-WEB-001…009 and 012…015. Pricing EN has `showAmounts: false`.

- [ ] **Step 1: Write failing content contract test**

```ts
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const root = join(__dirname);

test('no RNOSAI and no trial CTA in content', () => {
  for (const loc of ['vi', 'en']) {
    const dir = join(root, loc);
    for (const f of readdirSync(dir)) {
      const raw = readFileSync(join(dir, f), 'utf8');
      expect(raw).not.toMatch(/RNOSAI/);
      expect(raw.toLowerCase()).not.toMatch(/30 ngày|30-day trial|dùng thử 30/);
    }
  }
});

test('VI pricing amounts match list price v1', () => {
  const p = JSON.parse(readFileSync(join(root, 'vi/pricing.json'), 'utf8'));
  expect(p.skus.find((s: { id: string }) => s.id === 'mkt').retainer_vnd).toBe(4900000);
  expect(p.skus.find((s: { id: string }) => s.id === 'ind').retainer_vnd).toBe(9900000);
  expect(p.skus.find((s: { id: string }) => s.id === 'agy').retainer_vnd).toBe(19900000);
});

test('EN pricing hides amounts', () => {
  const p = JSON.parse(readFileSync(join(root, 'en/pricing.json'), 'utf8'));
  expect(p.showAmounts).toBe(false);
  expect(JSON.stringify(p)).not.toMatch(/199|399|799/);
});
```

- [ ] **Step 2: Run — FAIL missing JSON**

- [ ] **Step 3: Write JSON + pages**

`vi/home.json` keys: `slogan`, `sub`, `moats[3]`, `industries[3]` (`slug`, `title`, `blurb`), `ctaDemo`, `ctaPricing`. Slogan exact: `Một nền tảng, chuyên biệt từng ngành`. Sub: `CRM tốt nhất về Marketing`.

`en/home.json` slogan: `One platform, specialized by industry`.

`vi/pricing.json`:

```json
{
  "showAmounts": true,
  "skus": [
    { "id": "mkt", "name": "PTTCRM Marketing", "retainer_vnd": 4900000, "setup_vnd": 8000000, "includes": ["CRM lead/KH/CSKH", "Ingest Meta/Zalo lead", "KPI cơ bản"], "excludes": ["Playbook ngành", "Portal multi-client"] },
    { "id": "ind", "name": "PTTCRM Industry", "retainer_vnd": 9900000, "setup_vnd": 12000000, "popular": true, "includes": ["Mọi thứ Marketing", "1 industry pack", "Attribution ads→HĐ"], "excludes": ["Portal nhiều client"] },
    { "id": "agy", "name": "PTTCRM Agency OS", "retainer_vnd": 19900000, "setup_vnd": 20000000, "includes": ["Industry + multi-client", "Portal ROAS", "Handoff SLA"], "excludes": ["Payroll/BHXH", "ERP"] }
  ],
  "note": "Hợp đồng tối thiểu 12 tháng. Không niêm yết giá theo user."
}
```

`en/pricing.json`: same names, `showAmounts: false`, `note`: `USD list from wave 2. Request a demo for a quote.` — no numeric USD.

`PricingView`: if `showAmounts`, format VND with `vi-VN`; never divide by user count. CTA Demo.

Product slugs VI `crm|ads|portal|ai`. Solution slugs VI `bds|agency|fnb`; EN `real-estate|agency|fnb`. Ads EN copy must not promise Zalo.

Legal slugs VI `bao-mat|dieu-khoan|cookie` → EN `privacy|terms|cookies`.

About: company story as PTTCRM only.

- [ ] **Step 4: `pnpm exec vitest run apps/web/content/content.spec.ts && pnpm --filter web build` — PASS**

- [ ] **Step 5: Commit**

```bash
git add apps/web/content apps/web/src
git commit -m "$(cat <<'EOF'
feat: add VI/EN marketing pages and list prices

EOF
)"
```

---

### Task 5: Demo form + thank-you + UTM cookie

**Files:**
- Create: `apps/web/src/components/DemoForm.tsx`
- Create: `apps/web/src/lib/gtm-api.ts`
- Create: `apps/web/src/app/vi/dang-ky-demo/page.tsx`
- Create: `apps/web/src/app/en/request-demo/page.tsx`
- Create: `apps/web/src/app/vi/dang-ky-demo/cam-on/page.tsx`
- Create: `apps/web/src/app/en/request-demo/thanks/page.tsx`
- Create: `apps/web/src/components/UtmCapture.tsx`
- Test: `apps/web/src/lib/gtm-api.spec.ts`

**Interfaces:**
- Consumes: `validateDemoPayload`, `parseUtmSearch`, `mergeFirstTouchUtm`
- Produces: `submitDemo(payload: DemoPayload): Promise<{ id: string; lead_id: string; deduped: boolean }>`
  - `POST` `${NEXT_PUBLIC_GTM_API_BASE}/api/v1/public/gtm/demo-requests`
  - 422 → throw `{ field_errors }`
  - 204 → treat as success (honeypot) and still go thank-you without Pixel

- [ ] **Step 1: Failing test for client URL + payload shape**

```ts
import { buildDemoRequest } from './gtm-api';

test('buildDemoRequest maps form and first-touch utm', () => {
  const body = buildDemoRequest({
    full_name: 'Nguyen An',
    email: 'an@agency.vn',
    phone: '0901234567',
    company: 'An Agency',
    industry: 'agency',
    sku_interest: 'agy',
    consent_privacy: true,
    locale: 'vi',
    landing_path: '/vi/giai-phap/agency',
    website: '',
    utm_json: '{"utm_source":"google","utm_campaign":"w0"}',
  });
  expect(body.utm_source).toBe('google');
  expect(body.website).toBe('');
  expect(body.consent_privacy).toBe(true);
});
```

- [ ] **Step 2: Run — FAIL**

- [ ] **Step 3: Implement form**

`DemoForm` fields in UX order. Query `?industry=&sku=` prefills. Honeypot input `name="website"` `style={{ position: 'absolute', left: '-9999px' }}` tabIndex={-1} autoComplete="off". Submit disabled while pending. On 201 redirect to thanks. Thank-you pages: `export const metadata = { robots: { index: false, follow: false } }`.

`UtmCapture` client component: on mount read `window.location.search`, merge into cookie `ptt_utm` 30 days (`max-age=2592000`), path `/`.

Until Task 7, `NEXT_PUBLIC_GTM_API_BASE` may be empty — `submitDemo` throws `api_unconfigured` and the form shows `Hệ thống demo chưa kết nối` / `Demo API is not configured`.

- [ ] **Step 4: Tests PASS**

- [ ] **Step 5: Commit**

```bash
git add apps/web/src
git commit -m "$(cat <<'EOF'
feat: add demo form, UTM first-touch, noindex thanks

EOF
)"
```

---

### Task 6: RNOSAI GTM pure utils (TDD)

Work in `/Users/quoctuan/Documents/CursorAI/RNOSAI`.

**Files:**
- Create: `services/ptt-crm-api/src/gtm/gtm-validate.util.ts`
- Create: `services/ptt-crm-api/src/gtm/gtm-validate.util.spec.ts`
- Create: `services/ptt-crm-api/src/gtm/gtm-status.util.ts`
- Create: `services/ptt-crm-api/src/gtm/gtm-status.util.spec.ts`
- Create: `services/ptt-crm-api/src/gtm/gtm-ip.util.ts`
- Create: `services/ptt-crm-api/src/gtm/gtm-ip.util.spec.ts`
- Create: `services/ptt-crm-api/src/gtm/gtm-owner.util.ts`
- Create: `services/ptt-crm-api/src/gtm/gtm-owner.util.spec.ts`
- Create: `services/ptt-crm-api/src/gtm/gtm-sla.util.ts`
- Create: `services/ptt-crm-api/src/gtm/gtm-sla.util.spec.ts`

**Interfaces:**
- Consumes: nothing from PTTCRM
- Produces:
  - `validatePublicDemoBody(body: unknown): { ok: true; value: PublicDemoBody } | { ok: false; field_errors: Record<string, string> }`
  - `isHoneypot(body: { website?: string }): boolean` — true when `website` is non-empty
  - `canTransitionGtmStatus(from: GtmStatus, to: GtmStatus): boolean`
  - `hashGtmIp(ip: string, salt: string): string` SHA-256 hex
  - `pickRoundRobinOwner(ids: string[], previousOwnerId: string | null): string | null`
  - `gtmSlaTone(createdAt: Date, now: Date, status: string): 'none' | 'warn' | 'danger'` (same rules as Task 1)

`GtmStatus = 'new' | 'qualified' | 'disqualified' | 'demo_booked' | 'sandbox_granted' | 'won' | 'lost'`

Transitions allowed:

```
new → qualified | disqualified
qualified → demo_booked | disqualified
demo_booked → won | lost | sandbox_granted
sandbox_granted → won | lost
```

`qualified` requires note length ≥ 10 in the **service** (Task 8), not in `canTransitionGtmStatus`.

- [ ] **Step 1: Write failing Jest tests** (mirror Task 1 phone/email cases + honeypot + `new→won` false + round-robin `a,b` → a then b then a + SLA Friday 09:00 to 13:30 danger)

- [ ] **Step 2: Run**

```bash
cd /Users/quoctuan/Documents/CursorAI/RNOSAI/services/ptt-crm-api
npx jest src/gtm --verbose --no-coverage
```

Expected: FAIL cannot find module.

- [ ] **Step 3: Implement utils**

`hashGtmIp`: `createHash('sha256').update(ip + salt).digest('hex')`. Empty salt throws `Error('GTM_IP_SALT missing')`.

`pickRoundRobinOwner`: if `ids.length===0` return null; if `previousOwnerId` not in list, return `ids[0]`; else `ids[(index+1) % length]`.

- [ ] **Step 4: Jest PASS**

- [ ] **Step 5: Commit (RNOSAI)**

```bash
cd /Users/quoctuan/Documents/CursorAI/RNOSAI
git add services/ptt-crm-api/src/gtm
git commit -m "$(cat <<'EOF'
feat: add GTM validate, status, IP hash, owner, SLA utils

EOF
)"
```

---

### Task 7: Public POST + DDL + lead create

**Files:**
- Create: `docs/specs/2026-08-15-postgresql-ddl-gtm-w0.sql` (DDL from SRS Phần 4, verbatim)
- Create: `scripts/apply_pg_ddl_gtm_w0.sh`
- Create: `services/ptt-crm-api/src/gtm/gtm.types.ts`
- Create: `services/ptt-crm-api/src/gtm/gtm.repository.ts`
- Create: `services/ptt-crm-api/src/gtm/gtm.repository.spec.ts`
- Create: `services/ptt-crm-api/src/gtm/gtm.service.ts`
- Create: `services/ptt-crm-api/src/gtm/gtm.service.spec.ts`
- Create: `services/ptt-crm-api/src/gtm/gtm-public.controller.ts`
- Create: `services/ptt-crm-api/src/gtm/gtm.module.ts`
- Modify: `services/ptt-crm-api/src/app.module.ts` — `imports: [GtmModule]`
- Modify: `services/ptt-crm-api/src/config/app-config.service.ts` — `gtmIpSalt`, `gtmSalesUserIds: string[]`, `gtmCorsOrigins`

**Interfaces:**
- Consumes: utils from Task 6; `LeadsWriteService.createLead`
- Produces: `GtmService.createPublic(body, ip): Promise<{ id: string; lead_id: string; deduped: boolean } | 'honeypot' | 'rate_limited' | { field_errors }>`

Rate limit: in-memory `Map<ipHash, timestamps[]>` keep last 3600s; if length ≥ 10 return `rate_limited`.

Dedup: `repository.findLeadIdByEmailSince(email, since)` — if found, insert request with that `lead_id`, `deduped=true`, skip `createLead`.

Create lead body:

```ts
{
  full_name: value.full_name,
  email: value.email,
  phone: value.phone,
  source: 'pttcrm_web',
  channel: 'web',
  lead_flow_kind: 'b2b_prospect',
}
```

`lead_id` stored as `String(lead.id)`.

CORS origins exact: `https://pttcrm.com`, `https://www.pttcrm.com`, `http://localhost:3300`. Controller sets `Access-Control-Allow-Origin` only if `Origin` header is in that list.

Honeypot: return HTTP 204 empty, no insert.

- [ ] **Step 1: Service spec first**

```ts
it('P0 honeypot returns honeypot and does not insert', async () => {
  const repo = { insert: jest.fn(), findLeadIdByEmailSince: jest.fn() };
  const leads = { createLead: jest.fn() };
  const svc = new GtmService(repo as never, leads as never, cfg());
  await expect(svc.createPublic({ website: 'http://spam', consent_privacy: true }, '1.1.1.1'))
    .resolves.toBe('honeypot');
  expect(repo.insert).not.toHaveBeenCalled();
  expect(leads.createLead).not.toHaveBeenCalled();
});

it('P0 dedup 7 days reuses lead_id', async () => {
  const repo = {
    insert: jest.fn().mockResolvedValue({ id: 'r2' }),
    findLeadIdByEmailSince: jest.fn().mockResolvedValue('99'),
    lastOwnerId: jest.fn().mockResolvedValue(null),
  };
  const leads = { createLead: jest.fn() };
  const svc = new GtmService(repo as never, leads as never, cfg());
  const out = await svc.createPublic(validBody(), '1.1.1.1');
  expect(out).toEqual({ id: 'r2', lead_id: '99', deduped: true });
  expect(leads.createLead).not.toHaveBeenCalled();
});
```

- [ ] **Step 2: Jest FAIL**

- [ ] **Step 3: Implement repository SQL insert + module + controller**

`POST` `/api/v1/public/gtm/demo-requests`  
201 `{ id, lead_id, deduped }`  
204 honeypot  
422 `{ field_errors }`  
429 `{ error: 'rate_limited' }`

`apply_pg_ddl_gtm_w0.sh` runs `psql` with the SQL file (same pattern as `scripts/apply_pg_ddl_market_research_p20.sh` if present — copy the connection env style from that script).

- [ ] **Step 4:**

```bash
npx jest src/gtm --verbose --no-coverage
```

Expected: PASS.

- [ ] **Step 5: Commit RNOSAI**

```bash
git add docs/specs/2026-08-15-postgresql-ddl-gtm-w0.sql scripts/apply_pg_ddl_gtm_w0.sh \
  services/ptt-crm-api/src/gtm services/ptt-crm-api/src/app.module.ts \
  services/ptt-crm-api/src/config/app-config.service.ts
git commit -m "$(cat <<'EOF'
feat: public GTM demo-request API and Postgres table

EOF
)"
```

---

### Task 8: Staff GET/PATCH + caps

**Files:**
- Create: `services/ptt-crm-api/src/gtm/gtm-staff.controller.ts`
- Create: `services/ptt-crm-api/src/gtm/guards/staff-gtm.guard.ts`
- Modify: `services/ptt-crm-api/src/staff-auth/staff-auth.service.ts` — append `{ section: 'gtm_demos', action: 'view' }`, `{ section: 'gtm_demos', action: 'edit' }` to `DEFAULT_STUB_CAPS`
- Create: `services/ptt-crm-api/src/gtm/gtm-staff.controller.spec.ts`
- Modify: `services/ptt-crm-api/src/gtm/gtm.service.ts` — `list`, `patchStatus`
- Modify: `services/ptt-crm-api/src/gtm/gtm.service.spec.ts`

**Interfaces:**
- Consumes: `canTransitionGtmStatus`
- Produces:
  - `GET /api/v1/gtm/demo-requests?status&industry&locale&owner_user_id&limit=50&offset=0` guard view
  - `PATCH /api/v1/gtm/demo-requests/:id` body `{ status, status_note, owner_user_id }` guard edit
  - `patchStatus`: if `to==='qualified'` and `(status_note||'').trim().length < 10` → 422 `{ field_errors: { status_note } }`; illegal transition → 409 `{ error: 'invalid_transition' }`

- [ ] **Step 1: Tests for qualified note and new→won 409**

- [ ] **Step 2: Jest FAIL**

- [ ] **Step 3: Implement controllers + guards** (copy `StaffMarketResearchViewGuard` pattern, section `gtm_demos`, actions `view` / `edit`)

- [ ] **Step 4: Jest PASS**

- [ ] **Step 5: Commit RNOSAI**

```bash
git commit -m "$(cat <<'EOF'
feat: staff GTM demo inbox API and caps

EOF
)"
```

---

### Task 9: ops-web Demo inbox

**Files:**
- Create: `services/ops-web/src/lib/gtm-api.ts`
- Create: `services/ops-web/src/lib/gtm-sla.ts` — re-export algorithm: copy `gtmSlaTone` implementation from `ptt-crm-api/src/gtm/gtm-sla.util.ts` (do not import across services)
- Create: `services/ops-web/src/lib/gtm-sla.spec.ts`
- Create: `services/ops-web/src/app/crm/gtm/demos/page.tsx`
- Modify: `services/ops-web/src/components/OpsNav.tsx` — inside `sharedCrm` after «Tất cả leads»:

```ts
if (hasCap(user, 'gtm_demos', 'view') || hasCap(user, 'crm_leads', 'view')) {
  sharedCrm.push({ href: '/crm/gtm/demos', label: 'Demo PTTCRM' });
}
```

**Interfaces:**
- Consumes: staff GET/PATCH
- Produces: table columns: created_at, full_name (link `/crm/leads/{lead_id}`), company, industry, sku_interest, locale, utm_campaign, status, owner_user_id, age + SLA badge

- [ ] **Step 1: `gtm-sla.spec.ts` same Friday 09:00→13:30 danger case**

- [ ] **Step 2: FAIL**

- [ ] **Step 3: Page — filters as query string `?status=&industry=&locale=&owner=`; status change form: select + note textarea + save. Badge class `warn` / `danger` using CSS `--ptt-warn` / `--ptt-danger` or existing ops tokens.

- [ ] **Step 4: `npx jest src/lib/gtm-sla.spec.ts` in ops-web (or vitest if that package uses it — match neighboring specs). PASS.

- [ ] **Step 5: Commit RNOSAI**

```bash
git commit -m "$(cat <<'EOF'
feat: add /crm/gtm/demos inbox and nav link

EOF
)"
```

---

### Task 10: Wire site → API, SEO, Pixel, CI, Playwright

**Files:**
- Create: `apps/web/src/app/sitemap.ts`
- Create: `apps/web/src/components/SeoHead.tsx`
- Create: `apps/web/src/components/MetaPixel.tsx`
- Create: `apps/web/.env.example`
- Create: `.github/workflows/w0-ci.yml`
- Create: `apps/web/playwright.config.ts`
- Create: `apps/web/e2e/w0-smoke.spec.ts`
- Modify: locale `layout.tsx` to include `SeoHead` + `MetaPixel` + `UtmCapture`
- Modify: thank-you to fire `fbq('track','Lead')` only when `parseConsent` ads === true

**Interfaces:**
- Consumes: Task 5 `submitDemo`, Task 7 API
- Produces: W0 acceptance checklist green

`sitemap.ts` lists every PATH_PAIRS URL except `cam-on` / `thanks`.

`SeoHead`: canonical = `https://pttcrm.com{pathname}`; hreflang `vi` / `en` / `x-default` (`https://pttcrm.com/vi`). JSON-LD Organization on all pages; Offer on `/vi/bang-gia` only (VND amounts).

`MetaPixel`: if `NEXT_PUBLIC_META_PIXEL_ID` set AND (consent.analytics || consent.ads) inject official pixel and `PageView`.

`.env.example`:

```
NEXT_PUBLIC_GTM_API_BASE=http://127.0.0.1:3000
NEXT_PUBLIC_LOGIN_URL=https://rs.pttads.vn/login
NEXT_PUBLIC_META_PIXEL_ID=
NEXT_PUBLIC_USD_PRICE=0
```

`w0-ci.yml`:

```yaml
name: w0
on: [push, pull_request]
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: pnpm }
      - run: pnpm install
      - run: |
          if rg -n 'RNOSAI' apps/web/content apps/web/src; then
            echo 'RNOSAI is forbidden on the public site' >&2
            exit 1
          fi
      - run: pnpm exec vitest run
      - run: pnpm --filter web build
```

Playwright `w0-smoke.spec.ts`:
1. `GET /` with `Accept-Language: en` → URL contains `/en`
2. Home VI has slogan `Một nền tảng, chuyên biệt từng ngành`
3. Switch EN from `/vi/bang-gia` → `/en/pricing` and page has no `199`
4. Fill demo (website honeypot empty) against mocked API 201 → `/cam-on` and `robots` noindex
5. `GET /sitemap.xml` body does not contain `cam-on`

FR-WEB-023 (`pttcrm.vn` 301) is **DNS/host**, not app code. Document in `docs/runbooks/w0-dns.md`:

```
pttcrm.vn  301  https://pttcrm.com/vi
www.pttcrm.com  301  https://pttcrm.com
```

- [ ] **Step 1: Write Playwright spec (will fail until server up)**

- [ ] **Step 2: Run `pnpm --filter web exec playwright test` — FAIL**

- [ ] **Step 3: Implement SEO/Pixel/CI/runbook; mock API in Playwright with `page.route('**/api/v1/public/gtm/demo-requests', ...)`**

- [ ] **Step 4:**

```bash
pnpm exec vitest run
pnpm --filter web build
rg -n 'RNOSAI' apps/web/content apps/web/src; echo $?   # expect 1 from rg (no matches)
pnpm --filter web exec playwright test
```

Expected: all green.

- [ ] **Step 5: Commit PTTCRM**

```bash
git add apps/web .github docs/runbooks/w0-dns.md
git commit -m "$(cat <<'EOF'
feat: wire demo API, SEO, pixel consent, W0 CI

EOF
)"
```

---

## W0 exit (do not claim done without this)

| Check | Command / proof |
|-------|-----------------|
| Site build | `pnpm --filter web build` PASS |
| Unit | `pnpm exec vitest run` PASS |
| Forbidden brand | `rg RNOSAI apps/web/content apps/web/src` no matches |
| API | `npx jest src/gtm` in ptt-crm-api PASS |
| DDL | table `gtm_demo_request` exists on staging |
| Inbox | `/crm/gtm/demos` lists a staging row |
| Playwright | `w0-smoke` PASS |
| DNS | IT ticket for `pttcrm.com` / `pttcrm.vn` — not a code task |

## Out of this plan (already specified W1+)

Sandbox grant, case studies, Excel/PDF, Stripe USD, app i18n, ASEAN playbooks, SOC2.
