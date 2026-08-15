import { CustomersView } from '@/components/CustomersView';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Khách hàng — PTTCRM',
  description: 'Case study CPL/ROAS đã PO ký — PTTCRM Marketing CRM.',
  alternates: { languages: { vi: '/vi/khach-hang', en: '/en/customers' } },
};

export default function KhachHangPage() {
  return <CustomersView locale="vi" />;
}
