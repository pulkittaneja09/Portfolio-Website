import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { useIsDesktopPointer } from '@/hooks/useMediaQuery';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/cn';

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
 * Static stand-in for the cloud: the same sphere, drawn once to a 2D canvas.
 * Mobile, touch and reduced-motion visitors get only this, and it ships in the
 * main bundle so there is never an empty box while three.js loads.
 *
 * A Fibonacci spiral with a deterministic jitter (a pure spiral reads as a
 * lattice at this density); depth drives opacity and size, which is what
 * sells the volume without any colour.
 */
function SphereFallback({ color }: { color: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const draw = () => {
      const size = canvas.clientWidth;
      if (!size) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(size * dpr);
      canvas.height = Math.round(size * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, size, size);
      ctx.fillStyle = color;

      const total = 2400;
      const golden = Math.PI * (3 - Math.sqrt(5));
      const jitter = (n: number) => {
        const v = Math.sin(n * 12.9898) * 43758.5453;
        return v - Math.floor(v) - 0.5;
      };
      const radius = size * 0.4;
      const centre = size / 2;
      // Points scale with the box, but never above ~1.4 CSS px.
      const unit = Math.min(1, size / 560);

      for (let i = 0; i < total; i += 1) {
        const y = 1 - (i / (total - 1)) * 2;
        const ring = Math.sqrt(Math.max(0, 1 - y * y));
        const theta = golden * i + jitter(i) * 0.6;
        const shell = jitter(i + 31) > 0.32 ? 0.55 + (jitter(i + 57) + 0.5) * 0.4 : 1;
        const x = Math.cos(theta) * ring * shell;
        const z = Math.sin(theta) * ring * shell;
        const depth = (z + 1) / 2;

        ctx.globalAlpha = 0.08 + depth * 0.62 * (0.55 + (jitter(i + 11) + 0.5) * 0.45);
        ctx.beginPath();
        ctx.arc(
          centre + x * radius,
          centre - y * shell * radius,
          (0.5 + depth * 0.9) * unit,
          0,
          Math.PI * 2,
        );
        ctx.fill();
      }
    };

    draw();
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(draw);
    observer?.observe(canvas);
    return () => observer?.disconnect();
  }, [color]);

  return <canvas ref={ref} className="h-full w-full" aria-hidden />;
}

export function HeroVisual({ className }: { className?: string }) {
  const isDesktop = useIsDesktopPointer();
  const reduced = useReducedMotion();
  const color = useLightColor();
  const [mountThree, setMountThree] = useState(false);
  const [ready, setReady] = useState(false);
  const [onScreen, setOnScreen] = useState(true);
  const box = useRef<HTMLDivElement>(null);

  const canRender3D = isDesktop && !reduced;

  useEffect(() => {
    if (!canRender3D) return;

    // three.js is ~220KB gzipped and this cloud exists to react to a cursor,
    // so it is fetched on the first real interaction: visitors get it the
    // instant they move the mouse, and a page-load audit never pays for it.
    let timer = 0;
    const events = ['pointermove', 'wheel', 'keydown'] as const;
    const mount = () => {
      events.forEach((e) => window.removeEventListener(e, mount));
      timer = window.setTimeout(() => setMountThree(true), 0);
    };

    events.forEach((e) => window.addEventListener(e, mount, { once: true, passive: true }));

    return () => {
      events.forEach((e) => window.removeEventListener(e, mount));
      window.clearTimeout(timer);
    };
  }, [canRender3D]);

  // Stop the render loop entirely while the hero is scrolled away.
  useEffect(() => {
    const node = box.current;
    if (!node || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting));
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={box} className={cn('relative aspect-square w-full', className)}>
      {/* The static scatter stays underneath and dissolves once the live
          cloud has its first frame, so there is never a pop or an empty box. */}
      <div
        className="absolute inset-0 transition-opacity duration-800 ease-quiet"
        style={{ opacity: ready ? 0 : 1 }}
      >
        <SphereFallback color={color} />
      </div>

      {mountThree && (
        <div className="absolute inset-0">
          <Suspense fallback={null}>
            <PointSphere color={color} active={onScreen} onReady={() => setReady(true)} />
          </Suspense>
        </div>
      )}
    </div>
  );
}
