import { LazyMotion } from 'framer-motion';
import type { ReactNode } from 'react';

/** The animation features arrive in their own chunk (lib/motionFeatures.ts). */
const loadFeatures = () => import('@/lib/motionFeatures').then((module) => module.default);

/**
 * Framer Motion's provider, mounted only inside the code that animates: the
 * overlays, the toast list and the desktop project stack, all lazy chunks.
 * The home page's critical path therefore carries no animation library at
 * all. LazyMotion + `m` (not `motion`) loads just the DOM feature set, and
 * `strict` makes a stray `motion.*` import throw in development.
 */
export function MotionRoot({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      {children}
    </LazyMotion>
  );
}
