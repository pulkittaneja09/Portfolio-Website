import type { MouseEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { LinkProps } from 'react-router-dom';
import { transitionTo } from '@/lib/viewTransition';

/**
 * A router Link whose plain left click goes through a View Transition (see
 * lib/viewTransition.ts). Modified clicks — new tab, new window — behave
 * exactly like a normal link.
 */
export function TransitionLink({ to, onClick, ...props }: Omit<LinkProps, 'to'> & { to: string }) {
  const navigate = useNavigate();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    transitionTo((path) => navigate(path), to);
  };

  return <Link to={to} onClick={handleClick} {...props} />;
}
