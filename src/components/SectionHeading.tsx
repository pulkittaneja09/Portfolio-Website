import type { ReactNode } from 'react';
import { Reveal } from '@/components/Reveal';
import { ScrambleText } from '@/components/ScrambleText';
import { cn } from '@/lib/cn';

interface Props {
  /** Two-digit index shown in the label, e.g. "03". */
  index: string;
  label: string;
  title: ReactNode;
  lede?: ReactNode;
  /** Pulled to the right on wide screens — usually a link or a count. */
  aside?: ReactNode;
  className?: string;
}

/**
 * Shared section header: "03 — PROJECTS" in mono, a hairline, then a large
 * quiet heading. String titles resolve with a short text scramble; anything
 * richer falls back to the blur-to-sharp reveal.
 */
export function SectionHeading({ index, label, title, lede, aside, className }: Props) {
  return (
    <header className={cn('mb-14 sm:mb-20', className)}>
      <Reveal>
        <div className="flex items-center gap-4">
          <span className="label whitespace-nowrap">
            <span className="text-text">{index}</span>
            <span className="mx-2 text-faint">—</span>
            {label}
          </span>
          <span className="h-px flex-1 bg-[var(--border)]" aria-hidden />
        </div>
      </Reveal>

      <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <Reveal index={1} className="max-w-3xl">
          <h2 className="text-display-lg">
            {typeof title === 'string' ? <ScrambleText text={title} /> : title}
          </h2>
          {lede && <p className="prose-body mt-5">{lede}</p>}
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
