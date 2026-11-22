/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  EDIT THIS FILE TO CHANGE THE SITE. Nothing here is duplicated in the UI.
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  Every number below is traceable to the résumé, a repo README or a notebook
 *  output. If you add a figure, fill in its `source` so it stays auditable.
 *  Anything still unknown is marked with a TODO(pulkit) comment.
 */

import type {
  AgentTrace,
  Education,
  ExperienceItem,
  NavItem,
  NowItem,
  Profile,
  Project,
  SideProject,
  SkillGroup,
  Stat,
  Venture,
} from './types';

export const GITHUB_USERNAME = 'pulkittaneja09';

export const profile: Profile = {
  name: 'Pulkit Taneja',
  title: 'AI Agents & Backend Engineer',
  tagline:
    'I build AI agents, RAG systems and the Go/Python backends that run them in production. Founder of Audaxity.',
  roles: [
    'Founder, Audaxity Technologies',
    'AI / Backend Engineer',
    'MCP + LangGraph builder',
    'RAG systems, end to end',
  ],
  summary:
    'CS undergrad at VIT Chennai and co-founder of Audaxity Technologies, an AI academic intelligence platform incubated at V-NEST. I ship production-shaped AI systems: MCP servers and LangGraph agents for enterprise automation, RAG pipelines grounded in real documents, and the FastAPI and Go backends underneath them.',
  location: 'Chennai, India',
  email: 'pulkittaneja0509@gmail.com',
  phone: '+91 94681 28969',
  availability: 'Open to AI/ML & backend internships · 2027',
  resumePath: '/Pulkit_Taneja_Resume.pdf',
  // Where the site is served from. Drives canonical URLs, Open Graph and
  // JSON-LD in index.html, and the generated sitemap.xml and robots.txt.
  // TODO(pulkit): change it if you add a custom domain or rename the Vercel project.
  siteUrl: 'https://portfolio-website-pi-blush-92.vercel.app',
  socials: [
    {
      label: 'GitHub',
      href: 'https://github.com/pulkittaneja09',
      handle: '@pulkittaneja09',
      icon: 'github',
    },
    {
      label: 'LinkedIn',
      href: 'https://linkedin.com/in/pulkit-taneja-627437366',
      handle: 'pulkit-taneja',
      icon: 'linkedin',
    },
    {
      label: 'Email',
      href: 'mailto:pulkittaneja0509@gmail.com',
      handle: 'pulkittaneja0509@gmail.com',
      icon: 'mail',
    },
    {
      label: 'LeetCode',
      href: 'https://leetcode.com/u/PULKITTANEJA/',
      handle: 'PULKITTANEJA',
      icon: 'leetcode',
    },
  ],
};

export const education: Education = {
  institution: 'Vellore Institute of Technology, Chennai',
  degree: 'B.Tech',
  field: 'Computer Science and Engineering',
  start: 'Aug 2024',
  end: 'May 2028 (expected)',
};

/**
 * About, in two short paragraphs. `**phrase**` renders as a white highlight
 * and `*word*` in the accent serif — one serif word per section, at most.
 */
export const about: string[] = [
  'I build *agents* that actually ship. My work sits where language models meet real systems: **MCP servers** that expose enterprise tools, LangGraph workflows that route each request to the right one, and **RAG pipelines** that answer from documents instead of guessing.',
  'Right now I am co-founding **Audaxity**, an academic intelligence platform incubated at V-NEST. Before that I built an MCP server with 10+ enterprise tools at SDG Corporation. The part I care about most is everything around the model: **access control before retrieval**, cited answers, and **FastAPI and Go backends** that keep working after the demo.',
];

/**
 * The "Now" row under About. The LeetCode solved count is appended after
 * these at build time (see src/lib/siteStats.ts), so it is never typed here.
 */
export const now: NowItem[] = [
  { label: 'Building Audaxity', href: '#founder' },
  { label: "B.Tech CSE, VIT Chennai '28" },
];

/** Section anchors, in page order. Drives the left-column nav and ⌘K. */
export const nav: NavItem[] = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'founder', label: 'Founder' },
  { id: 'contact', label: 'Contact' },
];

/**
 * The left-column "agent run" card cycles through these. Each is an example of
 * the kind of system behind a real project, labelled "example trace" on the
 * page — illustrative output, not a benchmark. Plain ASCII on purpose: the
 * mono font's latin subset has no arrow or ≥ glyphs, and a trace reads truer.
 */
