import { CustomerView } from '@/components/CustomerView';
import { customersListHref, fetchCustomer } from '@/lib/cms';
import { notFound } from 'next/navigation';

type Props = { params: Promise<{ slug: string }> };

export default async function ViCustomerPage({ params }: Props) {
  const { slug } = await params;
  const customer = await fetchCustomer('vi', slug);
  if (!customer) notFound();
  return (
    <CustomerView locale="vi" customer={customer} listHref={customersListHref('vi')} listLabel="Khách hàng" />
  );
}
