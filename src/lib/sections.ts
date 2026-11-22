import { nav } from '@/data/portfolio';
import type { NavItem } from '@/data/types';
import { hasNotes } from '@/lib/notes';

/**
 * The page's sections, in order: `nav` from portfolio.ts, plus Notes (after
 * Projects) once a note is published. The rail nav, the scroll-spy, the phone
 * bar and ⌘K all read this, so the section appears everywhere at once.
 */
const founder = nav.findIndex((item) => item.id === 'founder');

export const sections: NavItem[] = hasNotes
  ? [...nav.slice(0, founder), { id: 'notes', label: 'Notes' }, ...nav.slice(founder)]
  : nav;