export const agentTraces: AgentTrace[] = [
  {
    project: 'audaxity',
    task: 'map lecture to syllabus',
    steps: [
      { kind: 'plan', detail: '3 steps' },
      { kind: 'tool', detail: 'mcp://transcripts.search', time: '142ms' },
      { kind: 'tool', detail: 'rag.retrieve(k=8)', time: '88ms' },
      { kind: 'llm', detail: 'synthesize + cite', time: '1.2s' },
    ],
    result: '4 topics covered · 2 gaps flagged',
  },
  {
    project: 'scrap-2-spark',
    task: 'grade battery pack B-0417',
    steps: [
      { kind: 'plan', detail: '3 steps' },
      { kind: 'http', detail: 'POST /predict/rul', time: '64ms' },
      { kind: 'model', detail: 'random_forest.predict', time: '11ms' },
      { kind: 'rule', detail: 'soh >= 70% -> second life', time: '2ms' },
    ],
    result: 'reuse · ~410 cycles remaining',
  },
  {
    project: 'parcelpilot',
    task: 'refund status for TXT-501',
    steps: [
      { kind: 'plan', detail: 'authorize -> retrieve -> answer' },
      { kind: 'auth', detail: 'scope ACCT-001, ACCT-003', time: '2ms' },
      { kind: 'db', detail: 'owner(TXT-501) -> ACCT-004', time: '4ms' },
      { kind: 'guard', detail: 'owner not in scope', time: '1ms' },
    ],
    result: '403 · no retrieval, no tokens spent',
  },
];

/** Proof bar. Verified figures only — no rounding up, no vanity metrics. */
export const stats: Stat[] = [
  {
    value: 97.9,
    suffix: '%',
    decimals: 1,
    label: 'Fake-news classifier accuracy',
    source: 'Held-out test accuracy 0.97909 on the 20,800-article Kaggle set (TF-IDF + logistic regression).',
  },
  {
    value: 0.879,
    prefix: 'R² ',
    decimals: 3,
    label: 'Battery RUL prediction',
    source: 'Random Forest on the NASA Battery Dataset — 2,716 cycles across 34 cells.',
  },
  {
    value: 1000,
    suffix: '+',
    label: 'Applicants served by my Go API',
    source: 'IEEE recruitment portal backend, Golang + PostgreSQL, 2025 cycle.',
  },
  {
    value: 10,
    suffix: '+',
    label: 'Enterprise tools exposed over MCP',
    source: 'MCP server built at SDG Corporation for intent-routed ITSM automation.',
  },
  {
    value: 22,
    suffix: '',
    label: 'Public repositories',
    source: 'Fetched live from the GitHub REST API; the number here is only a fallback.',
    live: 'publicRepos',
  },
  {
    value: 1,
    label: 'Startup incubated at V-NEST',
    source: 'Audaxity Technologies, incubated at V-NEST, VIT Chennai.',
  },
];

