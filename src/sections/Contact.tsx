import { useState } from 'react';
import { MagneticButton } from '@/components/MagneticButton';
import { Reveal } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';
import { StatusBadge } from '@/components/StatusBadge';
import { ArrowUpRightIcon, CopyIcon, DownloadIcon, SendIcon, socialIconMap } from '@/components/icons';
import { useToast } from '@/components/Toaster';
import { profile } from '@/data/portfolio';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';

type FormState = 'idle' | 'sending' | 'sent' | 'error';

const FORMSPREE_ID = import.meta.env.VITE_FORMSPREE_ID;

export function Contact() {
  const copy = useCopyToClipboard();
  const toast = useToast();
  const [state, setState] = useState<FormState>('idle');

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    // Honeypot: real people never fill a hidden field.
    if (data.get('company')) {
      setState('sent');
      return;
    }

    // Without a Formspree ID configured, hand off to the visitor's mail client
    // rather than silently dropping the message.
    if (!FORMSPREE_ID) {
      const subject = encodeURIComponent(`Portfolio enquiry from ${String(data.get('name') ?? '')}`);
      const body = encodeURIComponent(
        `${String(data.get('message') ?? '')}\n\n— ${String(data.get('name') ?? '')} (${String(data.get('email') ?? '')})`,
      );
      window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
      toast('Opening your mail app');
      return;
    }

    setState('sending');
    try {
      const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: data,
      });

      if (!response.ok) throw new Error(`Formspree responded ${response.status}`);

      setState('sent');
      form.reset();
      toast('Message sent — I will reply soon');
    } catch {
      setState('error');
    }
  }

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="scroll-mt-24 border-t border-line py-24 sm:py-28"
    >
      <div className="shell">
        <SectionHeading
          index="06"
          eyebrow="Contact"
          title={<span id="contact-title">Hiring for an AI or backend internship?</span>}
          lede="I reply to every message that is actually about work. The fastest route is email — the form below ends up in the same inbox."
        />

        <div className="grid gap-5 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-8">
          {/* ── Direct routes ────────────────────────────────────────────── */}
          <Reveal>
            <div className="card flex h-full flex-col p-6 sm:p-7">
              <StatusBadge label={profile.availability} className="self-start" />

              <p className="mt-6 text-[0.9375rem] leading-relaxed text-muted">{profile.summary}</p>

              <div className="mt-7">
                <p className="eyebrow">Email</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <a
                    href={`mailto:${profile.email}`}
                    className="link-underline break-all font-mono text-sm text-ink"
                  >
                    {profile.email}
                  </a>
                  <button
                    type="button"
                    onClick={() => void copy(profile.email, 'Email copied')}
                    className="inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 font-mono text-[0.625rem] uppercase tracking-[0.1em] text-muted transition-colors hover:border-accent/50 hover:text-accent"
                  >
                    <CopyIcon className="h-3.5 w-3.5" />
                    Copy
                  </button>
                </div>
              </div>

              <ul className="mt-7 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2">
                {profile.socials
                  .filter((social) => social.icon !== 'mail')
                  .map((social) => {
                    const Icon = socialIconMap[social.icon];
                    return (
                      <li key={social.label} className="bg-surface">
                        <a
                          href={social.href}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="group flex items-center gap-3 p-4 transition-colors hover:bg-elevated"
                        >
                          <Icon className="h-4 w-4 shrink-0 text-muted transition-colors group-hover:text-accent" />
                          <span className="min-w-0 flex-1">
                            <span className="block text-sm text-ink">{social.label}</span>
                            <span className="block truncate font-mono text-[0.6875rem] text-faint">
                              {social.handle}
                            </span>
                          </span>
                          <ArrowUpRightIcon className="h-3.5 w-3.5 shrink-0 text-faint transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" />
                        </a>
                      </li>
                    );
                  })}
              </ul>

              <div className="mt-auto pt-7">
                <MagneticButton href={profile.resumePath} variant="outline" download>
                  <DownloadIcon className="h-4 w-4" />
                  Download résumé (PDF)
                </MagneticButton>
              </div>
            </div>
          </Reveal>

          {/* ── Form ─────────────────────────────────────────────────────── */}
          <Reveal index={1}>
            <form onSubmit={onSubmit} className="card flex h-full flex-col p-6 sm:p-7" noValidate={false}>
              <p className="eyebrow">Send a message</p>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact-name" className="block text-sm text-muted">
                    Your name
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    className="mt-1.5 w-full rounded-lg border border-line bg-elevated px-3.5 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-faint focus:border-accent/60"
                    placeholder="Alex Rivera"
                  />
                </div>

                <div>
                  <label htmlFor="contact-email" className="block text-sm text-muted">
                    Email
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    className="mt-1.5 w-full rounded-lg border border-line bg-elevated px-3.5 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-faint focus:border-accent/60"
                    placeholder="alex@company.com"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label htmlFor="contact-message" className="block text-sm text-muted">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  rows={6}
                  className="mt-1.5 w-full resize-y rounded-lg border border-line bg-elevated px-3.5 py-2.5 text-sm leading-relaxed text-ink outline-none transition-colors placeholder:text-faint focus:border-accent/60"
                  placeholder="What are you building, and what would I be working on?"
                />
              </div>

              {/* Honeypot — hidden from people, irresistible to bots. */}
              <div className="absolute -left-[9999px]" aria-hidden>
                <label htmlFor="contact-company">Company (leave blank)</label>
                <input id="contact-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <MagneticButton type="submit" variant="solid">
                  <SendIcon className="h-4 w-4" />
                  {state === 'sending' ? 'Sending…' : 'Send message'}
                </MagneticButton>

                <p className="font-mono text-[0.6875rem] text-faint" role="status" aria-live="polite">
                  {state === 'sent' && 'Message sent. Thank you — I will reply soon.'}
                  {state === 'error' && 'That did not go through. Email me directly instead.'}
                  {state === 'idle' && !FORMSPREE_ID && 'Opens your mail client until a form key is set.'}
                </p>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
