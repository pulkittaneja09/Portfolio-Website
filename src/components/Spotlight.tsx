import { useCallback, useRef, useState } from 'react';
import type { ElementType, ReactNode } from 'react';
import { useIsDesktopPointer } from '@/hooks/useMediaQuery';
import { cn } from '@/lib/cn';

interface Props {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  /** Radius of the light pool, in px. */
  radius?: number;
}

/**
 * A hairline panel with a soft white light pool that follows the cursor
 * inside it, and a border that brightens on the side nearest the cursor.
 *
 * Two stacked layers do the work: a radial gradient fill at ~6% for the pool,
 * and a second radial gradient used as a border mask, so the 1px edge lights
 * up locally instead of the whole outline turning on.
 *
 * Position is written straight to CSS custom properties in a rAF, never to
 * React state — a card re-rendering on every mouse move would be the single
 * most expensive thing on the page.
 */
export function Spotlight({ children, className, as: Tag = 'div', radius = 340 }: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const frame = useRef(0);
  const isDesktop = useIsDesktopPointer();
  const [active, setActive] = useState(false);

  const onMouseMove = useCallback(
    (event: React.MouseEvent) => {
      if (!isDesktop) return;
      const node = ref.current;
      if (!node) return;

      const { clientX, clientY } = event;
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        const rect = node.getBoundingClientRect();
        node.style.setProperty('--mx', `${clientX - rect.left}px`);
        node.style.setProperty('--my', `${clientY - rect.top}px`);
      });
    },
    [isDesktop],
  );

  const onEnter = useCallback(() => {
    if (isDesktop) setActive(true);
  }, [isDesktop]);

  const onLeave = useCallback(() => {
    cancelAnimationFrame(frame.current);
    setActive(false);
  }, []);

  return (
    <Tag
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      data-spotlight={active ? 'on' : 'off'}
      style={{ '--spot-r': `${radius}px` } as React.CSSProperties}
      className={cn('spotlight panel', className)}
    >
      {children}
    </Tag>
  );
}
