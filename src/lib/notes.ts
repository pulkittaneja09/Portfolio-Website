import allNotes from 'virtual:notes';

/**
 * Notes from content/notes (config/notes.ts). A production build contains the
 * published notes only; the dev server adds drafts, flagged, so you can read
 * them while you write. While nothing is published the home section, the nav
 * item, the routes and the feed all stay hidden.
 */
export type Note = (typeof allNotes)[number];

export const notes: Note[] = allNotes;
export const hasNotes = notes.length > 0;

export const noteBySlug = (slug: string | undefined) => notes.find((note) => note.slug === slug);

/** "22 Nov 2026" */
export const formatNoteDate = (date: string) =>
  new Date(`${date}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });

/** "4 min read", from the rendered text at ~220 words a minute. */
export function readingTime(html: string): string {
  const words = html
    .replace(/<[^>]+>/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 220))} min read`;
}
