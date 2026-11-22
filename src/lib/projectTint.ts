import type { CSSProperties } from 'react';

/**
 * Each flagship project's own tint, drawn from the Midnight + Glacier family
 * so the four sit together: glacier, seafoam, sky and steel. Dark values are
 * light and soft; light values are the deeper twins. Used for the hover glow
 * behind a project's thumbnail and the wash over its case-study header.
 * RGB channel triplets, consumed as `rgb(var(--tint) / α)`.
 */
const TINTS: Record<string, { dark: string; light: string }> = {
  parcelpilot: { dark: '143 180 255', light: '47 91 211' },
  'scrap-2-spark': { dark: '125 211 192', light: '14 124 108' },
  'knowledgehub-ai': { dark: '154 208 232', light: '22 120 160' },
  'ieee-recruitment-backend': { dark: '180 194 218', light: '84 102 134' },
};

const FALLBACK = { dark: 'var(--accent-rgb)', light: 'var(--accent-rgb)' };

/** Inline style for an element with the `tinted` class (index.css picks the theme). */
export function tintStyle(slug: string): CSSProperties {
  const tint = TINTS[slug] ?? FALLBACK;
  return { '--tint-d': tint.dark, '--tint-l': tint.light } as CSSProperties;
}
