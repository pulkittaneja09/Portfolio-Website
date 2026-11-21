import { HeroVisual } from '@/components/HeroVisual';
import { LocalClock } from '@/components/LocalClock';
import { MagneticButton } from '@/components/MagneticButton';
import { RotatingRoles } from '@/components/RotatingRoles';
import { StatusBadge } from '@/components/StatusBadge';
import { ArrowRightIcon, DownloadIcon } from '@/components/icons';
import { education, profile } from '@/data/portfolio';

/**
 * The hero's entrance is CSS, not Framer Motion, and it never animates
 * opacity.
 *
 * A JS-driven fade holds each element at opacity 0 until React has hydrated,
 * and the LCP element lives here, so on a throttled phone that is pure render
 * delay. Instead everything paints on the first frame and settles from a blur
 * (the name) or a short rise (the rest). Both collapse to nothing under
 * prefers-reduced-motion — see `.hero-sharpen` and `.hero-rise` in index.css.
 */
const delay = (seconds: number) => ({ animationDelay: `${seconds}s` });

const facts = (): { label: string; value: string }[] => [
  { label: 'Currently', value: 'Co-founder, Audaxity' },
  { label: 'Studying', value: `${education.degree} CSE · VIT Chennai` },
  { label: 'Graduating', value: education.end.replace(' (expected)', '') },
  { label: 'CGPA', value: `${education.score} / 10` },
];

export function Hero() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-name"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden pt-28 sm:pt-32"
    >
      {/* ── The cloud ─────────────────────────────────────────────────────
          Desktop: a large field to the right, bleeding off the shell.
          Mobile: a smaller static scatter sitting behind the name. */}
      <div
        className="pointer-events-none absolute right-[-22vw] top-1/2 -z-10 w-[min(118vw,34rem)] -translate-y-[62%] opacity-40 sm:right-[-8vw] sm:opacity-60 lg:right-[max(-6rem,calc((100vw-75rem)/2-10rem))] lg:w-[min(52vw,44rem)] lg:-translate-y-1/2 lg:opacity-100"
        aria-hidden
      >
        <div className="hero-rise" style={delay(0.2)}>
          <HeroVisual />
        </div>
      </div>

      <div className="shell flex flex-1 flex-col">
        {/* ── Meta row ──────────────────────────────────────────────────── */}
        <div className="hero-rise flex flex-wrap items-center justify-between gap-4" style={delay(0)}>
          <StatusBadge label={profile.availability} />
          <LocalClock className="label" />
        </div>

        {/* ── Name and pitch ────────────────────────────────────────────── */}
        <div className="flex flex-1 flex-col justify-center py-16 sm:py-20">
          <p className="hero-rise label" style={delay(0.05)}>
            <span className="text-text">00</span>
            <span className="mx-2 text-faint">—</span>
            AI agents · Backend systems
          </p>

          <h1 id="hero-name" className="mt-6 text-display-xl font-medium tracking-[-0.045em] sm:mt-8">
            {profile.name.split(' ').map((word, i) => (
              <span key={word} className="hero-sharpen block" style={delay(0.08 + i * 0.08)}>
                {word}
              </span>
            ))}
          </h1>

          <p
            className="hero-rise mt-8 max-w-[34ch] text-pretty text-[1.1875rem] leading-[1.45] tracking-[-0.01em] text-text/90 sm:text-[1.375rem]"
            style={delay(0.24)}
          >
            {profile.tagline}
          </p>

          <div className="hero-rise mt-4" style={delay(0.3)}>
            <RotatingRoles roles={profile.roles} />
          </div>

          <div className="hero-rise mt-10 flex flex-wrap items-center gap-3" style={delay(0.36)}>
            <MagneticButton href="#work" variant="solid">
              View work
              <ArrowRightIcon className="h-4 w-4 transition-transform duration-400 ease-quiet group-hover:translate-x-0.5" />
            </MagneticButton>

            <MagneticButton href={profile.resumePath} variant="outline" download>
              <DownloadIcon className="h-4 w-4 text-muted" />
              Résumé
            </MagneticButton>

            <MagneticButton href="#contact" variant="ghost">
              Get in touch
            </MagneticButton>
          </div>
        </div>

        {/* ── Facts ─────────────────────────────────────────────────────── */}
        <dl
          className="hero-rise grid grid-cols-2 gap-x-6 gap-y-6 border-t border-hairline py-8 sm:grid-cols-4"
          style={delay(0.44)}
        >
          {facts().map((fact) => (
            <div key={fact.label} className="min-w-0">
              <dt className="label text-faint">{fact.label}</dt>
              <dd className="mt-2 text-sm text-text/90 sm:truncate">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
