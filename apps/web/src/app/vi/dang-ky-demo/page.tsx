import { DemoForm } from '@/components/DemoForm';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Đăng ký Demo — PTTCRM',
  alternates: { languages: { vi: '/vi/dang-ky-demo', en: '/en/request-demo' } },
};

export default function DangKyDemoPage() {
  return (
    <main className="wrap form-page">
      <div>
        <p className="crumbs">
          <Link href="/vi">PTTCRM</Link> / Đăng ký Demo
        </p>
        <h1>Đăng ký Demo 60 phút</h1>
        <p className="lead">
          Sales liên hệ 08:30–18:00 GMT+7, T2–T6. Không dùng thử tự phục vụ công khai.
        </p>
        <Suspense>
          <DemoForm locale="vi" />
        </Suspense>
      </div>
      <aside className="aside">
        <div className="k mono" style={{ color: '#00727d' }}>
          SAU KHI GỬI
        </div>
        <ol>
          <li>Sales nhận lead trong hàng Demo PTTCRM.</li>
          <li>Liên hệ dưới 4 giờ giờ hành chính.</li>
          <li>Demo 60 phút: ads → lead → HĐ → ROAS.</li>
          <li>Sandbox 14 ngày chỉ sau khi demo đạt chuẩn.</li>
        </ol>
        <p style={{ margin: '20px 0 0', fontSize: 13, color: '#5a6c6e' }}>
          024 7307 7979 · hello@pttcrm.com
        </p>
      </aside>
    </main>
  );
}
