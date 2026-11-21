import { Reveal } from '@/components/Reveal';
import { stats } from '@/data/portfolio';
import type { Stat } from '@/data/types';
import { useCountUp } from '@/hooks/useCountUp';
import { useInView } from '@/hooks/useInView';

interface ProofBarProps {
  /** Live repo count from the GitHub API; falls back to the value in data. */
  publicRepos?: number;
}

function StatCell({ stat, start, value, index }: { stat: Stat; start: boolean; value: number; index: number }) {
  const display = useCountUp({ to: value, decimals: stat.decimals ?? 0, start, durationMs: 1200 });

  return (
    <li className="group relative bg-bg p-5 transition-colors duration-600 ease-quiet hover:bg-elevated sm:p-6">
      <div className="flex items-center justify-between">
        <span className="meta">{String(index + 1).padStart(2, '0')}</span>
        {stat.live === 'publicRepos' && (
          <span className="meta flex items-center gap-1.5">
            <span className="h-1 w-1 rounded-full bg-text/70" aria-hidden />
            live
          </span>
        )}
      </div>

      <p className="mt-10 text-[2rem] font-medium leading-none tracking-[-0.04em] text-text tabular-nums sm:mt-14 sm:text-[2.5rem]">
        {stat.prefix && <span className="mr-1 text-[0.55em] tracking-[-0.02em] text-muted">{stat.prefix.trim()}</span>}
        {display}
        {stat.suffix && <span className="text-muted">{stat.suffix}</span>}
      </p>

      {/* The label, and on hover its source in the same slot. The source is
          always in the accessibility tree. */}
      <div className="relative mt-3 min-h-[2.6rem] text-[0.8125rem] leading-snug">
        <p className="text-muted transition-[opacity,filter] duration-400 ease-quiet group-hover:opacity-0 group-hover:blur-[2px]">
          {stat.label}
          <span className="sr-only">. Source: {stat.source}</span>
        </p>
        <p
          className="absolute inset-x-0 top-0 line-clamp-3 text-[0.75rem] text-faint opacity-0 blur-[2px] transition-[opacity,filter] duration-400 ease-quiet group-hover:opacity-100 group-hover:blur-0"
          aria-hidden
        >
          {stat.source}
        </p>
      </div>
    </li>
  );
}

export function ProofBar({ publicRepos }: ProofBarProps) {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <section aria-labelledby="proof-heading" className="py-16 sm:py-24">
      <h2 id="proof-heading" className="sr-only">
        Proof in numbers
      </h2>

      <div ref={ref} className="shell">
        <Reveal>
          {/* gap-px over the hairline colour draws the separators, so there is
              no doubled border where the grid wraps. */}
          <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-panel border border-hairline bg-[var(--border)] sm:grid-cols-3 lg:grid-cols-6">
            {stats.map((stat, i) => (
              <StatCell
                key={stat.label}
                stat={stat}
                index={i}
                start={inView}
                value={stat.live === 'publicRepos' && publicRepos ? publicRepos : stat.value}
              />
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
