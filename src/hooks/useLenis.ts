import { useEffect } from 'react';
import Lenis from 'lenis';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * Lenis smooth scroll, wired to the shared easing.
 *
 * Disabled entirely under `prefers-reduced-motion` — hijacking the scroll is
 * exactly the kind of motion that setting is asking you not to do. Anchor
 * links are routed through Lenis so in-page jumps use the same curve.
 */
let instance: Lenis | null = null;

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
  if (instance) instance.scrollTo(target, { immediate: !smooth });
  else target.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
}

/** Back to the very top, on the same curve. */
export function scrollToTop(smooth = true): void {
  if (instance) instance.scrollTo(0, { immediate: !smooth });
  else window.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'auto' });
}

export function useLenis(): void {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) {
      document.documentElement.style.scrollBehavior = 'auto';
      return;
    }

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      // Touch devices already have momentum scrolling; leave it alone.
      syncTouch: false,
      touchMultiplier: 1.6,
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
      lenis.scrollTo(target as HTMLElement);
      history.replaceState(null, '', hash);
    };

    document.addEventListener('click', onClick);

    return () => {
      document.removeEventListener('click', onClick);
      cancelAnimationFrame(frame);
      lenis.destroy();
      instance = null;
    };
  }, [reduced]);
}
