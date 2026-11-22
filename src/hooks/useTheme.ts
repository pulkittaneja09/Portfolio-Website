import { useSyncExternalStore } from 'react';
import { currentTheme, subscribeTheme } from '@/lib/theme';
import type { Theme } from '@/lib/theme';

/** The active theme, re-rendering whenever it changes (toggle, ⌘K, terminal, system). */
export function useTheme(): Theme {
  return useSyncExternalStore(subscribeTheme, currentTheme, () => 'dark');
}
