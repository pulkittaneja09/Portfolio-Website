/**
 * Film grain, fixed over the whole viewport at 2%.
 *
 * An inline SVG feTurbulence rather than a PNG: it is a few hundred bytes, it
 * never blurs on a high-DPI screen, and it costs no extra request. The filter
 * is rasterised once by the browser and composited, so it does not repaint.
 *
 * The 2% lives inside the filter (an alpha transfer), not on the element: the
 * layer is fully opaque as far as CSS is concerned, so nothing on the page
 * ever rests below opacity 1.
 */
export function GrainOverlay() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[100] hidden md:block"
      style={{ mixBlendMode: 'overlay' }}
      aria-hidden
    >
      <svg className="h-full w-full">
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.82" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.02" />
          </feComponentTransfer>
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </div>
  );
}
