import type { PricingRow, ServiceId } from '@/types/data';

export const PRICING_SERVICES: ServiceId[] = [
  'AllDebrid',
  'Premiumize',
  'Real-Debrid',
  'TorBox',
  'Debrid-Link',
  'LinkSnappy',
  'Mega-Debrid',
  'Deepbrid',
  'High-Way',
];

export const PRICING_ROWS: PricingRow[] = [
  {
    plan: 'Free / Trial',
    cells: {
      AllDebrid: '7-day trial (SMS required)',
      TorBox: 'Free tier',
      Deepbrid: 'Limited hosts only',
      'High-Way': 'Limited hosts',
    },
  },
  {
    plan: '7 Days',
    cells: {
      LinkSnappy: '$4.99 USD',
    },
  },
  {
    plan: '14 Days',
    cells: {
      Deepbrid: '€4.50',
    },
  },
  {
    plan: '15 Days',
    cells: {
      AllDebrid: '€2.99 (one-time)',
      'Real-Debrid': '€3.00',
      'Debrid-Link': '€3.00',
    },
  },
  {
    plan: '30 Days',
    cells: {
      AllDebrid: '€2.99 recurring / €3.99 one-time',
      Premiumize: '€9.99 / US$11.99',
      'Real-Debrid': '€4.00',
      TorBox: 'Essential $3 / Standard $5 / Pro $10',
      'Debrid-Link': '€4.00',
      LinkSnappy: '$12.99 USD',
      'Mega-Debrid': '€4.00',
      Deepbrid: '€4.99',
      'High-Way': 'Premium €5.99 / Unlimited €9.99',
    },
    isHighlight: true,
  },
  {
    plan: '90 Days',
    cells: {
      AllDebrid: '€8.99 (one-time)',
      'Real-Debrid': '€9.00',
      'Debrid-Link': '€9.00',
      LinkSnappy: '$29.99 USD',
      'Mega-Debrid': '€9.00',
      Deepbrid: '€12.99',
      'High-Way': 'Premium €15.99 / Unlimited €24.99',
    },
  },
  {
    plan: '180 Days',
    cells: {
      AllDebrid: '€15.99 (one-time)',
      'Real-Debrid': '€16.00',
      'Debrid-Link': '€16.00',
      LinkSnappy: '$54.99 USD',
      'Mega-Debrid': '€16.00',
      Deepbrid: '€19.99',
      'High-Way': 'Premium €29.99 / Unlimited €44.99',
    },
  },
  {
    plan: '300 Days',
    cells: {
      AllDebrid: '€24.99 (one-time)',
      'Debrid-Link': '€25.00',
    },
  },
  {
    plan: '365 Days / 1 Year',
    cells: {
      Premiumize: '€69.99 / US$79.99 (€5.75 / US$6.57 per month)',
      Deepbrid: '€32.99',
      'High-Way': 'Premium €47.99 / Unlimited €71.99',
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
    benefit: 'Previously listed: €3 / 15 days',
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
