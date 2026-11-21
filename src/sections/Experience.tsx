import { Reveal } from '@/components/Reveal';
import { SectionLabel } from '@/components/SectionLabel';
import { ArrowUpRightIcon } from '@/components/icons';
import { education, experience } from '@/data/portfolio';
import { cn } from '@/lib/cn';

/**
 * A changelog-style timeline: dates in a mono rail on the left, the work on
 * the right, joined by a single hairline spine. The current role holds the
 * only lit node.
 */
export function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-title" className="section-y scroll-mt-24">
      <div className="shell">
        <SectionLabel id="experience-title" className="mb-10">
          Experience
        </SectionLabel>

        <ol className="relative">
          {experience.map((item, index) => {
            const current = item.end.toLowerCase() === 'present';
            return (
              <Reveal
                as="li"
                key={`${item.org}-${item.role}`}
                index={index}
                className="relative grid gap-4 border-t border-hairline py-10 sm:py-12 md:grid-cols-[13rem_minmax(0,1fr)] md:gap-12"
              >
                {/* ── Rail ─────────────────────────────────────────────── */}
                <div className="flex items-start gap-3 md:flex-col md:gap-2">
                  <p className="label flex items-center gap-2.5 text-text">
                    <span
                      className={cn(
                        'h-1.5 w-1.5 rounded-full',
                        current ? 'soft-pulse bg-text' : 'border border-[var(--border-hover)]',
                      )}
                      aria-hidden
                    />
                    {item.start} — {item.end}
                  </p>
                  <p className="label text-faint md:pl-4">{item.location}</p>
                </div>

                {/* ── Work ─────────────────────────────────────────────── */}
                <div className="min-w-0">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h3 className="text-display-sm">{item.role}</h3>
                    {item.kind === 'founder' && (
                      <span className="label rounded-full border border-hairline px-2 py-0.5 text-[0.625rem]">
                        Founder
                      </span>
                    )}
                  </div>

                  {item.href ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="group mt-1.5 inline-flex items-center gap-1 text-muted transition-colors duration-400 ease-quiet hover:text-text"
                    >
                      {item.org}
                      <ArrowUpRightIcon className="h-3.5 w-3.5 transition-transform duration-400 ease-quiet group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </a>
                  ) : (
                    <p className="mt-1.5 text-muted">{item.org}</p>
                  )}

                  <ul className="mt-6 max-w-[64ch] space-y-3">
                    {item.bullets.map((bullet) => (
                      <li
                        key={bullet.slice(0, 32)}
                        className="flex gap-4 text-[0.9375rem] leading-relaxed text-muted"
                      >
                        <span
                          className="mt-[0.7rem] h-px w-3 shrink-0 bg-[var(--border-hover)]"
                          aria-hidden
                        />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>

                  <p className="meta mt-6 uppercase tracking-[0.08em]">{item.stack.join(' · ')}</p>
                </div>
              </Reveal>
            );
          })}
        </ol>

        {/* ── Education ──────────────────────────────────────────────────── */}
        <Reveal index={3}>
          <div className="panel mt-6 grid gap-6 p-6 sm:p-8 md:grid-cols-[13rem_minmax(0,1fr)_auto] md:items-center md:gap-12">
            <p className="label">Education</p>
            <div>
              <h3 className="text-lg tracking-[-0.015em]">{education.institution}</h3>
              <p className="mt-1 text-sm text-muted">
                {education.degree}, {education.field}
              </p>
            </div>

            <div className="flex items-end gap-10 md:text-right">
              <div>
                <p className="text-[1.75rem] font-medium leading-none tracking-[-0.035em] text-text">
                  {education.score}
                </p>
                <p className="meta mt-2 uppercase tracking-[0.08em]">{education.scoreLabel}</p>
              </div>
              <div>
                <p className="text-sm text-text">
                  {education.start} — {education.end.replace(' (expected)', '')}
                </p>
                <p className="meta mt-2 uppercase tracking-[0.08em]">Expected</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
