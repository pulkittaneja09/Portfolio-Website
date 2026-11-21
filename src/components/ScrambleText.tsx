import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/cn';

/** Glyphs the scramble cycles through. Latin only — no symbol soup. */
const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

interface Props {
  text: string;
  className?: string;
  /** Total run time. Kept under 600ms so it reads as a settle, not an effect. */
  durationMs?: number;
  /** Delay before the scramble starts. */
  delayMs?: number;
  as?: 'span' | 'h1' | 'h2' | 'h3';
}

/**
 * Resolves text left to right, each character scrambling briefly before it
 * locks. Runs once, when the element first enters view.
 *
 * The final string is always in the DOM for assistive tech and for anyone
 * with reduced motion — only a visual layer is scrambled, so the heading is
 * never unreadable to a screen reader mid-animation.
 */
export function ScrambleText({ text, className, durationMs = 520, delayMs = 0, as = 'span' }: Props) {
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(reduced ? text : '');
  const ref = useRef<HTMLElement>(null);
  const done = useRef(false);

  useEffect(() => {
    if (reduced) {
      setDisplay(text);
      return;
    }

    const node = ref.current;
    if (!node) return;

    let raf = 0;
    let timer = 0;

    const run = () => {
      const start = performance.now();
      const chars = [...text];

      const tick = (now: number) => {
        const progress = Math.min(1, (now - start) / durationMs);
        // Characters lock in sequence; each gets a short scramble window.
        const locked = progress * chars.length;

        setDisplay(
          chars
            .map((char, i) => {
              if (char === ' ') return ' ';
              if (i < locked - 1) return char;
              if (i > locked + 2) return '';
              return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
            })
            .join(''),
        );

        if (progress < 1) raf = requestAnimationFrame(tick);
        else setDisplay(text);
      };

      raf = requestAnimationFrame(tick);
    };

    if (typeof IntersectionObserver === 'undefined') {
      setDisplay(text);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || done.current) return;
        done.current = true;
        observer.disconnect();
        timer = window.setTimeout(run, delayMs);
      },
      { threshold: 0.4 },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
      window.clearTimeout(timer);
    };
  }, [text, durationMs, delayMs, reduced]);

  const Tag = as;

  return (
    <Tag ref={ref as never} className={cn('inline-block', className)}>
      {/* The real string, always present for assistive tech and selection. */}
      <span className="sr-only">{text}</span>
      <span aria-hidden>{display || ' '}</span>
    </Tag>
  );
}
