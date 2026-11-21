import { RichText } from '@/components/RichText';
import { Section } from '@/components/Section';
import { about, dailyTools, now } from '@/data/portfolio';
import { stagger } from '@/lib/stagger';

/**
 * Two short first-person paragraphs, a "Now" strip and the daily tools.
 * It is on screen at load on desktop, so it uses the load entrance rather
 * than a scroll reveal.
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

      <div
        className="enter mt-8 flex max-w-prose flex-wrap items-center gap-x-3 gap-y-1.5 rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-3"
        style={stagger(4)}
      >
        <span className="label mr-1 text-faint">Now</span>
        {/* Separators trail their item, so a wrapped line never opens on a dot. */}
        {now.map((item, i) => (
          <span key={item} className="text-sm text-strong">
            {item}
            {i < now.length - 1 && (
              <span className="ml-3 text-faint" aria-hidden>
                ·
              </span>
            )}
          </span>
        ))}
      </div>

      {/* Each separator rides on the end of the item before it, so a wrapped
          line always starts with a tool, never with a stray dot. */}
      <p className="enter meta mt-5 flex max-w-prose flex-wrap gap-x-2" style={stagger(5)}>
        <span>Daily tools:</span>
        {dailyTools.map((tool, i) => (
          <span key={tool} className="text-body">
            {tool}
            {i < dailyTools.length - 1 && <span className="ml-2 text-faint">·</span>}
          </span>
        ))}
      </p>
    </Section>
  );
}
