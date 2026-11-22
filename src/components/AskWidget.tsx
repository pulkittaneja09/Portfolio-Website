import { AnimatePresence, m } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { ChatIcon, CloseIcon, SendIcon } from '@/components/icons';
import { profile } from '@/data/portfolio';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { SUGGESTED_QUESTIONS, ask } from '@/lib/ask';
import { MotionRoot } from '@/components/MotionRoot';

interface Message {
  id: number;
  from: 'visitor' | 'site';
  text: string;
  related?: string[];
}

const GREETING: Message = {
  id: 0,
  from: 'site',
  text: `Ask me anything about Pulkit — projects, stack, experience, availability. I answer only from the data on this page, so I will not make anything up.`,
  related: SUGGESTED_QUESTIONS.slice(0, 3),
};

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * A small answer box, not a chatbot. Questions are matched against topics
 * built from portfolio.ts (see lib/ask.ts) — no API key, no network call,
 * and no way for it to invent a credential.
 *
 * App owns `open`, so the phone top bar and the palette can open it too. On
 * desktop the launcher is a small round button sized to sit in the page
 * gutter, clear of the content column at every width; on phones there is no
 * floating launcher at all.
 */
export function AskWidget({ open, onOpenChange }: Props) {
  const reduced = useReducedMotion();
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [value, setValue] = useState('');
  const nextId = useRef(1);
  const panelRef = useRef<HTMLDivElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Escape closes the panel while focus is inside it (so it never also
  // closes a palette opened on top of it).
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && panelRef.current?.contains(document.activeElement)) onOpenChange(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onOpenChange]);

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => inputRef.current?.focus(), 160);
    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: reduced ? 'auto' : 'smooth' });
  }, [messages, reduced]);

  function send(question: string) {
    const trimmed = question.trim();
    if (!trimmed) return;

    const answer = ask(trimmed);
    setMessages((current) => [
      ...current,
      { id: (nextId.current += 1), from: 'visitor', text: trimmed },
      { id: (nextId.current += 1), from: 'site', text: answer.text, related: answer.related },
    ]);
    setValue('');
  }

  return (
    <MotionRoot>
      {/* ── Launcher (desktop) ───────────────────────────────────────────
          36px wide at 12px from the edge between 1024 and 1279, where the
          gutter is 48px; 24px from the edge above that. The label shows on
          hover and focus only. */}
      <button
        type="button"
        onClick={() => onOpenChange(!open)}
        className="group glass fixed bottom-6 right-3 z-[65] hidden h-9 w-9 print:!hidden place-items-center rounded-full text-body shadow-float transition-[border-color,color] duration-200 hover:border-line/[0.14] hover:text-strong lg:grid xl:right-6"
        aria-expanded={open}
        aria-controls="ask-panel"
        aria-label={open ? 'Close the Ask about Pulkit panel' : 'Ask about Pulkit'}
      >
        {open ? <CloseIcon className="h-4 w-4" /> : <ChatIcon className="h-4 w-4" />}
        <span
          className="glass pointer-events-none absolute right-full top-1/2 mr-2 hidden -translate-y-1/2 whitespace-nowrap rounded-full px-3 py-1.5 text-sm text-strong group-hover:block group-focus-visible:block"
          aria-hidden
        >
          {open ? 'Close' : 'Ask about Pulkit'}
        </span>
      </button>

      {/* ── Panel ────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <m.div
            id="ask-panel"
            role="dialog"
            ref={panelRef}
            aria-label="Ask about Pulkit"
            className="glass-strong fixed bottom-4 right-4 z-[66] flex print:hidden max-h-[min(30rem,70vh)] w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-xl shadow-overlay lg:bottom-[4.25rem] lg:right-3 xl:right-6"
            initial={reduced ? undefined : { opacity: 0, y: 10, scale: 0.985 }}
            animate={reduced ? undefined : { opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? undefined : { opacity: 0, y: 6, scale: 0.99 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <header className="flex shrink-0 items-center gap-2.5 border-b border-line/[0.08] py-2.5 pl-4 pr-2">
              <p className="flex-1 text-sm font-medium tracking-[-0.01em]">Ask about Pulkit</p>
              <span className="label text-[0.625rem] text-faint">offline · no API</span>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="grid h-8 w-8 place-items-center rounded-md text-faint transition-colors duration-200 hover:text-strong"
                aria-label="Close"
              >
                <CloseIcon className="h-3.5 w-3.5" />
              </button>
            </header>

            <div
              ref={logRef}
              data-lenis-prevent
              className="flex-1 space-y-3 overflow-y-auto overscroll-contain p-4"
              aria-live="polite"
            >
              {messages.map((message) => (
                <div key={message.id}>
                  <div
                    className={
                      message.from === 'visitor'
                        ? 'ml-auto max-w-[85%] rounded-xl rounded-br-sm bg-line/[0.08] px-3.5 py-2.5 text-[0.8125rem] leading-relaxed text-strong'
                        : 'max-w-[92%] rounded-xl rounded-bl-sm border border-line/[0.08] px-3.5 py-2.5 text-[0.8125rem] leading-relaxed text-body'
                    }
                  >
                    {message.text}
                  </div>

                  {message.related && message.related.length > 0 && (
                    <ul className="mt-3 flex flex-wrap gap-1.5">
                      {message.related.map((question) => (
                        <li key={question}>
                          <button
                            type="button"
                            onClick={() => send(question)}
                            className="rounded-md border border-line/[0.08] px-2.5 py-1 text-left text-[0.6875rem] text-body transition-colors duration-300 hover:border-line/[0.14] hover:text-strong"
                          >
                            {question}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>

            <form
              className="flex shrink-0 items-center gap-2 border-t border-line/[0.08] p-3"
              onSubmit={(event) => {
                event.preventDefault();
                send(value);
              }}
            >
              <label htmlFor="ask-input" className="sr-only">
                Ask a question about Pulkit
              </label>
              <input
                id="ask-input"
                ref={inputRef}
                value={value}
                onChange={(event) => setValue(event.target.value)}
                placeholder="What has he built?"
                autoComplete="off"
                className="min-w-0 flex-1 rounded-lg border border-line/[0.08] bg-transparent px-3.5 py-2 text-[0.8125rem] text-strong outline-none transition-colors duration-300 placeholder:text-faint focus:border-line/[0.14]"
              />
              <button
                type="submit"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-strong text-bg transition-opacity duration-300 hover:opacity-90"
                aria-label="Send question"
              >
                <SendIcon className="h-4 w-4" />
              </button>
            </form>

            <p className="meta shrink-0 border-t border-line/[0.08] px-4 py-2.5 text-[0.625rem] leading-relaxed">
              Answers are matched against this page&rsquo;s data, not generated. For anything it cannot
              answer, email {profile.email}.
            </p>
          </m.div>
        )}
      </AnimatePresence>
    </MotionRoot>
  );
}
