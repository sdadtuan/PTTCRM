import { PixelLead } from '@/components/PixelLead';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cảm ơn — PTTCRM',
  robots: { index: false, follow: false },
};

export default function CamOnPage() {
  return (
    <>
      <PixelLead />
      <section className="mast">
        <div className="wrap page-hero">
          <h1>Đã nhận đăng ký Demo</h1>
          <p className="lead">Sales sẽ liên hệ trong giờ hành chính (T2–T6, 08:30–18:00).</p>
          <p style={{ marginTop: 24 }}>
            <Link className="btn btn-solid" href="/vi">
              Về trang chủ
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
