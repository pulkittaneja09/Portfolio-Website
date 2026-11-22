import { useEffect, useRef } from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * A soft 600px glacier-blue pool that follows the cursor across the whole page,
 * behind the content. Fine pointers only: there is no cursor to follow on a
 * touch screen, and the effect is pure decoration under reduced motion.
 *
 * Position lives in two CSS custom properties written from a rAF loop that
 * only runs while the light is still catching up to the pointer — React
 * never re-renders for it, and an idle page costs nothing.
 */
export function CursorSpotlight() {
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)');
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const enabled = finePointer && !reduced;

  useEffect(() => {
    const node = ref.current;
    if (!enabled || !node) return;

    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let frame = 0;
    let primed = false;

    const paint = () => {
      // Ease toward the pointer: close enough to feel attached, soft enough
      // that a flick of the mouse reads as a glide rather than a jump.
      current.x += (target.x - current.x) * 0.22;
      current.y += (target.y - current.y) * 0.22;
      node.style.setProperty('--spot-x', `${current.x.toFixed(1)}px`);
      node.style.setProperty('--spot-y', `${current.y.toFixed(1)}px`);

      const settled = Math.abs(target.x - current.x) < 0.5 && Math.abs(target.y - current.y) < 0.5;
      frame = settled ? 0 : requestAnimationFrame(paint);
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      target.x = event.clientX;
      target.y = event.clientY;

      // First sighting: start exactly at the pointer rather than sweeping in
      // from the corner.
      if (!primed) {
        primed = true;
        current.x = target.x;
        current.y = target.y;
      }

      node.dataset.active = 'true';
      if (!frame) frame = requestAnimationFrame(paint);
    };

    const onLeave = () => {
      node.dataset.active = 'false';
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);
    window.addEventListener('blur', onLeave);

    return () => {
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('blur', onLeave);
      cancelAnimationFrame(frame);
    };
  }, [enabled]);

  if (!enabled) return null;
  // No data-active until the first move: the layer is display: none until then.
  return <div ref={ref} className="cursor-spotlight" aria-hidden />;
}
