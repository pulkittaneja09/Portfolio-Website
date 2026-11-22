import { useEffect } from 'react';
import { TransitionLink } from '@/components/TransitionLink';
import { ArrowLeftIcon } from '@/components/icons';
import { profile, uses } from '@/data/portfolio';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { updatedLabel } from '@/lib/siteStats';
import { stagger } from '@/lib/stagger';

/** Only what has been filled in: empty slots and empty groups stay hidden. */
const groups = uses
  .map((group) => ({
    title: group.title,
    items: group.items.filter((item): item is { name: string; note?: string } => item.name !== null),
  }))
  .filter((group) => group.items.length > 0);

/** /uses — the setup behind the work, in the case study's label/value rows. */
export function Uses() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  useDocumentMeta(`Uses — ${profile.name}`, 'The tools behind the work.', '/uses');

  return (
    <main id="main" className="mx-auto max-w-[46rem] px-5 pb-24 pt-12 sm:px-8 sm:pb-32 sm:pt-20">
      <TransitionLink
        to="/"
        className="enter group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.1em] text-body transition-colors duration-300 hover:text-strong"
      >
        <ArrowLeftIcon
          className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-0.5"
          aria-hidden
        />
        {profile.name}
      </TransitionLink>

      <header className="mt-14 sm:mt-20">
        <p className="enter label text-faint" style={stagger(1)}>
          Uses · updated {updatedLabel}
        </p>
        <h1
          className="enter mt-4 text-[clamp(2rem,6vw,2.75rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-strong"
          style={stagger(2)}
        >
          What I <em className="serif">use</em>.
        </h1>
        <p className="enter mt-5 max-w-prose text-body" style={stagger(3)}>
          The tools behind the work.
        </p>
      </header>

      <dl className="enter mt-12 divide-y divide-line/[0.06] border-y border-line/[0.06]" style={stagger(4)}>
        {groups.map((group) => (
          <div key={group.title} className="grid gap-1 py-4 sm:grid-cols-[27%_minmax(0,1fr)] sm:gap-6">
            <dt className="label pt-1 text-faint">{group.title}</dt>
            <dd>
              <ul className="space-y-1.5">
                {group.items.map((item) => (
                  <li key={item.name} className="text-[0.9375rem] text-body">
                    <span className="text-strong">{item.name}</span>
                    {item.note && <span className="text-faint"> — {item.note}</span>}
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        ))}
      </dl>
    </main>
  );
}
