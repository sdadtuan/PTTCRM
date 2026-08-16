import { CustomerView } from '@/components/CustomerView';
import { customersListHref, fetchCustomer } from '@/lib/cms';
import { notFound } from 'next/navigation';

type Props = { params: Promise<{ slug: string }> };

export default async function EnCustomerPage({ params }: Props) {
  const { slug } = await params;
  const customer = await fetchCustomer('en', slug);
  if (!customer) notFound();
  return (
    <CustomerView locale="en" customer={customer} listHref={customersListHref('en')} listLabel="Customers" />
  );
}
