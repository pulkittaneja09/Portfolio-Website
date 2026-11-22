import { useEffect, useRef } from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * One circle, glued to the pointer. Its position is written straight to its
 * transform from every pointermove: no spring, no easing, no React state, so
 * it never trails the mouse. Only its size, fill and opacity animate (fast,
 * ease-out): 40px over links, buttons and chips; 64px with "View" over a
 * project card; 0.85 while the button is held; hidden over text you might
 * select (the native text cursor returns there) and when the mouse leaves
 * the window.
 *
 * Fine pointers with hover only: touch devices keep their normal behaviour,
 * and the native cursor is hidden only while this is mounted
 * (html.has-custom-cursor). Under reduced motion the circle stays but changes
 * size without animating.
 */

type CursorState = 'default' | 'link' | 'card' | 'text';

/** Where selecting text matters: the native text cursor comes back. */
const TEXT = 'main p, main li:not(:has(a, button)), main dd, main blockquote';
const CARD = '[data-cursor="card"]';
const LINK = 'a, button, [role="button"], [role="option"], label, select, summary, .skill-chip';

function stateFor(target: EventTarget | null): CursorState {
  if (!(target instanceof Element)) return 'default';
  if (target.closest('input, textarea, [contenteditable="true"]')) return 'text';
  // A project card is one big stretched link (marked data-card-link); the
  // Live and Code links on top of it are ordinary links.
  const link = target.closest(LINK);
  if (link && !link.hasAttribute('data-card-link')) return 'link';
  if (target.closest(CARD)) return 'card';
  if (link) return 'link';
  if (target.closest(TEXT)) return 'text';
  return 'default';
}

export function CustomCursor() {
  const fine = useMediaQuery('(hover: hover) and (pointer: fine)');
  if (!fine) return null;
  return <Cursor />;
}

function Cursor() {
  const reduced = useReducedMotion();
  const node = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const el = node.current;
    if (!el) return;
    root.classList.add('has-custom-cursor');
    let state: CursorState = 'default';

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      // Straight to the transform, inside the event: the circle is drawn in
      // the same frame as the pointer, with nothing interpolated in between.
      el.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
      if (el.dataset.visible !== 'true') el.dataset.visible = 'true';
      const next = stateFor(event.target);
      if (next !== state) {
        state = next;
        el.dataset.state = next;
      }
    };
    const onDown = () => (el.dataset.pressed = 'true');
    const onUp = () => delete el.dataset.pressed;
    const onLeave = () => {
      el.dataset.visible = 'false';
      delete el.dataset.pressed;
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });
    root.addEventListener('mouseleave', onLeave);
    window.addEventListener('blur', onLeave);
    return () => {
      root.classList.remove('has-custom-cursor');
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      root.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('blur', onLeave);
    };
  }, []);

  return (
    <div
      ref={node}
      className="cursor"
      data-state="default"
      data-visible="false"
      data-reduced={reduced || undefined}
      aria-hidden
    >
      <div className="cursor-circle" />
      <span className="cursor-label">View</span>
    </div>
  );
}
