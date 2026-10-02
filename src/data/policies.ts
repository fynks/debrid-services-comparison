import type { PolicyRow, ServiceId } from '@/types/data';

/** Official policy, refund, and support destinations checked on 2026-10-02. */
export const POLICY_ROWS: PolicyRow[] = [
  {
    service: 'AllDebrid',
    terms: 'https://alldebrid.com/tos/',
    termsLabel: 'Terms',
    privacy: 'https://alldebrid.com/privacy/',
    privacyLabel: 'Privacy',
    refund: 'https://alldebrid.com/tos/',
    refundLabel: 'Within 14 days if no data was downloaded',
    support: 'https://alldebrid.com/contact/',
    supportLabel: 'Contact',
  },
  {
    service: 'Real-Debrid',
    terms: 'https://real-debrid.com/terms',
    termsLabel: 'Terms',
    privacy: 'https://real-debrid.com/privacy',
    privacyLabel: 'Privacy',
    refund: 'https://real-debrid.com/terms',
    refundLabel: 'Unused accounts: up to 7 days',
    support: 'https://real-debrid.com/support',
    supportLabel: 'Support',
  },
  {
    service: 'LinkSnappy',
    terms: 'https://linksnappy.com/tos',
    termsLabel: 'Terms',
    privacy: 'https://linksnappy.com/privacy-policy',
    privacyLabel: 'Privacy',
    refund: 'https://linksnappy.com/refund-policy',
    refundLabel: 'Refund policy',
    support: 'https://support.linksnappy.com/support/tickets/new',
    supportLabel: 'Support',
  },
  {
    service: 'TorBox',
    terms: 'https://torbox.app/policies/terms',
    termsLabel: 'Current Terms',
    privacy: 'https://torbox.app/policies/privacy',
    privacyLabel: 'Current Privacy Policy',
    refund: 'https://torbox.app/policies/terms',
    refundLabel: 'Terms / refund provisions',
    support: 'https://support.torbox.app/',
    supportLabel: 'Support',
  },
  {
    service: 'Debrid-Link',
    terms: 'https://debrid-link.com/tos',
    termsLabel: 'Terms',
    privacy: 'https://debrid-link.com/privacy',
    privacyLabel: 'Privacy',
    refund: 'https://debrid-link.com/tos',
    refundLabel: 'Unused accounts: up to 14 days',
    support: 'https://debrid-link.com/contact',
    supportLabel: 'Contact',
  },
  {
    service: 'Premiumize',
    terms: 'https://www.premiumize.me/legal#tos',
    termsLabel: 'Legal',
    privacy: 'https://www.premiumize.me/privacy',
    privacyLabel: 'Privacy',
    refund: 'https://www.premiumize.me/legal#refund',
    refundLabel: 'Refund terms',
    support: 'https://www.premiumize.me/help',
    supportLabel: 'Help',
  },
  {
    service: 'Mega-Debrid',
    terms:
      'https://www.mega-debrid.eu/index.php?page=conditionsutilisation&lang=en',
    termsLabel: 'Conditions',
    privacy: 'https://www.mega-debrid.eu/index.php?page=privacy',
    privacyLabel: 'Privacy',
    refund: 'No public refund terms verified',
    refundLabel: 'No public refund terms verified',
    support: 'https://help.mega-debrid.eu/',
    supportLabel: 'Help',
  },
  {
    service: 'Deepbrid',
    terms: 'https://www.deepbrid.com/page/terms',
    termsLabel: 'Terms',
    privacy: 'https://www.deepbrid.com/page/privacy',
    privacyLabel: 'Privacy',
    refund: 'https://www.deepbrid.com/page/refund-policy',
    refundLabel: 'Refund policy',
    support: 'https://www.deepbrid.com/helpdesk',
    supportLabel: 'Helpdesk (login required)',
  },
  {
    service: 'High-Way',
    terms: 'https://high-way.me/help/terms',
    termsLabel: 'Terms',
    privacy: 'https://high-way.me/help/privacy-policy',
    privacyLabel: 'Privacy',
    refund: 'https://high-way.me/help/widerrufsbelehrung/',
    refundLabel: '14-day withdrawal information',
    support: 'https://high-way.me/help/contact/',
    supportLabel: 'Contact',
  },
];

export const POLICY_SERVICES: ServiceId[] = POLICY_ROWS.map((r) => r.service);

/** Usenet support - preserved from the original `index.html` usenet table. */
export const USENET_SUPPORT: Array<{ service: ServiceId; supported: boolean }> = [
  { service: 'AllDebrid', supported: false },
  { service: 'TorBox', supported: true },
  { service: 'Premiumize', supported: true },
  { service: 'Real-Debrid', supported: false },
  { service: 'Debrid-Link', supported: false },
  { service: 'LinkSnappy', supported: false },
  { service: 'Mega-Debrid', supported: false },
  { service: 'Deepbrid', supported: true },
  { service: 'High-Way', supported: false },
];

export const STATUS_LINKS: Array<{
  service: ServiceId;
  url: string;
  description: string;
}> = [
  {
    service: 'AllDebrid',
    url: 'https://alldebrid.com/status/',
    description: 'View live status and supported hosts',
  },
  {
    service: 'Real-Debrid',
    url: 'https://real-debrid.com/compare',
    description: 'Check service status and host comparison',
  },
  {
    service: 'TorBox',
    url: 'https://torbox.app/hosters',
    description: 'View supported hosters and status',
  },
  {
    service: 'Premiumize',
    url: 'https://www.premiumize.me/services',
    description: 'Check service availability and features',
  },
  {
    service: 'LinkSnappy',
    url: 'https://linksnappy.com/myaccount/status',
    description: 'Monitor service status and hosts',
  },
  {
    service: 'Debrid-Link',
    url: 'https://debrid-link.com/webapp/status',
    description: 'View current status and host list',
  },
  {
    service: 'Mega-Debrid',
    url: 'https://www.mega-debrid.eu/index.php?page=hebergeurs',
    description: 'Check supported file hosts',
  },
];

export const SPEED_TEST_LINKS: Array<{
  service: ServiceId;
  url: string;
  label?: string;
}> = [
  { service: 'Real-Debrid', url: 'https://real-debrid.com/speedtest' },
  { service: 'Premiumize', url: 'https://www.premiumize.me/speedtest' },
  { service: 'TorBox', url: 'https://www.torbox.app/speedtest' },
  { service: 'Debrid-Link', url: 'https://debrid-link.com/webapp/speedtest' },
  {
    service: 'Mega-Debrid',
    url: 'https://www.mega-debrid.eu/index.php?page=network',
    label: 'Network Test',
  },
];
