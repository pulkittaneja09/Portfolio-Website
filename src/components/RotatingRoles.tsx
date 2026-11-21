import { AnimatePresence, m } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface Props {
  roles: string[];
  intervalMs?: number;
}

/**
 * Cycles the role line under the tagline. Under reduced motion it renders the
 * roles as a static, comma-separated list instead of moving.
 */
export function RotatingRoles({ roles, intervalMs = 2600 }: Props) {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduced || roles.length < 2) return;
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % roles.length), intervalMs);
    return () => window.clearInterval(timer);
  }, [reduced, roles.length, intervalMs]);

  if (reduced) {
    return (
      <p className="font-mono text-sm text-muted">
        {roles.join(' · ')}
      </p>
    );
  }

  return (
    <div className="flex items-center gap-2.5 font-mono text-sm text-muted">
      <span className="text-accent" aria-hidden>
        ▸
      </span>
      {/* The live region announces each role once for screen readers. */}
      <span className="relative block h-6 overflow-hidden" aria-live="polite" aria-atomic="true">
        <AnimatePresence mode="wait" initial={false}>
          <m.span
            key={roles[index]}
            className="block whitespace-nowrap"
            initial={{ y: 22, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -22, opacity: 0 }}
            transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
          >
            {roles[index]}
          </m.span>
        </AnimatePresence>
      </span>
    </div>
  );
}
