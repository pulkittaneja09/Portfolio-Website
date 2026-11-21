import { motion } from 'framer-motion';
import { HeroVisual } from '@/components/HeroVisual';
import { MagneticButton } from '@/components/MagneticButton';
import { RotatingRoles } from '@/components/RotatingRoles';
import { StatusBadge } from '@/components/StatusBadge';
import { ArrowRightIcon, DownloadIcon, MailIcon } from '@/components/icons';
import { education, profile } from '@/data/portfolio';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/** Word-by-word entrance for the name. Skipped entirely under reduced motion. */
function AnimatedName({ name }: { name: string }) {
  const reduced = useReducedMotion();
  const words = name.split(' ');

  if (reduced) {
    return <>{name}</>;
  }

  return (
    <>
      {words.map((word, i) => (
        <span key={word} className="inline-block overflow-hidden pb-[0.06em] align-bottom">
          <motion.span
            className="inline-block"
            initial={{ y: '102%' }}
            animate={{ y: 0 }}
            transition={{ duration: 0.85, delay: 0.08 + i * 0.09, ease: [0.16, 1, 0.3, 1] }}
          >
            {word}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </>
  );
}

export function Hero() {
  const reduced = useReducedMotion();
  const fade = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 14 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] as const },
        };

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
          <div className="max-w-2xl">
            <motion.div {...fade(0)}>
              <StatusBadge label={profile.availability} />
            </motion.div>

            <h1
              id="hero-name"
              className="mt-7 font-display text-display-xl font-semibold uppercase leading-[0.9]"
            >
              <AnimatedName name={profile.name} />
            </h1>

            <motion.p
              {...fade(0.34)}
              className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-ink/85 sm:text-xl"
            >
              {profile.tagline}
            </motion.p>

            <motion.div {...fade(0.42)} className="mt-4">
              <RotatingRoles roles={profile.roles} />
            </motion.div>

            {/* ── Three CTAs ─────────────────────────────────────────────── */}
            <motion.div {...fade(0.5)} className="mt-9 flex flex-wrap items-center gap-3">
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
            </motion.div>

            {/* ── Context line ───────────────────────────────────────────── */}
            <motion.dl
              {...fade(0.58)}
              className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-line pt-6 font-mono text-xs text-faint"
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
            </motion.dl>
          </div>

          {/* ── Visual ───────────────────────────────────────────────────── */}
          <motion.div
            {...(reduced
              ? {}
              : {
                  initial: { opacity: 0, scale: 0.94 },
                  animate: { opacity: 1, scale: 1 },
                  transition: { duration: 1.1, delay: 0.3, ease: [0.16, 1, 0.3, 1] as const },
                })}
            className="relative mx-auto w-full max-w-md lg:max-w-none"
          >
            <HeroVisual />

            <p className="mt-2 text-center font-mono text-[0.625rem] uppercase tracking-[0.2em] text-faint lg:text-right">
              agent graph · live
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
