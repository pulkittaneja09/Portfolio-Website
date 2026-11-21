import { useEffect, useRef } from 'react';
import type { CSSProperties, ElementType, ReactNode } from 'react';
import { observeReveal } from '@/lib/reveal';

interface RevealProps {
  children: ReactNode;
  /** Stagger index — each step delays the entrance by 60ms. */
  index?: number;
  className?: string;
  as?: ElementType;
}

/**
 * Fades an element up 12px as it scrolls into view, once. Visible by default:
 * see `lib/reveal.ts` for why this can never leave content hidden.
 */
export function Reveal({ children, index = 0, className, as: Tag = 'div' }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => observeReveal(ref.current), []);

  return (
    <Tag ref={ref} className={className} style={{ '--i': index } as CSSProperties}>
      {children}
    </Tag>
  );
}
