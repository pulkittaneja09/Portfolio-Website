# Build my portfolio website

You are building my personal portfolio. The main audience is **technical recruiters and startup founders hiring AI/ML and backend interns**. A recruiter spends 6 to 10 seconds deciding whether to keep reading, so in that time the site must show: who I am, what I build, and proof that it works (live demos, real metrics, real code). It should look memorable and crafted, not like a template, but clarity comes first and visual flair second.

## Step 0: Gather my real data first (do not invent anything)

1. Read `resume.pdf` in the project root. Pull out education, experience, projects, metrics, skills and links.
2. Fetch my GitHub data from `https://api.github.com/users/pulkittaneja09/repos?per_page=100&sort=updated`, or use `gh` if it's installed. For each strong repo, read its README to get the description, stack and demo links.
3. Put everything into **one typed data file**, `src/data/portfolio.ts`, and have all components render from it. I'll edit content there later without touching the UI.
4. If something is missing (a demo URL, a metric, a screenshot), leave a clear `// TODO(pulkit): ...` placeholder. **Never make up numbers, companies or links.**
5. Show me the extracted data and the planned section order before you write UI code.

### What you already know about me (cross-check against the resume)
- **Pulkit Taneja**: CS undergrad at VIT Chennai (2028), CGPA 8.25
- **Co-founder & CEO, Audaxity Technologies**: AI-powered Academic Intelligence Platform for universities. Incubated at V-NEST (VIT Chennai), DPIIT-recognised
- **AI & Hyper Automation Intern, SDG Corporation** (Jun–Jul 2026): backend, Model Context Protocol (MCP), AI workflows, enterprise automation
- **Backend & AI/LLM Engineer Intern, Dezors** (remote, Nov 2025 – Apr 2026)
- **Flagship projects:**
  - *Scrap 2 Spark*: AI battery-intelligence platform (SDG Hackathon). Random Forest model predicting remaining useful life of Li-ion batteries. React/TS/Vite on Vercel, FastAPI on Render. I built the API, the ML integration and the deployment.
  - *KnowledgeHub AI*: RAG-based enterprise assistant (LangChain/LangGraph, ChromaDB)
  - *IEEE Recruitment Website Backend*: Golang + PostgreSQL
  - *Fake News Detection*: 97.9% accuracy on 20,800 articles
- **Stack:** Python, Go, JavaScript/TypeScript, Java, C/C++ · LangChain, LangGraph, AI agents, MCP, RAG, ChromaDB · FastAPI, Node.js, PostgreSQL · Docker, Linux, Nginx · React, Vite
- GitHub: github.com/pulkittaneja09 · LinkedIn: linkedin.com/in/pulkit-taneja-627437366
- Community: ComputerSocietyVITC

## Tech stack (use exactly this)
- **Vite + React 18 + TypeScript** (strict mode)
- **Tailwind CSS** for styling, with CSS variables for theme tokens
- **Framer Motion** for animation
- **React Three Fiber + drei**, only for one hero element, lazy-loaded, with a static fallback
- `cmdk` for the command palette
- Deploy target: **Vercel** (add `vercel.json` if needed)
- No UI kit or template look. Write the components yourself.

