import { useEffect, useId, useState } from 'react';
import { Reveal } from '@/components/Reveal';
import { Section } from '@/components/Section';
import { skillGroups } from '@/data/portfolio';
import type { Skill, SkillIcon as SkillIconSlug } from '@/data/types';
import { scrollToTarget } from '@/hooks/useLenis';
import { cn } from '@/lib/cn';
import {
  activeSkill,
  describeEvidence,
  evidenceFor,
  hasEvidence,
  setActiveSkill,
  useActiveSkill,
} from '@/lib/skills';

/** A monochrome Simple Icons logo from the sprite, in currentColor. */
function SkillIcon({ slug }: { slug: SkillIconSlug }) {
  return (
    <svg className="h-3 w-3 shrink-0" fill="currentColor" aria-hidden focusable="false">
      <use href={`/skills.svg#${slug}`} />
    </svg>
  );
}

/** Select a skill (or clear it if it is already selected) and go to the work. */
function pick(name: string) {
  const next = activeSkill() === name ? null : name;
  setActiveSkill(next);
  if (!next) return;
  const evidence = evidenceFor(next);
  const target = evidence.projects.length || evidence.side.length ? 'projects' : 'experience';
  scrollToTarget(document.getElementById(target));
}

export function SkillChip({ skill, selected }: { skill: Skill; selected: boolean }) {
  const tipId = useId();
  const [alignEnd, setAlignEnd] = useState(false);
  const evidence = evidenceFor(skill.name);
  const label = (
    <>
      {skill.icon && <SkillIcon slug={skill.icon} />}
      {skill.name}
    </>
  );

  // No project, role or side project carries this tag: listed, not clickable.
  if (!hasEvidence(evidence)) return <span className="skill-chip">{label}</span>;

  // The tooltip hangs right from the chip, unless its 18rem would not fit.
  const place = (element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    setAlignEnd(rect.left + 18 * 16 > window.innerWidth - 16);
  };

  return (
    <button
      type="button"
      className="skill-chip group/chip relative"
      data-selected={selected || undefined}
      aria-pressed={selected}
      aria-describedby={tipId}
      onMouseEnter={(event) => place(event.currentTarget)}
      onFocus={(event) => place(event.currentTarget)}
      onClick={() => pick(skill.name)}
    >
      {label}
      <span
        id={tipId}
        role="tooltip"
        className={cn(
          'skill-tip hidden group-hover/chip:block group-focus-visible/chip:block',
          alignEnd ? 'right-0' : 'left-0',
        )}
      >
        {describeEvidence(evidence)}
      </span>
    </button>
  );
}

/**
 * Grouped rows: the category in small mono caps on the same 27% column as the
 * experience dates, chips wrapping beside it. Hovering a chip shows where the
 * skill was used; clicking it highlights that work in Experience and Projects
 * (the rest fade) and scrolls there. The evidence comes from the real tags in
 * portfolio.ts (lib/skills.ts). Escape, the pill above Projects, or a second
 * click on the chip clears it.
 */
export function Skills() {
  const selected = useActiveSkill();

  useEffect(() => {
    if (!selected) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActiveSkill(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected]);

  // Leaving the page (a case study, say) drops the filter.
  useEffect(() => () => setActiveSkill(null), []);

  return (
    <Section id="skills" label="Skills">
      <p className="meta -mt-4 mb-6">Pick a skill to see the work behind it.</p>
      <dl className="space-y-4">
        {skillGroups.map((group, index) => (
          <Reveal
            key={group.id}
            index={index}
            className="grid gap-y-2 sm:grid-cols-[27%_minmax(0,1fr)] sm:gap-x-6"
          >
            <dt className="label pt-[0.4rem] text-faint">{group.title}</dt>
            <dd data-tone={group.id}>
              <ul className="flex flex-wrap gap-1.5">
                {group.items.map((skill) => (
                  <li key={skill.name}>
                    <SkillChip skill={skill} selected={selected === skill.name} />
                  </li>
                ))}
              </ul>
            </dd>
          </Reveal>
        ))}
      </dl>
    </Section>
  );
}
