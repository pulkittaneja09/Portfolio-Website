import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { TransitionLink } from '@/components/TransitionLink';
import { ArrowLeftIcon } from '@/components/icons';
import { profile } from '@/data/portfolio';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { formatNoteDate, noteBySlug, readingTime } from '@/lib/notes';
import { stagger } from '@/lib/stagger';
import { NotFound } from '@/pages/NotFound';

/**
 * One note, in the same reading column as a case study. The HTML was rendered
 * from your own Markdown at build time (config/notes.ts), so it is trusted.
 */
export function NotePage() {
  const { slug } = useParams<{ slug: string }>();
  const note = noteBySlug(slug);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [slug]);

  useDocumentMeta(
    note ? `${note.title} — ${profile.name}` : `Note not found — ${profile.name}`,
    note?.summary || 'Note not found.',
    `/notes/${slug ?? ''}`,
  );

  if (!note) return <NotFound />;

  return (
    <main id="main" className="mx-auto max-w-[46rem] px-5 pb-24 pt-12 sm:px-8 sm:pb-32 sm:pt-20">
      <TransitionLink
        to="/notes"
        className="enter group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.1em] text-body transition-colors duration-300 hover:text-strong"
      >
        <ArrowLeftIcon
          className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-0.5"
          aria-hidden
        />
        Notes
      </TransitionLink>

      <article className="mt-14 sm:mt-20">
        <header>
          <p className="enter label text-faint" style={stagger(1)}>
            <time dateTime={note.date}>{formatNoteDate(note.date)}</time> · {readingTime(note.html)}
            {note.draft && ' · draft, not published'}
          </p>
          <h1
            className="enter mt-4 text-[clamp(2rem,6vw,2.75rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-strong"
            style={stagger(2)}
          >
            {note.title}
          </h1>
        </header>

        <div
          className="note-prose enter mt-10"
          style={stagger(3)}
          // Rendered from the repository's own Markdown at build time.
          dangerouslySetInnerHTML={{ __html: note.html }}
        />
      </article>
    </main>
  );
}
