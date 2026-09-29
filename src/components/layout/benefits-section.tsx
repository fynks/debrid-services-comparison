import { Gauge, Link2, Lock, PackageOpen } from 'lucide-react';

const BENEFITS = [
  {
    icon: Gauge,
    title: 'Maximum download speeds',
    description: 'Bypass host throttling with direct, high-bandwidth links.',
  },
  {
    icon: Link2,
    title: 'Multi-host access',
    description: 'A single subscription unlocks hundreds of supported hosts.',
  },
  {
    icon: PackageOpen,
    title: 'Torrent-to-link conversion',
    description: 'Drop a magnet or torrent and receive a direct URL.',
  },
  {
    icon: Lock,
    title: 'Ad-free experience',
    description: 'No popups, countdowns, or captchas on supported hosts.',
  },
];

export function BenefitsSection() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
      {BENEFITS.map(({ icon: Icon, title, description }) => (
        <div
          key={title}
          className="rounded-lg border border-border bg-card p-4"
        >
          <span
            aria-hidden="true"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-muted text-foreground"
          >
            <Icon className="h-4 w-4" />
          </span>
          <h3 className="mt-3 text-sm font-semibold leading-tight tracking-tight text-foreground">
            {title}
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>
      ))}
    </div>
  );
}
