import { HeroVisual } from '@/components/HeroVisual';
import { MagneticButton } from '@/components/MagneticButton';
import { RotatingRoles } from '@/components/RotatingRoles';
import { StatusBadge } from '@/components/StatusBadge';
import { ArrowRightIcon, DownloadIcon, MailIcon } from '@/components/icons';
import { education, profile } from '@/data/portfolio';

/**
 * The hero's entrance is CSS, not Framer Motion, and it animates transform
 * only — never opacity.
 *
 * A JS-driven fade holds each element at opacity 0 until React has hydrated.
 * On a throttled phone that pushed Largest Contentful Paint to 3.6s, 87% of
 * it render delay, because the LCP element here is the tagline. Painting at
 * full opacity from the first frame and sliding it into place keeps the
 * entrance and drops the delay. The `.hero-rise` keyframes in index.css
 * collapse to nothing under prefers-reduced-motion.
 */
const riseDelay = (seconds: number) => ({ animationDelay: `${seconds}s` });

/** Word-by-word reveal for the name: masked, not faded. */
function AnimatedName({ name }: { name: string }) {
  const words = name.split(' ');

  return (
    <>
      {words.map((word, i) => (
        <span key={word}>
          <span className="inline-block overflow-hidden pb-[0.06em] align-bottom">
            <span className="hero-word inline-block" style={riseDelay(0.06 + i * 0.09)}>
              {word}
            </span>
          </span>
          {/* A plain breaking space between the blocks, so the name wraps. */}
          {i < words.length - 1 ? ' ' : null}
        </span>
      ))}
    </>
  );
}

export function Hero() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-name"
      className="relative isolate overflow-hidden pb-20 pt-28 sm:pb-28 sm:pt-32 lg:pb-32 lg:pt-36"
    >
      <div className="grid-backdrop pointer-events-none absolute inset-0 -z-10 opacity-[0.55]" aria-hidden />

      <div className="shell">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
          {/* ── Copy ─────────────────────────────────────────────────────── */}
          <div className="min-w-0 max-w-2xl">
            <div className="hero-rise" style={riseDelay(0)}>
              <StatusBadge label={profile.availability} />
            </div>

            <h1
              id="hero-name"
              className="mt-7 font-display text-display-xl font-semibold uppercase leading-[0.9]"
            >
              <AnimatedName name={profile.name} />
            </h1>

            <p
              className="hero-rise mt-6 max-w-xl text-pretty text-lg leading-relaxed text-ink/85 sm:text-xl"
              style={riseDelay(0.24)}
            >
              {profile.tagline}
            </p>

            <div className="hero-rise mt-4" style={riseDelay(0.32)}>
              <RotatingRoles roles={profile.roles} />
            </div>

            {/* ── Three CTAs ─────────────────────────────────────────────── */}
            <div
              className="hero-rise mt-9 flex flex-wrap items-center gap-3"
              style={riseDelay(0.4)}
            >
              <MagneticButton href="#work" variant="solid">
                View projects
                <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </MagneticButton>

              <MagneticButton href={profile.resumePath} variant="outline" download>
                <DownloadIcon className="h-4 w-4" />
                Download résumé
              </MagneticButton>

              <MagneticButton href="#contact" variant="ghost">
                <MailIcon className="h-4 w-4" />
                Contact
              </MagneticButton>
            </div>

            {/* ── Context line ───────────────────────────────────────────── */}
            <dl
              className="hero-rise mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-line pt-6 font-mono text-xs text-faint"
              style={riseDelay(0.48)}
            >
              <div className="flex items-center gap-2">
                <dt className="sr-only">Studying</dt>
                <dd>
                  <span className="text-muted">{education.degree} CSE</span> · VIT Chennai ·{' '}
                  {education.end}
                </dd>
              </div>
              <div className="flex items-center gap-2">
                <dt className="sr-only">{education.scoreLabel}</dt>
                <dd>
                  CGPA <span className="text-muted">{education.score}</span>
                </dd>
              </div>
              <div className="flex items-center gap-2">
                <dt className="sr-only">Location</dt>
                <dd>{profile.location}</dd>
              </div>
            </dl>
          </div>

          {/* ── Visual ───────────────────────────────────────────────────── */}
          <div
            className="hero-rise relative mx-auto w-full min-w-0 max-w-md lg:max-w-none"
            style={riseDelay(0.3)}
          >
            <HeroVisual />

            <p className="mt-2 text-center font-mono text-[0.625rem] uppercase tracking-[0.2em] text-faint lg:text-right">
              agent graph · live
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
