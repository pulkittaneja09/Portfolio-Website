import { Reveal } from '@/components/Reveal';
import { ScrambleText } from '@/components/ScrambleText';
import { ArrowUpRightIcon } from '@/components/icons';
import { venture } from '@/data/portfolio';

/**
 * The founder section is the one raised surface on the page: an elevated
 * panel lit from above by a single soft white source. It is the thing that
 * separates this CV from every other student's, so it gets depth, not colour.
 */
export function Audaxity() {
  return (
    <section id="audaxity" aria-labelledby="audaxity-title" className="section-y scroll-mt-24">
      <div className="shell">
        <Reveal>
          <div className="flex items-center gap-4">
            <span className="label whitespace-nowrap">
              <span className="text-text">03</span>
              <span className="mx-2 text-faint">—</span>
              Founder
            </span>
            <span className="h-px flex-1 bg-[var(--border)]" aria-hidden />
          </div>
        </Reveal>

        <Reveal index={1} className="mt-10 sm:mt-14">
          <div className="relative overflow-hidden rounded-[1.25rem] border border-hairline bg-elevated shadow-float">
            {/* One light source, high and centred-right. Monochrome. */}
            <div
              className="pointer-events-none absolute -top-1/2 left-1/2 h-full w-[120%] -translate-x-1/3"
              style={{ background: 'radial-gradient(closest-side, rgb(var(--pool) / calc(var(--pool-strength) * 1.5)), transparent)' }}
              aria-hidden
            />
            {/* A brighter hairline along the top edge, where the light lands. */}
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-px"
              style={{
                background:
                  'linear-gradient(90deg, transparent, rgb(var(--light) / 0.22) 55%, transparent)',
              }}
              aria-hidden
            />
            <div className="dot-matrix pointer-events-none absolute inset-0 opacity-60" aria-hidden />

            <div className="relative grid gap-14 p-6 sm:p-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-20 lg:p-16">
              {/* ── Pitch ──────────────────────────────────────────────── */}
              <div>
                <p className="label">
                  {venture.role} · since {venture.since}
                </p>

                <h2 id="audaxity-title" className="mt-5 text-display-lg">
                  <ScrambleText text={venture.name} />
                </h2>

                <p className="mt-6 max-w-[52ch] text-pretty text-[1.0625rem] leading-[1.65] text-muted sm:text-lg">
                  {venture.pitch}
                </p>

                {/* ── Credentials ──────────────────────────────────────── */}
                <ul className="mt-10 divide-y divide-hairline border-y border-hairline">
                  {venture.badges.map((badge, i) => (
                    <li key={badge.label} className="grid gap-1 py-4 sm:grid-cols-[2.5rem_minmax(0,1fr)]">
                      <span className="meta pt-0.5">{String(i + 1).padStart(2, '0')}</span>
                      <div>
                        <p className="text-sm text-text">{badge.label}</p>
                        <p className="mt-1 text-[0.8125rem] leading-relaxed text-muted">{badge.detail}</p>
                      </div>
                    </li>
                  ))}
                </ul>

                <p className="meta mt-6 uppercase tracking-[0.08em]">{venture.stack.join(' · ')}</p>

                {venture.href && (
                  <a
                    href={venture.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="group mt-10 inline-flex h-10 items-center gap-2 rounded-lg border border-hairline px-4 text-sm text-text transition-colors duration-400 ease-quiet hover:border-strong hover:bg-light/[0.03]"
                  >
                    Visit {venture.name}
                    <ArrowUpRightIcon className="h-4 w-4 text-muted transition-transform duration-400 ease-quiet group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                )}
              </div>

              {/* ── Product pipeline ───────────────────────────────────── */}
              <div>
                <p className="label">What the platform does</p>

                <ol className="relative mt-8">
                  {/* The spine joining each stage to the next. */}
                  <span
                    className="absolute bottom-6 left-[0.9375rem] top-6 w-px bg-[var(--border-hover)]"
                    aria-hidden
                  />
                  {venture.building.map((step, index) => (
                    <li key={step.title} className="relative flex gap-5 pb-8 last:pb-0">
                      <span
                        className="relative grid h-[1.875rem] w-[1.875rem] shrink-0 place-items-center rounded-full border border-strong bg-elevated font-mono text-[0.625rem] text-text"
                        aria-hidden
                      >
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <div className="pt-1">
                        <h3 className="text-[0.9375rem] font-medium tracking-[-0.01em]">{step.title}</h3>
                        <p className="mt-1.5 text-[0.875rem] leading-relaxed text-muted">{step.body}</p>
                      </div>
                    </li>
                  ))}
                </ol>

                <p className="meta mt-10 max-w-[44ch] leading-relaxed">
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