export const projects: Project[] = [
  {
    slug: 'parcelpilot',
    short: 'ParcelPilot',
    name: 'ParcelPilot AI Support Copilot',
    problem:
      'Support agents lose minutes per ticket digging through policy PDFs and escalation runbooks before they can answer a customer.',
    oneLiner: 'Agents lose minutes per ticket in policy PDFs.',
    built:
      'A support-operations copilot where agents ask questions in plain English and get answers grounded in the actual order record, company policy documents and the conversation so far — with every action confirmed before it fires.',
    role: 'Sole engineer — FastAPI backend, RAG pipeline, agent routing, access-control layer, React/TS frontend and both deployments.',
    year: '2026',
    stack: ['FastAPI', 'Python', 'React', 'TypeScript', 'Claude', 'ChromaDB', 'SQLite', 'Render', 'Vercel'],
    metric: { value: '403 before retrieval', label: 'out-of-scope requests blocked pre-LLM' },
    links: {
      demo: 'https://parcelpilot-ai-agent-psi.vercel.app/',
      repo: 'https://github.com/pulkittaneja09/parcelpilot-ai-agent',
      api: 'https://parcelpilot-ai-agent-59d5.onrender.com/docs',
    },
    preview: '/previews/parcelpilot-support-dashboard.webp',
    previewFrames: [
      '/previews/parcelpilot-escalation-created.webp',
      '/previews/parcelpilot-access-denied.webp',
    ],
    emphasis: 'lead',
    tags: ['AI agents', 'RAG', 'Backend'],
    detail: {
      overview: [
        'ParcelPilot is a purpose-built copilot for customer-support operations, not a generic chatbot. An agent picks a ticket or order, and then holds a real conversation about it: follow-ups like “why?” or “what do I tell the customer?” keep their context.',
        'The interesting part is not the LLM call — it is everything guarding it. Authorization resolves the record’s owning account from the database and checks it against the caller’s scope before any context is loaded, any vector search runs, or any model token is spent.',
      ],
      highlights: [
        'Multi-turn conversational memory with a session store and history windowing, so follow-up questions resolve against earlier turns.',
        'Retrieval-augmented answers: ChromaDB retrieval with source precedence runs per turn, so responses cite operational data and policy docs rather than model recall.',
        'Prepare-then-confirm actions — escalating a ticket is proposed, shown to the agent, and only executed on explicit confirmation.',
        'Backend-enforced, account-scoped authorization, covered by pytest: a support agent scoped to ACCT-001/ACCT-003 asking about an ACCT-004 ticket gets HTTP 403 with zero retrieval and zero model spend.',
        'Layered FastAPI architecture — domain exception types mapped narrowly to HTTP responses, services split by concern, auto-seeding database on first boot for clean deployments.',
      ],
      challenges: [
        {
          title: 'Authorization that a modified request cannot talk its way past',
          body: 'The naive design trusts a client-supplied record ID. Instead the server treats the inbound ID as a lookup key only, resolves the owning account from the database, and compares it to the caller’s allowed set — ahead of retrieval and the LLM. Editing a ticket ID in the browser leaks nothing and costs nothing.',
        },
        {
          title: 'Keeping follow-ups coherent without blowing the context window',
          body: 'Replaying whole transcripts into every prompt is expensive and degrades grounding. The session store keeps a windowed history and re-runs retrieval each turn, so “why?” resolves against the previous answer while the prompt stays bounded.',
        },
        {
          title: 'Cold-start deployments on free infrastructure',
          body: 'Render gives you an empty filesystem on redeploy. A startup hook seeds accounts, orders and tickets from the source spreadsheet if the database is absent, so a fresh deploy is immediately demoable instead of empty.',
        },
      ],
      next: [
        'Replace the mocked X-User-ID header with real OAuth2/JWT identity.',
        'Move sessions out of memory into Redis so conversations survive restarts.',
        'Stream model tokens to the client to cut perceived latency.',
        'Host ChromaDB on a managed service so embeddings survive redeploys.',
        'Add structured logging and tracing across the RAG pipeline.',
      ],
      architecture: {
        caption: 'Authorization resolves and gates the request before retrieval or any model call.',
        nodes: [
          { id: 'ui', label: 'React + TS', note: 'Vercel', col: 0, row: 1, tone: 'client' },
          { id: 'api', label: 'FastAPI', note: 'Render', col: 1, row: 1, tone: 'service' },
          { id: 'authz', label: 'Access control', note: 'account scope', col: 2, row: 0, tone: 'service' },
          { id: 'db', label: 'SQLite', note: 'orders · tickets', col: 2, row: 2, tone: 'store' },
          { id: 'chroma', label: 'ChromaDB', note: 'policy chunks', col: 3, row: 2, tone: 'store' },
          { id: 'agent', label: 'Agent router', note: 'session memory', col: 3, row: 0, tone: 'service' },
          { id: 'llm', label: 'Claude', note: 'grounded answer', col: 4, row: 1, tone: 'model' },
        ],
        edges: [
          { from: 'ui', to: 'api', label: 'ask' },
          { from: 'api', to: 'authz', label: 'gate' },
          { from: 'api', to: 'db', label: 'resolve owner' },
          { from: 'authz', to: 'agent', label: 'allowed' },
          { from: 'db', to: 'chroma', label: 'context' },
          { from: 'chroma', to: 'llm' },
          { from: 'agent', to: 'llm', label: 'prompt' },
        ],
      },
    },
  },
  {
    slug: 'scrap-2-spark',
    name: 'Scrap 2 Spark',
    problem:
      'An EV battery retired from a car may still hold years of useful life, but deciding reuse versus recycling means reading thousands of telemetry cycles by hand.',
    oneLiner: 'Retired EV batteries get scrapped with life left.',
    built:
      'A battery-intelligence platform that ingests telemetry CSVs, predicts remaining useful life with a trained Random Forest, grades cell health and risk, and recommends a second-life deployment path with a sustainability estimate.',
    role: 'Built the FastAPI service, the ML integration and inference endpoints, and shipped both halves to production (Vercel + Render) during the SDG hackathon.',
    year: '2026',
    stack: [
      'FastAPI',
      'scikit-learn',
      'Pandas',
      'NumPy',
      'React',
      'TypeScript',
      'Vite',
      'Render',
      'Python',
      'Vercel',
    ],
    metric: { value: 'R² = 0.879', label: 'RUL prediction on 2,716 NASA cycles' },
    links: {
      demo: 'https://sdg-hackthon.vercel.app/',
      repo: 'https://github.com/pulkittaneja09/sdg-hackthon',
      api: 'https://sdg-hackathon.onrender.com/',
    },
    // Captured from the live demo. TODO(pulkit): an analytics-dashboard view
    // (after a CSV upload) would show the ML output better than the landing page.
    preview: '/previews/scrap-2-spark.webp',
    emphasis: 'standard',
    tags: ['Machine learning', 'Backend', 'Sustainability'],
    detail: {
      overview: [
        'Scrap 2 Spark turns raw lithium-ion telemetry into a decision. Upload a cycle-level CSV and the service validates it, engineers degradation features, runs inference, and returns remaining useful life with a confidence score, a battery grade, a risk category and a recommended second-life application.',
        'Trained on the NASA Battery Dataset — 2,716 charge/discharge cycles across 34 cells — the Random Forest regressor reaches R² = 0.879 on held-out data.',
      ],
      highlights: [
        'Random Forest regressor chosen for structured telemetry: it handles the nonlinear capacity-fade relationship, resists overfitting on a small cell count, and needs minimal preprocessing.',
        'Feature engineering over raw cycles — capacity degradation trend, voltage stability, temperature variance and current consistency — rather than feeding the model raw readings.',
        'Production-shaped REST API: CSV validation, typed responses, and health reports generated per battery instead of a bare prediction float.',
        'Full second-life pipeline: RUL → risk classification → deployment recommendation → sustainability impact, so the output is actionable, not just a number.',
      ],
      challenges: [
        {
          title: 'Thirty-four cells is a small training set',
          body: 'Per-cell variance in battery data is large and cells are few, so a high-variance model memorises individual batteries. Engineering trend features across each cell’s cycle history — rather than per-cycle snapshots — gave the forest signal that generalises across cells.',
        },
        {
          title: 'A hackathon demo that survives a cold backend',
          body: 'The frontend sits on Vercel and the API on Render’s free tier, which sleeps. The client handles the cold-start delay explicitly with request state in the UI, so a judge clicking through never sees a silent failure.',
        },
      ],
      next: [
        'Compare against gradient boosting and a small sequence model on the same split.',
        'Report prediction intervals, not just a point estimate and confidence score.',
        'Persist uploaded fleets so degradation can be tracked over time.',
        // TODO(pulkit): add anything else you plan here.
      ],
      architecture: {
        caption: 'Telemetry CSV → validation → engineered features → Random Forest → graded report.',
        nodes: [
          { id: 'csv', label: 'Telemetry CSV', note: 'cycle-level', col: 0, row: 1, tone: 'client' },
          { id: 'ui', label: 'React + Vite', note: 'Vercel', col: 1, row: 1, tone: 'client' },
          { id: 'api', label: 'FastAPI', note: 'Render', col: 2, row: 1, tone: 'service' },
          {
            id: 'feat',
            label: 'Feature engineering',
            note: 'degradation trend',
            col: 3,
            row: 0,
            tone: 'service',
          },
          { id: 'model', label: 'Random Forest', note: 'scikit-learn', col: 4, row: 0, tone: 'model' },
          { id: 'report', label: 'Health report', note: 'RUL · risk · reuse', col: 4, row: 2, tone: 'store' },
        ],
        edges: [
          { from: 'csv', to: 'ui', label: 'upload' },
          { from: 'ui', to: 'api', label: 'POST' },
          { from: 'api', to: 'feat', label: 'validate' },
          { from: 'feat', to: 'model', label: 'features' },
          { from: 'model', to: 'report', label: 'RUL' },
          { from: 'report', to: 'ui', label: 'dashboard' },
        ],
      },
    },
  },
  {
    slug: 'knowledgehub-ai',
    name: 'KnowledgeHub AI',
    problem:
      'Enterprise knowledge is locked inside PDFs nobody reads, and a plain LLM asked about them confidently invents answers.',
    oneLiner: 'Plain LLMs invent answers about your documents.',
    built:
      'A RAG assistant that ingests enterprise PDFs, embeds and indexes them in ChromaDB, and answers natural-language questions with cited, retrieval-grounded responses from Gemini 2.5 Flash.',
    role: 'Built the end-to-end LangChain ingestion and retrieval pipeline, the FastAPI service and the React client, then deployed across Render and Vercel.',
    year: '2026',
    stack: [
      'FastAPI',
      'LangChain',
      'ChromaDB',
      'Gemini 2.5 Flash',
      'Google Embeddings',
      'React',
      'Vite',
      'Python',
      'Vercel',
    ],
    metric: { value: 'Cited answers', label: 'every response traced to source chunks' },
    links: {
      demo: 'https://knowledgehub-ai-pulkit.vercel.app/',
      repo: 'https://github.com/pulkittaneja09/Enterprise-Knowledge-Assistant',
    },
    // Captured from the live demo. TODO(pulkit): a screenshot of a cited answer
    // would make an even stronger thumbnail.
    preview: '/previews/knowledgehub-ai.webp',
    emphasis: 'standard',
    tags: ['RAG', 'LangChain', 'Backend'],
    detail: {
      overview: [
        'KnowledgeHub AI is a document-intelligence service: upload enterprise PDFs, and ask questions about them in plain language. Retrieval runs before generation, so answers arrive with citations back to the source chunks and hallucinations drop sharply versus prompting the model directly.',
        'The ingestion path is text extraction → chunking → Google Embeddings → ChromaDB. The query path embeds the question, runs semantic similarity search, assembles the retrieved context, and only then calls Gemini 2.5 Flash.',
      ],
      highlights: [
        'LangChain RAG pipeline with Google Embeddings and a ChromaDB vector store for similarity search.',
        'Grounded generation with source citations, so a reader can check the claim against the document.',
        'FastAPI ingestion endpoints handling upload, extraction, chunking and indexing as a single pipeline.',
        'Served two ways — a React + Vite client and a Streamlit surface for quick internal testing.',
      ],
      challenges: [
        {
          title: 'Chunking decides answer quality',
          body: 'Chunks that are too small lose the context a question needs; too large and similarity search returns mostly noise. Tuning chunk size and overlap against real enterprise PDFs mattered far more to answer quality than any prompt change.',
        },
        {
          title: 'Grounding the model instead of trusting it',
          body: 'Gemini will answer from parametric memory if you let it. The prompt assembles retrieved context explicitly and asks for citations, which makes an ungrounded answer visible rather than plausible.',
        },
      ],
      next: [
        'Hybrid retrieval — BM25 alongside dense vectors — for queries that hinge on exact identifiers.',
        'A reranking pass over retrieved chunks before prompt assembly.',
        'Per-document access control so teams only query what they own.',
      ],
      architecture: {
        caption: 'Retrieval happens before generation; the model never answers unaided.',
        nodes: [
          { id: 'pdf', label: 'Enterprise PDFs', note: 'upload', col: 0, row: 0, tone: 'client' },
          { id: 'ui', label: 'React + Vite', note: 'question', col: 0, row: 2, tone: 'client' },
          { id: 'api', label: 'FastAPI', note: 'Render', col: 1, row: 1, tone: 'service' },
          { id: 'chunk', label: 'Chunk + embed', note: 'Google Embeddings', col: 2, row: 0, tone: 'service' },
          { id: 'chroma', label: 'ChromaDB', note: 'vector store', col: 3, row: 1, tone: 'store' },
          { id: 'llm', label: 'Gemini 2.5 Flash', note: 'cited answer', col: 4, row: 1, tone: 'model' },
        ],
        edges: [
          { from: 'pdf', to: 'api', label: 'ingest' },
          { from: 'ui', to: 'api', label: 'ask' },
          { from: 'api', to: 'chunk' },
          { from: 'chunk', to: 'chroma', label: 'index' },
          { from: 'api', to: 'chroma', label: 'similarity search' },
          { from: 'chroma', to: 'llm', label: 'context' },
          { from: 'llm', to: 'ui', label: 'answer + sources' },
        ],
      },
    },
  },
  {
    slug: 'ieee-recruitment-backend',
    name: 'IEEE Recruitment Backend',
    problem:
      'The IEEE Computer Society VIT Chennai recruitment cycle needed to take in a thousand-plus applications without losing one or leaking an applicant’s data.',
    oneLiner: 'One application window, no lost or leaked data.',
    built:
      'A Go service (Gin + PostgreSQL) exposing the recruitment portal’s REST API: JWT authentication, request validation, structured error handling, SQL migrations and Docker deployment.',
    role: 'Backend developer on the society team — built and reviewed API routes, middleware and CLI tooling through pull requests.',
    year: '2025',
    stack: ['Go', 'Gin', 'PostgreSQL', 'JWT', 'Docker', 'REST'],
    metric: { value: '1,000+', label: 'applicants handled in the 2025 cycle' },
    links: {
      repo: 'https://github.com/pulkittaneja09/recruitment-backend',
      // TODO(pulkit): add the live portal URL here if it is still public.
    },
    // TODO(pulkit): no UI to screenshot — a snippet of the API surface or an
    // ER diagram would work well here as public/previews/ieee-backend.webp.
    preview: null,
    emphasis: 'wide',
    tags: ['Go', 'Backend', 'Open source'],
    detail: {
      overview: [
        'The recruitment portal backend is the least glamorous and most instructive thing in this list: a real service, used once, under deadline, by a thousand-plus people who could not be asked to try again.',
        'Written in Go with Gin and PostgreSQL, structured into routes, models, middleware and database layers, with a connection pool sized by environment and migrations kept in version control.',
      ],
      highlights: [
        'Secure REST endpoints with JWT authentication, configurable expiry and bcrypt-hashed credentials.',
        'Request validation and consistent error handling, so a malformed application fails loudly at the boundary.',
        'CLI utilities for operational tasks — JWT secret generation and password hashing — shipped as a standalone binary.',
        'Dockerised deployment plus a unit-tested utility layer and a Makefile for repeatable builds.',
        'Worked inside a team workflow: forks, semantic commits, pull-request review and `go fmt` as a gate.',
      ],
      challenges: [
        {
          title: 'A deadline you cannot redeploy past',
          body: 'A recruitment window opens once. Configuration had to come entirely from the environment with sane development defaults, and connection pool bounds had to be set deliberately, because there is no second chance to tune under load.',
        },
        {
          title: 'Collaborating on a shared codebase',
          body: 'This was the first codebase where my work went through other people’s review. Semantic commits, formatted code and narrow PRs stopped being style advice and became the thing that let several people ship into one service at once.',
        },
      ],
      next: [
        'Add a migration tool rather than hand-run SQL files.',
        'Structured request logging and rate limiting at the edge.',
        'Integration tests against a throwaway Postgres container in CI.',
      ],
      architecture: {
        caption: 'Middleware authenticates and validates before a handler ever touches the database.',
        nodes: [
          { id: 'client', label: 'Portal client', note: 'applicants', col: 0, row: 1, tone: 'client' },
          { id: 'gin', label: 'Gin router', note: 'Go', col: 1, row: 1, tone: 'service' },
          { id: 'mw', label: 'Middleware', note: 'JWT · validation', col: 2, row: 0, tone: 'service' },
          {
            id: 'handlers',
            label: 'Handlers',
            note: 'users · applications',
            col: 3,
            row: 1,
            tone: 'service',
          },
          { id: 'pg', label: 'PostgreSQL', note: 'pooled · migrated', col: 4, row: 1, tone: 'store' },
        ],
        edges: [
          { from: 'client', to: 'gin', label: 'HTTPS' },
          { from: 'gin', to: 'mw', label: 'authenticate' },
          { from: 'mw', to: 'handlers', label: 'authorized' },
          { from: 'handlers', to: 'pg', label: 'SQL' },
        ],
      },
    },
  },
];

