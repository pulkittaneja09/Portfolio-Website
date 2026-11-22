import { m, useScroll } from 'framer-motion';
import { useRef } from 'react';
import { Section } from '@/components/Section';
import { ArrowUpRightIcon } from '@/components/icons';
import { experience, profile } from '@/data/portfolio';
import type { ExperienceItem } from '@/data/types';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { formatRange } from '@/lib/dates';
import { filterState, useActiveSkill } from '@/lib/skills';

function ExperienceRow({ item }: { item: ExperienceItem }) {
  const external = Boolean(item.href?.startsWith('http'));
  const body = (
    <>
      <div className="pt-0.5">
        <p className="font-mono text-xs uppercase leading-snug tracking-[0.04em] text-faint [text-wrap:balance]">
          {formatRange(item.start, item.end)}
        </p>
        <p className="meta mt-2 hidden sm:block">{item.location}</p>
      </div>

      <div className="min-w-0">
        <h3 className="font-medium leading-snug text-strong transition-colors duration-200 group-hover/row:text-accent">
          {item.role}
          <span className="text-faint"> · </span>
          <span className="whitespace-nowrap">
            {item.org}
            {item.href && (
              <ArrowUpRightIcon
                className="ml-1 inline-block h-3.5 w-3.5 -translate-y-px transition-transform duration-200 group-hover/row:-translate-y-[3px] group-hover/row:translate-x-0.5"
                aria-hidden
              />
            )}
          </span>
        </h3>

        <ul className="mt-2 space-y-1 text-sm leading-relaxed text-body transition-colors duration-200 group-hover/row:text-strong/80">
          {item.impact.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>

        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Technologies used">
          {item.stack.map((tech) => (
            <li key={tech} className="chip">
              {tech}
            </li>
          ))}
        </ul>
      </div>
    </>
  );

  const layout = 'row-card group/row grid gap-y-2 sm:grid-cols-[27%_minmax(0,1fr)] sm:gap-x-6';

  if (!item.href) return <div className={layout}>{body}</div>;

  return (
    <a
      href={item.href}
      className={layout}
      {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
      aria-label={`${item.role} at ${item.org}${external ? ' (opens in a new tab)' : ''}`}
    >
      {body}
    </a>
  );
}

/**
 * Three rows: dates in mono on the left, the work on the right. Hovering one
 * row lifts it onto a faint panel and fades the others (see `.row-list`).
 */
export function Experience() {
  const skill = useActiveSkill();
  const reduced = useReducedMotion();
  const list = useRef<HTMLOListElement>(null);
  const { scrollYProgress: fill } = useScroll({ target: list, offset: ['start 70%', 'end 55%'] });

  return (
    <Section id="experience" label="Experience">
      <ol ref={list} className="row-list relative -mt-4 space-y-3 sm:-mt-5">
        {experience.map((item) => (
          <li
            key={`${item.org}-${item.role}`}
            className="row-item"
            data-filter={filterState((evidence) => evidence.roles.includes(item), skill)}
          >
            <ExperienceRow item={item} />
          </li>
        ))}
        {/* The one moving thing here: a hairline that fills with the accent
            as you read down the roles. Transform only (scaleY). */}
        <li className="exp-track" aria-hidden role="presentation">
          {!reduced && <m.span className="exp-fill" style={{ scaleY: fill }} />}
        </li>
      </ol>

      <div>
        <a
          href={profile.resumePath}
          target="_blank"
          rel="noopener"
          className="group mt-10 inline-flex items-center gap-1.5 text-sm font-medium text-strong"
        >
          <span className="link link-on-group">View full résumé</span>
          <ArrowUpRightIcon
            className="h-3.5 w-3.5 text-body transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
            aria-hidden
          />
          <span className="sr-only">(PDF, opens in a new tab)</span>
        </a>
      </div>
    </Section>
  );
}
