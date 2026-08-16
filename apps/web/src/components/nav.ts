import type { Locale } from '@pttcrm/gtm-core';

export type NavItemLink = { id: string; href: string; label: string; desc?: string; icon?: string };

export type NavGroup = {
  id: 'solutions' | 'platform' | 'pricing' | 'markets' | 'resources';
  label: string;
  href?: string;
  megaKicker?: string;
  items?: NavItemLink[];
  featured?: { title: string; body: string; cta: string; href: string };
};

const COPY = {
  vi: {
    solutions: 'Giải pháp',
    platform: 'Nền tảng',
    pricing: 'Bảng giá',
    resources: 'Tài nguyên',
    login: 'Đăng nhập',
    demo: 'Đăng ký Demo',
    megaSol: 'Theo ngành',
    megaPlat: 'Bốn module',
    megaRes: 'Đọc & liên hệ',
    featSolH: 'Chuyên biệt từng ngành',
    featSolP: 'Cùng một nền tảng. Khác metric chốt: booking, ROAS client, đặt chỗ.',
    featPlatH: 'Closed-loop trên một hệ',
    featPlatP: 'Ads → lead → hợp đồng → portal ROAS. Không phình HRM hay ERP.',
    featResH: 'Demo 60 phút',
    featResP: 'Không trial 30 ngày. Một buổi với data theo ngành của bạn.',
    bds: 'Bất động sản',
    bdsD: 'Lead dự án tới booking.',
    agency: 'Agency',
    agencyD: 'Nhiều client, portal ROAS, SLA handoff.',
    fnb: 'F&B',
    fnbD: 'Campaign tới đặt chỗ / cửa hàng.',
    education: 'Giáo dục',
    educationD: 'Lead tư vấn tới đăng ký khóa.',
    pharma: 'Pharma',
    pharmaD: 'Lead OTC/DTC gắn campaign.',
    crm: 'CRM',
    crmD: 'Lead, pipeline, CSKH — một nguồn sự thật.',
    ads: 'Ads',
    adsD: 'Meta và Zalo (gói Việt Nam) vào cùng một lead.',
    portal: 'Portal',
    portalD: 'Khách xem CPL/ROAS theo hợp đồng.',
    ai: 'AI',
    aiD: 'Chấm điểm lead, gợi ý bước kế tiếp.',
    news: 'Tin tức',
    events: 'Sự kiện',
    about: 'Về chúng tôi',
    customers: 'Khách hàng',
    hub: 'Tất cả tài nguyên',
  },
  en: {
    solutions: 'Solutions',
    platform: 'Platform',
    pricing: 'Pricing',
    resources: 'Resources',
    login: 'Log in',
    demo: 'Request demo',
    megaSol: 'By industry',
    megaPlat: 'Four modules',
    megaRes: 'Read & contact',
    featSolH: 'Specialized by industry',
    featSolP: 'One platform. Different closing metrics: booking, client ROAS, reservations.',
    featPlatH: 'Closed-loop on one system',
    featPlatP: 'Ads → lead → contract → portal ROAS. Not an HRM or ERP.',
    featResH: '60-minute demo',
    featResP: 'No 30-day trial. One session on your industry data.',
    bds: 'Real estate',
    bdsD: 'Project lead to booking.',
    agency: 'Agency',
    agencyD: 'Multi-client, ROAS portal, handoff SLA.',
    fnb: 'F&B',
    fnbD: 'Campaign to reservation / store CRM.',
    education: 'Education',
    educationD: 'Inquiry lead to enrollment.',
    pharma: 'Pharma',
    pharmaD: 'OTC/DTC leads tied to campaigns.',
    crm: 'CRM',
    crmD: 'Leads, pipeline, care — one source of truth.',
    ads: 'Ads',
    adsD: 'Meta and Google into the same lead record.',
    portal: 'Portal',
    portalD: 'Clients see CPL/ROAS per contract.',
    ai: 'AI',
    aiD: 'Lead score and next-best action.',
    news: 'News',
    events: 'Events',
    about: 'About',
    customers: 'Customers',
    hub: 'All resources',
    markets: 'Markets',
    megaAsean: 'ASEAN playbooks',
    featAseanH: 'Sell across ASEAN',
    featAseanP: 'English playbooks for TH, ID, PH, SG — timezone, WhatsApp, demo prefill.',
    allMarkets: 'All markets',
    partners: 'Partners',
    trust: 'Trust Center',
    security: 'Security pack',
    enterprise: 'Enterprise IT',
    systemStatus: 'System status',
  },
} as const;

