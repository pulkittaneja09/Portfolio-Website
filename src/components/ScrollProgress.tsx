import { m, useScroll, useSpring } from 'framer-motion';

/** Hairline progress bar pinned under the nav. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const width = useSpring(scrollYProgress, { stiffness: 220, damping: 34, restDelta: 0.001 });

  return (
    <m.div
      className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-accent"
      style={{ scaleX: width }}
      aria-hidden
    />
  );
}
