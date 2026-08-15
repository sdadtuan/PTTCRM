import { PixelLead } from '@/components/PixelLead';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Thank you — PTTCRM',
  robots: { index: false, follow: false },
};

export default function ThanksPage() {
  return (
    <>
      <PixelLead />
      <section className="mast">
        <div className="wrap page-hero">
          <h1>Request received</h1>
          <p className="lead">Sales will contact you during business hours (Mon–Fri, 08:30–18:00 VN).</p>
          <p style={{ marginTop: 24 }}>
            <Link className="btn btn-solid" href="/en">
              Back to home
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