export const sideProjects: SideProject[] = [
  {
    name: 'Fake News Detection',
    blurb: 'TF-IDF + logistic regression over a 20,800-article corpus, evaluated on a held-out split.',
    oneLiner: 'TF-IDF + logistic regression',
    metric: '97.9% test accuracy',
    stack: ['Python', 'scikit-learn', 'NLP', 'TF-IDF'],
    repo: 'https://github.com/pulkittaneja09/fake-news-detection',
  },
  {
    name: 'Fake Job Detector',
    blurb: 'Random Forest classifier flagging fraudulent job postings from listing text.',
    oneLiner: 'Random Forest on listing text',
    metric: '~93% accuracy',
    stack: ['Python', 'scikit-learn', 'NLP'],
    repo: 'https://github.com/pulkittaneja09/Fake-Job-Detector-Training',
  },
  {
    name: 'AI Email Agent',
    blurb: 'Agent that reads an inbox and drafts contextual replies with tool-calling.',
    oneLiner: 'Reads an inbox, drafts replies',
    stack: ['Python', 'AI agents', 'LLM'],
    repo: 'https://github.com/pulkittaneja09/ai-email-agent',
  },
  {
    name: 'Go Movies API',
    blurb: 'RESTful CRUD service in Go with Gorilla Mux and JSON responses.',
    oneLiner: 'REST CRUD service in Go',
    stack: ['Go', 'Gorilla Mux', 'REST'],
    repo: 'https://github.com/pulkittaneja09/Go-Movies-API',
  },
  {
    name: 'genai-core',
    blurb: 'Working notes and reference implementations for LLM primitives I use elsewhere.',
    oneLiner: 'Reference LLM primitives',
    stack: ['Python', 'LangChain'],
    repo: 'https://github.com/pulkittaneja09/genai-core',
  },
  {
    name: 'agentic-ai',
    blurb: 'Notebook experiments on agent loops, tool routing and multi-step planning.',
    oneLiner: 'Agent-loop and planning notebooks',
    stack: ['Python', 'LangGraph', 'Jupyter'],
    repo: 'https://github.com/pulkittaneja09/agentic-ai',
  },
];

