/**
 * Runs a callback when the browser is idle, falling back to a timer where
 * requestIdleCallback is unavailable. Returns a cancel function.
 */
/**
 * Like whenIdle, but never before the page has finished loading plus a beat:
 * warm-up downloads must not compete with the first paint for bandwidth.
 */
export function afterLoadIdle(callback: () => void, delay = 1500): () => void {
  if (typeof window === 'undefined') return () => undefined;
  let cancelIdle: () => void = () => undefined;
  let timer = 0;
  const schedule = () => {
    timer = window.setTimeout(() => (cancelIdle = whenIdle(callback, 4000)), delay);
  };
  if (document.readyState === 'complete') schedule();
  else window.addEventListener('load', schedule, { once: true });
  return () => {
    window.removeEventListener('load', schedule);
    window.clearTimeout(timer);
    cancelIdle();
  };
}

export function whenIdle(callback: () => void, timeout = 3000): () => void {
  if (typeof window === 'undefined') return () => undefined;

  if (typeof window.requestIdleCallback === 'function') {
    const handle = window.requestIdleCallback(callback, { timeout });
    return () => window.cancelIdleCallback(handle);
  }

  const handle = window.setTimeout(callback, Math.min(timeout, 1500));
  return () => window.clearTimeout(handle);
}
