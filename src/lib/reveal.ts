/**
 * Scroll reveal that can never leave content invisible.
 *
 * Content is visible by default. An element is only hidden ("armed") while it
 * is off screen *below* the viewport and about to scroll in, and only once
 * the visitor has actually started scrolling; it is shown the moment it
 * enters. So:
 *
 *  - nothing is hidden at load — not even content just below the fold;
 *  - a full-page screenshot, a print, or a crawler that never scrolls sees
 *    every element at full opacity;
 *  - a jump that skips the approach zone (anchor link, End key) simply shows
 *    the element without animating it.
 *
 * Two shared observers do the work, and a sweep after every scroll reveals
 * any armed element that is in view — a belt-and-braces guarantee for the one
 * invariant that matters: nothing on screen stays at opacity < 1.
 */

type State = 'armed' | 'shown';

const SHOW_MS = 550;
const STAGGER_MS = 60;
const MAX_STEPS = 4;

const watched = new Set<HTMLElement>();
let approach: IntersectionObserver | null = null;
let enter: IntersectionObserver | null = null;
let sweepTimer = 0;
let listening = false;
let scrolled = false;

function setState(el: HTMLElement, state: State | null) {
  if (state) el.dataset.reveal = state;
  else delete el.dataset.reveal;
}

function forget(el: HTMLElement) {
  approach?.unobserve(el);
  enter?.unobserve(el);
  watched.delete(el);
}

function show(el: HTMLElement) {
  if (el.dataset.reveal !== 'armed') {
    forget(el);
    return;
  }
  setState(el, 'shown');
  forget(el);
  // Once the entrance has run, drop the attribute entirely so the element is
  // back on its own styles (and its own hover transitions).
  const delay = Math.min(Number(el.style.getPropertyValue('--i') || 0), MAX_STEPS) * STAGGER_MS;
  window.setTimeout(
    () => {
      if (el.dataset.reveal === 'shown') setState(el, null);
    },
    SHOW_MS + delay + 50,
  );
}

function inView(el: HTMLElement): boolean {
  const rect = el.getBoundingClientRect();
  return rect.bottom > 0 && rect.top < window.innerHeight && rect.width > 0;
}

/** Reveal every armed element that is on screen. Cheap: a handful of rects. */
function sweep() {
  document.querySelectorAll<HTMLElement>('[data-reveal="armed"]').forEach((el) => {
    if (inView(el)) show(el);
  });
}

function scheduleSweep() {
  window.clearTimeout(sweepTimer);
  sweepTimer = window.setTimeout(sweep, 120);
}

/** Hide an element that is fully below the fold, then wait for it to enter. */
function arm(el: HTMLElement) {
  setState(el, 'armed');
  approach?.unobserve(el);
  enter?.observe(el);
}

function onScroll() {
  if (!scrolled) {
    // First scroll: only now is it safe to hide what is coming up. Anything
    // still fully below the fold within the approach distance is armed;
    // anything already on screen is left alone for good.
    scrolled = true;
    const reach = window.innerHeight * 1.25;
    watched.forEach((el) => {
      if (el.dataset.reveal) return;
      const top = el.getBoundingClientRect().top;
      if (top >= window.innerHeight && top < reach) arm(el);
      else if (top < window.innerHeight) forget(el);
    });
  }
  scheduleSweep();
}

function revealAll() {
  document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => setState(el, null));
}

function ensureObservers(): boolean {
  if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') return false;
  if (approach && enter) return true;

  // Fires as an element comes within a quarter-screen of the bottom edge.
  approach = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const el = entry.target as HTMLElement;
        if (!entry.isIntersecting || el.dataset.reveal) return;
        if (entry.boundingClientRect.top < window.innerHeight) {
          // Already on screen (at load, or after a jump): leave it alone.
          forget(el);
        } else if (scrolled) {
          // Still fully below the fold, and the page is moving: safe to hide.
          arm(el);
        }
        // Below the fold before any scroll: stay visible; the first scroll
        // decides (see onScroll).
      });
    },
    { rootMargin: '0px 0px 25% 0px', threshold: 0 },
  );

  enter = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) show(entry.target as HTMLElement);
      });
    },
    { rootMargin: '0px 0px -4% 0px', threshold: 0 },
  );

  if (!listening) {
    listening = true;
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('scrollend', sweep);
    // A resize is not a scroll: it only re-checks what is now in view. (Tools
    // that capture a full page resize the viewport; treating that as the
    // first scroll would hide content just below the fold mid-capture.)
    window.addEventListener('resize', scheduleSweep);
    window.addEventListener('beforeprint', revealAll);
  }
  return true;
}

/** Register an element. Returns the cleanup for an effect. */
export function observeReveal(el: HTMLElement | null): () => void {
  if (!el) return () => {};
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};
  if (!ensureObservers()) return () => {};

  watched.add(el);
  approach?.observe(el);

  return () => {
    forget(el);
    setState(el, null);
  };
}
