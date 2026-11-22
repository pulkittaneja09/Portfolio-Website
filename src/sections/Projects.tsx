import { m, motionValue, useInView, useScroll, useTransform } from 'framer-motion';
import type { MotionStyle, MotionValue } from 'framer-motion';
import { Fragment, useLayoutEffect, useRef } from 'react';
import type { CSSProperties, RefObject } from 'react';
import { CountUp } from '@/components/CountUp';
import { ProjectThumb } from '@/components/ProjectThumb';
import { Reveal } from '@/components/Reveal';
import { Section } from '@/components/Section';
import { SkillFilterPill } from '@/components/SkillFilterPill';
import { TransitionLink } from '@/components/TransitionLink';
import { ArrowUpRightIcon } from '@/components/icons';
import { GITHUB_USERNAME, projects, sideProjects } from '@/data/portfolio';
import type { Project } from '@/data/types';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { tintStyle } from '@/lib/projectTint';
import { siteStats } from '@/lib/siteStats';
import { filterState, useActiveSkill } from '@/lib/skills';

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

interface CardMotion {
  /** 0 while the card is uncovered, 1 once the next card fully covers it. */
  cover: MotionValue<number>;
  /** The thumbnail's parallax offset, in px. */
  parallax: MotionValue<number>;
}

const ZERO = motionValue(0);

/**
 * One flagship project as a large card: thumbnail beside the name, the
 * problem in one line, the metric, four tags and the Live / Code links, on an
 * opaque panel washed with the project's own tint. The whole card opens the
 * case study. In the desktop stack it also gets the scroll-driven depth
 * (scale, tilt back, dim) and the thumbnail parallax.
 */
function ProjectCard({ project, motion }: { project: Project; motion?: CardMotion }) {
  const scale = useTransform(motion?.cover ?? ZERO, [0, 1], [1, 0.92]);
  const rotateX = useTransform(motion?.cover ?? ZERO, [0, 1], [0, 8]);
  const dim = useTransform(motion?.cover ?? ZERO, [0, 1], [0, 0.4]);

  return (
    <m.article
      className="project-card tinted group/row"
      data-cursor="card"
      style={{ ...(tintStyle(project.slug) as MotionStyle), ...(motion ? { scale, rotateX } : {}) }}
    >
      <div className="grid gap-5 sm:grid-cols-[minmax(0,42%)_minmax(0,1fr)] sm:gap-6">
        <ProjectThumb project={project} parallax={motion?.parallax} className="order-2 sm:order-none" />

        <div className="min-w-0">
          <h3 className="font-medium leading-snug text-strong transition-colors duration-300 group-hover/row:text-accent">
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
              className="ml-1 inline-block h-3.5 w-3.5 -translate-y-px transition-transform duration-300 group-hover/row:-translate-y-[3px] group-hover/row:translate-x-0.5"
              aria-hidden
            />
          </h3>

          <p className="mt-1.5 text-sm leading-relaxed text-body">{project.oneLiner}</p>

          <p className="mt-2.5 text-sm leading-relaxed [text-wrap:pretty]">
            <CountUp value={project.metric.value} className="font-mono text-xs text-accent" />
            <span className="text-faint"> · {project.metric.label}</span>
          </p>

          <ul className="mt-3.5 flex flex-wrap gap-1.5" aria-label="Technologies used">
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

      {/* Depth: the ground colour laid over a covered card, its alpha driven
          by the scroll (a paint of one layer; no layout). */}
      {motion && <m.div className="card-dim" style={{ '--dim': dim } as MotionStyle} aria-hidden />}
      {/* Shown when an active skill filter does not match this project. */}
      <div className="card-filter-dim" aria-hidden />
    </m.article>
  );
}

/** Where the stacked cards stick: 96px (level with the rail), then 16px lower each. */
const STICK_TOP = 96;
const STICK_STEP = 16;
const PARALLAX = 10; // ±px: the thumbnail drifts 20px against its card in all

