import { useEffect, useState } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const list = window.matchMedia(query);
    setMatches(list.matches);
    const onChange = (event: MediaQueryListEvent) => setMatches(event.matches);
    list.addEventListener('change', onChange);
    return () => list.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

/**
 * True for devices with a real pointer and a wide viewport — the only places
 * the 3D hero and the custom cursor are worth their cost.
 */
export function useIsDesktopPointer(): boolean {
  return useMediaQuery('(min-width: 1024px) and (hover: hover) and (pointer: fine)');
}
