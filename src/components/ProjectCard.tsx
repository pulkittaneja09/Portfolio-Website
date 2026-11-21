import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRightIcon, GitHubIcon, PlayIcon } from '@/components/icons';
import type { Project } from '@/data/types';
import { useIsDesktopPointer } from '@/hooks/useMediaQuery';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/cn';

/**
 * Cycles a project's screenshots while the card is hovered — the "looping
 * preview" without shipping a video file.
 */
function usePreviewFrames(project: Project, active: boolean): string | null {
  const frames = project.preview ? [project.preview, ...(project.previewFrames ?? [])] : [];
  const [index, setIndex] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!active || reduced || frames.length < 2) {
      setIndex(0);
      return;
    }
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % frames.length), 1500);
    return () => window.clearInterval(timer);
  }, [active, reduced, frames.length]);

  return frames[index] ?? null;
}

/** Placeholder shown for projects that have no screenshot yet. */
function PreviewPlaceholder({ project }: { project: Project }) {
  return (
    <div className="grid h-full w-full place-items-center bg-elevated">
      <div className="px-6 text-center">
        <p className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-faint">
          {project.stack.slice(0, 3).join(' · ')}
        </p>
        <p className="mt-2 font-display text-lg text-accent">{project.metric.value}</p>
      </div>
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgb(var(--line)) 1px, transparent 1px), linear-gradient(to bottom, rgb(var(--line)) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
        aria-hidden
      />
    </div>
  );
}

interface Props {
  project: Project;
  /** Bento placement classes from the parent grid. */
  className?: string;
  /**
   * `lead` is the tall feature tile, `banner` lays the preview beside the copy
   * across the full width, `standard` is the regular stacked card.
   */
  variant?: 'lead' | 'standard' | 'banner';
}

export function ProjectCard({ project, className, variant = 'standard' }: Props) {
  const lead = variant === 'lead';
  const banner = variant === 'banner';
  const [hovered, setHovered] = useState(false);
  const isDesktop = useIsDesktopPointer();
  const reduced = useReducedMotion();
  const frame = usePreviewFrames(project, hovered && isDesktop);
  const cardRef = useRef<HTMLElement>(null);
  const chipLimit = lead || banner ? 8 : 5;

  // Subtle tilt toward the cursor. Transform-only, desktop-only.
  const onMouseMove = (event: React.MouseEvent) => {
    if (!isDesktop || reduced || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    cardRef.current.style.transform = `perspective(1100px) rotateX(${-y * 2.4}deg) rotateY(${x * 2.8}deg) translateZ(0)`;
  };

  const resetTilt = () => {
    if (cardRef.current) cardRef.current.style.transform = '';
  };

  return (
    <article
      ref={cardRef}
      className={cn(
        'card group/card flex transition-[transform,border-color,box-shadow] duration-500 ease-out',
        'hover:border-accent/40 hover:shadow-lift focus-within:border-accent/40',
        banner ? 'flex-col lg:flex-row' : 'flex-col',
        className,
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        resetTilt();
      }}
      onMouseMove={onMouseMove}
    >
      {/* ── Preview ──────────────────────────────────────────────────────── */}
      <div
        className={cn(
          'relative overflow-hidden bg-elevated',
          banner
            ? 'aspect-[16/9] border-b border-line lg:aspect-auto lg:w-[38%] lg:shrink-0 lg:border-b-0 lg:border-r'
            : cn('border-b border-line', lead ? 'aspect-[16/9]' : 'aspect-[16/10]'),
        )}
      >
        {frame ? (
          <img
            src={frame}
            alt={`${project.name} interface`}
            width={1024}
            height={lead ? 576 : 640}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover object-top transition-transform duration-[900ms] ease-out group-hover/card:scale-[1.035]"
          />
        ) : (
          <PreviewPlaceholder project={project} />
        )}

        <div
          className={cn(
            'pointer-events-none absolute inset-0 from-surface via-surface/10 to-transparent opacity-80',
            banner ? 'bg-gradient-to-t lg:bg-gradient-to-r lg:from-transparent lg:to-surface' : 'bg-gradient-to-t',
          )}
          aria-hidden
        />

        <span className="absolute left-3 top-3 chip border-accent/40 bg-bg/70 text-accent backdrop-blur">
          {project.metric.value}
        </span>
      </div>

      {/* ── Body ─────────────────────────────────────────────────────────── */}
      <div className={cn('flex flex-1 flex-col p-5', (lead || banner) && 'sm:p-6')}>
        <div className="flex items-start justify-between gap-4">
          <h3
            className={cn(
              'font-display leading-tight',
              lead || banner ? 'text-xl sm:text-2xl' : 'text-lg',
            )}
          >
            {/* The whole card is clickable through this stretched link, while
                the demo and source buttons below stay independently clickable. */}
            <Link
              to={`/projects/${project.slug}`}
              className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
            >
              {project.name}
            </Link>
          </h3>
          <span className="shrink-0 font-mono text-[0.6875rem] text-faint">{project.year}</span>
        </div>

        <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-muted">{project.problem}</p>

        {(lead || banner) && (
          <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink/70">{project.built}</p>
        )}

        <p className="mt-3 border-l-2 border-accent/50 pl-3 text-[0.8125rem] leading-relaxed text-ink/70">
          <span className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-faint">
            My role ·{' '}
          </span>
          {project.role}
        </p>

        <ul className="mt-4 flex flex-wrap gap-1.5">
          {project.stack.slice(0, chipLimit).map((tech) => (
            <li key={tech} className="chip">
              {tech}
            </li>
          ))}
          {project.stack.length > chipLimit && (
            <li className="chip border-transparent">+{project.stack.length - chipLimit}</li>
          )}
        </ul>

        {/* ── Actions ────────────────────────────────────────────────────── */}
        <div className="relative z-10 mt-auto flex flex-wrap items-center gap-2 pt-5">
          {project.links.demo && (
            <a
              href={project.links.demo}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1.5 rounded-full border border-accent/50 px-3 py-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-ink transition-colors hover:bg-accent/10"
            >
              <PlayIcon className="h-3.5 w-3.5 text-accent" />
              Live demo
            </a>
          )}

          {project.links.repo && (
            <a
              href={project.links.repo}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-muted transition-colors hover:border-ink/35 hover:text-ink"
            >
              <GitHubIcon className="h-3.5 w-3.5" />
              Code
            </a>
          )}

          <span className="ml-auto inline-flex items-center gap-1 font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-faint transition-colors group-hover/card:text-accent">
            Case study
            <ArrowUpRightIcon className="h-3.5 w-3.5 transition-transform duration-300 group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5" />
          </span>
        </div>
      </div>
    </article>
  );
}
