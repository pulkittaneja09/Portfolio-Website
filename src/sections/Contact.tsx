import { useEffect, useRef, useState } from 'react';
import { Reveal } from '@/components/Reveal';
import { Section } from '@/components/Section';
import { ArrowUpRightIcon } from '@/components/icons';
import { profile } from '@/data/portfolio';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';

/**
 * One big line, the address set large (click to copy, with a toast and an
 * inline confirmation), and the other ways in. No form: email is the route
 * that actually gets answered.
 */
export function Contact() {
  const copy = useCopyToClipboard();
  const [copied, setCopied] = useState(false);
  const timer = useRef(0);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const onCopy = async () => {
    const ok = await copy(profile.email, 'Email copied');
    if (!ok) return;
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 2200);
  };

  const others = profile.socials.filter((social) => social.icon !== 'mail');

  return (
    <Section id="contact" label="Contact" className="mb-20 lg:mb-24">
      <Reveal>
        <p className="text-[clamp(2rem,4.6vw,3rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-strong">
          Let&rsquo;s build <em className="serif">something</em>.
        </p>
        <p className="mt-5 max-w-prose text-body">
          I&rsquo;m looking for AI/ML and backend internships for 2027. Email is the fastest way to reach
          me, and I reply to everything that is about work.
        </p>
      </Reveal>

      <Reveal index={1} className="mt-10">
        <button
          type="button"
          onClick={() => void onCopy()}
          className="group block max-w-full text-left"
          aria-label={`Copy email address: ${profile.email}`}
        >
          <span className="link link-on-group break-all text-[clamp(1.375rem,4vw,2rem)] font-medium leading-tight tracking-[-0.02em]">
            {profile.email}
          </span>
        </button>
        <p className="meta mt-3 flex flex-wrap items-center gap-x-2" aria-live="polite">
          <span className={copied ? 'text-accent' : undefined}>{copied ? 'Copied to clipboard' : 'Click to copy'}</span>
          <span aria-hidden>·</span>
          <a href={`mailto:${profile.email}`} className="group inline-flex items-center gap-1 text-body">
            <span className="link link-on-group text-body">open in your mail app</span>
            <ArrowUpRightIcon
              className="h-3 w-3 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
              aria-hidden
            />
          </a>
        </p>
      </Reveal>

      <Reveal index={2} className="mt-10">
        <ul className="flex flex-wrap gap-x-6 gap-y-2 text-[0.9375rem]">
          {others.map((social) => (
            <li key={social.label}>
              <a
                href={social.href}
                target="_blank"
                rel="noreferrer noopener"
                className="group inline-flex items-center gap-1 font-medium text-strong"
              >
                <span className="link link-on-group">{social.label}</span>
                <ArrowUpRightIcon
                  className="h-3.5 w-3.5 text-body transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                  aria-hidden
                />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </li>
          ))}
          <li>
            <a
              href={profile.resumePath}
              target="_blank"
              rel="noopener"
              className="group inline-flex items-center gap-1 font-medium text-strong"
            >
              <span className="link link-on-group">Résumé</span>
              <ArrowUpRightIcon
                className="h-3.5 w-3.5 text-body transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                aria-hidden
              />
              <span className="sr-only">(PDF, opens in a new tab)</span>
            </a>
          </li>
        </ul>
      </Reveal>
    </Section>
  );
}
