import { venture } from '@/data/portfolio';

/**
 * Audaxity's pipeline as a small inline SVG in mono: four stages joined by
 * arrows. Horizontal from 640px up, drawn at its natural size (it only scales
 * down if the card is narrower); stacked vertically on phones, where a
 * scaled-down row would leave the labels unreadably small. Sizes come from
 * the label lengths, so editing the stages in `portfolio.ts` never needs a
 * layout change here.
 */

const CHAR = 7.2; // Geist Mono advance at 12px (0.6em)
const PAD_X = 10;
const NODE_H = 28;
const GAP_H = 28; // horizontal connector length
const GAP_V = 16; // vertical connector length

const nodeWidth = (label: string) => Math.round(label.length * CHAR + PAD_X * 2);

const stroke = (last: boolean) => (last ? 'rgba(255,255,255,0.24)' : 'rgba(255,255,255,0.12)');
const ink = (last: boolean) => (last ? 'var(--text-strong)' : 'var(--text)');

function Arrow({ d, head }: { d: string; head: string }) {
  return (
    <g
      stroke="rgba(255,255,255,0.28)"
      strokeWidth="1"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={d} />
      <path d={head} />
    </g>
  );
}

export function PipelineFlow() {
  const { stages } = venture.pipeline;
  const label = `Pipeline: ${stages.join(', then ')}`;

  // ── Horizontal ────────────────────────────────────────────────────────────
  let x = 0;
  const row = stages.map((stage, i) => {
    const w = nodeWidth(stage);
    const node = { stage, x, w, i };
    x += w + (i < stages.length - 1 ? GAP_H : 0);
    return node;
  });
  const width = x;
  const mid = NODE_H / 2;

  // ── Vertical ──────────────────────────────────────────────────────────────
  const column = stages.map((stage, i) => ({ stage, y: i * (NODE_H + GAP_V), w: nodeWidth(stage), i }));
  const columnHeight = stages.length * NODE_H + (stages.length - 1) * GAP_V;
  const columnWidth = Math.max(...column.map((n) => n.w)) + 4;

  return (
    <div className="font-mono text-xs">
      <svg
        viewBox={`-1 -1 ${width + 2} ${NODE_H + 2}`}
        width={width + 2}
        height={NODE_H + 2}
        className="hidden h-auto max-w-full sm:block"
        role="img"
        aria-label={label}
      >
        {row.map((node) => {
          const last = node.i === stages.length - 1;
          const next = row[node.i + 1];
          return (
            <g key={node.stage}>
              <rect
                x={node.x}
                y={0}
                width={node.w}
                height={NODE_H}
                rx={6}
                fill="rgba(255,255,255,0.025)"
                stroke={stroke(last)}
              />
              <text x={node.x + node.w / 2} y={mid + 4} textAnchor="middle" fill={ink(last)}>
                {node.stage}
              </text>
              {next && (
                <Arrow
                  d={`M ${node.x + node.w + 5} ${mid} H ${next.x - 5}`}
                  head={`M ${next.x - 9} ${mid - 3.5} L ${next.x - 5} ${mid} L ${next.x - 9} ${mid + 3.5}`}
                />
              )}
            </g>
          );
        })}
      </svg>

      <svg
        viewBox={`-1 -1 ${columnWidth + 2} ${columnHeight + 2}`}
        width={columnWidth + 2}
        height={columnHeight + 2}
        className="sm:hidden"
        role="img"
        aria-label={label}
      >
        {column.map((node) => {
          const last = node.i === stages.length - 1;
          const hasNext = node.i < stages.length - 1;
          const lineX = 16;
          const y1 = node.y + NODE_H + 3;
          const y2 = node.y + NODE_H + GAP_V - 3;
          return (
            <g key={node.stage}>
              <rect
                x={0}
                y={node.y}
                width={node.w}
                height={NODE_H}
                rx={6}
                fill="rgba(255,255,255,0.025)"
                stroke={stroke(last)}
              />
              <text x={PAD_X} y={node.y + NODE_H / 2 + 4} fill={ink(last)}>
                {node.stage}
              </text>
              {hasNext && (
                <Arrow
                  d={`M ${lineX} ${y1} V ${y2}`}
                  head={`M ${lineX - 3.5} ${y2 - 4} L ${lineX} ${y2} L ${lineX + 3.5} ${y2 - 4}`}
                />
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
