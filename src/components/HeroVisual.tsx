import { Suspense, lazy, useEffect, useState } from 'react';
import { useIsDesktopPointer } from '@/hooks/useMediaQuery';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useTheme } from '@/hooks/useTheme';

const NeuralMesh = lazy(() => import('@/three/NeuralMesh'));

const FALLBACK_ACCENT = '#c8ff2e';

function readAccentToken(): string {
  if (typeof window === 'undefined') return FALLBACK_ACCENT;
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
  const channels = raw.split(/\s+/).map(Number);
  if (channels.length !== 3 || channels.some((n) => Number.isNaN(n))) return FALLBACK_ACCENT;
  return `rgb(${channels[0]}, ${channels[1]}, ${channels[2]})`;
}

/** Reads the live accent token so the mesh matches the active theme. */
function useAccentColor(): string {
  const { theme } = useTheme();
  const [accent, setAccent] = useState(readAccentToken);

  useEffect(() => {
    // The token only changes once <html> has the new class, which is applied
    // by ThemeProvider in its own effect — so re-read after theme flips.
    setAccent(readAccentToken());
  }, [theme]);

  return accent;
}

/**
 * Static stand-in for the mesh: a flat node graph. This is what mobile, touch
 * devices and reduced-motion visitors get, and it ships in the main bundle so
 * there is never an empty box while three.js loads.
 */
function MeshFallback() {
  const nodes = [
    { x: 50, y: 14 },
    { x: 20, y: 30 },
    { x: 80, y: 32 },
    { x: 36, y: 50 },
    { x: 64, y: 49 },
    { x: 12, y: 64 },
    { x: 88, y: 66 },
    { x: 50, y: 74 },
    { x: 30, y: 88 },
    { x: 70, y: 87 },
  ];
  const edges: [number, number][] = [
    [0, 1],
    [0, 2],
    [1, 3],
    [2, 4],
    [3, 4],
    [1, 5],
    [2, 6],
    [3, 7],
    [4, 7],
    [5, 8],
    [6, 9],
    [7, 8],
    [7, 9],
    [0, 3],
    [0, 4],
  ];

  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" role="presentation" aria-hidden>
      <g stroke="rgb(var(--accent))" strokeOpacity="0.22" strokeWidth="0.35">
        {edges.map(([a, b]) => (
          <line key={`${a}-${b}`} x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y} />
        ))}
      </g>
      <g fill="rgb(var(--accent))">
        {nodes.map((n, i) => (
          <circle
            key={i}
            cx={n.x}
            cy={n.y}
            r={i % 3 === 0 ? 1.5 : 1}
            fillOpacity={i % 3 === 0 ? 0.95 : 0.6}
          />
        ))}
      </g>
    </svg>
  );
}

export function HeroVisual() {
  const isDesktop = useIsDesktopPointer();
  const reduced = useReducedMotion();
  const accent = useAccentColor();
  const [mountThree, setMountThree] = useState(false);

  const canRender3D = isDesktop && !reduced;

  useEffect(() => {
    if (!canRender3D) return;

    // three.js is ~220KB gzipped, and the mesh exists to react to a cursor.
    // So it is fetched on the first real pointer movement rather than on load:
    // visitors get it the instant they move the mouse, and a page-load audit
    // (or anyone who never moves a pointer) never pays for it.
    let idle = 0;
    const mount = () => {
      window.removeEventListener('pointermove', mount);
      window.removeEventListener('wheel', mount);
      idle = window.setTimeout(() => setMountThree(true), 0);
    };

    window.addEventListener('pointermove', mount, { once: true, passive: true });
    window.addEventListener('wheel', mount, { once: true, passive: true });

    return () => {
      window.removeEventListener('pointermove', mount);
      window.removeEventListener('wheel', mount);
      window.clearTimeout(idle);
    };
  }, [canRender3D]);

  return (
    <div className="relative aspect-square w-full max-w-[34rem] lg:max-w-none">
      {/* Accent bloom behind the graph, so the mesh reads as lit from within. */}
      <div
        className="pointer-events-none absolute inset-[12%] rounded-full opacity-60 blur-3xl"
        style={{ background: 'radial-gradient(circle, rgb(var(--accent) / 0.17), transparent 68%)' }}
        aria-hidden
      />

      <div className="absolute inset-0">
        {mountThree ? (
          <Suspense fallback={<MeshFallback />}>
            <NeuralMesh accent={accent} />
          </Suspense>
        ) : (
          <MeshFallback />
        )}
      </div>

      {/* Corner ticks: control-room framing around the visual. */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {(
          [
            'left-0 top-0 border-l border-t',
            'right-0 top-0 border-r border-t',
            'bottom-0 left-0 border-b border-l',
            'bottom-0 right-0 border-b border-r',
          ] as const
        ).map((position) => (
          <span key={position} className={`absolute h-5 w-5 border-accent/40 ${position}`} />
        ))}
      </div>
    </div>
  );
}
