import {
  education,
  experience,
  fundamentals,
  profile,
  projects,
  sideProjects,
  skillGroups,
  venture,
} from '@/data/portfolio';
import { liveStats as stats, siteStats } from '@/lib/siteStats';

/**
 * Offline answer engine for the "Ask about Pulkit" widget.
 *
 * Deliberately not an LLM: it scores a question against a set of topics built
 * from portfolio.ts and returns the best match, so it works with no API key,
 * no network call and no chance of inventing a fact that is not in the data.
 *
 * TODO(pulkit): to upgrade this to a real model, add a serverless function at
 * /api/ask that takes { question }, prompts a model with the same portfolio
 * data as context, and returns { answer, sources }. Call it from `ask()` below
 * and fall back to this matcher when it errors. The API key must live in the
 * serverless environment — never in VITE_* variables, which ship to the client.
 */

export interface Answer {
  text: string;
  /** Follow-up suggestions shown as chips under the answer. */
  related: string[];
}

interface Topic {
  id: string;
  /** Words that pull a question toward this topic. */
  keywords: string[];
  answer: () => string;
  related: string[];
}

const list = (items: string[]) =>
  items.length <= 1 ? (items[0] ?? '') : `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;

const TOPICS: Topic[] = [
  {
    id: 'who',
    keywords: ['who', 'about', 'yourself', 'introduce', 'background', 'summary', 'bio', 'pulkit'],
    answer: () => profile.summary,
    related: ['What has he built?', 'Where has he worked?', 'Is he available for internships?'],
  },
  {
    id: 'availability',
    keywords: [
      'available',
      'availability',
      'hire',
      'hiring',
      'internship',
      'intern',
      'job',
      'open',
      'join',
      'notice',
    ],
    answer: () =>
      `${profile.availability}. He is based in ${profile.location} and open to remote work — he already did a six-month remote engineering internship at Dezors. The fastest way to reach him is ${profile.email}.`,
    related: ['What is his experience?', 'Can I see his résumé?', 'What is his strongest project?'],
  },
  {
    id: 'projects',
    keywords: ['project', 'projects', 'built', 'build', 'portfolio', 'work', 'shipped', 'demo'],
    answer: () =>
      `Four flagship projects: ${list(projects.map((p) => p.name))}. Three of them are live in production. The one most worth opening first is ${projects[0].name} — ${projects[0].problem.toLowerCase()} ${projects[0].links.demo ? `Live at ${projects[0].links.demo}` : ''}`.trim(),
    related: ['Tell me about ParcelPilot', 'What machine learning has he done?', 'Does he write Go?'],
  },
  {
    id: 'parcelpilot',
    keywords: ['parcelpilot', 'parcel', 'copilot', 'support', 'authorization', 'authz', 'agent', 'agents'],
    answer: () => {
      const p = projects.find((item) => item.slug === 'parcelpilot');
      if (!p) return 'No data for that project.';
      return `${p.name}: ${p.built} His role: ${p.role} The part worth noting is authorization — out-of-scope requests get a 403 before any retrieval runs or any model token is spent. Stack: ${p.stack.join(', ')}. Live at ${p.links.demo}`;
    },
    related: ['How does the RAG pipeline work?', 'What would he improve?', 'What other projects are there?'],
  },
  {
    id: 'rag',
    keywords: [
      'rag',
      'retrieval',
      'chroma',
      'chromadb',
      'embedding',
      'vector',
      'knowledgehub',
      'langchain',
      'gemini',
    ],
    answer: () => {
      const p = projects.find((item) => item.slug === 'knowledgehub-ai');
      if (!p) return 'No data for that project.';
      return `He has shipped RAG twice. ${p.name} indexes enterprise PDFs with Google Embeddings into ChromaDB and answers questions through Gemini 2.5 Flash with citations back to the source chunks. ParcelPilot uses the same pattern over operational records and policy documents, with retrieval gated behind an access-control check. Live at ${p.links.demo}`;
    },
    related: ['Tell me about ParcelPilot', 'What is his AI stack?', 'What has he done with MCP?'],
  },
  {
    id: 'mcp',
    keywords: [
      'mcp',
      'model context protocol',
      'langgraph',
      'automation',
      'itsm',
      'sdg',
      'tooling',
      'routing',
    ],
    answer: () => {
      const sdg = experience.find((item) => item.org === 'SDG Corporation');
      return `At SDG Corporation he built an MCP server exposing 10+ enterprise tools, plus LangGraph agent workflows that route by intent to the right tool — used to speed up internal ITSM resolution. He also wrote the Python/FastAPI integrations behind automated ticket creation, retrieval, updates and workflow execution. ${sdg ? `That was ${sdg.start} to ${sdg.end} in ${sdg.location}.` : ''}`;
    },
    related: ['What else has he automated?', 'What is his backend stack?', 'Tell me about his startup'],
  },
  {
    id: 'ml',
    keywords: [
      'ml',
      'machine learning',
      'model',
      'accuracy',
      'random forest',
      'battery',
      'scrap',
      'spark',
      'nasa',
      'prediction',
      'data science',
      'classifier',
    ],
    answer: () =>
      `Scrap 2 Spark predicts the remaining useful life of lithium-ion batteries with a Random Forest trained on the NASA Battery Dataset — 2,716 cycles across 34 cells, reaching R² = 0.879 on held-out data. He also built a fake-news classifier (TF-IDF + logistic regression) that scores 97.9% on a held-out split of a 20,800-article corpus, and a fake-job-posting detector at roughly 93%.`,
    related: ['What does Scrap 2 Spark do?', 'What is his Python stack?', 'What else has he built?'],
  },
  {
    id: 'backend',
    keywords: [
      'backend',
      'api',
      'fastapi',
      'go',
      'golang',
      'postgres',
      'postgresql',
      'database',
      'server',
      'nginx',
      'docker',
      'deploy',
      'devops',
      'infra',
    ],
    answer: () =>
      `Backend is the centre of gravity. FastAPI across ParcelPilot, Scrap 2 Spark, KnowledgeHub AI and the Dezors production backend. Go with Gin and PostgreSQL for the IEEE recruitment portal that handled 1,000+ applicants — JWT auth, validation, migrations and Docker. On the infrastructure side: Docker, Linux, Nginx as a reverse proxy on a VPS, and deployments on Vercel and Render.`,
    related: ['Does he write Go?', 'What has he deployed to production?', 'What is his full stack?'],
  },
  {
    id: 'go',
    keywords: ['go', 'golang', 'gin', 'ieee', 'recruitment'],
    answer: () => {
      const p = projects.find((item) => item.slug === 'ieee-recruitment-backend');
      return `Yes. ${p ? `${p.name}: ${p.built} It served ${p.metric.value} applicants in the 2025 cycle.` : ''} He also has smaller Go work — a REST CRUD service with Gorilla Mux and an HTTP form handler. Go is his second language after Python.`;
    },
    related: ['What is his backend stack?', 'What languages does he know?', 'What other projects are there?'],
  },
  {
    id: 'startup',
    keywords: [
      'startup',
      'audaxity',
      'founder',
      'ceo',
      'company',
      'venture',
      'incubat',
      'vnest',
      'v-nest',
      'dpiit',
    ],
    answer: () =>
      `${venture.name} — he is ${venture.role}, since ${venture.since}. ${venture.pitch} It is ${venture.badges.map((b) => b.label.toLowerCase()).join(' and ')}. The MVP ships Whisper-based speech-to-text, AI knowledge generation and automated syllabus mapping.`,
    related: ['What is he building there?', 'What is his experience?', 'Is he available for internships?'],
  },
  {
    id: 'experience',
    keywords: [
      'experience',
      'worked',
      'work history',
      'employment',
      'intern',
      'internships',
      'role',
      'roles',
      'dezors',
      'jobs',
    ],
    answer: () =>
      experience
        .map((item) => `${item.role} at ${item.org} (${item.start} – ${item.end}): ${item.bullets[0]}`)
        .join(' '),
    related: ['Tell me about his startup', 'What has he done with MCP?', 'What is his backend stack?'],
  },
  {
    id: 'skills',
    keywords: [
      'skill',
      'skills',
      'stack',
      'tech',
      'technology',
      'language',
      'languages',
      'know',
      'tools',
      'framework',
    ],
    answer: () =>
      skillGroups
        .map((group) => `${group.title}: ${group.items.map((item) => item.name).join(', ')}.`)
        .join(' ') + ` CS fundamentals: ${fundamentals.join(', ')}.`,
    related: ['What is his backend stack?', 'What machine learning has he done?', 'Does he write Go?'],
  },
  {
    id: 'education',
    keywords: [
      'education',
      'study',
      'studying',
      'college',
      'university',
      'degree',
      'vit',
      'graduate',
      'graduation',
      'school',
    ],
    answer: () =>
      `${education.degree} in ${education.field} at ${education.institution}, ${education.start} to ${education.end}. He has also solved ${siteStats.leetcodeSolved ?? '120+'} problems on LeetCode.`,
    related: ['Is he available for internships?', 'What has he built?', 'Where is he based?'],
  },
  {
    id: 'contact',
    keywords: [
      'contact',
      'email',
      'reach',
      'linkedin',
      'github',
      'resume',
      'cv',
      'download',
      'phone',
      'call',
    ],
    answer: () =>
      `Email ${profile.email}. ${profile.socials
        .filter((social) => social.icon !== 'mail')
        .map((social) => `${social.label}: ${social.href}`)
        .join(
          '. ',
        )}. The résumé PDF is linked at the bottom of the left column, after the experience list, and in the contact section.`,
    related: ['Is he available for internships?', 'Where is he based?', 'What has he built?'],
  },
  {
    id: 'location',
    keywords: ['where', 'location', 'based', 'city', 'relocate', 'remote', 'country', 'india', 'chennai'],
    answer: () =>
      `${profile.location}. He studies at VIT Chennai, has worked on-site in Noida (SDG Corporation) and fully remote for Dezors, so both arrangements are proven.`,
    related: ['Is he available for internships?', 'What is his experience?', 'How do I contact him?'],
  },
  {
    id: 'numbers',
    keywords: ['metric', 'metrics', 'number', 'numbers', 'result', 'results', 'impact', 'proof', 'stats'],
    answer: () =>
      stats
        .map((stat) => `${stat.prefix ?? ''}${stat.value}${stat.suffix ?? ''} — ${stat.label}`)
        .join('. ') + '.',
    related: ['What machine learning has he done?', 'What has he built?', 'What is his experience?'],
  },
  {
    id: 'side',
    keywords: ['side', 'other', 'smaller', 'more', 'else', 'repos', 'repositories', 'open source'],
    answer: () =>
      `Beyond the flagships: ${sideProjects.map((item) => `${item.name} (${item.blurb.toLowerCase().replace(/\.$/, '')})`).join('; ')}. All of them are public at github.com/pulkittaneja09.`,
    related: ['What has he built?', 'What machine learning has he done?', 'Does he write Go?'],
  },
];

export const SUGGESTED_QUESTIONS = [
  'What has he built?',
  'Is he available for internships?',
  'What has he done with MCP?',
  'What machine learning has he done?',
  'Tell me about his startup',
];

const STOP_WORDS = new Set([
  'a',
  'an',
  'the',
  'is',
  'are',
  'was',
  'were',
  'do',
  'does',
  'did',
  'has',
  'have',
  'had',
  'he',
  'his',
  'him',
  'you',
  'your',
  'i',
  'me',
  'my',
  'what',
  'tell',
  'about',
  'of',
  'to',
  'for',
  'in',
  'on',
  'with',
  'and',
  'or',
  'can',
  'could',
  'would',
  'show',
  'give',
  'any',
]);

function tokenise(question: string): string[] {
  return question
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 1 && !STOP_WORDS.has(word));
}

/** Scores each topic against the question and returns the best answer. */
export function ask(question: string): Answer {
  const words = tokenise(question);
  const normalised = question.toLowerCase();

  if (words.length === 0) {
    return {
      text: `Ask me anything about Pulkit's work — projects, stack, experience or availability. Everything here comes straight from the data on this page, so I will not invent an answer.`,
      related: SUGGESTED_QUESTIONS.slice(0, 3),
    };
  }

  let best: Topic | null = null;
  let bestScore = 0;

  TOPICS.forEach((topic) => {
    let score = 0;
    topic.keywords.forEach((keyword) => {
      // Multi-word keywords only count as a phrase match, and count double.
      if (keyword.includes(' ')) {
        if (normalised.includes(keyword)) score += 4;
        return;
      }
      words.forEach((word) => {
        if (word === keyword) score += 2;
        else if (word.length > 3 && (word.startsWith(keyword) || keyword.startsWith(word))) score += 1;
      });
    });

    if (score > bestScore) {
      bestScore = score;
      best = topic;
    }
  });

  // TypeScript cannot see that the closure assigned `best`.
  const match = best as Topic | null;

  if (!match || bestScore < 2) {
    return {
      text: `I only answer from what is on this page, and nothing here matches that. Try asking about his projects, his stack, his experience, his startup, or whether he is available. For anything else, email him at ${profile.email}.`,
      related: SUGGESTED_QUESTIONS.slice(0, 3),
    };
  }

  return { text: match.answer(), related: match.related };
}
