import { useEffect, useRef, useState } from 'react';
import { useIsDesktopPointer } from '@/hooks/useMediaQuery';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * Two-part cursor: an instant dot and a trailing ring that swells over
 * interactive elements. Desktop pointers only, and never under reduced motion.
 *
 * Positions are written straight to the DOM in a rAF loop — putting the cursor
 * in React state would re-render the tree on every mouse move.
 */
export function CustomCursor() {
  const isDesktop = useIsDesktopPointer();
  const reduced = useReducedMotion();
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  const enabled = isDesktop && !reduced;

  useEffect(() => {
    if (!enabled) return;

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const trail = { ...target };
    let hovering = false;
    let frame = 0;

    const onMove = (event: MouseEvent) => {
      target.x = event.clientX;
      target.y = event.clientY;
      setVisible(true);

      const element = event.target as HTMLElement | null;
      hovering = Boolean(element?.closest('a, button, [role="button"], input, textarea, summary'));
    };

    const onLeave = () => setVisible(false);

    const tick = () => {
      trail.x += (target.x - trail.x) * 0.16;
      trail.y += (target.y - trail.y) * 0.16;

      if (dot.current) {
        dot.current.style.transform = `translate3d(${target.x}px, ${target.y}px, 0) translate(-50%, -50%)`;
      }
      if (ring.current) {
        ring.current.style.transform = `translate3d(${trail.x}px, ${trail.y}px, 0) translate(-50%, -50%) scale(${hovering ? 1.9 : 1})`;
        ring.current.style.opacity = hovering ? '0.95' : '0.5';
      }

      frame = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    frame = requestAnimationFrame(tick);
    document.documentElement.classList.add('has-custom-cursor');

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(frame);
      document.documentElement.classList.remove('has-custom-cursor');
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[90] transition-opacity duration-300"
      style={{ opacity: visible ? 1 : 0 }}
      aria-hidden
    >
      <div ref={dot} className="absolute left-0 top-0 h-1.5 w-1.5 rounded-full bg-accent" />
      <div
        ref={ring}
        className="absolute left-0 top-0 h-7 w-7 rounded-full border border-accent/70 transition-[opacity] duration-200"
      />
    </div>
  );
}
