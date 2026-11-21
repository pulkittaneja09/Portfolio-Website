import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from './useReducedMotion';

interface Options {
  to: number;
  durationMs?: number;
  decimals?: number;
  /** Count up only once the element is on screen. */
  start: boolean;
}

/** Eased count-up driven by rAF, so it never fights React's render loop. */
export function useCountUp({ to, durationMs = 1400, decimals = 0, start }: Options): string {
  const reduced = useReducedMotion();
  const [value, setValue] = useState(() => (reduced ? to : 0));
  const frame = useRef(0);

  useEffect(() => {
    if (!start) return;
    if (reduced) {
      setValue(to);
      return;
    }

    const begin = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - begin) / durationMs);
      // easeOutExpo: fast arrival, gentle settle.
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setValue(to * eased);
      if (progress < 1) frame.current = requestAnimationFrame(tick);
    };

    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
  }, [to, durationMs, start, reduced]);

  // Group thousands so 1000 reads as 1,000 mid-count as well as at rest.
  return value.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}
