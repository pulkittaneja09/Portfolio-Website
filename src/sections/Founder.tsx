import { PipelineFlow } from '@/components/PipelineFlow';
import { Reveal } from '@/components/Reveal';
import { RichText } from '@/components/RichText';
import { Section } from '@/components/Section';
import { venture } from '@/data/portfolio';

function Check() {
  return (
    <svg viewBox="0 0 12 12" className="mt-1 h-3.5 w-3.5 shrink-0 text-accent" aria-hidden focusable="false">
      <path
        d="M2.5 6.4 5 8.9l4.5-5.8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Audaxity, as the one card on the page that is not a row: a hairline box lit
 * from its top edge, with the mission, the product pipeline and the two
 * credentials that matter.
 */
export function Founder() {
  return (
    <Section id="founder" label="Founder">
      <Reveal>
        <article className="founder-card relative overflow-hidden rounded-2xl border border-white/[0.08] p-6 sm:p-8">
          <p className="label text-faint">
            {venture.role} · since {venture.since}
          </p>
          <h3 className="mt-3 text-2xl font-semibold tracking-[-0.02em] text-strong">{venture.name}</h3>
          <p className="mt-3 max-w-prose text-lg leading-relaxed text-body">
            <RichText text={venture.mission} />
          </p>

          <div className="mt-8">
            <PipelineFlow />
          </div>

          <ul className="mt-8 space-y-3.5 border-t border-white/[0.06] pt-6">
            {venture.badges.map((badge) => (
              <li key={badge.label} className="flex gap-3">
                <Check />
                <div>
                  <p className="font-medium text-strong">{badge.label}</p>
                  <p className="mt-0.5 text-[0.9375rem] leading-relaxed text-body">{badge.detail}</p>
                </div>
              </li>
            ))}
          </ul>

          <p className="meta mt-6">{venture.stack.join(' · ')}</p>
        </article>
      </Reveal>
    </Section>
  );
}
