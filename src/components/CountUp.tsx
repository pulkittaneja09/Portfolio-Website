import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const DURATION_MS = 1100;
const NUMBER = /\d[\d,]*(?:\.\d+)?/;
/** An HTTP status ("403 before retrieval") is a label, not a quantity. */
const STATUS = /^[1-5]\d\d(?=\s+[A-Za-z])/;

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Counts the first number in `value` up from zero the first time it scrolls
 * into view, keeping its prefix, suffix, decimals and thousands separators
 * ("R² = 0.879", "1,000+", "97.9% test accuracy"). Values without a number,
 * HTTP statuses and reduced motion render as written. Screen readers always
 * get the final text.
 */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const match = STATUS.test(value) ? null : NUMBER.exec(value);
  const animate = Boolean(match) && !reduced;
  const [progress, setProgress] = useState(animate ? 0 : 1);

  useEffect(() => {
    const node = ref.current;
    if (!animate || !node || typeof IntersectionObserver === 'undefined') {
      setProgress(1);
      return;
    }
    let raf = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / DURATION_MS);
          setProgress(easeOut(t));
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    observer.observe(node);
    // Printing shows the final figures.
    const onPrint = () => setProgress(1);
    window.addEventListener('beforeprint', onPrint);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener('beforeprint', onPrint);
    };
  }, [animate]);

  let shown = value;
  if (match && progress < 1) {
    const raw = match[0];
    const target = Number(raw.replace(/,/g, ''));
    const decimals = raw.split('.')[1]?.length ?? 0;
    const current = (target * progress).toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
      useGrouping: raw.includes(','),
    });
    shown = value.slice(0, match.index) + current + value.slice(match.index + raw.length);
  }

  return (
    <span ref={ref} className={className}>
      <span aria-hidden className="tabular-nums">
        {shown}
      </span>
      <span className="sr-only">{value}</span>
    </span>
  );
}
