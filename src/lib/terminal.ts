import {
  education,
  experience,
  fundamentals,
  profile,
  projects,
  sideProjects,
  skillGroups,
  stats,
  venture,
} from '@/data/portfolio';

/** One line of terminal output. `tone` drives the colour, nothing else. */
export interface Line {
  text: string;
  tone?: 'default' | 'accent' | 'muted' | 'error' | 'heading';
  /** Rendered as a link when present. */
  href?: string;
}

export interface CommandResult {
  lines: Line[];
  /** Side effects the overlay performs after printing. */
  effect?: 'clear' | 'close' | 'download-resume' | 'theme' | 'easter-egg';
}

const l = (text: string, tone: Line['tone'] = 'default', href?: string): Line =>
  href ? { text, tone, href } : { text, tone };

const blank = (): Line => l('');

export const COMMANDS = [
  'help',
  'whoami',
  'projects',
  'skills',
  'experience',
  'education',
  'stats',
  'startup',
  'resume',
  'contact',
  'theme',
  'clear',
  'exit',
  'sudo hire-pulkit',
] as const;

function helpOutput(): Line[] {
  const rows: [string, string][] = [
    ['help', 'this list'],
    ['whoami', 'the short version'],
    ['projects', 'what I have shipped, with links'],
    ['skills', 'languages, AI/ML, backend, infra'],
    ['experience', 'roles and what I did in them'],
    ['education', 'degree, institution, CGPA'],
    ['stats', 'the numbers, with their sources'],
    ['startup', 'Audaxity Technologies'],
    ['resume', 'download the PDF'],
    ['contact', 'how to reach me'],
    ['theme', 'flip dark / light'],
    ['clear', 'wipe the screen'],
    ['exit', 'close the terminal'],
  ];

  return [
    l('Available commands', 'heading'),
    blank(),
    ...rows.map(([name, description]) => l(`  ${name.padEnd(12)}${description}`, 'muted')),
    blank(),
    l('  Tip: there is one command not on this list.', 'muted'),
  ];
}

function projectsOutput(): Line[] {
  const lines: Line[] = [l(`Featured work (${projects.length})`, 'heading'), blank()];

  projects.forEach((project, i) => {
    lines.push(l(`  ${i + 1}. ${project.name}  [${project.year}]`, 'accent'));
    lines.push(l(`     ${project.problem}`, 'muted'));
    lines.push(l(`     ${project.metric.value} — ${project.metric.label}`));
    lines.push(l(`     stack: ${project.stack.join(', ')}`, 'muted'));
    if (project.links.demo) lines.push(l(`     live:  ${project.links.demo}`, 'muted', project.links.demo));
    if (project.links.repo) lines.push(l(`     code:  ${project.links.repo}`, 'muted', project.links.repo));
    lines.push(blank());
  });

  lines.push(l(`Also: ${sideProjects.map((p) => p.name).join(' · ')}`, 'muted'));
  return lines;
}

function skillsOutput(): Line[] {
  const lines: Line[] = [l('Technical skills', 'heading'), blank()];
  skillGroups.forEach((group) => {
    lines.push(l(`  ${group.title}`, 'accent'));
    lines.push(l(`    ${group.items.map((item) => item.name).join(' · ')}`, 'muted'));
    lines.push(blank());
  });
  lines.push(l('  CS fundamentals', 'accent'));
  lines.push(l(`    ${fundamentals.join(' · ')}`, 'muted'));
  return lines;
}

function experienceOutput(): Line[] {
  const lines: Line[] = [l('Experience', 'heading'), blank()];
  experience.forEach((item) => {
    lines.push(l(`  ${item.role} @ ${item.org}`, 'accent'));
    lines.push(l(`  ${item.start} – ${item.end} · ${item.location}`, 'muted'));
    item.bullets.forEach((bullet) => lines.push(l(`    • ${bullet}`)));
    lines.push(blank());
  });
  return lines;
}

function statsOutput(): Line[] {
  const lines: Line[] = [l('The numbers, and where they come from', 'heading'), blank()];
  stats.forEach((stat) => {
    const value = `${stat.prefix ?? ''}${stat.decimals ? stat.value.toFixed(stat.decimals) : stat.value}${stat.suffix ?? ''}`;
    lines.push(l(`  ${value.padEnd(10)} ${stat.label}`, 'accent'));
    lines.push(l(`  ${''.padEnd(10)} ${stat.source}`, 'muted'));
    lines.push(blank());
  });
  return lines;
}

