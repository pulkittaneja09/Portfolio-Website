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

  const field =
    'mt-2 w-full rounded-lg border border-hairline bg-transparent px-3.5 py-2.5 text-sm text-text outline-none transition-[border-color,background-color] duration-400 ease-quiet placeholder:text-faint hover:border-strong focus:border-strong focus:bg-light/[0.02]';

  return (
    <section id="contact" aria-labelledby="contact-title" className="section-y scroll-mt-24">
      <div className="shell">
        <SectionHeading
          index="06"
          label="Contact"
          title={
            <span id="contact-title">
              Hiring for an AI or backend internship? <span className="text-muted">Let’s talk.</span>
            </span>
          }
          lede="I reply to every message that is actually about work. The fastest route is email — the form below ends up in the same inbox."
        />

        {/* ── The address, large ──────────────────────────────────────────── */}
        <Reveal>
          <div className="flex flex-col gap-6 border-y border-hairline py-10 sm:flex-row sm:items-end sm:justify-between sm:py-14">
            <div className="min-w-0">
              <StatusBadge label={profile.availability} />
              <a
                href={`mailto:${profile.email}`}
                className="group mt-6 block break-all text-[1.625rem] font-medium leading-[1.05] tracking-[-0.035em] text-text transition-colors duration-600 ease-quiet hover:text-muted sm:text-[2.5rem] lg:text-[3.25rem]"
              >
                {profile.email}
              </a>
            </div>
            <button
              type="button"
              onClick={() => void copy(profile.email, 'Email copied')}
              className="inline-flex h-10 shrink-0 items-center gap-2 self-start rounded-lg border border-hairline px-4 text-sm text-muted transition-colors duration-400 ease-quiet hover:border-strong hover:text-text sm:self-auto"
            >
              <CopyIcon className="h-4 w-4" />
              Copy address
            </button>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20">
          {/* ── Direct routes ────────────────────────────────────────────── */}
          <Reveal className="flex flex-col">
            <p className="label">Elsewhere</p>
            <p className="prose-body mt-5 text-[0.9375rem]">{profile.summary}</p>

            <ul className="mt-8 divide-y divide-hairline border-y border-hairline">
              {profile.socials
                .filter((social) => social.icon !== 'mail')
                .map((social) => {
                  const Icon = socialIconMap[social.icon];
                  return (
                    <li key={social.label}>
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="group flex items-center gap-4 py-4"
                      >
                        <Icon className="h-4 w-4 shrink-0 text-faint transition-colors duration-400 ease-quiet group-hover:text-text" />
                        <span className="text-sm text-text">{social.label}</span>
                        <span className="meta ml-auto truncate">{social.handle}</span>
                        <ArrowUpRightIcon className="h-3.5 w-3.5 shrink-0 text-faint transition-[color,transform] duration-400 ease-quiet group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-text" />
                      </a>
                    </li>
                  );
                })}
            </ul>

            <div className="mt-8">
              <MagneticButton href={profile.resumePath} variant="outline" download>
                <DownloadIcon className="h-4 w-4 text-muted" />
                Download résumé (PDF)
              </MagneticButton>
            </div>
          </Reveal>

          {/* ── Form ─────────────────────────────────────────────────────── */}
          <Reveal index={1}>
            <form onSubmit={onSubmit} className="relative flex h-full flex-col" noValidate={false}>
              <p className="label">Send a message</p>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact-name" className="block text-[0.8125rem] text-muted">
                    Your name
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    className={field}
                    placeholder="Alex Rivera"
                  />
                </div>

                <div>
                  <label htmlFor="contact-email" className="block text-[0.8125rem] text-muted">
                    Email
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    className={field}
                    placeholder="alex@company.com"
                  />
                </div>
              </div>

              <div className="mt-5">
                <label htmlFor="contact-message" className="block text-[0.8125rem] text-muted">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  rows={6}
                  className={`${field} resize-y leading-relaxed`}
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
                  {state === 'sending' ? 'Sending…' : 'Send message'}
                  <SendIcon className="h-4 w-4" />
                </MagneticButton>

                <p className="meta" role="status" aria-live="polite">
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
