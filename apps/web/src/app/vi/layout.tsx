import type { Locale } from '@pttcrm/gtm-core';
import { CookieBar } from '@/components/CookieBar';
import { SiteChrome } from '@/components/SiteChrome';
import { UtmCapture } from '@/components/UtmCapture';
import '@/components/pages.css';
import { headers } from 'next/headers';

export default async function ViLayout({ children }: { children: React.ReactNode }) {
  const h = await headers();
  const pathname = h.get('x-pathname') ?? '/vi';
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600&family=IBM+Plex+Mono:wght@500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <SiteChrome locale={'vi' satisfies Locale} pathname={pathname}>
          {children}
        </SiteChrome>
        <CookieBar locale="vi" />
        <UtmCapture />
      </body>
    </html>
  );
}
