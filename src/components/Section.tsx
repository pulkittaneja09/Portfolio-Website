import type { ReactNode } from 'react';
import { SectionLabel } from '@/components/SectionLabel';
import { SectionRule } from '@/components/SectionRule';
import { cn } from '@/lib/cn';

interface Props {
  id: string;
  label: string;
  children: ReactNode;
  className?: string;
}

/**
 * One section of the right-hand column: a plain mono label, then content.
 * The same rhythm everywhere, so the column scans top to bottom.
 */
export function Section({ id, label, children, className }: Props) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-label`}
      className={cn('section-anchor relative mb-24 lg:mb-28', className)}
    >
      {/* Every section but the first gets a divider in the gap above it. */}
      {id !== 'about' && <SectionRule />}
      <SectionLabel id={`${id}-label`} className="mb-8 text-strong">
        {label}
      </SectionLabel>
      {children}
    </section>
  );
}
