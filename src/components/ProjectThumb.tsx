import type { Project } from '@/data/types';
import { cn } from '@/lib/cn';
import { previewSrcSet } from '@/lib/images';

const frame =
  'relative aspect-[16/10] overflow-hidden rounded-lg border border-line/[0.08] bg-line/[0.02] light:bg-white light:shadow-card';

/**
 * A 16:10 thumbnail for a project row: the real screenshot, slightly dimmed
 * (brightness, not opacity — it is fully opaque at rest) until the row is hovered. A project with no interface to show gets a
 * schematic of its own architecture instead — the services and data stores
 * from its case-study diagram, cascaded in mono. Nothing invented.
 */
export function ProjectThumb({ project, className }: { project: Project; className?: string }) {
  if (project.preview) {
    return (
      // data-vt-shot lets a View Transition morph this into the case study's image.
      <div className={cn(frame, className)} data-vt-shot={project.slug}>
        <img
          src={project.preview}
          srcSet={previewSrcSet(project.preview)}
          sizes="(min-width: 1024px) 200px, (min-width: 640px) 28vw, 208px"
          alt={`${project.name} interface`}
          width={1024}
          height={640}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover object-left-top brightness-[0.8] saturate-[0.85] transition-[filter] duration-300 group-hover/row:brightness-100 group-hover/row:saturate-100 light:brightness-100 light:saturate-100"
        />
      </div>
    );
  }

  const nodes = [...project.detail.architecture.nodes]
    .sort((a, b) => a.col - b.col || a.row - b.row)
    .slice(0, 5);

  return (
    <div
      className={cn(
        frame,
        'flex flex-col justify-center gap-[0.2rem] px-3.5 font-mono text-[0.625rem] leading-[1.5] transition-colors duration-300 group-hover/row:border-line/[0.12]',
        className,
      )}
      role="img"
      aria-label={`${project.name} architecture: ${nodes.map((node) => node.label).join(', ')}`}
    >
      {nodes.map((node, i) => (
        <p key={node.id} className="truncate" style={{ paddingLeft: `${i * 0.55}rem` }} aria-hidden>
          {/* The elbow is drawn, not typed: box-drawing glyphs are outside
              the mono font's latin subset. */}
          {i > 0 && (
            <span className="mr-1.5 inline-block h-[0.45rem] w-[0.45rem] -translate-y-[0.2rem] border-b border-l border-line/[0.18]" />
          )}
          <span className="text-strong/85">{node.label}</span>
        </p>
      ))}
    </div>
  );
}