export function buildNav(locale: Locale): NavGroup[] {
  const demo = locale === 'en' ? '/en/request-demo' : '/vi/dang-ky-demo';
  if (locale === 'en') {
    const t = COPY.en;
    return [
      {
        id: 'solutions',
        label: t.solutions,
        megaKicker: t.megaSol,
        featured: { title: t.featSolH, body: t.featSolP, cta: t.demo, href: demo },
        items: [
          { id: 'bds', href: '/en/solutions/real-estate', label: t.bds, desc: t.bdsD, icon: 'RE' },
          { id: 'agency', href: '/en/solutions/agency', label: t.agency, desc: t.agencyD, icon: 'AG' },
          { id: 'fnb', href: '/en/solutions/fnb', label: t.fnb, desc: t.fnbD, icon: 'F&B' },
          { id: 'education', href: '/en/solutions/education', label: t.education, desc: t.educationD, icon: 'EDU' },
          { id: 'pharma', href: '/en/solutions/pharma', label: t.pharma, desc: t.pharmaD, icon: 'PH' },
        ],
      },
      {
        id: 'platform',
        label: t.platform,
        megaKicker: t.megaPlat,
        featured: { title: t.featPlatH, body: t.featPlatP, cta: t.demo, href: demo },
        items: [
          { id: 'crm', href: '/en/product/crm', label: t.crm, desc: t.crmD, icon: 'CRM' },
          { id: 'ads', href: '/en/product/ads', label: t.ads, desc: t.adsD, icon: 'ADS' },
          { id: 'portal', href: '/en/product/portal', label: t.portal, desc: t.portalD, icon: 'POR' },
          { id: 'ai', href: '/en/product/ai', label: t.ai, desc: t.aiD, icon: 'AI' },
        ],
      },
      { id: 'pricing', label: t.pricing, href: '/en/pricing' },
      {
        id: 'markets',
        label: t.markets,
        megaKicker: t.megaAsean,
        featured: { title: t.featAseanH, body: t.featAseanP, cta: t.demo, href: demo },
        items: [
          { id: 'hub', href: '/en/markets', label: t.allMarkets },
          { id: 'th', href: '/en/markets/th', label: 'Thailand' },
          { id: 'id', href: '/en/markets/id', label: 'Indonesia' },
          { id: 'ph', href: '/en/markets/ph', label: 'Philippines' },
          { id: 'sg', href: '/en/markets/sg', label: 'Singapore' },
          { id: 'partners', href: '/en/partners', label: t.partners },
        ],
      },
      {
        id: 'resources',
        label: t.resources,
        megaKicker: t.megaRes,
        featured: { title: t.featResH, body: t.featResP, cta: t.demo, href: demo },
        items: [
          { id: 'hub', href: '/en/resources', label: t.hub },
          { id: 'news', href: '/en/news', label: t.news },
          { id: 'events', href: '/en/events', label: t.events },
          { id: 'customers', href: '/en/customers', label: t.customers },
          { id: 'about', href: '/en/about', label: t.about },
          { id: 'trust', href: '/en/trust', label: t.trust },
          { id: 'security', href: '/en/trust/security', label: t.security },
          { id: 'enterprise', href: '/en/trust/enterprise', label: t.enterprise },
          { id: 'status', href: '/en/status', label: t.systemStatus },
          { id: 'demo', href: demo, label: t.demo },
        ],
      },
    ];
  }
  const t = COPY.vi;
  return [
    {
      id: 'solutions',
      label: t.solutions,
      megaKicker: t.megaSol,
      featured: { title: t.featSolH, body: t.featSolP, cta: t.demo, href: demo },
      items: [
        { id: 'bds', href: '/vi/giai-phap/bds', label: t.bds, desc: t.bdsD, icon: 'BĐS' },
        { id: 'agency', href: '/vi/giai-phap/agency', label: t.agency, desc: t.agencyD, icon: 'AG' },
        { id: 'fnb', href: '/vi/giai-phap/fnb', label: t.fnb, desc: t.fnbD, icon: 'F&B' },
        { id: 'education', href: '/vi/giai-phap/education', label: t.education, desc: t.educationD, icon: 'EDU' },
        { id: 'pharma', href: '/vi/giai-phap/pharma', label: t.pharma, desc: t.pharmaD, icon: 'PH' },
      ],
    },
    {
      id: 'platform',
      label: t.platform,
      megaKicker: t.megaPlat,
      featured: { title: t.featPlatH, body: t.featPlatP, cta: t.demo, href: demo },
      items: [
        { id: 'crm', href: '/vi/san-pham/crm', label: t.crm, desc: t.crmD, icon: 'CRM' },
        { id: 'ads', href: '/vi/san-pham/ads', label: t.ads, desc: t.adsD, icon: 'ADS' },
        { id: 'portal', href: '/vi/san-pham/portal', label: t.portal, desc: t.portalD, icon: 'POR' },
        { id: 'ai', href: '/vi/san-pham/ai', label: t.ai, desc: t.aiD, icon: 'AI' },
      ],
    },
    { id: 'pricing', label: t.pricing, href: '/vi/bang-gia' },
    {
      id: 'resources',
      label: t.resources,
      megaKicker: t.megaRes,
      featured: { title: t.featResH, body: t.featResP, cta: t.demo, href: demo },
      items: [
        { id: 'hub', href: '/vi/tai-nguyen', label: t.hub },
        { id: 'news', href: '/vi/tin-tuc', label: t.news },
        { id: 'events', href: '/vi/su-kien', label: t.events },
        { id: 'customers', href: '/vi/khach-hang', label: t.customers },
        { id: 'about', href: '/vi/ve-chung-toi', label: t.about },
        { id: 'demo', href: demo, label: t.demo },
      ],
    },
  ];
}

export function navCopy(locale: Locale) {
  return COPY[locale];
}

export const NAV = buildNav('vi');
