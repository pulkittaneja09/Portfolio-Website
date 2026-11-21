import { m } from 'framer-motion';
import type { ReactNode } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface RevealProps {
  children: ReactNode;
  /** Stagger index — each step delays the reveal by 70ms. */
  index?: number;
  className?: string;
  as?: 'div' | 'li' | 'section' | 'article';
  y?: number;
}

/**
 * The single scroll-reveal primitive for the site: blur 8px to 0 and 24px of
 * travel, on the house easing. One place to change the feel of every entrance.
 *
 * Collapses to a plain element under `prefers-reduced-motion`.
 */
export function Reveal({ children, index = 0, className, as = 'div', y = 24 }: RevealProps) {
  const reduced = useReducedMotion();
  const Component = m[as];

  if (reduced) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }

  return (
    <Component
      className={className}
      initial={{ opacity: 0, y, filter: 'blur(8px)' }}
      // Clear the filter once settled: any `filter` makes this a backdrop root,
      // which would stop glass inside it from blurring what is behind.
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)', transitionEnd: { filter: 'none' } }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{
        duration: 0.7,
        delay: Math.min(index, 8) * 0.07,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </Component>
  );
}
