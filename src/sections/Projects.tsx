import { ProjectCard } from '@/components/ProjectCard';
import { Reveal } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';
import { Spotlight } from '@/components/Spotlight';
import { ArrowUpRightIcon, GitHubIcon } from '@/components/icons';
import { GITHUB_USERNAME, projects, sideProjects } from '@/data/portfolio';
import type { Project } from '@/data/types';

/**
 * Asymmetric bento: the lead project takes a 2x2 tile, the rest fill around it.
 * Placement is derived from each project's `emphasis`, so reordering the data
 * reflows the grid without touching this file.
 */
const placement: Record<Project['emphasis'], string> = {
  lead: 'lg:col-span-7 lg:row-span-2',
  standard: 'lg:col-span-5',
  wide: 'lg:col-span-12',
};

export function Projects() {
  return (
    <section id="work" aria-labelledby="work-title" className="section-y scroll-mt-24">
      <div className="shell">
        <SectionHeading
          index="01"
          label="Selected work"
          title={
            <span id="work-title">
              Things I built that are <span className="text-muted">running right now.</span>
            </span>
          }
          lede="Four projects, three of them live in production. Each panel links to a case study with the architecture, what was hard, and what I would do next."
          aside={
            <a
              href={`https://github.com/${GITHUB_USERNAME}?tab=repositories`}
              target="_blank"
              rel="noreferrer noopener"
              className="label group inline-flex items-center gap-2 transition-colors duration-400 ease-quiet hover:text-text"
            >
              <GitHubIcon className="h-3.5 w-3.5" />
              All repositories
              <ArrowUpRightIcon className="h-3.5 w-3.5 transition-transform duration-400 ease-quiet group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          }
        />

        <div className="grid gap-3 sm:gap-4 lg:grid-cols-12">
          {projects.map((project, index) => (
            <Reveal
              key={project.slug}
              index={index}
              as="div"
              className={`${placement[project.emphasis]} flex`}
            >
              <ProjectCard
                project={project}
                variant={project.emphasis === 'wide' ? 'banner' : project.emphasis}
                className="w-full"
              />
            </Reveal>
          ))}
        </div>

        {/* ── Smaller work ───────────────────────────────────────────────── */}
        <div className="mt-24">
          <Reveal>
            <div className="flex items-center gap-4">
              <h3 className="label whitespace-nowrap">Also on the shelf</h3>
              <span className="h-px flex-1 bg-[var(--border)]" aria-hidden />
            </div>
          </Reveal>

          <ul className="mt-8 grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {sideProjects.map((item, index) => (
              <Reveal as="li" key={item.name} index={index} className="flex">
                <Spotlight radius={260} className="group flex w-full rounded-panel bg-bg hover:border-strong">
                  <a
                    href={item.repo}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex h-full w-full flex-col p-5 sm:p-6"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h4 className="text-[0.9375rem] font-medium tracking-[-0.01em]">{item.name}</h4>
                      <ArrowUpRightIcon className="h-4 w-4 shrink-0 text-faint transition-[color,transform] duration-400 ease-quiet group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-text" />
                    </div>

                    <p className="mt-2 flex-1 text-[0.875rem] leading-relaxed text-muted">{item.blurb}</p>

                    {item.metric && <p className="mt-5 text-sm text-text">{item.metric}</p>}

                    <p className="meta mt-2 uppercase tracking-[0.08em]">{item.stack.join(' · ')}</p>
                  </a>
                </Spotlight>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
