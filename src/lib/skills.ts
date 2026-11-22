import { useSyncExternalStore } from 'react';
import { experience, projects, sideProjects, skillGroups } from '@/data/portfolio';
import type { ExperienceItem, Project, SideProject, Skill } from '@/data/types';

/**
 * Evidence for each skill, computed from the real `stack` and `tags` in
 * portfolio.ts — never typed by hand. A skill matches a project, role or side
 * project when its name (or one of its `aliases`) is one of that item's tags.
 */

/** "Gemini 2.5 Flash", "gemini 2.5 flash" and "Gemini2.5Flash" are one tag. */
const normalise = (value: string) => value.toLowerCase().replace(/[^a-z0-9+#]/g, '');

export interface Evidence {
  projects: Project[];
  roles: ExperienceItem[];
  side: SideProject[];
}

/** Every skill by name. Go sits in two groups but is one skill. */
const skillsByName = new Map<string, Skill>(
  skillGroups.flatMap((group) => group.items).map((skill) => [skill.name, skill]),
);

const cache = new Map<string, Evidence>();

export function evidenceFor(name: string): Evidence {
  const cached = cache.get(name);
  if (cached) return cached;
  const skill = skillsByName.get(name);
  const wanted = new Set((skill?.aliases ?? [name]).map(normalise));
  const tagged = (tags: string[]) => tags.some((tag) => wanted.has(normalise(tag)));
  const evidence: Evidence = {
    projects: projects.filter((project) => tagged([...project.stack, ...project.tags])),
    roles: experience.filter((role) => tagged(role.stack)),
    side: sideProjects.filter((item) => tagged(item.stack)),
  };
  cache.set(name, evidence);
  return evidence;
}

export const hasEvidence = (evidence: Evidence) =>
  evidence.projects.length + evidence.roles.length + evidence.side.length > 0;

/** "Used in: ParcelPilot, KnowledgeHub AI · at SDG Corporation" */
export function describeEvidence(evidence: Evidence): string {
  const work = [...evidence.projects.map((p) => p.short ?? p.name), ...evidence.side.map((s) => s.name)];
  const roles = evidence.roles.map((role) => role.org);
  if (work.length && roles.length) return `Used in: ${work.join(', ')} · at ${roles.join(', ')}`;
  if (work.length) return `Used in: ${work.join(', ')}`;
  return `Used at ${roles.join(', ')}`;
}

// ── The active filter ────────────────────────────────────────────────────────
// A tiny store rather than context: the Skills chips set it, and the
// experience, project and "More" rows (in other sections) read it.

let active: string | null = null;
const listeners = new Set<() => void>();

export const activeSkill = () => active;

export function setActiveSkill(name: string | null): void {
  if (name === active) return;
  active = name;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useActiveSkill(): string | null {
  return useSyncExternalStore(subscribe, activeSkill, () => null);
}

/** For a row: 'match' or 'dim' while a skill is active, nothing otherwise. */
export function filterState(isMatch: (evidence: Evidence) => boolean, skill: string | null) {
  if (!skill) return undefined;
  return isMatch(evidenceFor(skill)) ? 'match' : 'dim';
}
