'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { fireLeadEvent, loadMetaPixel } from '@/lib/pixel';

export default function ThanksClient() {
  useEffect(() => {
    loadMetaPixel();
    fireLeadEvent();
  }, []);

  return (
    <main className="wrap page-hero" style={{ paddingBottom: 80 }}>
      <h1>Thank you!</h1>
      <p className="lead">Sales will contact you in business hours (Mon–Fri, 08:30–18:00 GMT+7).</p>
      <p>
        <Link href="/en">← Back to home</Link>
      </p>
    </main>
  );
}
