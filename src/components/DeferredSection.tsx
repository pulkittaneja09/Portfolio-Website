import { Suspense, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';

interface Props {
  /** Anchor id, kept on the placeholder so in-page links always resolve. */
  id: string;
  /** Reserved height, so swapping in the real section causes no layout shift. */
  minHeight: string;
  children: ReactNode;
  /** How far ahead of the viewport to start loading. */
  rootMargin?: string;
}

/**
 * Mounts a heavy below-the-fold section only once the reader is heading
 * toward it.
 *
 * The stack grid inlines ~30 brand glyphs across five sub-grids; mounting it
 * during page load cost more in style and layout than it did in bytes. The
 * placeholder holds the anchor id and the height, so deep links still land in
 * the right place and nothing shifts when the real section arrives.
 */
export function DeferredSection({ id, minHeight, children, rootMargin = '900px' }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (show) return;

    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setShow(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );

    observer.observe(node);

    // A keyboard or palette jump can skip straight past the observer, so also
    // mount if the hash points here.
    if (window.location.hash === `#${id}`) setShow(true);

    return () => observer.disconnect();
  }, [show, rootMargin, id]);

  if (show) {
    return <Suspense fallback={<div style={{ minHeight }} aria-hidden />}>{children}</Suspense>;
  }

  return <div ref={ref} id={id} style={{ minHeight }} aria-hidden />;
}
