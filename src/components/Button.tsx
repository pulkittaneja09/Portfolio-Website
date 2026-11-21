import type { ElementType, ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'md' | 'sm';

interface BaseProps {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
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
  onClick?: () => void;
  type?: 'button' | 'submit';
  download?: never;
  target?: never;
  rel?: never;
};

/**
 * Three weights of the same quiet button. No colour anywhere: hierarchy comes
 * from how much light the surface holds.
 *
 *   primary    solid light-on-dark, inverted — the one call to action
 *   secondary  hairline border, brightening on hover
 *   ghost      text only, with a border appearing on hover
 */
const variants: Record<Variant, string> = {
  primary: 'bg-text text-bg border-transparent hover:opacity-90 font-medium',
  secondary: 'border-[var(--border)] text-text hover:border-[var(--border-hover)] hover:bg-light/[0.03]',
  ghost: 'border-transparent text-muted hover:text-text hover:border-[var(--border)]',
};

const sizes: Record<Size, string> = {
  md: 'h-10 px-4 text-sm gap-2 rounded-lg',
  sm: 'h-8 px-3 text-[0.8125rem] gap-1.5 rounded-md',
};

export function Button(props: AnchorProps | ButtonProps) {
  const { children, variant = 'secondary', size = 'md', className } = props;

  const classes = cn(
    'group inline-flex items-center justify-center border transition-all duration-400 ease-quiet',
    'whitespace-nowrap',
    variants[variant],
    sizes[size],
    className,
  );

  if ('href' in props && props.href) {
    const Tag: ElementType = 'a';
    return (
      <Tag
        className={classes}
        href={props.href}
        download={props.download}
        target={props.target}
        rel={props.rel}
      >
        {children}
      </Tag>
    );
  }

  return (
    <button className={classes} type={props.type ?? 'button'} onClick={props.onClick}>
      {children}
    </button>
  );
}
