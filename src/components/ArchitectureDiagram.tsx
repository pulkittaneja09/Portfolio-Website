import { useMemo } from 'react';
import type { Architecture } from '@/data/types';

/**
 * Renders a project's architecture as an SVG flow from its node/edge data.
 * Hand-drawn SVG rather than a diagramming library: it is a few hundred bytes,
 * it inherits the theme tokens, and it has no runtime to load.
 */

const COL_W = 168;
const ROW_H = 92;
const BOX_W = 132;
const BOX_H = 56;
const PAD = 26;

const toneStyles: Record<Architecture['nodes'][number]['tone'], { fill: string; stroke: string; label: string }> = {
  client: { fill: 'rgb(var(--elevated))', stroke: 'rgb(var(--line))', label: 'rgb(var(--ink))' },
  service: { fill: 'rgb(var(--elevated))', stroke: 'rgb(var(--accent) / 0.55)', label: 'rgb(var(--ink))' },
  model: { fill: 'rgb(var(--accent) / 0.14)', stroke: 'rgb(var(--accent))', label: 'rgb(var(--ink))' },
  store: { fill: 'rgb(var(--surface))', stroke: 'rgb(var(--line))', label: 'rgb(var(--ink))' },
};

export function ArchitectureDiagram({ architecture }: { architecture: Architecture }) {
  const { nodes, edges, caption } = architecture;

  const layout = useMemo(() => {
    const cols = Math.max(...nodes.map((n) => n.col)) + 1;
    const rows = Math.max(...nodes.map((n) => n.row)) + 1;
    const width = cols * COL_W + PAD * 2;
    const height = rows * ROW_H + PAD * 2;

    const position = (col: number, row: number) => ({
      x: PAD + col * COL_W + (COL_W - BOX_W) / 2,
      y: PAD + row * ROW_H + (ROW_H - BOX_H) / 2,
    });

    const byId = new Map(nodes.map((node) => [node.id, { ...node, ...position(node.col, node.row) }]));
    return { width, height, byId };
  }, [nodes]);

  return (
    <figure className="not-prose">
      <div className="overflow-x-auto rounded-card border border-line bg-surface p-2 sm:p-4">
        <svg
          viewBox={`0 0 ${layout.width} ${layout.height}`}
          className="h-auto w-full"
          style={{ minWidth: `${Math.min(layout.width, 760)}px` }}
          role="img"
          aria-label={caption}
        >
          <defs>
            <marker
              id="arch-arrow"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 9 5 L 0 9 z" fill="rgb(var(--accent) / 0.8)" />
            </marker>
          </defs>

          {/* Edges first so boxes sit on top of them. */}
          <g>
            {edges.map((edge) => {
              const from = layout.byId.get(edge.from);
              const to = layout.byId.get(edge.to);
              if (!from || !to) return null;

              const x1 = from.x + BOX_W;
              const y1 = from.y + BOX_H / 2;
              const x2 = to.x;
              const y2 = to.y + BOX_H / 2;

              // Flowing right: a gentle S-curve. Otherwise route around.
              const forward = to.col > from.col;
              const sx = forward ? x1 : from.x + BOX_W / 2;
              const sy = forward ? y1 : from.y + BOX_H;
              const ex = forward ? x2 : to.x + BOX_W / 2;
              const ey = forward ? y2 : to.y;
              const midX = (sx + ex) / 2;

              const path = forward
                ? `M ${sx} ${sy} C ${midX} ${sy}, ${midX} ${ey}, ${ex} ${ey}`
                : `M ${sx} ${sy} C ${sx} ${sy + 34}, ${ex} ${ey - 34}, ${ex} ${ey}`;

              return (
                <g key={`${edge.from}-${edge.to}`}>
                  <path
                    d={path}
                    fill="none"
                    stroke="rgb(var(--accent) / 0.4)"
                    strokeWidth="1.4"
                    markerEnd="url(#arch-arrow)"
                  />
                  {edge.label && (
                    <text
                      x={(sx + ex) / 2}
                      y={(sy + ey) / 2 - 7}
                      textAnchor="middle"
                      className="font-mono"
                      fontSize="9.5"
                      fill="rgb(var(--faint))"
                    >
                      {edge.label}
                    </text>
                  )}
                </g>
              );
            })}
          </g>

          <g>
            {[...layout.byId.values()].map((node) => {
              const tone = toneStyles[node.tone];
              return (
                <g key={node.id}>
                  <rect
                    x={node.x}
                    y={node.y}
                    width={BOX_W}
                    height={BOX_H}
                    rx="9"
                    fill={tone.fill}
                    stroke={tone.stroke}
                    strokeWidth="1.2"
                  />
                  <text
                    x={node.x + BOX_W / 2}
                    y={node.y + (node.note ? 23 : 32)}
                    textAnchor="middle"
                    fontSize="12"
                    fontWeight="500"
                    fill={tone.label}
                  >
                    {node.label}
                  </text>
                  {node.note && (
                    <text
                      x={node.x + BOX_W / 2}
                      y={node.y + 38}
                      textAnchor="middle"
                      className="font-mono"
                      fontSize="9"
                      fill="rgb(var(--faint))"
                    >
                      {node.note}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      <figcaption className="mt-3 font-mono text-xs text-faint">{caption}</figcaption>
    </figure>
  );
}