## Design direction
- **Theme: "AI engineer's control room".** Dark by default (near-black, not pure #000), one sharp accent colour (electric lime, cyan or amber; pick one and stay consistent), plus a light mode toggle.
- **Type:** a characterful display font for headings (e.g. Space Grotesk or Clash Display), a clean sans for body text, and a mono font (JetBrains Mono) for code and terminal bits.
- **Layout:** asymmetric bento grid for projects, generous whitespace, strong hierarchy. Every section should be scannable in 2 seconds.
- **Motion:** subtle and purposeful. Staggered reveals on scroll, magnetic buttons, smooth hover states. Respect `prefers-reduced-motion` everywhere.

## Sections, in order
1. **Hero**: name, a one-line positioning statement (e.g. "I build AI agents and the backends that run them"), a small rotating line of roles (Founder · AI/Backend Engineer · MCP builder), and **three CTAs: View Projects, Download Resume, Contact**. On the side, an interactive 3D or particle element that reacts to the cursor: a node graph or neural mesh, nodding to agents and RAG. Add a status badge: "🟢 Open to AI/ML & backend internships, 2027".
2. **Proof bar**: an animated count-up strip of real numbers only (e.g. 97.9% model accuracy, 2 internships, 1 startup founded, number of public repos from GitHub).
3. **Featured projects (the most important section)**: a bento grid of 3 or 4 flagship projects. Each card shows:
   - the problem, in one line
   - what I built and my role
   - stack chips
   - a key metric or result
   - **Live demo** and **GitHub** buttons
   - a screenshot or looping preview on hover
   - Clicking a card opens a detail view (modal or `/projects/:slug`) with an architecture diagram (a simple SVG or Mermaid-style flow, e.g. React → FastAPI → ML model), challenges, and what I'd do next.
4. **Experience**: a vertical timeline (Audaxity, SDG, Dezors), each entry with 2 or 3 impact-first bullets (verb + what + result).
5. **Audaxity spotlight**: a short founder section covering what we're building, the V-NEST incubation and DPIIT recognition. This makes me stand out from other students, so give it its own visual treatment.
6. **Tech stack**: grouped (AI/ML, Backend, Languages, Infra, Frontend), using real logos (e.g. simple-icons) with a hover tooltip naming the projects where I used each tool. **No skill-percentage bars.**
7. **GitHub activity**: live data from the GitHub API (top repos by stars or recency, language breakdown), plus a contribution graph via an image service such as `ghchart.rshah.org`. Cache the result and handle rate limits without breaking.
8. **Contact**: email (copy-to-clipboard with a toast), LinkedIn, GitHub, resume download. A simple form using Formspree or EmailJS, with the key in `.env` as a placeholder.

## "Wow" features recruiters remember
- **⌘K / Ctrl+K command palette**: jump to sections, open projects, copy email, download resume, toggle theme.
- **Terminal mode**: a toggle (or the `` ` `` key) that opens an in-browser terminal. Commands: `help`, `whoami`, `projects`, `skills`, `experience`, `resume`, `contact`, `clear`, `sudo hire-pulkit` (as an easter egg). Built with my own React component, not a heavy library.
- **"Ask about Pulkit" widget (optional, build last)**: a small chat box that answers questions about me from `portfolio.ts`. Ship a fallback version with no API that does keyword matching over my data. Add a TODO where a real LLM call through a serverless function in `/api` could replace it. Never expose API keys on the client.
- A custom cursor on desktop only, a scroll progress bar, and section-aware nav highlighting.

## Non-negotiables (quality bar)
- **Lighthouse 95+** on Performance, Accessibility, Best Practices and SEO. Lazy-load the 3D, use optimised images (webp), keep the initial JS small.
- **Mobile-first and fully responsive.** Test at 360px, 768px and 1440px. Turn off 3D and the custom cursor on touch devices.
- **Accessibility:** semantic HTML, keyboard navigable, visible focus states, alt text, AA contrast.
- **SEO and sharing:** title and meta description, Open Graph and Twitter cards (generate an OG image with my name and title), favicon, `sitemap.xml`, `robots.txt`, JSON-LD `Person` schema.
- **Resume:** serve the PDF from `/public/Pulkit_Taneja_Resume.pdf`.
- Clean folder structure: `components/`, `sections/`, `data/`, `hooks/`, `lib/`. No `any` types. Run ESLint and Prettier.
- A README covering setup, how to edit content in `portfolio.ts`, and how to deploy to Vercel.

## How to work
1. Do Step 0 and show me the data and section plan. Wait for my OK.
2. Scaffold the project and the design tokens (colours, fonts, spacing). Show me the hero first.
3. Build the sections one at a time and commit after each (`feat: hero`, `feat: projects`, ...).
4. Add the wow features (command palette, then terminal, then chat widget last).
5. Finish with a performance, accessibility and mobile pass. Run `npm run build`, fix every warning, and report Lighthouse-relevant issues.

After each major step, tell me briefly what you did and what I should check in the browser (`npm run dev`).
