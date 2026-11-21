import { Reveal } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';
import { ArrowUpRightIcon, PinIcon } from '@/components/icons';
import { education, experience } from '@/data/portfolio';
import { cn } from '@/lib/cn';

export function Experience() {
  return (
    <section
      id="experience"
      aria-labelledby="experience-title"
      className="scroll-mt-24 border-t border-hairline py-24 sm:py-28"
    >
      <div className="shell">
        <SectionHeading
          index="02"
          label="Experience"
          title={<span id="experience-title">Three roles, all shipping to someone else’s deadline.</span>}
          lede="A founder seat and two engineering internships. Each bullet is the work, not the job description."
        />

        <ol className="relative">
          {/* The spine. Sits behind the markers, stops at the last entry. */}
          <span
            className="absolute bottom-10 left-[7px] top-2 w-px bg-gradient-to-b from-accent/60 via-[var(--border)] to-transparent sm:left-[9px]"
            aria-hidden
          />

          {experience.map((item, index) => (
            <Reveal
              as="li"
              key={`${item.org}-${item.role}`}
              index={index}
              className="relative pb-12 pl-8 last:pb-0 sm:pl-12"
            >
              {/* Marker */}
              <span
                className={cn(
                  'absolute left-0 top-1.5 grid h-[15px] w-[15px] place-items-center rounded-full border-2 sm:h-[19px] sm:w-[19px]',
                  item.kind === 'founder' ? 'border-strong bg-light/[0.06]' : 'border-hairline bg-bg',
                )}
                aria-hidden
              >
                {item.kind === 'founder' && <span className="h-1.5 w-1.5 rounded-full bg-text" />}
              </span>

              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h3 className=" text-xl sm:text-2xl">{item.role}</h3>
                <span className="text-faint" aria-hidden>
                  /
                </span>
                {item.href ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="group inline-flex items-center gap-1 text-lg text-text"
                  >
                    {item.org}
                    <ArrowUpRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                ) : (
                  <span className="text-lg text-text">{item.org}</span>
                )}
              </div>

              <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-faint">
                <span>
                  {item.start} — {item.end}
                </span>
                <span aria-hidden>·</span>
                <span className="inline-flex items-center gap-1">
                  <PinIcon className="h-3.5 w-3.5" />
                  {item.location}
                </span>
                {item.kind === 'founder' && (
                  <span className="rounded-full border border-strong px-2 py-0.5 uppercase tracking-[0.1em] text-text">
                    Founder
                  </span>
                )}
              </p>

              <ul className="mt-5 space-y-3">
                {item.bullets.map((bullet) => (
                  <li
                    key={bullet.slice(0, 32)}
                    className="flex gap-3 text-[0.9375rem] leading-relaxed text-text/80"
                  >
                    <span className="mt-[0.5rem] h-px w-4 shrink-0 bg-light/[0.06]" aria-hidden />
                    <span className="max-w-2xl">{bullet}</span>
                  </li>
                ))}
              </ul>

              <ul className="mt-5 flex flex-wrap gap-1.5">
                {item.stack.map((tech) => (
                  <li key={tech} className="chip">
                    {tech}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </ol>

        {/* ── Education ──────────────────────────────────────────────────── */}
        <Reveal index={3} className="mt-14">
          <div className="panel flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="label">Education</p>
              <h3 className="mt-2 text-lg">{education.institution}</h3>
              <p className="mt-1 text-sm text-muted">
                {education.degree}, {education.field}
              </p>
            </div>

            <div className="flex items-center gap-8 sm:text-right">
              <div>
                <p className=" text-2xl text-text">{education.score}</p>
                <p className="font-mono text-[0.625rem] uppercase tracking-[0.12em] text-faint">
                  {education.scoreLabel}
                </p>
              </div>
              <div>
                <p className="font-mono text-sm text-text">
                  {education.start} — {education.end.replace(' (expected)', '')}
                </p>
                <p className="font-mono text-[0.625rem] uppercase tracking-[0.12em] text-faint">Expected</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
