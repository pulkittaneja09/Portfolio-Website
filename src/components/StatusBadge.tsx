import { cn } from '@/lib/cn';

/**
 * Availability pill. The dot pulses in opacity only — white, no colour, no
 * glow, no halo. It is the single moving element in the hero's first frame.
 */
export function StatusBadge({ label, className }: { label: string; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex max-w-full items-center gap-2.5 rounded-full border border-[var(--border)] py-1.5 pl-3 pr-3.5',
        'font-mono text-[0.6875rem] leading-snug tracking-[0.06em] text-muted',
        className,
      )}
      style={{ background: 'var(--surface)' }}
    >
      <span className="relative flex h-1.5 w-1.5 shrink-0" aria-hidden>
        <span className="soft-pulse absolute inset-0 rounded-full bg-light" />
      </span>
      {label}
    </span>
  );
}
