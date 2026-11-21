import { useEffect, useState } from 'react';
import { nav } from '@/data/portfolio';
import { cn } from '@/lib/cn';

interface Props {
  active: string | null;
  onOpenPalette: () => void;
}

/**
 * Below 1024px the left column becomes the page header and its nav goes away,
 * so this thin bar carries navigation instead: a monogram that returns to the
 * top, the section you are in once you have scrolled past the header, and a
 * button into the command palette (which doubles as the mobile menu).
 */
export function MobileBar({ active, onOpenPalette }: Props) {
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

  const section = nav.find((item) => item.id === active)?.label;

  return (
    <div className="fixed inset-x-0 top-0 z-50 lg:hidden">
      <div
        className={cn(
          'flex h-14 items-center justify-between border-b px-5 transition-[background-color,border-color,backdrop-filter] duration-300 sm:px-8',
          scrolled ? 'glass border-x-0 border-t-0' : 'border-transparent',
        )}
      >
        <a href="#about" className="flex min-w-0 items-center gap-3" aria-label="Back to top">
          <span
            className="grid h-7 w-7 shrink-0 place-items-center rounded-md border border-white/[0.14] text-[0.625rem] font-semibold tracking-tight text-strong"
            aria-hidden
          >
            PT
          </span>
          <span
            className={cn(
              'label truncate text-body transition-[opacity,transform] duration-300',
              pastHeader && section ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0',
            )}
            aria-hidden
          >
            {section}
          </span>
        </a>

        <button
          type="button"
          onClick={onOpenPalette}
          className="inline-flex h-9 items-center gap-2 rounded-lg border border-white/[0.08] px-3 text-[0.8125rem] text-strong transition-colors duration-300 hover:border-white/[0.16]"
        >
          Menu
          <kbd className="hidden font-mono text-[0.6875rem] text-faint [@media(hover:hover)]:inline">⌘K</kbd>
        </button>
      </div>
    </div>
  );
}