export const experience: ExperienceItem[] = [
  {
    org: 'Audaxity Technologies',
    role: 'Co-founder & CEO',
    start: 'Mar 2026',
    end: 'Present',
    location: 'Chennai, India',
    kind: 'founder',
    bullets: [
      'Pitched and secured incubation under V-NEST, VIT Chennai, to build an AI-powered Academic Intelligence Platform for higher-education institutions.',
      'Built and shipped the MVP with Whisper-based speech-to-text, AI-powered knowledge generation and automated syllabus mapping.',
    ],
    impact: [
      'Pitched and won V-NEST incubation for an AI academic-intelligence platform, now DPIIT-recognised.',
      'Shipped the MVP: Whisper speech-to-text, AI knowledge generation and automated syllabus mapping.',
    ],
    stack: ['Whisper', 'Python', 'FastAPI', 'LLMs'],
    // TODO(pulkit): point this at the Audaxity site once it is live.
    href: '#founder',
  },
  {
    org: 'SDG Corporation',
    role: 'AI & Hyper Automation Intern',
    start: 'Jun 2026',
    end: 'Jul 2026',
    location: 'Noida, India',
    kind: 'internship',
    bullets: [
      'Developed an MCP server exposing 10+ enterprise tools and built LangGraph agent workflows for intent-based tool routing, accelerating internal ITSM service resolution across the company’s platforms.',
      'Built Python/FastAPI integrations for automated ticket creation, retrieval, updates and workflow execution, replacing manual intervention across enterprise ITSM systems.',
    ],
    impact: [
      'Built an MCP server exposing 10+ enterprise tools, with LangGraph agents routing each request by intent.',
      'Automated ITSM ticket creation, retrieval and updates with Python/FastAPI integrations.',
    ],
    stack: ['MCP', 'LangGraph', 'Python', 'FastAPI', 'ITSM'],
    // TODO(pulkit): add the company URL as `href` to make this row a link.
  },
  {
    org: 'Dezors',
    role: 'Backend & AI/LLM Engineer Intern',
    start: 'Nov 2025',
    end: 'Apr 2026',
    location: 'Remote',
    kind: 'internship',
    bullets: [
      'Built a Gemini-powered content generation pipeline that turned user prompts into structured slide content, automating end-to-end PowerPoint creation for decks of up to 50 slides.',
      'Designed and deployed a FastAPI backend powering an AI-driven Microsoft 365 alternative, configuring Nginx as a reverse proxy for production traffic on a VPS.',
    ],
    impact: [
      'Built a Gemini pipeline that turns one prompt into a structured deck of up to 50 slides.',
      'Deployed the FastAPI backend for an AI Microsoft 365 alternative behind Nginx on a VPS.',
    ],
    stack: ['FastAPI', 'Google Gemini', 'Nginx', 'Linux', 'VPS'],
    // TODO(pulkit): add the company URL as `href` to make this row a link.
  },
];

