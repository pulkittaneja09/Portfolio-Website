/**
 * Content types for the portfolio.
 *
 * Every piece of copy on the site comes from `src/data/portfolio.ts` and is
 * typed here, so editing content never means touching a component.
 */

export type IconSlug =
  | 'python'
  | 'go'
  | 'typescript'
  | 'javascript'
  | 'react'
  | 'cplusplus'
  | 'c'
  | 'openjdk'
  | 'fastapi'
  | 'nodedotjs'
  | 'express'
  | 'postgresql'
  | 'mongodb'
  | 'docker'
  | 'linux'
  | 'nginx'
  | 'git'
  | 'vercel'
  | 'render'
  | 'postman'
  | 'langchain'
  | 'googlegemini'
  | 'claude'
  | 'chromadb'
  | 'scikitlearn'
  | 'numpy'
  | 'pandas'
  | 'vite'
  | 'tailwindcss'
  | 'modelcontextprotocol';

export interface Social {
  label: string;
  href: string;
  /** Short handle shown next to the label, e.g. "@pulkittaneja09". */
  handle: string;
  icon: 'github' | 'linkedin' | 'leetcode' | 'mail' | 'file';
}

export interface Profile {
  name: string;
  /** Job title under the name. */
  title: string;
  /** One-liner under the title (two lines at most in the left column). */
  tagline: string;
  /** Short role descriptors, used by the terminal's `whoami`. */
  roles: string[];
  /** 2–3 sentence summary, used by the terminal, the chat widget and SEO. */
  summary: string;
  location: string;
  email: string;
  phone: string;
  availability: string;
  resumePath: string;
  siteUrl: string;
  socials: Social[];
}

/** One item in the About "Now" row. `href` makes it a link: an in-page anchor or a URL. */
export interface NowItem {
  label: string;
  href?: string;
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  start: string;
  end: string;
}

/** A single animated figure in the proof bar. */
export interface Stat {
  /** Numeric part that counts up. */
  value: number;
  /** Rendered before the number, e.g. "R² = ". */
  prefix?: string;
  /** Rendered after the number, e.g. "%" or "+". */
  suffix?: string;
  /** Decimal places to show while counting. */
  decimals?: number;
  label: string;
  /** Where the number comes from — shown on hover/focus so it is auditable. */
  source: string;
  /** Set when the value is fetched live rather than hard-coded. */
  live?: 'publicRepos';
}

export interface ExperienceItem {
  org: string;
  role: string;
  start: string;
  end: string;
  location: string;
  /** Impact-first bullets: verb + what + result. Long form, for the terminal and résumé views. */
  bullets: string[];
  /** Two short impact lines for the experience row on the page. */
  impact: string[];
  stack: string[];
  /** Makes the whole row a link: an external URL, or an in-page anchor like "#founder". */
  href?: string;
  kind: 'founder' | 'internship';
}

export interface ArchitectureNode {
  id: string;
  label: string;
  /** Sub-label, e.g. "Vercel" or "Render". */
  note?: string;
  /** Column in the flow diagram, 0-indexed left to right. */
  col: number;
  /** Row within the column, 0-indexed top to bottom. */
  row: number;
  tone: 'client' | 'service' | 'model' | 'store';
}

export interface ArchitectureEdge {
  from: string;
  to: string;
  label?: string;
}

export interface Architecture {
  caption: string;
  nodes: ArchitectureNode[];
  edges: ArchitectureEdge[];
}

export interface Project {
  slug: string;
  name: string;
  /** One line: what was broken before this existed. */
  problem: string;
  /** The same problem in ~50 characters, for the project row. */
  oneLiner: string;
  /** What was built, and the role in building it. */
  built: string;
  role: string;
  year: string;
  stack: string[];
  /** The single number a recruiter should remember. */
  metric: { value: string; label: string };
  links: { demo?: string; repo?: string; api?: string };
  /** Path under /public, or null while a screenshot is still missing. */
  preview: string | null;
  /** Extra frames cycled on hover. */
  previewFrames?: string[];
  /**
   * Bento placement. `lead` is the tall 7-column tile, `standard` stacks
   * beside it, and `wide` runs full width as a banner.
   */
  emphasis: 'lead' | 'standard' | 'wide';
  tags: string[];
  /** Detail page content. */
  detail: {
    overview: string[];
    highlights: string[];
    challenges: { title: string; body: string }[];
    next: string[];
    architecture: Architecture;
  };
}

export interface SideProject {
  name: string;
  /** Full sentence, used by the terminal and the Ask widget. */
  blurb: string;
  /** A few words that fit on the one-line "More" row without truncating. */
  oneLiner: string;
  metric?: string;
  stack: string[];
  repo: string;
}

export interface Venture {
  name: string;
  role: string;
  pitch: string;
  /** One line for the founder card. `*word*` renders in the accent serif. */
  mission: string;
  /** The product pipeline, stage by stage, for the founder card's diagram. */
  pipeline: { stages: string[] };
  since: string;
  badges: { label: string; detail: string }[];
  building: { title: string; body: string }[];
  stack: string[];
  href?: string;
}

export interface SkillGroup {
  id: string;
  title: string;
  blurb: string;
  items: { name: string; icon: IconSlug; usedIn: string[] }[];
}

/** One step of an example agent trace. Steps without `time` (the plan) get no ✓. */
export interface TraceStep {
  kind: string;
  detail: string;
  time?: string;
}

/**
 * An illustrative agent run for the signature card. Clearly labelled as an
 * example trace in the UI — these are not measurements.
 */
export interface AgentTrace {
  /** Short project slug shown in the card header. */
  project: string;
  task: string;
  steps: TraceStep[];
  result: string;
}

export interface NavItem {
  id: string;
  label: string;
}
