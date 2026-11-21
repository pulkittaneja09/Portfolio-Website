import { cn } from '@/lib/cn';

/** Availability pill. The pulsing dot is the only moving part. */
export function StatusBadge({ label, className }: { label: string; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex max-w-full items-center gap-2.5 rounded-full border border-accent/30 bg-accent/[0.06] py-1.5 pl-3 pr-4',
        'font-mono text-[0.625rem] uppercase leading-snug tracking-[0.1em] text-ink/90 sm:text-[0.6875rem] sm:tracking-[0.12em]',
        className,
      )}
    >
      <span className="relative flex h-2 w-2 shrink-0" aria-hidden>
        <span className="absolute inset-0 animate-pulse-dot rounded-full bg-accent" />
        <span className="absolute inset-0 rounded-full bg-accent opacity-40 blur-[3px]" />
      </span>
      {label}
    </span>
  );
}