export const venture: Venture = {
  name: 'Audaxity Technologies',
  role: 'Co-founder & CEO',
  since: 'March 2026',
  pitch:
    'An AI-powered Academic Intelligence Platform for higher-education institutions — turning what happens in a lecture hall into structured, searchable, syllabus-mapped knowledge.',
  mission: 'Lectures in, syllabus-mapped *knowledge* out.',
  pipeline: {
    stages: ['Lecture', 'Transcript', 'Knowledge', 'Syllabus coverage'],
  },
  badges: [
    {
      label: 'Incubated at V-NEST',
      detail: 'VIT Chennai’s technology business incubator. Pitched and secured the incubation.',
    },
    {
      label: 'DPIIT-recognised',
      detail: 'Recognised startup under India’s Department for Promotion of Industry and Internal Trade.',
      // TODO(pulkit): add the DPIIT recognition number and date — a recruiter
      // reading closely will look for it, and it is strong proof.
    },
  ],
  building: [
    {
      title: 'Lecture capture to knowledge',
      body: 'Whisper-based speech-to-text turns recorded teaching into transcripts the rest of the pipeline can reason over.',
    },
    {
      title: 'AI knowledge generation',
      body: 'Transcripts become structured study material — summaries, notes and question sets generated per session rather than written by hand.',
    },
    {
      title: 'Automated syllabus mapping',
      body: 'Generated knowledge is mapped back against the official syllabus automatically, so an institution can see coverage instead of assuming it.',
    },
  ],
  stack: ['Whisper', 'Python', 'FastAPI', 'LLMs', 'Vector search'],
};

