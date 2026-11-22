import { CountUp } from '@/components/CountUp';
import { ProjectThumb } from '@/components/ProjectThumb';
import { TransitionLink } from '@/components/TransitionLink';
import { ArrowUpRightIcon } from '@/components/icons';
import type { Project } from '@/data/types';
import { tintStyle } from '@/lib/projectTint';

const CHIP_LIMIT = 4;

/** A small inline link with an underline drawn in from the left. */
export function InlineLink({ href, children, label }: { href: string; children: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="group/link inline-flex items-center gap-1 text-strong"
      aria-label={`${label} (opens in a new tab)`}
    >
      <span className="link group-hover/link:bg-[length:100%_1px]">{children}</span>
      <ArrowUpRightIcon
        className="h-3 w-3 text-body transition-transform duration-200 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5 group-hover/link:text-accent"
        aria-hidden
      />
    </a>
  );
}

/**
 * One flagship project as a large card: thumbnail beside the name, the
 * problem in one line, the metric, four tags and the Live / Code links, on an
 * opaque panel washed with the project's own tint. The whole card opens the
 * case study. No animation code here: in the desktop stack
 * (sections/ProjectStack.tsx) the depth and the thumbnail parallax arrive
 * as a transform on the card's list item and two CSS variables.
 */
export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="project-card tinted group/row" data-cursor="card" style={tintStyle(project.slug)}>
      <div className="grid gap-5 sm:grid-cols-[minmax(0,42%)_minmax(0,1fr)] sm:gap-6">
        <ProjectThumb project={project} className="order-2 sm:order-none" />

        <div className="min-w-0">
          <h3 className="font-medium leading-snug text-strong transition-colors duration-200 group-hover/row:text-accent">
            {/* The whole card opens the case study through this stretched
                link; the Live and Code links below sit above it. */}
            <TransitionLink
              to={`/projects/${project.slug}`}
              data-card-link
              className="after:absolute after:inset-0 after:z-10 after:rounded-2xl after:content-[''] focus-visible:outline-none"
            >
              {project.name}
            </TransitionLink>
            <ArrowUpRightIcon
              className="ml-1 inline-block h-3.5 w-3.5 -translate-y-px transition-transform duration-200 group-hover/row:-translate-y-[3px] group-hover/row:translate-x-0.5"
              aria-hidden
            />
          </h3>

          <p className="mt-2 text-sm leading-relaxed text-body">{project.oneLiner}</p>

          <p className="mt-3 text-sm leading-relaxed [text-wrap:pretty]">
            <CountUp value={project.metric.value} className="font-mono text-xs text-accent" />
            <span className="text-faint"> · {project.metric.label}</span>
          </p>

          <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Technologies used">
            {project.stack.slice(0, CHIP_LIMIT).map((tech) => (
              <li key={tech} className="chip">
                {tech}
              </li>
            ))}
          </ul>

          {(project.links.demo || project.links.repo) && (
            <div className="relative z-20 mt-4 flex w-fit gap-5 font-mono text-xs">
              {project.links.demo && (
                <InlineLink href={project.links.demo} label={`${project.name} live demo`}>
                  Live
                </InlineLink>
              )}
              {project.links.repo && (
                <InlineLink href={project.links.repo} label={`${project.name} source code`}>
                  Code
                </InlineLink>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Depth in the desktop stack: the ground colour over a covered card,
          its alpha (--dim) set by the stack. Transparent everywhere else. */}
      <div className="card-dim" aria-hidden />
      {/* Shown when an active skill filter does not match this project. */}
      <div className="card-filter-dim" aria-hidden />
    </article>
  );
}
