import type { PricingRow, ServiceId } from '@/types/data';

/**
 * Pricing table content copied verbatim from the original index.html
 * pricing table. Currency symbols are preserved exactly as displayed
 * historically (€ for EUR, $ for USD).
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
      AllDebrid: '7 days*',
      TorBox: 'Free tier',
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
      AllDebrid: '€2.99',
      'Real-Debrid': '€3',
      'Debrid-Link': '€3',
      Deepbrid: '€4.50',
    },
  },
  {
    plan: '30 Days',
    cells: {
      AllDebrid: '€2.99/mo (Recur) / €3.99 (One-time)',
      Premiumize: '€9.99',
      'Real-Debrid': '€4',
      TorBox: 'Essential $3 / Standard $5 / Pro $10',
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
      AllDebrid: '€8.99 (One-time)',
      Premiumize: '$29.99',
      'Real-Debrid': '€9',
      'Debrid-Link': '€9',
      LinkSnappy: '$29.99 USD',
      'Mega-Debrid': '€9',
      Deepbrid: '€12.99',
    },
  },
  {
    plan: '180 Days',
    cells: {
      AllDebrid: '€15.99 (One-time)',
      'Real-Debrid': '€16',
      'Debrid-Link': '€16',
      LinkSnappy: '$54.99',
      'Mega-Debrid': '€16',
      Deepbrid: '€19.99',
    },
  },
  {
    plan: '300 Days',
    cells: {
      AllDebrid: '€24.99 (One-time)',
      'Debrid-Link': '€25',
    },
  },
  {
    plan: '365 Days',
    cells: {
      Premiumize: '€69.99',
      TorBox: 'Essential $33 / Pro $110',
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
    benefit: 'From €2.99/month',
  },
  {
    service: 'Real-Debrid',
    url: 'https://real-debrid.com/?id=10990901',
    benefit: 'From €3/month',
  },
  {
    service: 'LinkSnappy',
    url: 'https://linksnappy.com/?ref=774668',
    benefit: 'From $12.99/month',
  },
  {
    service: 'Debrid-Link',
    url: 'https://debrid-link.com/id/7B3BO',
    benefit: 'From €3/month',
  },
  {
    service: 'Deepbrid',
    url: 'https://www.deepbrid.com/aff/go/upward1971',
    benefit: 'From €4.50/month',
  },
];
