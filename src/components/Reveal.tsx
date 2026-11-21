import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface RevealProps {
  children: ReactNode;
  /** Stagger index — each step delays the reveal by 60ms. */
  index?: number;
  className?: string;
  as?: 'div' | 'li' | 'section' | 'article';
  y?: number;
}

/**
 * The single scroll-reveal primitive for the whole site, so timing stays
 * consistent. Collapses to a no-op under `prefers-reduced-motion`.
 */
export function Reveal({ children, index = 0, className, as = 'div', y = 18 }: RevealProps) {
  const reduced = useReducedMotion();
  const Component = motion[as];

  if (reduced) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }

  return (
    <Component
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{
        duration: 0.62,
        delay: Math.min(index, 8) * 0.06,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </Component>
  );
}
