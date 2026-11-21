import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Spotlight } from '@/components/Spotlight';
import { ArrowUpRightIcon, GitHubIcon } from '@/components/icons';
import type { Project } from '@/data/types';
import { useIsDesktopPointer } from '@/hooks/useMediaQuery';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/cn';
import { previewSrcSet } from '@/lib/images';
import { projectMeta } from '@/lib/projectMeta';

/**
 * Cycles a project's screenshots while the panel is hovered — the "looping
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

/**
 * For projects without a screenshot: the headline number set as type on a
 * dot field. A number is a better picture of an ML or backend project than a
 * stock mock-up would be.
 */
function MetricPlate({ project, large }: { project: Project; large: boolean }) {
  return (
    <div className="relative flex h-full w-full flex-col justify-end p-5 sm:p-6">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, var(--grid-line) 1px, transparent 0)',
          backgroundSize: '16px 16px',
          maskImage: 'radial-gradient(ellipse 90% 90% at 80% 10%, #000, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse 90% 90% at 80% 10%, #000, transparent 70%)',
        }}
        aria-hidden
      />
      <p
        className={cn(
          'relative font-medium leading-none tracking-[-0.04em] text-text',
          large ? 'text-[2.75rem] sm:text-[3.5rem]' : 'text-[2rem] sm:text-[2.25rem]',
        )}
      >
        {project.metric.value}
      </p>
      <p className="meta relative mt-3 uppercase tracking-[0.08em]">{project.metric.label}</p>
    </div>
  );
}

interface Props {
  project: Project;
  /** Bento placement classes from the parent grid. */
  className?: string;
  /**
   * `lead` is the tall feature tile, `banner` lays the visual beside the copy
   * across the full width, `standard` is the compact stacked card.
   */
  variant?: 'lead' | 'standard' | 'banner';
}

export function ProjectCard({ project, className, variant = 'standard' }: Props) {
  const lead = variant === 'lead';
  const banner = variant === 'banner';
  const [hovered, setHovered] = useState(false);
  const isDesktop = useIsDesktopPointer();
  const frame = usePreviewFrames(project, hovered && isDesktop);
  const chipLimit = lead || banner ? 7 : 4;

  return (
    <Spotlight
      as="article"
      radius={lead ? 460 : 340}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        'group/card flex rounded-panel bg-bg transition-[border-color,transform] duration-600 ease-quiet',
        'hover:border-strong focus-within:border-strong',
        banner ? 'flex-col lg:flex-row' : 'flex-col',
        className,
      )}
    >
      {/* ── Visual ───────────────────────────────────────────────────────── */}
      <div
        className={cn(
          'relative overflow-hidden border-hairline bg-elevated',
          banner
            ? 'rounded-t-[calc(0.875rem-1px)] border-b lg:order-2 lg:w-[40%] lg:shrink-0 lg:rounded-none lg:rounded-r-[calc(0.875rem-1px)] lg:border-b-0 lg:border-l'
            : 'rounded-t-[calc(0.875rem-1px)] border-b',
          lead ? 'aspect-[16/10]' : banner ? 'min-h-[11rem]' : 'aspect-[16/7]',
        )}
      >
        {frame ? (
          <>
            <img
              src={frame}
              srcSet={previewSrcSet(frame)}
              sizes="(min-width: 1024px) 680px, (min-width: 640px) 90vw, 100vw"
              alt={`${project.name} interface`}
              width={1024}
              height={640}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover object-top grayscale transition-[transform,filter] duration-800 ease-quiet group-hover/card:scale-[1.02] group-hover/card:grayscale-0"
            />
            <span className="glass absolute bottom-3 left-3 rounded-md px-2.5 py-1 font-mono text-[0.6875rem] tracking-[0.02em] text-text">
              {project.metric.value}
              <span className="ml-2 text-muted">{project.metric.label}</span>
            </span>
          </>
        ) : (
          <MetricPlate project={project} large={lead || banner} />
        )}
      </div>

      {/* ── Body ─────────────────────────────────────────────────────────── */}
      <div className={cn('flex flex-1 flex-col p-5 sm:p-6', (lead || banner) && 'lg:p-8')}>
        <p className="label text-faint">{projectMeta(project)}</p>

        <h3 className={cn('mt-3 text-text', lead || banner ? 'text-display-sm' : 'text-lg tracking-[-0.02em]')}>
          {/* The whole panel is clickable through this stretched link, while
              the demo and source links below sit above it. */}
          <Link
            to={`/projects/${project.slug}`}
            className="after:absolute after:inset-0 after:rounded-panel after:content-[''] focus-visible:outline-none focus-visible:after:outline focus-visible:after:outline-1 focus-visible:after:outline-offset-4 focus-visible:after:outline-[rgb(var(--accent))]"
          >
            {project.name}
          </Link>
        </h3>

        <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">{project.problem}</p>

        {(lead || banner) && (
          <p className="mt-3 max-w-[60ch] text-[0.9375rem] leading-relaxed text-muted">{project.built}</p>
        )}

        {lead && (
          <p className="mt-5 text-[0.875rem] leading-relaxed text-text/80">
            <span className="label mr-2 text-faint">Role</span>
            {project.role}
          </p>
        )}

        <ul className="mt-6 flex flex-wrap gap-1.5">
          {project.stack.slice(0, chipLimit).map((tech) => (
            <li key={tech} className="chip">
              {tech}
            </li>
          ))}
          {project.stack.length > chipLimit && (
            <li className="chip border-transparent text-faint">+{project.stack.length - chipLimit}</li>
          )}
        </ul>

        {/* ── Actions ────────────────────────────────────────────────────── */}
        <div className="relative z-10 mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 pt-7">
          {project.links.demo && (
            <a
              href={project.links.demo}
              target="_blank"
              rel="noreferrer noopener"
              className="link-underline inline-flex items-center gap-1.5 text-[0.8125rem] text-text"
            >
              Live demo
              <ArrowUpRightIcon className="h-3.5 w-3.5 text-muted" />
            </a>
          )}

          {project.links.repo && (
            <a
              href={project.links.repo}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1.5 text-[0.8125rem] text-muted transition-colors duration-400 ease-quiet hover:text-text"
            >
              <GitHubIcon className="h-3.5 w-3.5" />
              Source
            </a>
          )}

          <span
            className="label ml-auto inline-flex items-center gap-1.5 text-faint transition-colors duration-400 ease-quiet group-hover/card:text-text"
            aria-hidden
          >
            Case study
            <span className="inline-block transition-transform duration-400 ease-quiet group-hover/card:translate-x-1">
              →
            </span>
          </span>
        </div>
      </div>
    </Spotlight>
  );
}
