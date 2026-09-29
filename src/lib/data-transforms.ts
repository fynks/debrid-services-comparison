import type {
  HostSupportMatrix,
  OptimizedHostsData,
  ServiceId,
} from '@/types/data';

/**
 * Convert the optimized indexed JSON to a flat
 * `{ hostName: { service: boolean } }` matrix used by the UI.
 */
export function toSupportMatrix(data: OptimizedHostsData): HostSupportMatrix {
  const services = data.services;
  const matrix: HostSupportMatrix = {};
  for (const [host, indices] of Object.entries(data.supported)) {
    const row: Record<ServiceId, boolean> = {} as Record<ServiceId, boolean>;
    for (const service of services) {
      row[service] = false;
    }
    for (const idx of indices) {
      const service = services[idx];
      if (service) row[service] = true;
    }
    matrix[host] = row;
  }
  return matrix;
}

export interface ServiceHostStats {
  service: ServiceId;
  supported: number;
  total: number;
  percent: number;
}

/** Per-service supported-host counts. */
export function serviceStats(matrix: HostSupportMatrix): ServiceHostStats[] {
  const total = Object.keys(matrix).length;
  const byService = new Map<ServiceId, number>();
  for (const row of Object.values(matrix)) {
    for (const [service, supported] of Object.entries(row)) {
      if (!supported) continue;
      byService.set(service as ServiceId, (byService.get(service as ServiceId) ?? 0) + 1);
    }
  }
  return Array.from(byService.entries())
    .map(([service, supported]) => ({
      service,
      supported,
      total,
      percent: total === 0 ? 0 : Math.round((supported / total) * 100),
    }))
    .sort((a, b) => b.supported - a.supported);
}
