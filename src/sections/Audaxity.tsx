import { Reveal } from '@/components/Reveal';
import { ArrowUpRightIcon, SparkIcon } from '@/components/icons';
import { venture } from '@/data/portfolio';

/**
 * The founder section gets its own visual language — inverted ground, an
 * accent frame and a numbered pipeline — because it is the thing that
 * separates this CV from every other student's.
 */
export function Audaxity() {
  return (
    <section id="audaxity" aria-labelledby="audaxity-title" className="scroll-mt-24 py-12 sm:py-16">
      <div className="shell">
        <Reveal>
          <div className="relative overflow-hidden rounded-[1.5rem] border border-strong bg-surface">
            {/* Accent wash + grid, so the panel reads as lit from the corner. */}
            <div
              className="pointer-events-none absolute inset-0 opacity-70"
              style={{
                background:
                  'radial-gradient(90% 120% at 100% 0%, rgb(var(--accent) / 0.13), transparent 62%)',
              }}
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.3]"
              style={{
                backgroundImage:
                  'linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)',
                backgroundSize: '56px 56px',
                maskImage: 'radial-gradient(ellipse 70% 90% at 90% 10%, #000, transparent 70%)',
              }}
              aria-hidden
            />

            <div className="relative grid gap-10 p-7 sm:p-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:gap-14 lg:p-14">
              {/* ── Pitch ──────────────────────────────────────────────── */}
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[0.6875rem] tracking-[0.2em] text-text">03</span>
                  <span className="label">Founder</span>
                </div>

                <h2 id="audaxity-title" className="mt-5 text-display-md">
                  {venture.name}
                </h2>

                <p className="mt-2 font-mono text-xs uppercase tracking-[0.14em] text-text">
                  {venture.role} · since {venture.since}
                </p>

                <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-text/85">
                  {venture.pitch}
                </p>

                {/* ── Credentials ──────────────────────────────────────── */}
                <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                  {venture.badges.map((badge) => (
                    <li key={badge.label} className="rounded-xl border border-strong bg-text/[0.05] p-4">
                      <p className="flex items-center gap-2 text-sm text-text">
                        <SparkIcon className="h-4 w-4 shrink-0" />
                        {badge.label}
                      </p>
                      <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-muted">{badge.detail}</p>
                    </li>
                  ))}
                </ul>

                <ul className="mt-7 flex flex-wrap gap-1.5">
                  {venture.stack.map((tech) => (
                    <li key={tech} className="chip">
                      {tech}
                    </li>
                  ))}
                </ul>

                {venture.href && (
                  <a
                    href={venture.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="group mt-8 inline-flex items-center gap-2 rounded-full border border-strong px-5 py-2.5 text-sm transition-colors hover:bg-light/[0.06]"
                  >
                    Visit {venture.name}
                    <ArrowUpRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                )}
              </div>

              {/* ── Product pipeline ───────────────────────────────────── */}
              <div className="relative">
                <p className="label">What the platform does</p>

                <ol className="mt-5 space-y-px overflow-hidden rounded-xl border border-hairline bg-[var(--border)]">
                  {venture.building.map((step, index) => (
                    <li key={step.title} className="relative bg-bg p-5">
                      <div className="flex items-start gap-4">
                        <span
                          className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-md border border-strong bg-text/[0.07] font-mono text-xs text-text"
                          aria-hidden
                        >
                          {index + 1}
                        </span>
                        <div>
                          <h3 className=" text-base">{step.title}</h3>
                          <p className="mt-1.5 text-[0.875rem] leading-relaxed text-muted">{step.body}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>

                <p className="mt-5 font-mono text-[0.6875rem] leading-relaxed text-faint">
                  Lecture → transcript → structured knowledge → syllabus coverage. Each stage feeds the next,
                  so coverage is measured rather than assumed.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
