import { m, useInView, useScroll, useTransform } from 'framer-motion';
import type { MotionStyle, MotionValue } from 'framer-motion';
import { Fragment, useLayoutEffect, useRef } from 'react';
import type { RefObject } from 'react';
import { MotionRoot } from '@/components/MotionRoot';
import { ProjectCard } from '@/components/ProjectCard';
import { projects } from '@/data/portfolio';
import type { Project } from '@/data/types';
import { filterState, useActiveSkill } from '@/lib/skills';

/*
 * The desktop project stack, in its own lazily loaded chunk (with Framer
 * Motion), so phones and reduced-motion visitors never download it.
 */

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
export default function ProjectStack() {
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
    <MotionRoot>
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
    </MotionRoot>
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
    return `${((range ? progress(value, range.enter) * 2 - 1 : 0) * -PARALLAX).toFixed(2)}px`;
  });
  const scale = useTransform(cover, [0, 1], [1, 0.92]);
  const rotateX = useTransform(cover, [0, 1], [0, 8]);
  const dim = useTransform(cover, [0, 1], [0, 0.4]);

  // The depth is a transform on the sticky item itself (with its own
  // perspective); the dim and the parallax reach the card as CSS variables.
  return (
    <m.li
      data-card
      data-filter={filter}
      style={
        {
          '--i': index,
          '--dim': dim,
          '--parallax': parallax,
          scale,
          rotateX,
          transformPerspective: 1200,
          transformOrigin: '50% 0%',
        } as unknown as MotionStyle
      }
    >
      <ProjectCard project={project} />
    </m.li>
  );
}
