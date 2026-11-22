import { useEffect, useRef } from 'react';

/**
 * A 1px hairline in the gap above a section, drawn absolutely so it never
 * changes the rhythm. The first time the section scrolls into view a small
 * accent dot travels across it once and fades (see `.section-rule`). Under
 * reduced motion the line stays and the dot never appears.
 */
export function SectionRule() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        node.dataset.run = 'true';
        observer.disconnect();
      },
      { rootMargin: '0px 0px -15% 0px' },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return <div ref={ref} className="section-rule" aria-hidden />;
}
