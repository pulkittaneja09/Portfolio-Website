import { useEffect, useState } from 'react';

/**
 * Scroll-spy: the active section is the last one whose top has passed a line
 * a third of the way down the viewport. Reading positions on scroll (batched
 * to one rAF) is simpler and steadier than intersection ratios, which flicker
 * between short sections.
 *
 * At the very top the first section wins; at the very bottom the last one
 * does, even if it is too short for its top to ever reach the line.
 */
export function useActiveSection(ids: readonly string[], lineRatio = 0.33): string | null {
  const [active, setActive] = useState<string | null>(ids[0] ?? null);
  const key = ids.join('|');

  useEffect(() => {
    const list = key.split('|').filter(Boolean);
    if (list.length === 0) return;

    let frame = 0;

    const compute = () => {
      frame = 0;
      const line = window.innerHeight * lineRatio;
      let current = list[0];

      for (const id of list) {
        const section = document.getElementById(id);
        if (section && section.getBoundingClientRect().top <= line) current = id;
      }

      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      if (atBottom) current = list[list.length - 1];
      // Before any scrolling, the page is about its first section, full stop.
      if (window.scrollY < 8) current = list[0];

      setActive(current);
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);

    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      cancelAnimationFrame(frame);
    };
  }, [key, lineRatio]);

  return active;
}
