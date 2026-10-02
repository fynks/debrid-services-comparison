import type { PricingRow, ServiceId } from '@/types/data';

/**
 * Public prices verified against official provider pages on 2026-10-02.
 * Omitted cells mean no current public price was verified for that exact term;
 * they do not imply that a service or plan is unavailable.
 */

export const PRICING_SERVICES: ServiceId[] = [
  'AllDebrid',
  'Premiumize',
  'Real-Debrid',
  'TorBox',
  'Debrid-Link',
  'LinkSnappy',
  'Mega-Debrid',
  'Deepbrid',
];

export const PRICING_ROWS: PricingRow[] = [
  {
    plan: 'Free / Trial',
    cells: {
      AllDebrid: '7-day trial (SMS required)',
      TorBox: 'Free plan ($0/mo)',
      Deepbrid: 'Limited Hosts',
    },
  },
  {
    plan: '7 Days',
    cells: {
      LinkSnappy: '$4.99 USD',
    },
  },
  {
    plan: '15 Days',
    cells: {
      AllDebrid: '€2.99 (one-time)',
      'Debrid-Link': '€3',
    },
  },
  {
    plan: '30 Days',
    cells: {
      AllDebrid: '€2.99 / 30d recurring · €3.99 one-time',
      Premiumize: '€9.99 / US$11.99',
      TorBox: 'Essential $3 / Standard $5 / Pro $10 per month',
      'Debrid-Link': '€4',
      LinkSnappy: '$12.99 USD',
      'Mega-Debrid': '€4',
      Deepbrid: '€4.99',
    },
    isHighlight: true,
  },
  {
    plan: '90 Days',
    cells: {
      AllDebrid: '€8.99 (one-time)',
      'Debrid-Link': '€9',
      LinkSnappy: '$29.99 USD',
      'Mega-Debrid': '€9',
      Deepbrid: '€12.99',
    },
  },
  {
    plan: '180 Days',
    cells: {
      AllDebrid: '€15.99 (one-time)',
      'Debrid-Link': '€16',
      LinkSnappy: '$54.99 USD',
      'Mega-Debrid': '€16',
      Deepbrid: '€19.99',
    },
  },
  {
    plan: '300 Days',
    cells: {
      AllDebrid: '€24.99 (one-time)',
      'Debrid-Link': '€25',
    },
  },
  {
    plan: '365 Days',
    cells: {
      Premiumize: '€69.99 / US$79.99',
      Deepbrid: '€32.99',
    },
  },
];

export const REFERRAL_LINKS: Array<{
  service: ServiceId;
  url: string;
  benefit: string;
}> = [
  {
    service: 'AllDebrid',
    url: 'https://alldebrid.com/?uid=3wvya&lang=en',
    benefit: '€2.99 / 30 days recurring',
  },
  {
    service: 'Real-Debrid',
    url: 'https://real-debrid.com/?id=10990901',
    benefit: 'Price not verified',
  },
  {
    service: 'LinkSnappy',
    url: 'https://linksnappy.com/?ref=774668',
    benefit: '$4.99 / 7 days',
  },
  {
    service: 'Debrid-Link',
    url: 'https://debrid-link.com/id/7B3BO',
    benefit: '€3 / 15 days',
  },
  {
    service: 'Deepbrid',
    url: 'https://www.deepbrid.com/aff/go/upward1971',
    benefit: '€4.99 / 30 days',
  },
];
