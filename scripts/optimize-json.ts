// Build-time JSON optimizer for host support matrices.
//
// Converts verbose per-host `{ [service]: "✅" | "❌" }` dictionaries in
// `data/*.json` into compact indexed `{ services, supported }` payloads in
// `src/json/*-optimized.json`.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve, basename, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SERVICES, SERVICE_ORDER } from '../src/data/services.ts';
import type { OptimizedHostsData, ServiceId } from '../src/types/data.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, '..');

/** Known aliases in raw source files mapped to canonical ServiceId. */
const SERVICE_ALIASES: Record<string, ServiceId> = {
  RealDebrid: 'Real-Debrid',
};

export interface OptimizeResult {
  inputPath: string;
  outputPath: string;
  hostCount: number;
  serviceCount: number;
  totalSupported: number;
  originalBytes: number;
  optimizedBytes: number;
  reductionPercent: number;
  updated: boolean;
}

export const DEFAULT_TARGETS: Array<{ input: string; output: string }> = [
  {
    input: resolve(ROOT, 'data/file-hosts.json'),
    output: resolve(ROOT, 'src/json/file-hosts-optimized.json'),
  },
  {
    input: resolve(ROOT, 'data/adult-hosts.json'),
    output: resolve(ROOT, 'src/json/adult-hosts-optimized.json'),
  },
];

function resolveServiceId(rawName: string, sourceFile: string): ServiceId {
  const canonical = (SERVICE_ALIASES[rawName] ?? rawName) as ServiceId;
  if (!(canonical in SERVICES)) {
    throw new Error(
      `Unknown service "${rawName}" in ${sourceFile}. Expected one of: ${SERVICE_ORDER.join(', ')}`
    );
  }
  return canonical;
}

export function optimizeHostsFile(
  inputPath: string,
  outputPath: string,
  { quiet = false }: { quiet?: boolean } = {}
): OptimizeResult {
  const rawContent = readFileSync(inputPath, 'utf8');
  const rawData = JSON.parse(rawContent) as Record<
    string,
    Record<string, string | boolean | number>
  >;

  const discoveredServices = new Set<ServiceId>();
  for (const hostData of Object.values(rawData)) {
    for (const key of Object.keys(hostData)) {
      discoveredServices.add(resolveServiceId(key, inputPath));
    }
  }

  // Order services by canonical SERVICE_ORDER first, followed by any extras.
  const services: ServiceId[] = [
    ...SERVICE_ORDER.filter((s) => discoveredServices.has(s)),
    ...[...discoveredServices].filter((s) => !SERVICE_ORDER.includes(s)).sort(),
  ];

  const serviceToIndex = new Map<ServiceId, number>(
    services.map((s, idx) => [s, idx])
  );

  // Pre-sort hosts using localeCompare so default ascending order is baked in.
  const sortedHosts = Object.keys(rawData).sort((a, b) => a.localeCompare(b));

  const supported: Record<string, number> = {};
  let totalSupported = 0;

  for (const host of sortedHosts) {
    const hostData = rawData[host];
    let mask = 0;
    for (const [rawService, value] of Object.entries(hostData)) {
      if (value === '✅' || value === true || value === 1) {
        const serviceId = resolveServiceId(rawService, inputPath);
        const idx = serviceToIndex.get(serviceId);
        if (idx !== undefined) {
          mask |= 1 << idx;
          totalSupported++;
        }
      }
    }
    supported[host] = mask;
  }

  const outputData: OptimizedHostsData = {
    services,
    supported,
  };

  const serialized = JSON.stringify(outputData);
  const outDir = dirname(outputPath);
  if (!existsSync(outDir)) {
    mkdirSync(outDir, { recursive: true });
  }

  const existing = existsSync(outputPath)
    ? readFileSync(outputPath, 'utf8')
    : null;
  const updated = existing !== serialized;
  if (updated) {
    writeFileSync(outputPath, serialized, 'utf8');
  }

  const originalBytes = Buffer.byteLength(rawContent, 'utf8');
  const optimizedBytes = Buffer.byteLength(serialized, 'utf8');
  const reductionPercent =
    originalBytes > 0
      ? Number((((originalBytes - optimizedBytes) / originalBytes) * 100).toFixed(1))
      : 0;

  if (!quiet) {
    const status = updated ? 'wrote' : 'up-to-date';
    console.log(
      `[optimize-json] ${basename(inputPath)} → ${basename(outputPath)} (${status}): ` +
        `${sortedHosts.length} hosts, ${services.length} services, ` +
        `${originalBytes.toLocaleString()}B → ${optimizedBytes.toLocaleString()}B (-${reductionPercent}%)`
    );
  }

  return {
    inputPath,
    outputPath,
    hostCount: sortedHosts.length,
    serviceCount: services.length,
    totalSupported,
    originalBytes,
    optimizedBytes,
    reductionPercent,
    updated,
  };
}

export function optimizeAllHosts(options: { quiet?: boolean } = {}): OptimizeResult[] {
  return DEFAULT_TARGETS.map(({ input, output }) =>
    optimizeHostsFile(input, output, options)
  );
}

// Run as CLI when executed directly.
const isDirectRun =
  process.argv[1] &&
  resolve(process.argv[1]) === __filename;

if (isDirectRun) {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    optimizeAllHosts();
  } else {
    const inputPath = resolve(process.cwd(), args[0]);
    const defaultOutput = (() => {
      const ext = extname(inputPath) || '.json';
      const base = basename(inputPath, ext);
      return resolve(process.cwd(), `${base}-optimized${ext}`);
    })();
    const outputPath = args[1] ? resolve(process.cwd(), args[1]) : defaultOutput;
    optimizeHostsFile(inputPath, outputPath);
  }
}
