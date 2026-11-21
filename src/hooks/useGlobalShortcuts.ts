import { useEffect } from 'react';

interface Handlers {
  onPalette: () => void;
  onTerminal: () => void;
  onEscape: () => void;
}

/** True when focus is in a field, so shortcuts never steal a keystroke. */
function isTyping(target: EventTarget | null): boolean {
  const element = target as HTMLElement | null;
  if (!element) return false;
  const tag = element.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || element.isContentEditable;
}

export function useGlobalShortcuts({ onPalette, onTerminal, onEscape }: Handlers) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onEscape();
        return;
      }

      // ⌘K / Ctrl+K works even while typing — that is the expected behaviour.
      if (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        onPalette();
        return;
      }

      if (isTyping(event.target)) return;

      if (event.key === '`' || event.key === '~') {
        event.preventDefault();
        onTerminal();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onPalette, onTerminal, onEscape]);
}
