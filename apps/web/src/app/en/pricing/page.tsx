import { PricingView } from '@/components/PricingView';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing — PTTCRM',
  alternates: { languages: { vi: '/vi/bang-gia', en: '/en/pricing' } },
};

export default function EnPricingPage() {
  return <PricingView locale="en" />;
}
