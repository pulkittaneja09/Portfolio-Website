import type { Project } from '@/data/types';

/** "2026 · FastAPI · AI agents" — the mono metadata line on cards and case studies. */
export function projectMeta(project: Project): string {
  const parts = [project.year, project.stack[0], ...project.tags].filter(Boolean);
  // Stack and tags overlap ("Go" and "Go"), so keep the first three distinct.
  const seen = new Set<string>();
  return parts
    .filter((part) => {
      const key = part.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 3)
    .join(' · ');
}
