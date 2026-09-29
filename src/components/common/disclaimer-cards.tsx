import {
  AlertTriangle,
  Banknote,
  Check,
  FileText,
  Heart,
  Scale,
  type LucideIcon,
} from 'lucide-react';

interface DisclaimerItem {
  icon: LucideIcon;
  title: string;
  body: string;
}

const ITEMS: DisclaimerItem[] = [
  {
    icon: FileText,
    title: 'Services change frequently',
    body: 'Pricing, host support, refund policies, and features may be updated without notice. Always verify details on the official service websites before purchasing.',
  },
  {
    icon: Banknote,
    title: 'Final cost may vary',
    body: 'Displayed prices are subject to exchange rates, regional taxes, or payment processing fees. Your actual charge may differ slightly.',
  },
  {
    icon: Check,
    title: 'Data accuracy',
    body: 'While we strive for completeness, this comparison reflects community reports and public information. We do not guarantee uptime, speed, download success, or feature availability.',
  },
  {
    icon: Heart,
    title: 'No affiliation',
    body: 'This project is independent and not affiliated with any listed service.',
  },
  {
    icon: AlertTriangle,
    title: 'Use at your own discretion',
    body: 'Choosing a debrid service involves personal judgment. Test short-term plans first and review terms carefully.',
  },
  {
    icon: Scale,
    title: 'Legal responsibility',
    body: 'Debrid services are tools. You are responsible for complying with copyright laws and terms of use when accessing content.',
  },
];

export function DisclaimerCards() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {ITEMS.map(({ icon: Icon, title, body }) => (
        <article
          key={title}
          className="rounded-lg border border-border bg-card p-4"
        >
          <Icon
            className="h-4 w-4 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
          <h3 className="mt-3 text-sm font-semibold leading-tight tracking-tight text-foreground">
            {title}
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            {body}
          </p>
        </article>
      ))}
    </div>
  );
}
