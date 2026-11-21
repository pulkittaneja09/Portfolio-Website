import { useState } from 'react';
import { Reveal } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';
import { brandPaths } from '@/components/brandPaths';
import { fundamentals, skillGroups } from '@/data/portfolio';
import type { IconSlug, SkillGroup } from '@/data/types';

type Item = SkillGroup['items'][number];

function BrandIcon({ slug, label }: { slug: IconSlug; label: string }) {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" role="img" aria-label={label} focusable="false">
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
      <div className="grid gap-5 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-8">
        <div className="lg:pt-1">
          <h3 className="font-display text-lg">{group.title}</h3>

          {/* Fixed height so swapping the caption never shifts the grid. */}
          <div className="mt-1 min-h-[3.5rem] sm:min-h-[4rem]">
            {active ? (
              <p
                id={captionId}
                className="text-[0.8125rem] leading-relaxed text-muted"
                aria-live="polite"
              >
                <span className="font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-accent">
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
          className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-9"
          onMouseLeave={() => setActive(null)}
        >
          {group.items.map((item) => (
            <li key={item.name}>
              <button
                type="button"
                onMouseEnter={() => setActive(item)}
                onFocus={() => setActive(item)}
                onBlur={() => setActive(null)}
                onClick={() => setActive((current) => (current === item ? null : item))}
                aria-describedby={captionId}
                className="group flex w-full flex-col items-center gap-2.5 rounded-xl border border-line bg-surface px-2 py-4 transition-colors duration-300 hover:border-accent/40 hover:bg-elevated focus-visible:border-accent/40 aria-[current=true]:border-accent/40"
                aria-current={active === item}
              >
                <span className="text-muted transition-colors duration-300 group-hover:text-accent group-aria-[current=true]:text-accent">
                  <BrandIcon slug={item.icon} label={item.name} />
                </span>
                <span className="text-center text-[0.75rem] leading-tight text-muted transition-colors group-hover:text-ink">
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
      className="scroll-mt-24 border-t border-line py-24 sm:py-28"
    >
      <div className="shell">
        <SectionHeading
          index="04"
          eyebrow="Toolkit"
          title={<span id="stack-title">What I reach for, and where I have actually used it.</span>}
          lede="Point at any tool and the caption beside it names the projects it shipped in. No percentage bars — a number next to a logo means nothing."
        />

        <div className="space-y-10">
          {skillGroups.map((group, index) => (
            <Group key={group.id} group={group} index={index} />
          ))}
        </div>

        <Reveal index={5} className="mt-12">
          <div className="flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:gap-6">
            <p className="eyebrow shrink-0">CS fundamentals</p>
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
