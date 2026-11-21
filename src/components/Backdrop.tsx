/**
 * The page ground: a faint dot matrix that dissolves toward the edges, and a
 * single soft monochrome light pool high above the fold. Fixed and inert, so
 * it costs one composited layer and never repaints on scroll.
 */
export function Backdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <div className="dot-matrix absolute inset-0" />
      <div
        className="absolute left-1/2 top-[-28rem] h-[56rem] w-[80rem] -translate-x-1/2"
        style={{
          background: 'radial-gradient(closest-side, rgb(var(--light) / 0.045), transparent)',
        }}
      />
    </div>
  );
}
