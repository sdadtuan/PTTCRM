import { CustomersView } from '@/components/CustomersView';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Customers — PTTCRM',
  description: 'PO-signed CPL/ROAS case studies — PTTCRM marketing CRM.',
  alternates: { languages: { vi: '/vi/khach-hang', en: '/en/customers' } },
};

export default function CustomersPage() {
  return <CustomersView locale="en" />;
}
