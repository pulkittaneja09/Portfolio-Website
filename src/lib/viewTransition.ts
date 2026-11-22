import { flushSync } from 'react-dom';
import { scrollToTarget, scrollToTop } from '@/hooks/useLenis';

type StartViewTransition = (update: () => void) => { finished: Promise<void>; ready: Promise<void> };

const SHOT = 'project-shot';
const caseStudySlug = (path: string) => /^\/projects\/([^/#?]+)/.exec(path)?.[1];

/** document.startViewTransition, bound, or null where the API is missing. */
export function viewTransitionApi(): StartViewTransition | null {
  const start = (document as unknown as { startViewTransition?: StartViewTransition }).startViewTransition;
  return typeof start === 'function' ? start.bind(document) : null;
}

/** Name one row thumbnail for the morph (desktop only; the case study's image is named in CSS). */
function nameThumb(slug: string | undefined): HTMLElement | null {
  if (!slug || !window.matchMedia('(min-width: 1024px)').matches) return null;
  const thumb = document.querySelector<HTMLElement>(`[data-vt-shot="${slug}"]`);
  thumb?.style.setProperty('view-transition-name', SHOT);
  return thumb;
}

/**
 * Opens or closes a case study inside a same-document View Transition: the
 * page crossfades with a small lift, and on desktop the project's screenshot
 * morphs between its row thumbnail and the case study's image. Navigation
 * and scrolling both happen inside the update callback, so the new snapshot
 * is taken with the page already in place. Without the API, or under reduced
 * motion, it is a plain navigation.
 */
export function transitionTo(navigate: (to: string) => void, to: string): void {
  const opening = caseStudySlug(to);
  const leaving = caseStudySlug(window.location.pathname);
  // An object, so TypeScript sees the assignment made inside `update`.
  const tagged: { el: HTMLElement | null } = { el: null };

  const update = () => {
    flushSync(() => navigate(to));
    const hash = to.split('#')[1];
    if (hash) scrollToTarget(document.getElementById(hash), false);
    else scrollToTop(false);
    // Back to the list: the thumbnail of the case study we left is the target.
    if (!opening) tagged.el = nameThumb(leaving);
  };

  const start = viewTransitionApi();
  if (!start || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    update();
    tagged.el?.style.removeProperty('view-transition-name');
    return;
  }

  // Into a case study: the clicked row's thumbnail is the source.
  if (opening) tagged.el = nameThumb(opening);
  start(update).finished.finally(() => tagged.el?.style.removeProperty('view-transition-name'));
}
