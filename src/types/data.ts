/**
 * Domain types for the DebridCompare application.
 * Factual data is preserved from the existing JSON files and inline content.
 */

/** A debrid service that appears in pricing/feature/host tables. */
export type ServiceId =
  | 'AllDebrid'
  | 'Real-Debrid'
  | 'TorBox'
  | 'Premiumize'
  | 'Debrid-Link'
  | 'LinkSnappy'
  | 'Mega-Debrid'
  | 'Deepbrid'
  | 'High-Way';

/** Optimized JSON shape produced by scripts/optimize-json.ts */
export interface OptimizedHostsData {
  services: ServiceId[];
  /**
   * Bitmask per host: bit `i` (`1 << i`) is set when `services[i]` supports the host.
   */
  supported: Record<string, number>;
}

/** Flattened host support table - used by components. */
export type HostSupportMatrix = Record<string, Record<ServiceId, boolean>>;

/** Status indicator shown in tables */
export type SupportStatus = 'yes' | 'no';

/** Per-service static info displayed across the UI. */
export interface ServiceInfo {
  id: ServiceId;
  name: string;
  /** Primary website. */
  website: string;
  /** Live status page for supported hosts. */
  statusPage?: string;
  /** Speed-test endpoint. */
  speedTest?: string;
  /** Short tagline. */
  tagline?: string;
  /** True if this service offers a free tier / trial. */
  hasFreeTier?: boolean;
  /** True if this service supports Usenet. */
  hasUsenet?: boolean;
}

/** Pricing row, shared between static pricing table and pricing data. */
export interface PricingRow {
  /** Display label e.g. "30 Days". */
  plan: string;
  /** Per-service cell value. '-' for not offered. */
  cells: Partial<Record<ServiceId, string>>;
  /** True when this row should be visually highlighted. */
  isHighlight?: boolean;
}

/** Policy link entry. */
export interface PolicyRow {
  service: ServiceId;
  terms?: string;
  privacy?: string;
  refund?: string | 'See TOS' | 'See Terms' | 'Check CGV' | 'Not stated';
  support?: string;
}

/** Referral link for support-this-project section. */
export interface ReferralEntry {
  service: ServiceId;
  url: string;
  /** Display text e.g. "From €2.99/month" */
  benefit: string;
}

/** Resource / tool / community entry. */
export interface ResourceEntry {
  name: string;
  url: string;
  description: string;
  tags: string[];
  /** Optional sub-links for resources that have multiple destinations. */
  extraLinks?: Array<{ label: string; url: string }>;
}

/** Grouped resource section. */
export interface ResourceGroup {
  id: string;
  title: string;
  icon: string; // Lucide icon name
  items: ResourceEntry[];
}

/** A status-monitor entry linking to a service's status page. */
export interface StatusEntry {
  service: ServiceId;
  url: string;
  description: string;
}

/** A speed-test endpoint. */
export interface SpeedTestEntry {
  service: ServiceId;
  url: string;
  /** What the service calls it, e.g. "Network Test". */
  label?: string;
}
