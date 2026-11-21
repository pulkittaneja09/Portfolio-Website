import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { ChatIcon, CloseIcon, SendIcon, SparkIcon } from '@/components/icons';
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
        className="fixed bottom-5 right-5 z-[65] inline-flex items-center gap-2 rounded-full border border-accent/40 bg-surface/95 py-2.5 pl-3.5 pr-4 text-sm text-ink shadow-lift backdrop-blur transition-colors hover:border-accent hover:bg-elevated sm:bottom-6 sm:right-6"
        aria-expanded={open}
        aria-controls="ask-panel"
      >
        {open ? (
          <CloseIcon className="h-4 w-4 text-accent" />
        ) : (
          <ChatIcon className="h-4 w-4 text-accent" />
        )}
        <span className="hidden sm:inline">{open ? 'Close' : 'Ask about Pulkit'}</span>
        <span className="sm:hidden">{open ? 'Close' : 'Ask'}</span>
      </button>

      {/* ── Panel ────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="ask-panel"
            role="dialog"
            aria-label="Ask about Pulkit"
            className="fixed bottom-20 right-4 z-[66] flex max-h-[min(30rem,70vh)] w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-line bg-surface/97 shadow-lift backdrop-blur-xl sm:bottom-[4.75rem] sm:right-6"
            initial={reduced ? undefined : { opacity: 0, y: 12, scale: 0.98 }}
            animate={reduced ? undefined : { opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? undefined : { opacity: 0, y: 8, scale: 0.99 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            <header className="flex shrink-0 items-center gap-2.5 border-b border-line px-4 py-3">
              <SparkIcon className="h-4 w-4 text-accent" />
              <p className="flex-1 font-display text-sm">Ask about Pulkit</p>
              <span className="font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-faint">
                offline · no API
              </span>
            </header>

            <div
              ref={logRef}
              className="flex-1 space-y-3 overflow-y-auto overscroll-contain p-4"
              aria-live="polite"
            >
              {messages.map((message) => (
                <div key={message.id}>
                  <div
                    className={
                      message.from === 'visitor'
                        ? 'ml-auto max-w-[85%] rounded-2xl rounded-br-sm border border-accent/40 bg-accent/[0.08] px-3.5 py-2.5 text-[0.8125rem] leading-relaxed text-ink'
                        : 'max-w-[92%] rounded-2xl rounded-bl-sm border border-line bg-elevated px-3.5 py-2.5 text-[0.8125rem] leading-relaxed text-ink/85'
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
                            className="rounded-full border border-line px-2.5 py-1 text-left text-[0.6875rem] text-muted transition-colors hover:border-accent/50 hover:text-accent"
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
              className="flex shrink-0 items-center gap-2 border-t border-line p-3"
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
                className="min-w-0 flex-1 rounded-full border border-line bg-elevated px-3.5 py-2 text-[0.8125rem] text-ink outline-none transition-colors placeholder:text-faint focus:border-accent/60"
              />
              <button
                type="submit"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent text-accent-ink transition-[filter] hover:brightness-110"
                aria-label="Send question"
              >
                <SendIcon className="h-4 w-4" />
              </button>
            </form>

            <p className="shrink-0 border-t border-line px-4 py-2 font-mono text-[0.5625rem] leading-relaxed text-faint">
              Answers are matched against this page&rsquo;s data, not generated. For anything it cannot
              answer, email {profile.email}.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
