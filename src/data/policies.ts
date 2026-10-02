import type { PolicyRow, ServiceId } from '@/types/data';

/** Official policy, refund, and support destinations checked on 2026-10-02. */
export const POLICY_ROWS: PolicyRow[] = [
  {
    service: 'AllDebrid',
    terms: 'https://alldebrid.com/tos/',
    privacy: 'https://alldebrid.com/privacy/',
    refund: 'https://alldebrid.com/tos/',
    support: 'https://alldebrid.com/contact/',
  },
  {
    service: 'Real-Debrid',
    terms: 'https://real-debrid.com/terms',
    privacy: 'https://real-debrid.com/privacy',
    refund: 'https://real-debrid.com/terms',
    support: 'https://real-debrid.com/support',
  },
  {
    service: 'LinkSnappy',
    terms: 'https://linksnappy.com/tos',
    privacy: 'https://linksnappy.com/privacy-policy',
    refund: 'https://linksnappy.com/refund-policy',
    support: 'https://support.linksnappy.com/support/tickets/new',
  },
  {
    service: 'TorBox',
    terms: 'https://torbox.app/policies/terms',
    privacy: 'https://torbox.app/policies/privacy',
    refund: 'https://torbox.app/policies/terms',
    support: 'https://support.torbox.app/',
  },
  {
    service: 'Debrid-Link',
    terms: 'https://debrid-link.com/tos',
    privacy: 'https://debrid-link.com/privacy',
    refund: 'https://debrid-link.com/tos',
    support: 'https://debrid-link.com/contact',
  },
  {
    service: 'Premiumize',
    terms: 'https://www.premiumize.me/legal#tos',
    privacy: 'https://www.premiumize.me/privacy',
    refund: 'https://www.premiumize.me/legal#refund',
    support: 'https://www.premiumize.me/help',
  },
  {
    service: 'Mega-Debrid',
    terms:
      'https://www.mega-debrid.eu/index.php?page=conditionsutilisation&lang=en',
    privacy: 'https://www.mega-debrid.eu/index.php?page=privacy',
    refund: 'No public refund terms verified',
    support: 'https://help.mega-debrid.eu/',
  },
  {
    service: 'Deepbrid',
    terms: 'https://www.deepbrid.com/page/terms',
    privacy: 'https://www.deepbrid.com/page/privacy',
    refund: 'https://www.deepbrid.com/page/refund-policy',
    support: 'https://www.deepbrid.com/helpdesk',
  },
  {
    service: 'High-Way',
    terms: 'https://high-way.me/help/terms',
    privacy: 'https://high-way.me/help/privacy-policy',
    refund: 'https://high-way.me/help/widerrufsbelehrung/',
    support: 'https://high-way.me/help/contact/',
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