/**
 * The Skills section, the terminal's `skills` command and the Ask widget all
 * read this. Cross-checked against the résumé's Technical Skills and the
 * stacks in this file; nothing here is aspirational.
 *
 * "Used in" is never typed: lib/skills.ts matches each skill (its name, or
 * its `aliases`) against the real `stack` and `tags` of the projects, roles
 * and side projects in this file. A skill with no match is still listed, it
 * just has no tooltip and is not clickable. `icon` is a Simple Icons slug in
 * public/skills.svg (regenerate with `npm run icons`).
 */
export const skillGroups: SkillGroup[] = [
  {
    id: 'ai',
    title: 'AI / ML',
    items: [
      { name: 'LangChain', icon: 'langchain' },
      { name: 'LangGraph', icon: 'langgraph' },
      { name: 'AI Agents', aliases: ['AI agents'] },
      { name: 'MCP', icon: 'modelcontextprotocol' },
      { name: 'RAG' },
      { name: 'ChromaDB' },
      { name: 'Embeddings', aliases: ['Embeddings', 'Google Embeddings'] },
      {
        name: 'LLM APIs (Claude, Gemini)',
        aliases: ['Claude', 'Google Gemini', 'Gemini 2.5 Flash', 'LLM', 'LLMs'],
      },
      { name: 'Whisper' },
      { name: 'scikit-learn', icon: 'scikitlearn' },
      { name: 'Pandas', icon: 'pandas' },
      { name: 'NumPy', icon: 'numpy' },
      { name: 'NLP (TF-IDF)', aliases: ['NLP', 'TF-IDF'] },
    ],
  },
  {
    id: 'backend',
    title: 'Backend',
    items: [
      { name: 'FastAPI', icon: 'fastapi' },
      { name: 'Go', icon: 'go', aliases: ['Go', 'Gin', 'Gorilla Mux'] },
      { name: 'Node.js', icon: 'nodedotjs' },
      { name: 'Express', icon: 'express' },
      { name: 'PostgreSQL', icon: 'postgresql' },
      { name: 'MongoDB', icon: 'mongodb' },
      { name: 'SQLite', icon: 'sqlite' },
      { name: 'REST APIs', aliases: ['REST'] },
    ],
  },
  {
    id: 'languages',
    title: 'Languages',
    items: [
      { name: 'Python', icon: 'python' },
      { name: 'Go', icon: 'go', aliases: ['Go', 'Gin', 'Gorilla Mux'] },
      { name: 'TypeScript / JavaScript', icon: 'typescript', aliases: ['TypeScript', 'JavaScript'] },
      { name: 'Java', icon: 'openjdk' },
      { name: 'C / C++', icon: 'cplusplus' },
    ],
  },
  {
    id: 'infra',
    title: 'Infra & Ops',
    items: [
      { name: 'Docker', icon: 'docker' },
      { name: 'Linux', icon: 'linux' },
      { name: 'Nginx', icon: 'nginx' },
      { name: 'Vercel', icon: 'vercel' },
      { name: 'Render', icon: 'render' },
      { name: 'Git', icon: 'git' },
      { name: 'Postman', icon: 'postman' },
    ],
  },
  {
    id: 'frontend',
    title: 'Frontend',
    items: [
      { name: 'React', icon: 'react' },
      { name: 'Vite', icon: 'vite' },
      { name: 'Tailwind CSS', icon: 'tailwindcss' },
    ],
  },
  {
    id: 'core',
    title: 'CS Core',
    items: [{ name: 'DSA' }, { name: 'OOP' }, { name: 'DBMS' }, { name: 'Operating Systems' }],
  },
];
