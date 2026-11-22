/**
 * The palette opens with ⌘K or Ctrl+K (see useGlobalShortcuts); this is how
 * the key is named on the visitor's own keyboard.
 */
const isApple =
  typeof navigator !== 'undefined' && /Mac|iPhone|iPad|iPod/i.test(navigator.platform || navigator.userAgent);

export const paletteKey = isApple ? '⌘K' : 'Ctrl K';
