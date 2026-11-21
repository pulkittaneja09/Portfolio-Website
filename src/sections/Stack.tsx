import { useId, useState } from 'react';
import { Reveal } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';
import { brandPaths } from '@/components/brandPaths';
import { fundamentals, skillGroups } from '@/data/portfolio';
import type { IconSlug } from '@/data/types';
import { useIsDesktopPointer } from '@/hooks/useMediaQuery';

function BrandIcon({ slug, label }: { slug: IconSlug; label: string }) {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" role="img" aria-label={label} focusable="false">
      <path d={brandPaths[slug]} fill="currentColor" />
    </svg>
  );
}

interface TileProps {
  name: string;
  slug: IconSlug;
  usedIn: string[];
}

/**
 * One tool. The tooltip naming the projects it was used in is the point of
 * this section — a logo wall on its own proves nothing.
 */
function SkillTile({ name, slug, usedIn }: TileProps) {
  const [open, setOpen] = useState(false);
  const isDesktop = useIsDesktopPointer();
  const tooltipId = useId();

  return (
    <li className="relative">
      <button
        type="button"
        // On touch, tapping reveals the tooltip; on desktop hover does it.
        onClick={() => setOpen((value) => !value)}
        onMouseEnter={() => isDesktop && setOpen(true)}
        onMouseLeave={() => isDesktop && setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        aria-describedby={tooltipId}
        aria-expanded={open}
        className="group flex w-full flex-col items-center gap-2.5 rounded-xl border border-line bg-surface px-3 py-4 transition-colors duration-300 hover:border-accent/40 hover:bg-elevated"
      >
        <span className="text-muted transition-colors duration-300 group-hover:text-accent">
          <BrandIcon slug={slug} label={name} />
        </span>
        <span className="text-center text-[0.75rem] leading-tight text-muted transition-colors group-hover:text-ink">
          {name}
        </span>
      </button>

      <div
        id={tooltipId}
        role="tooltip"
        className={`pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 w-max max-w-[15rem] -translate-x-1/2 rounded-lg border border-line bg-elevated p-3 text-left shadow-lift transition-opacity duration-200 ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <p className="font-mono text-[0.625rem] uppercase tracking-[0.12em] text-faint">Used in</p>
        <ul className="mt-1.5 space-y-0.5">
          {usedIn.map((project) => (
            <li key={project} className="text-[0.75rem] leading-snug text-ink">
              {project}
            </li>
          ))}
        </ul>
      </div>
    </li>
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
          lede="Hover or tap any tool to see the projects it shipped in. No percentage bars — a number next to a logo means nothing."
        />

        <div className="space-y-10">
          {skillGroups.map((group, groupIndex) => (
            <Reveal key={group.id} index={groupIndex}>
              <div className="grid gap-5 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-8">
                <div className="lg:pt-1">
                  <h3 className="font-display text-lg">{group.title}</h3>
                  <p className="mt-1 text-[0.8125rem] leading-relaxed text-muted">{group.blurb}</p>
                </div>

                <ul className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-9">
                  {group.items.map((item) => (
                    <SkillTile key={item.name} name={item.name} slug={item.icon} usedIn={item.usedIn} />
                  ))}
                </ul>
              </div>
            </Reveal>
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
