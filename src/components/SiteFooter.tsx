interface Props {
  onOpenPalette: () => void;
  onOpenTerminal: () => void;
}

const key =
  'mx-0.5 inline-flex items-center rounded border border-white/[0.1] px-1.5 py-px text-faint transition-colors duration-300 hover:border-white/[0.2] hover:text-strong';

/**
 * One small mono line. The two shortcuts it mentions are also buttons, for
 * anyone reading it without a keyboard to hand.
 */
export function SiteFooter({ onOpenPalette, onOpenTerminal }: Props) {
  return (
    <footer className="meta max-w-prose pb-16 leading-relaxed lg:pb-24">
      Designed &amp; built by Pulkit in React + TypeScript. Press{' '}
      <button type="button" onClick={onOpenPalette} className={key} aria-label="Open the command palette (⌘K)">
        ⌘K
      </button>{' '}
      to navigate, or{' '}
      <button type="button" onClick={onOpenTerminal} className={key} aria-label="Open the terminal (backtick)">
        `
      </button>{' '}
      for terminal.
    </footer>
  );
}
