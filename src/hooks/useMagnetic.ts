import { useEffect, useRef } from 'react';

const MAX_PULL = 6; // px
const REACH = 1.6; // the pull starts this many half-sizes from the centre

/**
 * A subtle magnetic pull: while a mouse is near, the element drifts up to
 * 6px toward it, and settles back once the pointer moves away (or leaves
 * the window). Mouse and full
 * motion only; touch, pen and reduced motion get a still element.
 */
export function useMagnetic<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let raf = 0;
    let pulled = false;

    const reset = () => {
      if (!pulled) return;
      pulled = false;
      node.style.transform = '';
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || !fine.matches || reduced.matches) return;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = node.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (event.clientX - cx) / (rect.width / 2);
        const dy = (event.clientY - cy) / (rect.height / 2);
        if (Math.abs(dx) > REACH || Math.abs(dy) > REACH * 2) return reset();
        const clamp = (value: number) => Math.max(-1, Math.min(1, value));
        pulled = true;
        node.style.transform = `translate3d(${(clamp(dx) * MAX_PULL).toFixed(2)}px, ${(clamp(dy) * MAX_PULL).toFixed(2)}px, 0)`;
      });
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', reset);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('mouseleave', reset);
    };
  }, []);

  return ref;
}
