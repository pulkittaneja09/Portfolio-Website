import { useEffect, useRef, useState } from 'react';

/**
 * Fires once when an element first enters the viewport. Used to trigger
 * count-ups and reveals without keeping an observer alive for the whole session.
 */
export function useInView<T extends HTMLElement>(margin = '0px 0px -12% 0px') {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: margin, threshold: 0.15 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [margin]);

  return { ref, inView } as const;
}
