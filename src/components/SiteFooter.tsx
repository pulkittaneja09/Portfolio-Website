import { TransitionLink } from '@/components/TransitionLink';
import { paletteKey } from '@/lib/platform';
import { updatedLabel } from '@/lib/siteStats';

interface Props {
  onOpenPalette: () => void;
  onOpenTerminal: () => void;
}

const key =
  'mx-0.5 inline-flex items-center rounded border border-line/[0.1] px-1.5 py-px text-faint transition-colors duration-300 hover:border-line/[0.2] hover:text-strong';

/**
 * One small mono line. The two shortcuts it mentions are also buttons, for
 * anyone reading it without a keyboard to hand; the palette key is named for
 * the visitor's platform. "Last updated" is the month of the last commit.
 */
export function SiteFooter({ onOpenPalette, onOpenTerminal }: Props) {
  return (
    <footer className="meta max-w-prose pb-16 leading-relaxed lg:pb-24">
      Designed &amp; built by Pulkit in React + TypeScript. Press{' '}
      <button
        type="button"
        onClick={onOpenPalette}
        className={key}
        aria-label={`Open the command palette (${paletteKey})`}
      >
        {paletteKey}
      </button>{' '}
      to navigate, or{' '}
      <button
        type="button"
        onClick={onOpenTerminal}
        className={key}
        aria-label="Open the terminal (backtick)"
      >
        `
      </button>{' '}
      for terminal. Last updated {updatedLabel} ·{' '}
      <TransitionLink to="/uses" className="link">
        Uses
      </TransitionLink>
    </footer>
  );
}
