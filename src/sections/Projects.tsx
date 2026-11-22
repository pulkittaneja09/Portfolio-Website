import { Suspense, lazy } from 'react';
import { CountUp } from '@/components/CountUp';
import { InlineLink, ProjectCard } from '@/components/ProjectCard';
import { Reveal } from '@/components/Reveal';
import { Section } from '@/components/Section';
import { SkillFilterPill } from '@/components/SkillFilterPill';
import { ArrowUpRightIcon } from '@/components/icons';
import { GITHUB_USERNAME, projects, sideProjects } from '@/data/portfolio';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { siteStats } from '@/lib/siteStats';
import { filterState, useActiveSkill } from '@/lib/skills';

const loadStack = () => import('@/sections/ProjectStack');
const ProjectStack = lazy(loadStack);

// Desktop with full motion will want the stack: start fetching it now, so it
// is in place long before anyone scrolls down to Projects.
if (
  typeof window !== 'undefined' &&
  window.matchMedia('(min-width: 1024px)').matches &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches
) {
  void loadStack();
}

/** Phones, tablets and reduced motion: the same cards in a plain list, each fading up once. */
function ProjectList() {
  const skill = useActiveSkill();
  return (
    <ol className="project-cards space-y-4">
      {projects.map((project, index) => (
        <li
          key={project.slug}
          data-filter={filterState((evidence) => evidence.projects.includes(project), skill)}
        >
          <Reveal index={index}>
            <ProjectCard project={project} />
          </Reveal>
        </li>
      ))}
    </ol>
  );
}

/** Smaller work, one line each, linking to the repo. */
function MoreProjects() {
  const skill = useActiveSkill();

  return (
    <div className="mt-16">
      <h3 className="label mb-4 text-faint">More</h3>
      <ul>
        {sideProjects.map((item) => (
          <li
            key={item.name}
            className="row-item"
            data-filter={filterState((evidence) => evidence.side.includes(item), skill)}
          >
            <a
              href={item.repo}
              target="_blank"
              rel="noreferrer noopener"
              className="group/more -mx-3 flex items-baseline gap-3 rounded-lg px-3 py-2.5 transition-[background-color,box-shadow] duration-200 hover:bg-[var(--row-hover-bg)] hover:shadow-card"
              title={item.blurb}
            >
              <span className="shrink-0 text-sm font-medium text-strong transition-colors duration-200 group-hover/more:text-accent">
                {item.name}
              </span>
              <span className="hidden min-w-0 flex-1 truncate text-sm text-body transition-colors duration-200 group-hover/more:text-strong/80 sm:block">
                {item.oneLiner}
              </span>
              <span className="ml-auto flex shrink-0 items-baseline gap-3 sm:ml-0">
                {item.metric && <CountUp value={item.metric} className="font-mono text-xs text-accent" />}
                <ArrowUpRightIcon
                  className="h-3.5 w-3.5 translate-y-0.5 self-center text-faint transition-[transform,color] duration-200 group-hover/more:-translate-y-0 group-hover/more:translate-x-0.5 group-hover/more:text-accent"
                  aria-hidden
                />
              </span>
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Fetched at build time, falling back to the figure in portfolio.ts. */
const publicRepos = siteStats.publicRepos;

/** "22 public repos · View GitHub ↗". */
function GitHubLine() {
  return (
    <p className="meta mt-10 flex flex-wrap items-center gap-x-2">
      {publicRepos !== null && (
        <>
          <span>
            <span className="text-strong">{publicRepos}</span> public repos
          </span>
          <span aria-hidden>·</span>
        </>
      )}
      <InlineLink href={`https://github.com/${GITHUB_USERNAME}`} label="GitHub profile">
        View GitHub
      </InlineLink>
    </p>
  );
}

export function Projects() {
  const reduced = useReducedMotion();
  const desktop = useMediaQuery('(min-width: 1024px)');

  return (
    <Section id="projects" label="Projects">
      <SkillFilterPill />
      {desktop && !reduced ? (
        <Suspense fallback={<ProjectList />}>
          <ProjectStack />
        </Suspense>
      ) : (
        <ProjectList />
      )}

      <MoreProjects />
      <GitHubLine />
    </Section>
  );
}
