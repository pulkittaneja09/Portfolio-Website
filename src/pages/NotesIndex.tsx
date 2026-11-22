import { useEffect } from 'react';
import { TransitionLink } from '@/components/TransitionLink';
import { ArrowLeftIcon, ArrowUpRightIcon } from '@/components/icons';
import { profile } from '@/data/portfolio';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { formatNoteDate, hasNotes, notes } from '@/lib/notes';
import { stagger } from '@/lib/stagger';
import { NotFound } from '@/pages/NotFound';

/** /notes — every published note, newest first. A 404 while all are drafts. */
export function NotesIndex() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  useDocumentMeta(
    `Notes — ${profile.name}`,
    'Notes on building AI agents, RAG systems and the backends that run them.',
    '/notes',
  );

  if (!hasNotes) return <NotFound />;

  return (
    <main id="main" className="mx-auto max-w-[46rem] px-5 pb-24 pt-12 sm:px-8 sm:pb-32 sm:pt-20">
      <TransitionLink
        to="/#notes"
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
          Notes
        </p>
        <h1
          className="enter mt-4 text-[clamp(2rem,6vw,2.75rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-strong"
          style={stagger(2)}
        >
          Notes from building <em className="serif">agents</em>.
        </h1>
        <p className="enter mt-5 max-w-prose text-body" style={stagger(3)}>
          On AI agents, retrieval and the backends underneath them.{' '}
          <a href="/rss.xml" className="group inline-flex items-center gap-1 text-strong">
            <span className="link link-on-group">RSS</span>
            <ArrowUpRightIcon className="h-3 w-3 text-body" aria-hidden />
          </a>
        </p>
      </header>

      <ol className="enter mt-12 divide-y divide-line/[0.06] border-y border-line/[0.06]" style={stagger(4)}>
        {notes.map((note) => (
          <li key={note.slug}>
            <TransitionLink
              to={`/notes/${note.slug}`}
              className="group grid gap-1 py-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-6"
            >
              <span>
                <span className="font-medium text-strong transition-colors duration-300 group-hover:text-accent">
                  {note.title}
                  {note.draft && <span className="label ml-2 text-faint">draft</span>}
                </span>
                {note.summary && <span className="mt-1 block text-sm text-body">{note.summary}</span>}
              </span>
              <time dateTime={note.date} className="meta sm:pt-0.5">
                {formatNoteDate(note.date)}
              </time>
            </TransitionLink>
          </li>
        ))}
      </ol>
    </main>
  );
}
