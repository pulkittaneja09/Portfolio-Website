import { useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useIsDesktopPointer } from '@/hooks/useMediaQuery';

type Variant = 'solid' | 'outline' | 'ghost';

interface BaseProps {
  children: ReactNode;
  variant?: Variant;
  className?: string;
  /** Pull strength in px. */
  strength?: number;
}

type AnchorProps = BaseProps & {
  href: string;
  download?: boolean | string;
  target?: string;
  rel?: string;
  onClick?: never;
  type?: never;
};

type ButtonProps = BaseProps & {
  href?: never;
  /** Optional: a `type="submit"` button is driven by its form instead. */
  onClick?: () => void;
  type?: 'button' | 'submit';
  download?: never;
  target?: never;
  rel?: never;
};

const variants: Record<Variant, string> = {
  solid:
    'bg-accent text-accent-ink border-accent hover:brightness-[1.08] font-medium shadow-[0_0_28px_-10px_rgb(var(--accent)/0.7)]',
  outline: 'border-accent/55 text-ink hover:border-accent hover:bg-accent/[0.07]',
  ghost: 'border-line text-muted hover:text-ink hover:border-ink/35',
};

/**
 * A CTA that leans toward the cursor. The pull is transform-only (no layout
 * work) and is disabled on touch devices and under reduced motion.
 */
export function MagneticButton(props: AnchorProps | ButtonProps) {
  const { children, variant = 'outline', className, strength = 7 } = props;
  const reduced = useReducedMotion();
  const isDesktop = useIsDesktopPointer();
  const ref = useRef<HTMLElement | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const magnetic = isDesktop && !reduced;

  const handleMove = (event: React.MouseEvent) => {
    if (!magnetic || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const relX = (event.clientX - rect.left) / rect.width - 0.5;
    const relY = (event.clientY - rect.top) / rect.height - 0.5;
    setOffset({ x: relX * strength * 2, y: relY * strength * 1.4 });
  };

  const reset = () => setOffset({ x: 0, y: 0 });

  const shared = {
    ref: ref as never,
    onMouseMove: handleMove,
    onMouseLeave: reset,
    onBlur: reset,
    style: {
      transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
      transition: offset.x === 0 && offset.y === 0 ? 'transform 0.5s cubic-bezier(0.16,1,0.3,1)' : 'transform 0.09s linear',
    },
    className: cn(
      'group inline-flex items-center justify-center gap-2 rounded-full border px-5 py-2.5 text-sm transition-colors duration-300 will-change-transform',
      variants[variant],
      className,
    ),
  };

  if ('href' in props && props.href) {
    return (
      <a
        {...shared}
        href={props.href}
        download={props.download}
        target={props.target}
        rel={props.rel}
      >
        {children}
      </a>
    );
  }

  return (
    <button {...shared} type={props.type ?? 'button'} onClick={props.onClick}>
      {children}
    </button>
  );
}
