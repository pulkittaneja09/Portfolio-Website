import { useEffect, useState } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ChatIcon } from '@/components/icons';
import { cn } from '@/lib/cn';
import { paletteKey } from '@/lib/platform';
import { sections } from '@/lib/sections';

interface Props {
  active: string | null;
  onOpenPalette: () => void;
  onOpenAsk: () => void;
}

/**
 * Below 1024px the left column becomes the page header and its nav goes away,
 * so this thin bar carries navigation instead: a monogram that returns to the
 * top, the section you are in once you have scrolled past the header, the
 * "Ask about Pulkit" panel (here rather than floating over the text, as it
 * does on desktop), and a button into the command palette, which doubles as
 * the mobile menu.
 */
export function MobileBar({ active, onOpenPalette, onOpenAsk }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [pastHeader, setPastHeader] = useState(false);

  useEffect(() => {
    let frame = 0;
    const read = () => {
      frame = 0;
      setScrolled(window.scrollY > 8);
      setPastHeader(window.scrollY > window.innerHeight * 0.6);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };
    read();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  const section = sections.find((item) => item.id === active)?.label;

  return (
    <div className="fixed inset-x-0 top-0 z-50 lg:hidden print:hidden">
      <div
        className={cn(
          'flex h-14 items-center justify-between border-b px-5 transition-[background-color,border-color,backdrop-filter] duration-200 sm:px-8',
          scrolled ? 'glass border-x-0 border-t-0' : 'border-transparent',
        )}
      >
        <a href="#about" className="flex min-w-0 items-center gap-3" aria-label="Back to top">
          <span
            className="grid h-7 w-7 shrink-0 place-items-center rounded-md border border-line/[0.14] text-[0.625rem] font-semibold tracking-tight text-strong"
            aria-hidden
          >
            PT
          </span>
          {/* Mounted only once it has something to say, keyed by section so
              each change settles in fresh. */}
          {pastHeader && section && (
            <span key={section} className="line-in label truncate text-body" aria-hidden>
              {section}
            </span>
          )}
        </a>

        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={onOpenAsk}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-sm text-body transition-colors duration-200 hover:text-strong"
            aria-label="Ask about Pulkit"
          >
            <ChatIcon className="h-4 w-4" />
            Ask
          </button>
          <ThemeToggle className="h-9 w-9 rounded-lg" />
          <button
            type="button"
            onClick={onOpenPalette}
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-line/[0.08] px-3 text-sm text-strong transition-colors duration-200 hover:border-line/[0.14]"
          >
            Menu
            <kbd className="hidden font-mono text-xs text-faint [@media(hover:hover)]:inline">
              {paletteKey}
            </kbd>
          </button>
        </div>
      </div>
    </div>
  );
}
