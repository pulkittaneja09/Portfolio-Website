import { useState } from 'react';
import { Reveal } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';
import { brandPaths } from '@/components/brandPaths';
import { fundamentals, skillGroups } from '@/data/portfolio';
import type { IconSlug, SkillGroup } from '@/data/types';

type Item = SkillGroup['items'][number];

function BrandIcon({ slug, label }: { slug: IconSlug; label: string }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" role="img" aria-label={label} focusable="false">
      <path d={brandPaths[slug]} fill="currentColor" />
    </svg>
  );
}

/**
 * One discipline. Pointing at a tool rewrites the caption under the heading
 * with the projects it shipped in — the point of this section, since a logo
 * wall on its own proves nothing.
 *
 * A caption rather than a floating tooltip: tooltips anchored to edge tiles
 * spill past a 360px viewport, and this reads better on a phone anyway.
 */
function Group({ group, index }: { group: SkillGroup; index: number }) {
  const [active, setActive] = useState<Item | null>(null);
  const captionId = `stack-caption-${group.id}`;

  return (
    <Reveal index={index}>
      <div className="grid gap-6 border-t border-hairline pt-8 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-12">
        <div>
          <p className="meta">{String(index + 1).padStart(2, '0')}</p>
          <h3 className="mt-2 text-lg tracking-[-0.015em]">{group.title}</h3>

          {/* Fixed height so swapping the caption never shifts the grid. */}
          <div className="mt-2 min-h-[3.75rem] sm:min-h-[4.25rem]">
            {active ? (
              <p id={captionId} className="text-[0.8125rem] leading-relaxed text-muted" aria-live="polite">
                <span className="label text-text">
                  {active.name}
                </span>
                <br />
                Used in {active.usedIn.join(', ')}.
              </p>
            ) : (
              <p id={captionId} className="text-[0.8125rem] leading-relaxed text-muted">
                {group.blurb}
              </p>
            )}
          </div>
        </div>

        <ul
          className="grid grid-cols-3 gap-px self-start p-px sm:grid-cols-4 md:grid-cols-6 xl:grid-cols-7"
          onMouseLeave={() => setActive(null)}
        >
          {group.items.map((item) => (
            <li key={item.name} className="flex bg-bg shadow-[0_0_0_1px_var(--border)]">
              <button
                type="button"
                onMouseEnter={() => setActive(item)}
                onFocus={() => setActive(item)}
                onBlur={() => setActive(null)}
                onClick={() => setActive((current) => (current === item ? null : item))}
                aria-describedby={captionId}
                className="group flex w-full flex-col items-center gap-3 px-2 py-5 transition-colors duration-400 ease-quiet hover:bg-elevated focus-visible:bg-elevated aria-[current=true]:bg-elevated"
                aria-current={active === item}
              >
                <span className="text-faint transition-colors duration-400 ease-quiet group-hover:text-text group-aria-[current=true]:text-text">
                  <BrandIcon slug={item.icon} label={item.name} />
                </span>
                <span className="text-center text-[0.75rem] leading-tight text-muted transition-colors duration-400 ease-quiet group-hover:text-text">
                  {item.name}
                </span>
                {/* Always available to assistive tech, not only on hover. */}
                <span className="sr-only">Used in {item.usedIn.join(', ')}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}

export default function Stack() {
  return (
    <section
      id="stack"
      aria-labelledby="stack-title"
      className="section-y scroll-mt-24"
    >
      <div className="shell">
        <SectionHeading
          index="04"
          label="Toolkit"
          title={
            <span id="stack-title">
              What I reach for, <span className="text-muted">and where I have actually used it.</span>
            </span>
          }
          lede="Point at any tool and the caption beside it names the projects it shipped in. No percentage bars — a number next to a logo means nothing."
        />

        <div className="space-y-12">
          {skillGroups.map((group, index) => (
            <Group key={group.id} group={group} index={index} />
          ))}
        </div>

        <Reveal index={5} className="mt-12">
          <div className="grid gap-4 border-t border-hairline pt-8 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-12">
            <p className="label">CS fundamentals</p>
            <ul className="flex flex-wrap gap-1.5">
              {fundamentals.map((item) => (
                <li key={item} className="chip">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
