import { m, useScroll, useSpring } from 'framer-motion';

/** 1px silver hairline pinned to the top edge. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const width = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 });

  return (
    <m.div
      className="fixed inset-x-0 top-0 z-[60] h-px origin-left bg-accent/60"
      style={{ scaleX: width }}
      aria-hidden
    />
  );
}
