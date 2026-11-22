import { viewTransitionApi } from '@/lib/viewTransition';

export type Theme = 'light' | 'dark';

/**
 * The theme lives on <html data-theme>. The inline script in index.html sets
 * it before first paint (the saved choice, else the system preference), so
 * there is never a flash of the wrong theme. This module switches it at
 * runtime, saves the choice, keeps <meta name="theme-color"> in step, and
 * follows the system setting live until the visitor picks a theme.
 */

const KEY = 'theme';
const EVENT = 'themechange';
const THEME_COLOR: Record<Theme, string> = { light: '#F8FAFC', dark: '#0A0E14' };

export const currentTheme = (): Theme =>
  document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';

function savedTheme(): Theme | null {
  try {
    const value = localStorage.getItem(KEY);
    return value === 'light' || value === 'dark' ? value : null;
  } catch {
    return null;
  }
}

function apply(theme: Theme) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
  document
    .querySelectorAll('meta[name="theme-color"]')
    .forEach((meta) => meta.setAttribute('content', THEME_COLOR[theme]));
  window.dispatchEvent(new Event(EVENT));
}

/** The visible toggle's centre, so ⌘K and the terminal reveal from it too. */
function toggleOrigin(): { x: number; y: number } {
  const toggle = [...document.querySelectorAll<HTMLElement>('[data-theme-toggle]')].find(
    (element) => element.getClientRects().length > 0,
  );
  if (!toggle) return { x: window.innerWidth / 2, y: 0 };
  const rect = toggle.getBoundingClientRect();
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
}

/**
 * Switches the theme and saves the choice. With the View Transitions API the
 * new theme is revealed in a circle growing from `origin` over ~500ms;
 * without it, or under reduced motion, the switch is instant. Colour
 * transitions are suspended for the switch (html.theme-switching), so nothing
 * fades its own colour inside the reveal.
 */
export function setTheme(theme: Theme, origin: { x: number; y: number } = toggleOrigin()): void {
  try {
    localStorage.setItem(KEY, theme);
  } catch {
    // Private mode: the switch still works, it just is not remembered.
  }
  if (theme === currentTheme()) return;

  const root = document.documentElement;
  root.classList.add('theme-switching');
  const done = () => root.classList.remove('theme-switching');

  const start = viewTransitionApi();
  if (!start || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    apply(theme);
    requestAnimationFrame(() => requestAnimationFrame(done));
    return;
  }

  const { x, y } = origin;
  const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
  const transition = start(() => apply(theme));
  transition.ready
    .then(() => {
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        {
          duration: 500,
          easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
          pseudoElement: '::view-transition-new(root)',
        },
      );
    })
    .catch(() => undefined);
  transition.finished.finally(done);
}

export function toggleTheme(origin?: { x: number; y: number }): void {
  setTheme(currentTheme() === 'light' ? 'dark' : 'light', origin);
}

/** Until the visitor picks a theme, follow the system's light/dark setting live. */
export function followSystemTheme(): () => void {
  const query = window.matchMedia('(prefers-color-scheme: light)');
  const onChange = () => {
    if (!savedTheme()) apply(query.matches ? 'light' : 'dark');
  };
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

export function subscribeTheme(callback: () => void): () => void {
  window.addEventListener(EVENT, callback);
  return () => window.removeEventListener(EVENT, callback);
}