interface Range {
  /** scrollY over which the next card slides up over this one. */
  cover: [number, number];
  /** scrollY from this card entering the viewport to it sticking. */
  enter: [number, number];
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const progress = (value: number, [from, to]: [number, number]) =>
  to > from ? clamp01((value - from) / (to - from)) : 0;

/**
 * Desktop with full motion: the four cards are sticky, each 16px lower than
 * the last, so scrolling slides the next card up over the previous one. As a
 * card is covered it scales to 0.92, tilts back 8° (perspective 1200px) and
 * dims to 60%. Everything is a transform or an opacity driven by motion
 * values off scrollY: no React renders and no layout reads while scrolling.
 *
 * The scroll ranges come from static layout (the list itself is not sticky;
 * each card rests at the list's top plus the heights before it) and are
 * measured again only when the list or the window resizes.
 */
function ProjectStack() {
  const skill = useActiveSkill();
  const list = useRef<HTMLOListElement>(null);
  const ranges = useRef<Range[]>([]);
  const { scrollY } = useScroll();
  const active = useInView(list, { margin: '25% 0px 25% 0px' });

  useLayoutEffect(() => {
    const node = list.current;
    if (!node) return;
    const measure = () => {
      const vh = window.innerHeight;
      // One height for every card, the tallest one's, so a shorter card never
      // lets the covered ones peek out underneath it.
      node.style.removeProperty('--card-h');
      const tallest = Math.max(
        ...[...node.querySelectorAll<HTMLElement>('.project-card')].map((card) => card.offsetHeight),
      );
      node.style.setProperty('--card-h', `${tallest}px`);
      let top = node.getBoundingClientRect().top + window.scrollY;
      const resting: number[] = [];
      const heights: number[] = [];
      // Cards and the spacers between them are all in normal flow; only the
      // cards are sticky, so their resting tops are a running sum.
      for (const child of node.children as HTMLCollectionOf<HTMLElement>) {
        if (child.dataset.card !== undefined) {
          resting.push(top);
          heights.push(child.offsetHeight);
        }
        top += child.offsetHeight;
      }
      ranges.current = resting.map((_, i): Range => {
        const stick = STICK_TOP + i * STICK_STEP;
        const next = resting[i + 1];
        return {
          cover:
            next === undefined
              ? [Infinity, Infinity]
              : [next - (stick + heights[i]), next - (STICK_TOP + (i + 1) * STICK_STEP)],
          enter: [resting[i] - vh, resting[i] - stick],
        };
      });
      // Nudge the motion values so new ranges apply without waiting for a scroll.
      scrollY.set(window.scrollY);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    window.addEventListener('resize', measure);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [scrollY]);

  return (
    <ol ref={list} className="project-stack" data-active={active || undefined}>
      {projects.map((project, index) => (
        <Fragment key={project.slug}>
          {/* The scroll distance each card spends being covered. A separate,
              non-sticky item: a margin on the sticky card would count against
              its container and push the stack off screen early. */}
          {index > 0 && <li className="stack-spacer" aria-hidden role="presentation" />}
          <StackItem
            project={project}
            index={index}
            ranges={ranges}
            scrollY={scrollY}
            filter={filterState((evidence) => evidence.projects.includes(project), skill)}
          />
        </Fragment>
      ))}
      {/* Holds the finished stack for a beat, then it leaves with the section. */}
      <li className="stack-spacer stack-spacer-end" aria-hidden role="presentation" />
    </ol>
  );
}

function StackItem({
  project,
  index,
  ranges,
  scrollY,
  filter,
}: {
  project: Project;
  index: number;
  ranges: RefObject<Range[]>;
  scrollY: MotionValue<number>;
  filter: ReturnType<typeof filterState>;
}) {
  const cover = useTransform(scrollY, (value) => {
    const range = ranges.current?.[index];
    return range ? progress(value, range.cover) : 0;
  });
  const parallax = useTransform(scrollY, (value) => {
    const range = ranges.current?.[index];
    return range ? (progress(value, range.enter) * 2 - 1) * -PARALLAX : 0;
  });

  return (
    <li data-card data-filter={filter} style={{ '--i': index } as CSSProperties}>
      <ProjectCard project={project} motion={{ cover, parallax }} />
    </li>
  );
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
              className="group/more -mx-3 flex items-baseline gap-3 rounded-lg px-3 py-2.5 transition-[background-color,box-shadow] duration-300 hover:bg-[var(--row-hover-bg)] hover:shadow-card"
              title={item.blurb}
            >
              <span className="shrink-0 text-sm font-medium text-strong transition-colors duration-300 group-hover/more:text-accent">
                {item.name}
              </span>
              <span className="hidden min-w-0 flex-1 truncate text-sm text-body transition-colors duration-300 group-hover/more:text-strong/80 sm:block">
                {item.oneLiner}
              </span>
              <span className="ml-auto flex shrink-0 items-baseline gap-3 sm:ml-0">
                {item.metric && <CountUp value={item.metric} className="font-mono text-xs text-accent" />}
                <ArrowUpRightIcon
                  className="h-3.5 w-3.5 translate-y-0.5 self-center text-faint transition-[transform,color] duration-300 group-hover/more:-translate-y-0 group-hover/more:translate-x-0.5 group-hover/more:text-accent"
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
      {desktop && !reduced ? <ProjectStack /> : <ProjectList />}

      <MoreProjects />
      <GitHubLine />
    </Section>
  );
}
