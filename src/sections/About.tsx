import { RichText } from '@/components/RichText';
import { Section } from '@/components/Section';
import { ArrowUpRightIcon } from '@/components/icons';
import { about, dailyTools, now } from '@/data/portfolio';
import type { NowItem } from '@/data/types';
import { leetcodeLabel, leetcodeProfile } from '@/lib/siteStats';
import { stagger } from '@/lib/stagger';

/** Now, plus the LeetCode count fetched at build time ("LeetCode ↗" if it is unknown). */
const nowItems: NowItem[] = leetcodeProfile
  ? [...now, { label: leetcodeLabel, href: leetcodeProfile.href }]
  : now;
const toolItems: NowItem[] = dailyTools.map((label) => ({ label }));

function FactItem({ item }: { item: NowItem }) {
  if (!item.href) return <>{item.label}</>;
  const external = item.href.startsWith('http');
  return (
    <a
      href={item.href}
      className="group inline-flex items-baseline gap-1 text-body transition-colors duration-300 hover:text-strong"
      {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
    >
      <span className="link link-on-group">{item.label}</span>
      {external && (
        <>
          <ArrowUpRightIcon
            className="h-3 w-3 self-center transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
            aria-hidden
          />
          <span className="sr-only">(opens in a new tab)</span>
        </>
      )}
    </a>
  );
}

/**
 * One quiet label/value row. The label column is the same 27% as the
 * experience dates below, so the two line up. Each separator rides on the end
 * of the item before it, so a wrapped line never opens on a dot.
 */
function Fact({ label, items }: { label: string; items: NowItem[] }) {
  return (
    <div className="grid gap-y-1 sm:grid-cols-[27%_minmax(0,1fr)] sm:gap-x-6">
      <dt className="label pt-px text-faint">{label}</dt>
      <dd className="flex flex-wrap gap-x-2 gap-y-0.5 text-body">
        {items.map((item, i) => (
          <span key={item.label}>
            <FactItem item={item} />
            {i < items.length - 1 && (
              <span className="ml-2 text-faint" aria-hidden>
                ·
              </span>
            )}
          </span>
        ))}
      </dd>
    </div>
  );
}

/**
 * Two short first-person paragraphs, then "Now" and the daily tools as plain
 * label/value rows. It is on screen at load on desktop, so it uses the load
 * entrance rather than a scroll reveal.
 */
export function About() {
  return (
    <Section id="about" label="About">
      <div className="max-w-prose space-y-4">
        {about.map((paragraph, i) => (
          <p key={paragraph.slice(0, 24)} className="enter" style={stagger(2 + i)}>
            <RichText text={paragraph} />
          </p>
        ))}
      </div>

      <dl className="enter mt-8 space-y-3 text-sm" style={stagger(4)}>
        <Fact label="Now" items={nowItems} />
        <Fact label="Daily tools" items={toolItems} />
      </dl>
    </Section>
  );
}
