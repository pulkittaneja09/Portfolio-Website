import { stats } from '@/data/portfolio';
import type { Stat } from '@/data/types';
import { useCountUp } from '@/hooks/useCountUp';
import { useInView } from '@/hooks/useInView';

interface ProofBarProps {
  /** Live repo count from the GitHub API; falls back to the value in data. */
  publicRepos?: number;
}

function StatCell({ stat, start, value }: { stat: Stat; start: boolean; value: number }) {
  const display = useCountUp({ to: value, decimals: stat.decimals ?? 0, start });

  return (
    <li className="group relative bg-bg px-4 py-5 sm:px-5 sm:py-6">
      <p className="font-display text-xl tabular-nums leading-none text-ink sm:text-2xl">
        {stat.prefix}
        <span className="text-accent">{display}</span>
        {stat.suffix}
      </p>

      <p className="mt-2 text-[0.8125rem] leading-snug text-muted">
        {stat.label}
        {/* Where the number comes from — always in the accessibility tree,
            and surfaced visually on hover. */}
        <span className="sr-only">. Source: {stat.source}</span>
      </p>

      <span
        className="pointer-events-none absolute inset-x-2 top-full z-30 rounded-lg border border-line bg-elevated p-3 font-mono text-[0.6875rem] leading-relaxed text-muted opacity-0 shadow-lift transition-opacity duration-200 group-hover:opacity-100"
        aria-hidden
      >
        {stat.source}
      </span>
    </li>
  );
}

export function ProofBar({ publicRepos }: ProofBarProps) {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <section aria-labelledby="proof-heading" className="border-y border-line bg-bg">
      <h2 id="proof-heading" className="sr-only">
        Proof in numbers
      </h2>

      <div ref={ref} className="shell">
        {/* gap-px over the line colour draws the separators, so there is no
            doubled border where the grid wraps. */}
        <ul className="-mx-4 grid grid-cols-2 gap-px bg-line sm:-mx-5 sm:grid-cols-3 lg:grid-cols-6">
          {stats.map((stat) => (
            <StatCell
              key={stat.label}
              stat={stat}
              start={inView}
              value={stat.live === 'publicRepos' && publicRepos ? publicRepos : stat.value}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}
