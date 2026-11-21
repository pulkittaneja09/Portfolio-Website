import { useEffect, useRef, useState } from 'react';
import { agentTraces } from '@/data/portfolio';
import type { AgentTrace } from '@/data/types';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/cn';
import { stagger } from '@/lib/stagger';

/**
 * The signature element: a small card that plays an agent run line by line,
 * like a live trace — the prompt types out, each step lands ~350ms after the
 * last with its timing and a champagne ✓, the result holds for four seconds,
 * then the card fades and plays the next example.
 *
 * Everything derives from one elapsed-time clock advanced in a rAF loop.
 * Hovering pauses the clock; the loop stops entirely while the card is off
 * screen or the tab is hidden; React only re-renders when something visible
 * changes. Under reduced motion it renders the first trace, complete, still.
 */

const CHAR_MS = 22; // prompt typing speed
const AFTER_PROMPT_MS = 300; // beat between the prompt and the first step
const LINE_MS = 350; // one line every 350ms
const RESOLVE_MS = 200; // a step's timing and ✓ land just after its line
const HOLD_MS = 4000; // the finished trace stays up for 4s
const FADE_MS = 450;
const GAP_MS = 400; // blank beat before the next trace starts typing
const START_DELAY_MS = 900; // let the page's load entrance settle first

interface Frame {
  trace: number;
  typed: number;
  /** Lines shown after the prompt: the steps, then the result. */
  shown: number;
  resolved: number;
  fading: boolean;
}

function promptOf(trace: AgentTrace) {
  return { head: 'agent.run(', arg: `"${trace.task}"`, tail: ')' };
}

function timeline(trace: AgentTrace) {
  const { head, arg, tail } = promptOf(trace);
  const promptLen = head.length + arg.length + tail.length;
  const lines = trace.steps.length + 1;
  const appear = (i: number) => promptLen * CHAR_MS + AFTER_PROMPT_MS + i * LINE_MS;
  const fadeStart = appear(lines - 1) + RESOLVE_MS + HOLD_MS;
  return { promptLen, lines, appear, fadeStart, end: fadeStart + FADE_MS };
}

function derive(elapsed: number, index: number): Frame {
  const t = timeline(agentTraces[index]);
  if (elapsed < 0) return { trace: index, typed: 0, shown: 0, resolved: 0, fading: false };

  let shown = 0;
  let resolved = 0;
  for (let i = 0; i < t.lines; i += 1) {
    if (elapsed >= t.appear(i)) shown = i + 1;
    if (elapsed >= t.appear(i) + RESOLVE_MS) resolved = i + 1;
  }

  return {
    trace: index,
    typed: Math.min(t.promptLen, Math.floor(elapsed / CHAR_MS)),
    shown,
    resolved,
    fading: elapsed >= t.fadeStart,
  };
}

function complete(index: number): Frame {
  const t = timeline(agentTraces[index]);
  return { trace: index, typed: t.promptLen, shown: t.lines, resolved: t.lines, fading: false };
}

const same = (a: Frame, b: Frame) =>
  a.trace === b.trace &&
  a.typed === b.typed &&
  a.shown === b.shown &&
  a.resolved === b.resolved &&
  a.fading === b.fading;

function Caret() {
  return (
    <span
      className="ml-px inline-block h-[1.1em] w-[0.5em] translate-y-[0.2em] animate-caret-blink bg-strong/75"
      aria-hidden
    />
  );
}

