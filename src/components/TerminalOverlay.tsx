import { AnimatePresence, m } from 'framer-motion';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CloseIcon } from '@/components/icons';
import { profile } from '@/data/portfolio';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { COMMANDS, WELCOME, runCommand } from '@/lib/terminal';
import type { Line } from '@/lib/terminal';
import { cn } from '@/lib/cn';
import { currentTheme, setTheme } from '@/lib/theme';

interface Props {
  open: boolean;
  onClose: () => void;
}

interface Block {
  id: number;
  /** The echoed prompt line, absent for the welcome block. */
  input?: string;
  lines: Line[];
}

const toneClass: Record<NonNullable<Line['tone']>, string> = {
  default: 'text-body',
  accent: 'text-accent',
  muted: 'text-faint',
  // No red: an error reads as an error from its wording and its weight.
  error: 'text-strong underline decoration-line/20 underline-offset-4',
  heading: 'text-strong font-medium',
};

/**
 * In-browser terminal. ~180 lines of React rather than a terminal emulator
 * package, because all it has to do is print text and keep a history.
 */
export function TerminalOverlay({ open, onClose }: Props) {
  const reduced = useReducedMotion();
  const [blocks, setBlocks] = useState<Block[]>([{ id: 0, lines: WELCOME }]);
  const [value, setValue] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const nextId = useRef(1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Longest common prefix of the matching commands, for tab completion.
  const completion = useMemo(() => {
    if (!value.trim()) return null;
    const matches = COMMANDS.filter((c) => c.startsWith(value.toLowerCase()));
    if (matches.length === 0) return null;
    if (matches.length === 1) return matches[0];
    let prefix: string = matches[0];
    matches.forEach((match) => {
      while (!match.startsWith(prefix)) prefix = prefix.slice(0, -1);
    });
    return prefix.length > value.length ? prefix : null;
  }, [value]);

  useEffect(() => {
    if (open) {
      // Focus lands on the input so typing works the moment it opens.
      const timer = window.setTimeout(() => inputRef.current?.focus(), 120);
      const previous = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        window.clearTimeout(timer);
        document.body.style.overflow = previous;
      };
    }
    return undefined;
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: reduced ? 'auto' : 'smooth',
    });
  }, [blocks, reduced]);

  const submit = useCallback(
    (raw: string) => {
      const result = runCommand(raw);
      let lines = result.lines;
      if (result.effect === 'theme') {
        const target = result.theme ?? (currentTheme() === 'light' ? 'dark' : 'light');
        lines = [
          {
            text:
              target === currentTheme()
                ? `Already in the ${target} theme.`
                : `Switched to the ${target} theme.`,
            tone: 'accent',
          },
        ];
        setTheme(target);
      }

      if (result.effect === 'clear') {
        setBlocks([]);
      } else {
        setBlocks((current) => [...current, { id: (nextId.current += 1), input: raw, lines }]);
      }

      if (raw.trim()) setHistory((current) => [...current, raw.trim()]);
      setHistoryIndex(null);
      setValue('');

      switch (result.effect) {
        case 'close':
          window.setTimeout(onClose, 180);
          break;
        case 'download-resume': {
          const link = document.createElement('a');
          link.href = profile.resumePath;
          link.download = 'Pulkit_Taneja_Resume.pdf';
          link.click();
          break;
        }
        default:
          break;
      }
    },
    [onClose],
  );

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      submit(value);
      return;
    }

    if (event.key === 'Tab' && completion) {
      event.preventDefault();
      setValue(completion);
      return;
    }

    // Up/down walk the command history, the way a real shell does.
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (history.length === 0) return;
      const index = historyIndex === null ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(index);
      setValue(history[index]);
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (historyIndex === null) return;
      const index = historyIndex + 1;
      if (index >= history.length) {
        setHistoryIndex(null);
        setValue('');
      } else {
        setHistoryIndex(index);
        setValue(history[index]);
      }
      return;
    }

    if (event.key === 'l' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      setBlocks([]);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <m.div
          className="fixed inset-0 z-[75] flex items-center justify-center p-3 sm:p-6"
          initial={reduced ? undefined : { opacity: 0 }}
          animate={reduced ? undefined : { opacity: 1 }}
          exit={reduced ? undefined : { opacity: 0 }}
          transition={{ duration: 0.2 }}
          role="dialog"
          aria-modal="true"
          aria-label="Terminal"
        >
          <button
            type="button"
            className="absolute inset-0 cursor-default bg-bg/60 backdrop-blur-[2px]"
            onClick={onClose}
            aria-label="Close terminal"
            tabIndex={-1}
          />

          <m.div
            className="glass-strong relative flex h-full max-h-[min(42rem,88vh)] w-full max-w-3xl flex-col overflow-hidden rounded-xl shadow-overlay"
            initial={reduced ? undefined : { opacity: 0, y: 12, scale: 0.985 }}
            animate={reduced ? undefined : { opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? undefined : { opacity: 0, y: 8, scale: 0.99 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => inputRef.current?.focus()}
          >
            {/* Title bar */}
            <div className="flex shrink-0 items-center gap-3 border-b border-line/[0.08] px-4 py-3">
              <span className="flex gap-1.5" aria-hidden>
                <span className="h-2 w-2 rounded-full border border-line/[0.14]" />
                <span className="h-2 w-2 rounded-full border border-line/[0.14]" />
                <span className="h-2 w-2 rounded-full border border-line/[0.14]" />
              </span>
              <p className="label flex-1 truncate text-center text-faint">pulkit@portfolio — ~/about</p>
              <button
                type="button"
                onClick={onClose}
                className="rounded p-1 text-faint transition-colors duration-300 hover:text-strong"
                aria-label="Close terminal"
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            </div>

            {/* Scrollback */}
            <div
              ref={scrollRef}
              data-lenis-prevent
              className="flex-1 overflow-y-auto overscroll-contain px-4 py-5 font-mono text-[0.8125rem] leading-[1.7] sm:px-6"
            >
              {blocks.map((block) => (
                <div key={block.id} className="mb-3 last:mb-0">
                  {block.input !== undefined && (
                    <p className="flex gap-2.5 text-strong">
                      <span className="shrink-0 text-faint" aria-hidden>
                        $
                      </span>
                      <span className="break-all">{block.input}</span>
                    </p>
                  )}
                  {block.lines.map((line, i) =>
                    line.href ? (
                      <p key={i} className="whitespace-pre-wrap break-words">
                        <a
                          href={line.href}
                          target={line.href.startsWith('mailto:') ? undefined : '_blank'}
                          rel="noreferrer noopener"
                          className={cn(
                            toneClass[line.tone ?? 'default'],
                            'underline decoration-line/20 underline-offset-4 transition-colors duration-300 hover:text-strong',
                          )}
                        >
                          {line.text}
                        </a>
                      </p>
                    ) : (
                      <p
                        key={i}
                        className={cn('whitespace-pre-wrap break-words', toneClass[line.tone ?? 'default'])}
                      >
                        {/* U+00A0 keeps blank output lines at full line height. */}
                        {line.text || '\u00a0'}
                      </p>
                    ),
                  )}
                </div>
              ))}

              {/* Prompt */}
              <div className="flex items-center gap-2">
                <span className="shrink-0 text-faint" aria-hidden>
                  $
                </span>
                <div className="relative flex-1">
                  <input
                    ref={inputRef}
                    value={value}
                    onChange={(event) => setValue(event.target.value)}
                    onKeyDown={onKeyDown}
                    className="w-full bg-transparent font-mono text-[0.8125rem] text-strong caret-text outline-none"
                    placeholder="help"
                    aria-label="Terminal input"
                    autoComplete="off"
                    autoCapitalize="off"
                    spellCheck={false}
                  />
                  {completion && completion !== value && (
                    <span
                      className="pointer-events-none absolute inset-y-0 left-0 flex items-center font-mono text-[0.8125rem] text-faint"
                      aria-hidden
                    >
                      <span className="invisible">{value}</span>
                      <span>{completion.slice(value.length)}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Hint bar */}
            <div className="meta shrink-0 border-t border-line/[0.08] px-4 py-2.5 sm:px-6">
              <span className="hidden sm:inline">tab completes · ↑↓ history · ctrl+l clears · </span>
              esc closes
            </div>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
