import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { CMS_COOKIE, cmsAdminSecret } from '@/lib/cms-auth';
import { CmsDesk } from './CmsDesk';

export default async function CmsPage() {
  const jar = await cookies();
  const secret = cmsAdminSecret();
  if (!secret || jar.get(CMS_COOKIE)?.value !== secret) {
    redirect('/cms/login');
  }
  return <CmsDesk />;
}
