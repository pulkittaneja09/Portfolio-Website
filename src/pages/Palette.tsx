import type { CSSProperties } from 'react';
import { AgentRun } from '@/components/AgentRun';
import { ArrowUpRightIcon } from '@/components/icons';
import { experience, profile, projects, skillGroups } from '@/data/portfolio';
import { ExperienceRow } from '@/sections/Experience';
import { ProjectRow } from '@/sections/Projects';
import { SkillChip } from '@/sections/Skills';

/**
 * TEMPORARY (Round 4, task C2c): the three shortlisted palettes applied to
 * real components, dark and light, side by side. Deleted once a winner ships.
 */
type Theme = Record<string, string>;
interface Candidate {
  id: string;
  name: string;
  dark: Theme;
  light: Theme;
}

const hex = (value: string) => {
  const n = parseInt(value.slice(1), 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
};

const theme = (t: Record<string, string>): Theme =>
  Object.fromEntries(Object.entries(t).map(([key, value]) => [`--${key}-rgb`, hex(value)]));

const CANDIDATES: Candidate[] = [
  {
    id: 'a',
    name: 'A · Midnight + Glacier',
    dark: theme({
      bg: '#0A0E14', 'bg-elevated': '#10151D', 'text-strong': '#EEF2F8', text: '#A3ADBD', 'text-faint': '#5E6878',
      accent: '#8FB4FF', secondary: '#7DD3C0', ok: '#86D69E', 'tone-3': '#B4C2DA', 'tone-4': '#9AD0E8', line: '#C4D4F0',
    }),
    light: theme({
      bg: '#F8FAFC', 'bg-elevated': '#FFFFFF', 'text-strong': '#0B1220', text: '#475467', 'text-faint': '#8792A2',
      accent: '#2F5BD3', secondary: '#0E7C6C', ok: '#1F8A54', 'tone-3': '#546686', 'tone-4': '#1678A0', line: '#0F172A',
    }),
  },
  {
    id: 'b',
    name: 'B · Slate + Teal',
    dark: theme({
      bg: '#0A1112', 'bg-elevated': '#0F1819', 'text-strong': '#ECF3F2', text: '#9FB0AE', 'text-faint': '#5A6A69',
      accent: '#5ED4BE', secondary: '#9CB8FF', ok: '#8ADBA0', 'tone-3': '#B3C6C3', 'tone-4': '#8FCFE0', line: '#C8E6E1',
    }),
    light: theme({
      bg: '#F7FAF9', 'bg-elevated': '#FFFFFF', 'text-strong': '#0A1716', text: '#445452', 'text-faint': '#83918F',
      accent: '#0B7A6A', secondary: '#3157C9', ok: '#1F8A54', 'tone-3': '#536866', 'tone-4': '#16789A', line: '#0A1E1C',
    }),
  },
  {
    id: 'c',
    name: 'C · Graphite + Indigo',
    dark: theme({
      bg: '#0C0C10', 'bg-elevated': '#131319', 'text-strong': '#F0F0F5', text: '#A5A6B4', 'text-faint': '#5F6070',
      accent: '#A5ADFF', secondary: '#7FD6C2', ok: '#86D69E', 'tone-3': '#BDBED0', 'tone-4': '#9CC8F0', line: '#D4D6F0',
    }),
    light: theme({
      bg: '#FAFAFC', 'bg-elevated': '#FFFFFF', 'text-strong': '#0E0E14', text: '#4D4F60', 'text-faint': '#8A8B9A',
      accent: '#4A50C9', secondary: '#0F7F6C', ok: '#1F8A54', 'tone-3': '#5A5C74', 'tone-4': '#1F6FA8', line: '#12122A',
    }),
  },
];

function Panel({ candidate, mode }: { candidate: Candidate; mode: 'dark' | 'light' }) {
  const ai = skillGroups.find((group) => group.id === 'ai')!;
  const backend = skillGroups.find((group) => group.id === 'backend')!;
  const infra = skillGroups.find((group) => group.id === 'infra')!;
  return (
    <section
      data-palette={candidate.id}
      data-theme={mode === 'light' ? 'light' : undefined}
      data-shot={`${candidate.id}-${mode}`}
      style={{ ...(candidate[mode] as CSSProperties), background: 'var(--bg)', color: 'var(--text)' }}
      className="space-y-6 rounded-2xl border border-line/[0.1] p-6"
    >
      <p className="label text-faint">
        {candidate.name} — {mode}
      </p>
      <div>
        <h1 className="whitespace-nowrap text-[2.5rem] font-semibold leading-[1.05] tracking-[-0.035em] text-strong">
          {profile.name}
        </h1>
        <p className="mt-2 text-lg font-medium text-strong">{profile.title}</p>
        <p className="mt-3 flex items-center gap-2.5 font-mono text-xs text-body">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          {profile.availability}
        </p>
        <p className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-strong">
          Let&rsquo;s build <em className="serif">something</em>.
        </p>
      </div>
      <AgentRun />
      <ExperienceRow item={experience[0]} />
      <ProjectRow project={projects[0]} />
      <dl className="space-y-2">
        {[ai, backend, infra].map((group, g) => (
          <div key={group.id} data-tone={group.id}>
            <ul className="flex flex-wrap gap-1.5">
              {group.items.slice(0, 5).map((skill, i) => (
                <li key={skill.name}>
                  <SkillChip skill={skill} selected={g === 0 && i === 0} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </dl>
      <div className="flex items-center gap-4">
        <a
          href={profile.resumePath}
          className="inline-flex items-center gap-1 rounded-full border border-accent/40 px-4 py-1.5 text-sm font-medium text-accent"
        >
          Résumé <ArrowUpRightIcon className="h-3.5 w-3.5" />
        </a>
        <span className="link text-sm [background-size:100%_1px]">a link, hovered</span>
        <span className="font-mono text-sm text-accent">97.9%</span>
      </div>
    </section>
  );
}

export function Palette() {
  return (
    <main id="main" className="mx-auto grid max-w-[120rem] grid-cols-3 gap-6 p-6">
      {CANDIDATES.map((candidate) => (
        <div key={candidate.id} className="space-y-6">
          <Panel candidate={candidate} mode="dark" />
          <Panel candidate={candidate} mode="light" />
        </div>
      ))}
    </main>
  );
}