function contactOutput(): Line[] {
  const lines: Line[] = [l('Reach me', 'heading'), blank()];
  profile.socials.forEach((social) => {
    lines.push(l(`  ${social.label.padEnd(10)} ${social.href}`, 'muted', social.href));
  });
  lines.push(blank());
  lines.push(l(`  ${profile.availability}`, 'accent'));
  return lines;
}

const EASTER_EGG: Line[] = [
  l('[sudo] password for recruiter: ••••••••', 'muted'),
  blank(),
  l('  ┌─────────────────────────────────────────────┐', 'accent'),
  l('  │  OFFER PIPELINE — provisioning              │', 'accent'),
  l('  └─────────────────────────────────────────────┘', 'accent'),
  blank(),
  l('  [✔] verifying shipped projects ............ 4 live'),
  l('  [✔] checking production deploys ........... Vercel + Render'),
  l('  [✔] auditing metrics ...................... all sourced'),
  l('  [✔] measuring founder energy .............. DPIIT-recognised'),
  l('  [✔] availability check .................... 2027 internships'),
  blank(),
  l('  Pulkit has been hired. 🎉', 'accent'),
  l('  (Pending one small formality on your end.)', 'muted'),
  blank(),
  l(`  → ${profile.email}`, 'accent', `mailto:${profile.email}`),
];

/** Resolves a typed line to output. Unknown input returns an error line. */
export function runCommand(raw: string): CommandResult {
  const input = raw.trim().toLowerCase().replace(/\s+/g, ' ');

  switch (input) {
    case '':
      return { lines: [] };

    case 'help':
    case '?':
    case 'man':
      return { lines: helpOutput() };

    case 'whoami':
      return {
        lines: [
          l(profile.name, 'heading'),
          l(profile.tagline, 'accent'),
          blank(),
          l(profile.summary),
          blank(),
          l(`  ${profile.roles.join('  ·  ')}`, 'muted'),
          l(`  ${profile.location}`, 'muted'),
        ],
      };

    case 'projects':
    case 'ls':
    case 'work':
      return { lines: projectsOutput() };

    case 'skills':
    case 'stack':
      return { lines: skillsOutput() };

    case 'experience':
    case 'work history':
      return { lines: experienceOutput() };

    case 'education':
      return {
        lines: [
          l('Education', 'heading'),
          blank(),
          l(`  ${education.institution}`, 'accent'),
          l(`  ${education.degree}, ${education.field}`),
          l(`  ${education.start} – ${education.end}`, 'muted'),
          l(`  ${education.score} ${education.scoreLabel}`, 'muted'),
        ],
      };

    case 'stats':
    case 'numbers':
      return { lines: statsOutput() };

    case 'startup':
    case 'audaxity':
      return {
        lines: [
          l(venture.name, 'heading'),
          l(`${venture.role} · since ${venture.since}`, 'muted'),
          blank(),
          l(venture.pitch),
          blank(),
          ...venture.badges.map((badge) => l(`  [${badge.label}] ${badge.detail}`, 'accent')),
          blank(),
          ...venture.building.map((item) => l(`  • ${item.title} — ${item.body}`, 'muted')),
        ],
      };

    case 'resume':
    case 'cv':
      return {
        lines: [l('Downloading Pulkit_Taneja_Resume.pdf …', 'accent')],
        effect: 'download-resume',
      };

    case 'contact':
    case 'email':
      return { lines: contactOutput() };

    case 'theme':
      return { lines: [l('Flipping the lights.', 'muted')], effect: 'theme' };

    case 'clear':
    case 'cls':
      return { lines: [], effect: 'clear' };

    case 'exit':
    case 'quit':
    case 'close':
      return { lines: [], effect: 'close' };

    case 'sudo hire-pulkit':
      return { lines: EASTER_EGG, effect: 'easter-egg' };

    case 'sudo':
      return { lines: [l('usage: sudo <command>   (try: sudo hire-pulkit)', 'muted')] };

    case 'rm -rf /':
      return { lines: [l('Nice try. This terminal is read-only. 🙂', 'muted')] };

    default:
      return {
        lines: [
          l(`command not found: ${raw.trim()}`, 'error'),
          l("Type 'help' for the list of commands.", 'muted'),
        ],
      };
  }
}

export const WELCOME: Line[] = [
  l(`${profile.name} — interactive résumé`, 'heading'),
  l('pulkit-portfolio v1.0.0 · built with React, TypeScript and too much coffee', 'muted'),
  blank(),
  l("Type 'help' to see what this thing does, or 'whoami' for the short version.", 'muted'),
  l("Press Esc or type 'exit' to go back to the site.", 'muted'),
];
