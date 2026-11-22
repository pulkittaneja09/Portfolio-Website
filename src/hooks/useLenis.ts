import { useEffect } from 'react';
import Lenis from 'lenis';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * Lenis smooth scroll for mouse and trackpad. Wheel input is interpolated
 * with `lerp: 0.1` at a 1:1 wheel multiplier: smooth, but it lands within a
 * few frames, so it never feels floaty. Programmatic jumps (nav links, ⌘K,
 * anchors) ride one eased 1s curve.
 *
 * Not created at all under `prefers-reduced-motion` (hijacking the scroll is
 * exactly what that setting asks us not to do) or on touch-first devices,
 * which keep their own native momentum scrolling.
 */
let instance: Lenis | null = null;

/** The curve for programmatic jumps: 1s, fast out of the gate, soft landing. */
const JUMP = {
  duration: 1,
  easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
};

/*
 * Where a section lands comes from its own `scroll-margin-top` (.section-anchor:
 * 96px on desktop, level with the rail's top; 72px on phones, clear of the
 * 56px bar). Lenis 1.3 reads scroll-margin itself, and native scrolling under
 * reduced motion honours it too, so there is deliberately no offset here: one
 * would be applied on top of the margin and land sections twice as low.
 */

/**
 * Scroll to an element on the shared curve when Lenis is running, natively
 * otherwise. Anything that scrolls programmatically should go through this,
 * or it ends up fighting Lenis' own interpolation.
 */
export function scrollToTarget(target: HTMLElement | null, smooth = true): void {
  if (!target) return;
  if (instance) instance.scrollTo(target, { immediate: !smooth, ...JUMP });
  else target.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
}

/** Back to the very top, on the same curve. */
export function scrollToTop(smooth = true): void {
  if (instance) instance.scrollTo(0, { immediate: !smooth, ...JUMP });
  else window.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'auto' });
}

export function useLenis(): void {
  const reduced = useReducedMotion();
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)');

  useEffect(() => {
    if (reduced || !finePointer) {
      document.documentElement.style.scrollBehavior = 'auto';
      return;
    }

    const lenis = new Lenis({
      lerp: 0.1,
      wheelMultiplier: 1,
      // A touchscreen laptop keeps native touch scrolling even here.
      syncTouch: false,
    });

    instance = lenis;

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    // Same-page anchors should ride the same curve as a wheel scroll.
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement | null)?.closest('a[href^="#"], a[href^="/#"]');
      if (!(anchor instanceof HTMLAnchorElement)) return;

      const hash = anchor.getAttribute('href')?.replace(/^\//, '') ?? '';
      if (hash.length < 2) return;

      const target = document.querySelector(hash);
      if (!target) return;

      event.preventDefault();
      lenis.scrollTo(target as HTMLElement, JUMP);
      history.replaceState(null, '', hash);
    };

    document.addEventListener('click', onClick);

    return () => {
      document.removeEventListener('click', onClick);
      cancelAnimationFrame(frame);
      lenis.destroy();
      instance = null;
    };
  }, [reduced, finePointer]);
}