function Check() {
  return (
    <svg viewBox="0 0 12 12" className="tick-in h-3 w-3 text-accent" aria-hidden focusable="false">
      <path
        d="M2.5 6.4 5 8.9l4.5-5.8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** One fixed-height row, so the card never changes size while it plays. */
const row = 'grid h-[1.7em] items-center gap-x-[1ch] pl-[2ch]';

export function AgentRun({ className }: { className?: string }) {
  const reduced = useReducedMotion();
  const [frame, setFrame] = useState<Frame>(() => (reduced ? complete(0) : derive(-1, 0)));
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    if (reduced) {
      setFrame(complete(0));
      return;
    }

    const node = rootRef.current;
    let raf = 0;
    let last = 0;
    let elapsed = -START_DELAY_MS;
    let index = 0;
    let onScreen = true;

    const tick = (now: number) => {
      // Clamp the step so a backgrounded tab does not leap ahead on return.
      const dt = last ? Math.min(now - last, 100) : 0;
      last = now;
      if (!pausedRef.current) elapsed += dt;

      if (elapsed >= timeline(agentTraces[index]).end) {
        index = (index + 1) % agentTraces.length;
        elapsed = -GAP_MS;
      }

      const next = derive(elapsed, index);
      setFrame((previous) => (same(previous, next) ? previous : next));
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (raf || !onScreen || document.hidden) return;
      last = 0;
      raf = requestAnimationFrame(tick);
    };

    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    let observer: IntersectionObserver | null = null;
    if (node && typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(([entry]) => {
        onScreen = entry.isIntersecting;
        if (onScreen) start();
        else stop();
      });
      observer.observe(node);
    }

    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', onVisibility);
    start();

    return () => {
      stop();
      observer?.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [reduced]);

  const trace = agentTraces[frame.trace];
  const { head, arg, tail } = promptOf(trace);
  const typedHead = head.slice(0, frame.typed);
  const typedArg = arg.slice(0, Math.max(0, frame.typed - head.length));
  const typedTail = tail.slice(0, Math.max(0, frame.typed - head.length - arg.length));
  const steps = trace.steps.length;
  const resultShown = frame.shown > steps;

  // Screen readers get the first trace as plain text; the animated copy is
  // decorative and hidden from them.
  const first = agentTraces[0];
  const spoken = `Example agent trace. agent.run("${first.task}"). ${first.steps
    .map((step) => `${step.kind}: ${step.detail}${step.time ? `, ${step.time}` : ''}`)
    .join('. ')}. Done: ${first.result}.`;

  return (
    <figure
      ref={rootRef}
      className={cn(
        'enter w-full max-w-[22.5rem] overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.02] font-mono text-xs',
        className,
      )}
      style={stagger(9)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <figcaption className="flex items-center gap-2.5 whitespace-nowrap border-b border-white/[0.06] px-3.5 py-2.5">
        <span className="flex shrink-0 gap-1.5" aria-hidden>
          <span className="h-1.5 w-1.5 rounded-full bg-white/[0.14]" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/[0.14]" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/[0.14]" />
        </span>
        <span className="shrink-0 text-body">
          agent.run <span className="text-faint">— example trace</span>
        </span>
        {/* One line, always: the slug truncates before the header ever wraps,
            so the card keeps its height across traces. */}
        <span className="ml-auto min-w-0 truncate text-faint" aria-hidden>
          {paused && !reduced ? 'paused' : trace.project}
        </span>
        <span className="sr-only">{spoken}</span>
      </figcaption>

      <div
        className={cn(
          'px-4 py-3 leading-[1.7]',
          frame.fading && 'opacity-0 transition-opacity duration-[450ms] ease-linear',
        )}
        aria-hidden
      >
        {/* The prompt types out character by character. */}
        <div className="flex h-[1.7em] items-center whitespace-pre">
          <span className="text-faint">{'> '}</span>
          <span className="text-body">{typedHead}</span>
          <span className="text-strong">{typedArg}</span>
          <span className="text-body">{typedTail}</span>
          {frame.shown === 0 && !reduced && <Caret />}
        </div>

        {trace.steps.map((step, i) => {
          const visible = frame.shown > i;
          const done = frame.resolved > i;
          const active = frame.shown === i + 1 && !reduced;
          return (
            <div key={`${frame.trace}-${i}`} className={cn(row, 'grid-cols-[5ch_minmax(0,1fr)_auto_0.75rem]')}>
              {visible && (
                <>
                  <span className="line-in text-faint">{step.kind}</span>
                  <span
                    className={cn('line-in truncate whitespace-pre text-body', !step.time && 'col-span-3')}
                  >
                    {step.detail}
                    {active && <Caret />}
                  </span>
                  {step.time && (
                    <span className="line-in text-right tabular-nums text-faint">
                      {done ? step.time : '···'}
                    </span>
                  )}
                  {step.time && <span className="grid place-items-center">{done && <Check />}</span>}
                </>
              )}
            </div>
          );
        })}

        <div className={cn(row, 'grid-cols-[5ch_minmax(0,1fr)]')}>
          {resultShown && (
            <>
              <span className="line-in text-strong">done</span>
              <span className="line-in truncate whitespace-pre text-strong">
                {trace.result}
                {!reduced && <Caret />}
              </span>
            </>
          )}
        </div>
      </div>
    </figure>
  );
}
