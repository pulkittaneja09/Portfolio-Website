import { Suspense, lazy, useEffect, useState } from 'react';
import { useIsDesktopPointer } from '@/hooks/useMediaQuery';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useTheme } from '@/hooks/useTheme';

const PointSphere = lazy(() => import('@/three/PointSphere'));

const FALLBACK_LIGHT = '#ffffff';

/** Reads the live `--light` token so the cloud matches the active theme. */
function readLightToken(): string {
  if (typeof window === 'undefined') return FALLBACK_LIGHT;
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--light').trim();
  const channels = raw.split(/\s+/).map(Number);
  if (channels.length !== 3 || channels.some((n) => Number.isNaN(n))) return FALLBACK_LIGHT;
  return `rgb(${channels[0]}, ${channels[1]}, ${channels[2]})`;
}

function useLightColor(): string {
  const { theme } = useTheme();
  const [color, setColor] = useState(readLightToken);

  useEffect(() => {
    // The token only changes once <html> has the new class, which ThemeProvider
    // applies in its own effect — so re-read after the theme flips.
    setColor(readLightToken());
  }, [theme]);

  return color;
}

/**
 * Static stand-in for the cloud: a flat scatter of points on the same sphere
 * projection. Mobile, touch and reduced-motion visitors get this, and it ships
 * in the main bundle so there is never an empty box while three.js loads.
 */
function SphereFallback() {
  // Deterministic scatter — a Fibonacci spiral projected to 2D, so the shape
  // reads as a sphere rather than noise. Depth drives opacity and radius,
  // which is what sells the volume without any colour.
  const points: { x: number; y: number; o: number; r: number }[] = [];
  const total = 760;
  const golden = Math.PI * (3 - Math.sqrt(5));

  // A pure Fibonacci spiral reads as a lattice at this density, so each point
  // is nudged by a deterministic pseudo-random offset. Same seed every render,
  // so there is nothing to mismatch.
  const jitter = (n: number) => {
    const v = Math.sin(n * 12.9898) * 43758.5453;
    return v - Math.floor(v) - 0.5;
  };

  for (let i = 0; i < total; i += 1) {
    const y = 1 - (i / (total - 1)) * 2;
    const ring = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i + jitter(i) * 0.35;
    const x = Math.cos(theta) * ring;
    const z = Math.sin(theta) * ring;
    const depth = (z + 1) / 2;
    const radial = 1 + jitter(i + 99) * 0.06;

    points.push({
      x: 50 + x * 42 * radial,
      y: 50 - (y + jitter(i + 7) * 0.02) * 42,
      o: 0.1 + depth * 0.72,
      r: 0.22 + depth * 0.4,
    });
  }

  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" role="presentation" aria-hidden>
      <g fill="rgb(var(--light))">
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={p.r} fillOpacity={p.o} />
        ))}
      </g>
    </svg>
  );
}

export function HeroVisual() {
  const isDesktop = useIsDesktopPointer();
  const reduced = useReducedMotion();
  const color = useLightColor();
  const [mountThree, setMountThree] = useState(false);

  const canRender3D = isDesktop && !reduced;

  useEffect(() => {
    if (!canRender3D) return;

    // three.js is ~220KB gzipped and this cloud exists to react to a cursor,
    // so it is fetched on the first real pointer movement: visitors get it the
    // instant they move the mouse, and a page-load audit never pays for it.
    let timer = 0;
    const mount = () => {
      window.removeEventListener('pointermove', mount);
      window.removeEventListener('wheel', mount);
      timer = window.setTimeout(() => setMountThree(true), 0);
    };

    window.addEventListener('pointermove', mount, { once: true, passive: true });
    window.addEventListener('wheel', mount, { once: true, passive: true });

    return () => {
      window.removeEventListener('pointermove', mount);
      window.removeEventListener('wheel', mount);
      window.clearTimeout(timer);
    };
  }, [canRender3D]);

  return (
    <div className="relative aspect-square w-full">
      <div className="absolute inset-0">
        {mountThree ? (
          <Suspense fallback={<SphereFallback />}>
            <PointSphere color={color} />
          </Suspense>
        ) : (
          <SphereFallback />
        )}
      </div>
    </div>
  );
}
