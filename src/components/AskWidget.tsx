import { AnimatePresence, m } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { ChatIcon, CloseIcon, SendIcon } from '@/components/icons';
import { profile } from '@/data/portfolio';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { SUGGESTED_QUESTIONS, ask } from '@/lib/ask';

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

/**
 * A small answer box, not a chatbot. Questions are matched against topics
 * built from portfolio.ts (see lib/ask.ts) — no API key, no network call,
 * and no way for it to invent a credential.
 */
export function AskWidget() {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [value, setValue] = useState('');
  const nextId = useRef(1);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
    <>
      {/* ── Launcher ─────────────────────────────────────────────────────── */}
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="glass fixed bottom-5 right-5 z-[65] inline-flex h-10 items-center gap-2 rounded-full pl-3.5 pr-4 text-[0.8125rem] text-strong shadow-[0_12px_32px_-12px_rgba(0,0,0,0.6)] transition-[border-color] duration-400 hover:border-white/[0.14] sm:bottom-6 sm:right-6"
        aria-expanded={open}
        aria-controls="ask-panel"
      >
        {open ? <CloseIcon className="h-4 w-4 text-body" /> : <ChatIcon className="h-4 w-4 text-body" />}
        <span className="hidden sm:inline">{open ? 'Close' : 'Ask about Pulkit'}</span>
        <span className="sm:hidden">{open ? 'Close' : 'Ask'}</span>
      </button>

      {/* ── Panel ────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <m.div
            id="ask-panel"
            role="dialog"
            aria-label="Ask about Pulkit"
            className="glass-strong fixed bottom-20 right-4 z-[66] flex max-h-[min(30rem,70vh)] w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-xl shadow-[0_24px_64px_-24px_rgba(0,0,0,0.7)] sm:bottom-[4.75rem] sm:right-6"
            initial={reduced ? undefined : { opacity: 0, y: 10, scale: 0.985 }}
            animate={
              reduced
                ? undefined
                : { opacity: 1, y: 0, scale: 1 }
            }
            exit={reduced ? undefined : { opacity: 0, y: 6, scale: 0.99 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <header className="flex shrink-0 items-center gap-2.5 border-b border-white/[0.07] px-4 py-3">
              <p className="flex-1 text-sm font-medium tracking-[-0.01em]">Ask about Pulkit</p>
              <span className="label text-[0.625rem] text-faint">offline · no API</span>
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
                        ? 'ml-auto max-w-[85%] rounded-xl rounded-br-sm bg-white/[0.08] px-3.5 py-2.5 text-[0.8125rem] leading-relaxed text-strong'
                        : 'max-w-[92%] rounded-xl rounded-bl-sm border border-white/[0.07] px-3.5 py-2.5 text-[0.8125rem] leading-relaxed text-body'
                    }
                  >
                    {message.text}
                  </div>

                  {message.related && message.related.length > 0 && (
                    <ul className="mt-2.5 flex flex-wrap gap-1.5">
                      {message.related.map((question) => (
                        <li key={question}>
                          <button
                            type="button"
                            onClick={() => send(question)}
                            className="rounded-md border border-white/[0.07] px-2.5 py-1 text-left text-[0.6875rem] text-body transition-colors duration-400 hover:border-white/[0.14] hover:text-strong"
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
              className="flex shrink-0 items-center gap-2 border-t border-white/[0.07] p-3"
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
                className="min-w-0 flex-1 rounded-lg border border-white/[0.07] bg-transparent px-3.5 py-2 text-[0.8125rem] text-strong outline-none transition-colors duration-400 placeholder:text-faint focus:border-white/[0.14]"
              />
              <button
                type="submit"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-strong text-bg transition-opacity duration-400 hover:opacity-90"
                aria-label="Send question"
              >
                <SendIcon className="h-4 w-4" />
              </button>
            </form>

            <p className="meta shrink-0 border-t border-white/[0.07] px-4 py-2.5 text-[0.625rem] leading-relaxed">
              Answers are matched against this page&rsquo;s data, not generated. For anything it cannot
              answer, email {profile.email}.
            </p>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
