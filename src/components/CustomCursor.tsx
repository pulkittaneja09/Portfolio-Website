import { m, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * The dot + ring cursor. A 6px dot sits exactly on the pointer; a 32px
 * accent ring follows on a spring. Over links, buttons and chips the ring
 * grows to 48px with a 10% accent fill and the dot fades; over a project card
 * it grows to 72px and says "View"; over text inputs the native text cursor
 * comes back. Mousedown squeezes the ring to 0.85.
 *
 * Fine pointers with hover only: touch devices keep their normal behaviour,
 * and the native cursor is hidden only while this layer is mounted
 * (html.has-custom-cursor). Under reduced motion the ring follows instantly
 * and never animates its size.
 *
 * Position is two motion values written from pointermove, and the hover
 * state is a data attribute on the layer, so React never re-renders while
 * the mouse moves. The ring grows by `transform: scale` alone, with its
 * stroke counter-scaled so it stays a 1px hairline at every size.
 */

type CursorState = 'default' | 'link' | 'card' | 'text';

const TEXT =
  'input:not([type="button"]):not([type="submit"]):not([type="checkbox"]):not([type="radio"]), textarea, [contenteditable="true"]';
const CARD = '[data-cursor="card"]';
const LINK = 'a, button, [role="button"], [role="option"], label, select, summary, .skill-chip';

function stateFor(target: EventTarget | null): CursorState {
  if (!(target instanceof Element)) return 'default';
  if (target.closest(TEXT)) return 'text';
  // A project card is one big stretched link (marked data-card-link); the
  // Live and Code links on top of it are ordinary links.
  const link = target.closest(LINK);
  if (link && !link.hasAttribute('data-card-link')) return 'link';
  if (target.closest(CARD)) return 'card';
  return link ? 'link' : 'default';
}

export function CustomCursor() {
  const fine = useMediaQuery('(hover: hover) and (pointer: fine)');
  if (!fine) return null;
  return <Cursor />;
}

function Cursor() {
  const reduced = useReducedMotion();
  const layer = useRef<HTMLDivElement>(null);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 300, damping: 30, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 300, damping: 30, mass: 0.6 });

  useEffect(() => {
    const root = document.documentElement;
    const node = layer.current;
    if (!node) return;
    root.classList.add('has-custom-cursor');

    let state: CursorState = 'default';
    let first = true;

    const setState = (next: CursorState) => {
      if (next === state) return;
      state = next;
      node.dataset.state = next;
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      x.set(event.clientX);
      y.set(event.clientY);
      if (first) {
        // First sighting: the ring starts on the pointer, not flying in.
        first = false;
        springX.jump(event.clientX);
        springY.jump(event.clientY);
      }
      node.dataset.visible = 'true';
    };

    const onOver = (event: PointerEvent) => setState(stateFor(event.target));
    const onDown = () => (node.dataset.pressed = 'true');
    const onUp = () => delete node.dataset.pressed;
    const onLeave = () => {
      node.dataset.visible = 'false';
      delete node.dataset.pressed;
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerover', onOver, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });
    root.addEventListener('mouseleave', onLeave);
    window.addEventListener('blur', onLeave);

    return () => {
      root.classList.remove('has-custom-cursor');
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerover', onOver);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      root.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('blur', onLeave);
    };
  }, [x, y, springX, springY]);

  return (
    <div
      ref={layer}
      className="custom-cursor"
      data-state="default"
      data-visible="false"
      data-reduced={reduced || undefined}
      aria-hidden
    >
      <m.div className="cursor-ring" style={{ x: reduced ? x : springX, y: reduced ? y : springY }}>
        <div className="cursor-ring-scale">
          <svg viewBox="0 0 32 32" focusable="false">
            <circle cx="16" cy="16" r="15.5" />
          </svg>
        </div>
        <span className="cursor-label">View</span>
      </m.div>
      <m.div className="cursor-dot" style={{ x, y }} />
    </div>
  );
}
