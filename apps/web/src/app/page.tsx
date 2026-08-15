import { detectLocale } from '@pttcrm/gtm-core';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function RootPage() {
  const h = await headers();
  const al = h.get('accept-language');
  redirect(`/${detectLocale(al)}`);
}
