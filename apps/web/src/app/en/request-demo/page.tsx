import { DemoForm } from '@/components/DemoForm';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Request demo — PTTCRM',
  alternates: { languages: { vi: '/vi/dang-ky-demo', en: '/en/request-demo' } },
};

export default function RequestDemoPage() {
  return (
    <main className="wrap form-page">
      <div>
        <p className="crumbs">
          <Link href="/en">PTTCRM</Link> / Request demo
        </p>
        <h1>Book a 60-minute demo</h1>
        <p className="lead">Sales replies 08:30–18:00 GMT+7, Mon–Fri. No public self-serve trial.</p>
        <Suspense>
          <DemoForm locale="en" />
        </Suspense>
      </div>
      <aside className="aside">
        <div className="k mono" style={{ color: '#00727d' }}>
          AFTER SUBMIT
        </div>
        <ol>
          <li>Sales receives the lead in the Demo inbox.</li>
          <li>Contact within 4 business hours.</li>
          <li>60-minute demo: ads → lead → contract → ROAS.</li>
          <li>14-day sandbox only after a qualified demo.</li>
        </ol>
        <p style={{ margin: '20px 0 0', fontSize: 13, color: '#5a6c6e' }}>
          +84 24 7307 7979 · hello@pttcrm.com
        </p>
      </aside>
    </main>
  );
}
