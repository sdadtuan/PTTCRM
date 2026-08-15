import { PricingView } from '@/components/PricingView';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bảng giá — PTTCRM',
  alternates: { languages: { vi: '/vi/bang-gia', en: '/en/pricing' } },
};

export default function BangGiaPage() {
  return <PricingView locale="vi" />;
}
