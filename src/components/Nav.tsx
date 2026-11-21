import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TerminalIcon } from '@/components/icons';
import { nav, profile } from '@/data/portfolio';
import { useActiveSection } from '@/hooks/useActiveSection';
import { cn } from '@/lib/cn';

const SECTION_IDS = nav.map((item) => item.id);

interface NavProps {
  onOpenPalette: () => void;
  onOpenTerminal: () => void;
  /** Section links only resolve on the home route. */
  isHome: boolean;
}

/**
 * A floating glass bar. Transparent over the hero, then it gathers a hairline
 * and a 16px backdrop blur once the page moves beneath it.
 */
export function Nav({ onOpenPalette, onOpenTerminal, isHome }: NavProps) {
  const active = useActiveSection(isHome ? SECTION_IDS : []);
  const [condensed, setCondensed] = useState(false);

  useEffect(() => {
    const onScroll = () => setCondensed(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4">
      <nav
        className={cn(
          'mx-auto flex h-12 max-w-shell items-center justify-between gap-4 rounded-xl border pl-4 pr-2 transition-[background-color,border-color,backdrop-filter,box-shadow] duration-600 ease-quiet',
          condensed ? 'glass shadow-lift' : 'border-transparent',
        )}
        aria-label="Main"
      >
        <Link to="/" className="flex items-center gap-2.5 text-sm text-text">
          <span
            className="grid h-6 w-6 place-items-center rounded-[6px] border border-strong text-[0.625rem] font-semibold tracking-tight"
            aria-hidden
          >
            PT
          </span>
          {/* The wordmark is hidden on small screens, so the link needs a
              name that is always present. */}
          <span className="sr-only">{profile.name} — home</span>
          <span className="hidden font-medium tracking-[-0.01em] sm:inline" aria-hidden>
            {profile.name}
          </span>
        </Link>

        {/* Section links appear once there is room for them beside the
            controls; below that, ⌘K and scrolling do the navigating. */}
        <ul className="hidden items-center lg:flex">
          {nav.map((item) => {
            const isActive = isHome && active === item.id;
            return (
              <li key={item.id}>
                <a
                  href={isHome ? `#${item.id}` : `/#${item.id}`}
                  className={cn(
                    'rounded-md px-3 py-1.5 text-[0.8125rem] transition-colors duration-400 ease-quiet',
                    isActive ? 'text-text' : 'text-muted hover:text-text',
                  )}
                  aria-current={isActive ? 'true' : undefined}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onOpenTerminal}
            className="hidden h-8 w-8 place-items-center rounded-md text-muted transition-colors duration-400 ease-quiet hover:bg-light/[0.05] hover:text-text sm:grid"
            aria-label="Open terminal (backtick key)"
            title="Terminal — press `"
          >
            <TerminalIcon className="h-[15px] w-[15px]" />
          </button>


          <button
            type="button"
            onClick={onOpenPalette}
            className="ml-1 flex h-8 items-center gap-2 rounded-md border border-hairline px-2.5 text-[0.8125rem] text-muted transition-colors duration-400 ease-quiet hover:border-strong hover:text-text"
          >
            {/* No aria-label here: it would hide the button's own visible
                text from its accessible name. */}
            <span className="sr-only">Open command palette.</span>
            <span className="hidden xl:inline" aria-hidden>
              Search
            </span>
            <kbd className="font-mono text-[0.6875rem] tracking-[0.04em] text-faint">⌘K</kbd>
          </button>
        </div>
      </nav>
    </header>
  );
}
