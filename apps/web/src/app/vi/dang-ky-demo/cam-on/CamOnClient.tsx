'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { fireLeadEvent, loadMetaPixel } from '@/lib/pixel';

export default function CamOnClient() {
  useEffect(() => {
    loadMetaPixel();
    fireLeadEvent();
  }, []);

  return (
    <main className="wrap page-hero" style={{ paddingBottom: 80 }}>
      <h1>Cảm ơn bạn!</h1>
      <p className="lead">Sales sẽ liên hệ trong giờ hành chính (T2–T6, 08:30–18:00 GMT+7).</p>
      <p>
        <Link href="/vi">← Về trang chủ</Link>
      </p>
    </main>
  );
}
