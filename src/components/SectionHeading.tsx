import type { ReactNode } from 'react';
import { Reveal } from '@/components/Reveal';
import { cn } from '@/lib/cn';

interface Props {
  /** Two-digit index shown in the eyebrow, e.g. "03". */
  index: string;
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
  /** Pulled to the right on wide screens — usually a link or a count. */
  aside?: ReactNode;
  className?: string;
}

/** Shared section header so every section opens with the same rhythm. */
export function SectionHeading({ index, eyebrow, title, lede, aside, className }: Props) {
  return (
    <header className={cn('mb-12 sm:mb-16', className)}>
      <Reveal>
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-[0.6875rem] tracking-[0.2em] text-accent">{index}</span>
          <span className="eyebrow">{eyebrow}</span>
          <span className="h-px flex-1 bg-line" aria-hidden />
        </div>
      </Reveal>

      <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <Reveal index={1} className="max-w-2xl">
          <h2 className="font-display text-display-md">{title}</h2>
          {lede && <p className="mt-3 max-w-xl text-pretty leading-relaxed text-muted">{lede}</p>}
        </Reveal>

        {aside && (
          <Reveal index={2} className="shrink-0">
            {aside}
          </Reveal>
        )}
      </div>
    </header>
  );
}
