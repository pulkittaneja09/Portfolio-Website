import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';
import { CommandIcon, TerminalIcon } from '@/components/icons';
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
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-colors duration-500',
        condensed && 'border-b border-hairline bg-bg/80 backdrop-blur-xl',
      )}
    >
      <nav className="shell flex h-[var(--nav-h)] items-center justify-between gap-4" aria-label="Main">
        <Link to="/" className="group flex items-center gap-2.5 font-mono text-sm tracking-tight text-text">
          <span
            className="grid h-7 w-7 place-items-center rounded-md border border-strong bg-text/[0.08] text-xs font-semibold text-text"
            aria-hidden
          >
            PT
          </span>
          {/* The wordmark is hidden on small screens, so the link needs a
              name that is always present. */}
          <span className="sr-only">{profile.name} — home</span>
          <span className="hidden sm:inline" aria-hidden>
            {profile.name.split(' ')[0]}
            <span className="text-faint">.dev</span>
          </span>
        </Link>

        {/* Section links appear once there is room for them beside the
            controls; below that, ⌘K and scrolling do the navigating. */}
        <ul className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => {
            const isActive = isHome && active === item.id;
            return (
              <li key={item.id}>
                <a
                  href={isHome ? `#${item.id}` : `/#${item.id}`}
                  className={cn(
                    'relative rounded-full px-3 py-1.5 text-sm transition-colors duration-300',
                    isActive ? 'text-text' : 'text-muted hover:text-text',
                  )}
                  aria-current={isActive ? 'true' : undefined}
                >
                  {item.label}
                  {isActive && <span className="absolute inset-x-3 -bottom-0.5 h-px bg-text" aria-hidden />}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenTerminal}
            className="hidden h-9 w-9 place-items-center rounded-full border border-hairline text-muted transition-colors duration-300 hover:border-strong hover:text-text sm:grid"
            aria-label="Open terminal (backtick key)"
            title="Terminal — press `"
          >
            <TerminalIcon className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={onOpenPalette}
            className="group flex items-center gap-2 rounded-full border border-hairline py-1.5 pl-3 pr-2 text-sm text-muted transition-colors duration-300 hover:border-strong hover:text-text"
          >
            {/* No aria-label here: it would hide the button's own visible
                text from its accessible name. */}
            <span className="sr-only">Open command palette.</span>
            <CommandIcon className="h-3.5 w-3.5" />
            <span className="hidden xl:inline">Jump to…</span>
            <kbd className="rounded border border-hairline bg-elevated px-1.5 py-0.5 font-mono text-[0.625rem] text-faint">
              ⌘K
            </kbd>
          </button>

          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
