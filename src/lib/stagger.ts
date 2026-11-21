import type { CSSProperties } from 'react';

/**
 * Inline `--i` for the `.enter` load animation: each step adds 60ms of delay.
 * One helper so the stagger order of a column reads top to bottom in JSX.
 */
export function stagger(index: number): CSSProperties {
  return { '--i': index } as CSSProperties;
}
