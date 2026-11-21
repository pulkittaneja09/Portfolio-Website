import { Link } from 'react-router-dom';
import { ProjectThumb } from '@/components/ProjectThumb';
import { Reveal } from '@/components/Reveal';
import { Section } from '@/components/Section';
import { ArrowUpRightIcon } from '@/components/icons';
import { GITHUB_USERNAME, projects, sideProjects, stats } from '@/data/portfolio';
import type { Project } from '@/data/types';
import { useGitHub } from '@/hooks/useGitHub';

const CHIP_LIMIT = 4;

/** A small inline link with an underline drawn in from the left. */
function InlineLink({ href, children, label }: { href: string; children: string; label: string }) {
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
        className="h-3 w-3 text-body transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5 group-hover/link:text-accent"
        aria-hidden
      />
    </a>
  );
}

function ProjectRow({ project }: { project: Project }) {
  const extra = project.stack.length - CHIP_LIMIT;

  return (
    <article className="row-card group/row grid gap-y-4 sm:grid-cols-[27%_minmax(0,1fr)] sm:gap-x-6">
      <ProjectThumb project={project} className="order-2 w-52 max-w-full sm:order-none sm:w-auto" />

      <div className="min-w-0">
        <h3 className="font-medium leading-snug text-strong transition-colors duration-300 group-hover/row:text-accent">
          {/* The whole card opens the case study through this stretched
              link; the Live and Code links below sit above it. */}
          <Link
            to={`/projects/${project.slug}`}
            className="after:absolute after:inset-0 after:rounded-xl after:content-[''] focus-visible:outline-none"
          >
            {project.name}
          </Link>
          <ArrowUpRightIcon
            className="ml-1 inline-block h-3.5 w-3.5 -translate-y-px transition-transform duration-300 group-hover/row:-translate-y-[3px] group-hover/row:translate-x-0.5"
            aria-hidden
          />
        </h3>

        <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-body transition-colors duration-300 group-hover/row:text-strong/80">
          {project.oneLiner}
        </p>

        <p className="mt-2.5 font-mono text-xs leading-relaxed">
          <span className="text-accent">{project.metric.value}</span>
          <span className="text-faint"> · {project.metric.label}</span>
        </p>

        <ul className="mt-3.5 flex flex-wrap gap-1.5" aria-label="Technologies used">
          {project.stack.slice(0, CHIP_LIMIT).map((tech) => (
            <li key={tech} className="chip">
              {tech}
            </li>
          ))}
          {extra > 0 && <li className="chip border-transparent bg-transparent text-faint">+{extra}</li>}
        </ul>

        {(project.links.demo || project.links.repo) && (
          <div className="relative z-10 mt-4 flex gap-5 font-mono text-xs">
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
    </article>
  );
}

/** Smaller work, one line each, linking to the repo. */
function MoreProjects() {
  return (
    <div className="mt-16">
      <h3 className="label mb-4 text-faint">More</h3>
      <ul className="row-list">
        {sideProjects.map((item, index) => (
          <li key={item.name} className="row-item">
            <Reveal index={index}>
              <a
                href={item.repo}
                target="_blank"
                rel="noreferrer noopener"
                className="group/more -mx-3 flex items-baseline gap-3 rounded-lg px-3 py-2.5 transition-colors duration-300 hover:bg-white/[0.03]"
                title={item.blurb}
              >
                <span className="shrink-0 text-[0.9375rem] font-medium text-strong transition-colors duration-300 group-hover/more:text-accent">
                  {item.name}
                </span>
                <span className="hidden min-w-0 flex-1 truncate text-sm text-body sm:block">{item.blurb}</span>
                <span className="ml-auto flex shrink-0 items-baseline gap-3 sm:ml-0">
                  {item.metric && <span className="font-mono text-xs text-accent">{item.metric}</span>}
                  <ArrowUpRightIcon
                    className="h-3.5 w-3.5 translate-y-0.5 self-center text-faint transition-[transform,color] duration-300 group-hover/more:-translate-y-0 group-hover/more:translate-x-0.5 group-hover/more:text-accent"
                    aria-hidden
                  />
                </span>
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </Reveal>
          </li>
        ))}
      </ul>
    </div>
  );
}

const FALLBACK_REPOS = stats.find((stat) => stat.live === 'publicRepos')?.value ?? 22;

/** "22 public repos · View GitHub ↗", with the count fetched live and cached. */
function GitHubLine() {
  const github = useGitHub();
  const count = github.status === 'ready' ? github.data.user.public_repos : FALLBACK_REPOS;

  return (
    <p className="meta mt-10 flex flex-wrap items-center gap-x-2">
      <span>
        <span className="text-strong">{count}</span> public repos
      </span>
      <span aria-hidden>·</span>
      <InlineLink href={`https://github.com/${GITHUB_USERNAME}`} label="GitHub profile">
        View GitHub
      </InlineLink>
    </p>
  );
}

export function Projects() {
  return (
    <Section id="projects" label="Projects">
      <ol className="row-list space-y-3">
        {projects.map((project, index) => (
          <li key={project.slug} className="row-item">
            <Reveal index={index}>
              <ProjectRow project={project} />
            </Reveal>
          </li>
        ))}
      </ol>

      <MoreProjects />
      <GitHubLine />
    </Section>
  );
}
