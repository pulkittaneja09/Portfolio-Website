import { CountUp } from '@/components/CountUp';
import { RichText } from '@/components/RichText';
import { Section } from '@/components/Section';
import { ArrowUpRightIcon } from '@/components/icons';
import { about, now, projects, stats } from '@/data/portfolio';
import type { NowItem } from '@/data/types';
import { leetcodeLabel, leetcodeProfile } from '@/lib/siteStats';
import { stagger } from '@/lib/stagger';

/** Now, plus the LeetCode count fetched at build time ("LeetCode ↗" if it is unknown). */
const nowItems: NowItem[] = leetcodeProfile
  ? [...now, { label: leetcodeLabel, href: leetcodeProfile.href }]
  : now;

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

const statValue = (match: (label: string) => boolean) => {
  const stat = stats.find((item) => match(item.label));
  return stat ? `${stat.prefix ?? ''}${stat.value}${stat.suffix ?? ''}` : null;
};

/**
 * Three real numbers, all from portfolio.ts: the startup and the MCP tools
 * from the sourced `stats`, the shipped AI products counted from the projects
 * (AI, RAG or ML work with a live demo). A tile whose figure is missing is
 * dropped rather than guessed.
 */
const highlights = [
  { value: statValue((label) => label.startsWith('Startup')), label: 'startup founded' },
  {
    value: String(
      projects.filter(
        (project) => project.links.demo && project.tags.some((tag) => /AI|RAG|Machine learning/i.test(tag)),
      ).length,
    ),
    label: 'AI products shipped',
  },
  { value: statValue((label) => label.includes('MCP')), label: 'MCP tools built' },
].filter((item): item is { value: string; label: string } => Boolean(item.value) && item.value !== '0');

function Highlights() {
  return (
    <ul className="enter mt-10 grid grid-cols-3 gap-2 sm:gap-3" style={stagger(5)}>
      {highlights.map((item) => (
        <li
          key={item.label}
          className="rounded-xl border border-line/[0.08] bg-[var(--chip-bg)] px-3 py-3 light:bg-[var(--bg-elevated)] light:shadow-card sm:px-4 sm:py-3.5"
        >
          <CountUp
            value={item.value}
            className="block font-mono text-xl tracking-[-0.02em] text-accent sm:text-2xl"
          />
          <span className="mt-1 block text-xs leading-snug text-body">{item.label}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * Two short first-person paragraphs, then "Now" as a plain label/value row
 * (the tools live in the Skills section). It is on screen at load on
 * desktop, so it uses the load entrance rather than a scroll reveal.
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
      </dl>

      <Highlights />
    </Section>
  );
}
