/**
 * Runs a callback when the browser is idle, falling back to a timer where
 * requestIdleCallback is unavailable. Returns a cancel function.
 */
export function whenIdle(callback: () => void, timeout = 3000): () => void {
  if (typeof window === 'undefined') return () => undefined;

  if (typeof window.requestIdleCallback === 'function') {
    const handle = window.requestIdleCallback(callback, { timeout });
    return () => window.cancelIdleCallback(handle);
  }

  const handle = window.setTimeout(callback, Math.min(timeout, 1500));
  return () => window.clearTimeout(handle);
}
