import { Link } from 'react-router-dom';
import { Reveal } from '@/components/Reveal';
import { Section } from '@/components/Section';
import { TransitionLink } from '@/components/TransitionLink';
import { ArrowRightIcon } from '@/components/icons';
import { formatNoteDate, hasNotes, notes } from '@/lib/notes';

const LIMIT = 5;

/**
 * The latest notes, one line each: title on the left, date on the right.
 * Renders nothing while every note is still a draft.
 */
export function Notes() {
  if (!hasNotes) return null;

  return (
    <Section id="notes" label="Notes">
      <ol className="row-list">
        {notes.slice(0, LIMIT).map((note, index) => (
          <li key={note.slug} className="row-item">
            <Reveal index={index}>
              <TransitionLink
                to={`/notes/${note.slug}`}
                className="group/note -mx-3 flex items-baseline justify-between gap-6 rounded-lg px-3 py-2.5 transition-[background-color,box-shadow] duration-300 hover:bg-[var(--row-hover-bg)] hover:shadow-card"
              >
                <span className="min-w-0 truncate text-sm font-medium text-strong transition-colors duration-300 group-hover/note:text-accent">
                  {note.title}
                  {note.draft && <span className="label ml-2 text-faint">draft</span>}
                </span>
                <time dateTime={note.date} className="meta shrink-0">
                  {formatNoteDate(note.date)}
                </time>
              </TransitionLink>
            </Reveal>
          </li>
        ))}
      </ol>
      <Link
        to="/notes"
        className="group mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-strong"
      >
        <span className="link link-on-group">All notes</span>
        <ArrowRightIcon
          className="h-3.5 w-3.5 text-body transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-accent"
          aria-hidden
        />
      </Link>
    </Section>
  );
}
