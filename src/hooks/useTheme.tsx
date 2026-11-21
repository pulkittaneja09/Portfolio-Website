import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

type Theme = 'dark' | 'light';

interface ThemeValue {
  theme: Theme;
  toggle: () => void;
  set: (theme: Theme) => void;
}

const STORAGE_KEY = 'pt-theme';
const ThemeContext = createContext<ThemeValue | null>(null);

function readInitialTheme(): Theme {
  if (typeof document === 'undefined') return 'dark';
  // index.html already resolved this before paint; trust the DOM as the source.
  return document.documentElement.classList.contains('light') ? 'light' : 'dark';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(readInitialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light');
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* private browsing — the class swap still applies for this session */
    }
  }, [theme]);

  const toggle = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), []);
  const value = useMemo<ThemeValue>(() => ({ theme, toggle, set: setTheme }), [theme, toggle]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeValue {
  const value = useContext(ThemeContext);
  if (!value) throw new Error('useTheme must be used inside <ThemeProvider>');
  return value;
}
