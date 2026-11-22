import { execSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import type { Logger, Plugin } from 'vite';
import { readNotes, rssFeed } from './notes';
import type { Note } from './notes';

/**
 * Build-time site data, so the page itself never calls a third-party API:
 *
 * - `virtual:site-stats`: the LeetCode solved count and the public GitHub repo
 *   count, fetched once per build (CORS and rate limits cannot touch the page),
 *   plus the date of the last commit for the footer's "Last updated".
 *   A failed fetch falls back to the last good value cached in
 *   node_modules/.cache, then to `null`, and the page renders without the number.
 * - `__SITE_URL__` in index.html becomes `profile.siteUrl`, so canonical, Open
 *   Graph and JSON-LD URLs come from one place.
 * - sitemap.xml (every route, including each case study) and robots.txt are
 *   generated into the build.
 * - `virtual:notes`: the Markdown notes in content/notes, rendered to HTML
 *   (config/notes.ts). Drafts only in dev (or with NOTES_DRAFTS=1); the RSS
 *   feed, the sitemap entries and the feed <link> appear only once a note is
 *   published.
 */

export interface SiteStats {
  leetcodeSolved: number | null;
  publicRepos: number | null;
  /** ISO date of the last commit, or of the build if git is unavailable. */
  updated: string;
}

interface Options {
  siteUrl: string;
  routes: string[];
  leetcodeUser: string;
  githubUser: string;
  /** Optional, server-side only: raises the GitHub rate limit for the build. */
  githubToken?: string;
  notesDir: string;
  feed: { title: string; description: string };
}

const VIRTUAL_ID = 'virtual:site-stats';
const RESOLVED_ID = `\0${VIRTUAL_ID}`;
const NOTES_ID = 'virtual:notes';
const RESOLVED_NOTES = `\0${NOTES_ID}`;
const CACHE_FILE = resolve('node_modules/.cache/site-stats.json');
const TIMEOUT_MS = 6000;

async function fetchLeetCodeSolved(user: string): Promise<number> {
  const response = await fetch('https://leetcode.com/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Referer: `https://leetcode.com/u/${user}/` },
    body: JSON.stringify({
      query:
        'query($username: String!) { matchedUser(username: $username) { submitStatsGlobal { acSubmissionNum { difficulty count } } } }',
      variables: { username: user },
    }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const json = (await response.json()) as {
    data?: {
      matchedUser?: { submitStatsGlobal?: { acSubmissionNum?: { difficulty: string; count: number }[] } };
    };
  };
  const all = json.data?.matchedUser?.submitStatsGlobal?.acSubmissionNum?.find((d) => d.difficulty === 'All');
  if (!all || typeof all.count !== 'number' || all.count <= 0)
    throw new Error('no solved count in the response');
  return all.count;
}

async function fetchPublicRepos(user: string, token?: string): Promise<number> {
  const response = await fetch(`https://api.github.com/users/${user}`, {
    headers: {
      Accept: 'application/vnd.github+json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const json = (await response.json()) as { public_repos?: unknown };
  if (typeof json.public_repos !== 'number') throw new Error('no public_repos in the response');
  return json.public_repos;
}

type CachedCounts = Partial<Pick<SiteStats, 'leetcodeSolved' | 'publicRepos'>>;

function readCache(): CachedCounts {
  try {
    return JSON.parse(readFileSync(CACHE_FILE, 'utf8')) as CachedCounts;
  } catch {
    return {};
  }
}

function writeCache(counts: CachedCounts) {
  try {
    mkdirSync(dirname(CACHE_FILE), { recursive: true });
    writeFileSync(CACHE_FILE, JSON.stringify(counts));
  } catch {
    // A read-only node_modules only costs the fallback, never the build.
  }
}

function lastCommitDate(): string {
  try {
    const date = execSync('git log -1 --format=%cI', { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim();
    if (date) return date;
  } catch {
    // Not a git checkout: fall through to the build date.
  }
  return new Date().toISOString();
}

async function collect(options: Options, logger: Logger): Promise<SiteStats> {
  const cached = readCache();
  const [leetcode, github] = await Promise.allSettled([
    fetchLeetCodeSolved(options.leetcodeUser),
    fetchPublicRepos(options.githubUser, options.githubToken),
  ]);

  const pick = (result: PromiseSettledResult<number>, fallback: number | null | undefined, name: string) => {
    if (result.status === 'fulfilled') {
      logger.info(`[site] ${name}: ${result.value}`);
      return result.value;
    }
    const reason = result.reason instanceof Error ? result.reason.message : String(result.reason);
    const value = typeof fallback === 'number' ? fallback : null;
    logger.info(`[site] ${name} unavailable (${reason}); using ${value ?? 'no number'}`);
    return value;
  };

  const stats: SiteStats = {
    leetcodeSolved: pick(leetcode, cached.leetcodeSolved, 'LeetCode solved'),
    publicRepos: pick(github, cached.publicRepos, 'GitHub public repos'),
    updated: lastCommitDate(),
  };
  writeCache({ leetcodeSolved: stats.leetcodeSolved, publicRepos: stats.publicRepos });
  return stats;
}

function sitemap(siteUrl: string, routes: string[], updated: string) {
  const day = updated.slice(0, 10);
  const urls = routes
    .map(
      (route) =>
        `  <url>\n    <loc>${siteUrl}${route}</loc>\n    <lastmod>${day}</lastmod>\n    <priority>${route === '/' ? '1.0' : '0.8'}</priority>\n  </url>`,
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

export function site(options: Options): Plugin {
  let stats: Promise<SiteStats> | null = null;
  let logger: Logger;
  const getStats = () => (stats ??= collect(options, logger));

  const notesDir = resolve(options.notesDir);
  let includeDrafts = false;
  let notes: Note[] = [];
  const published = () => notes.filter((note) => !note.draft);

  return {
    name: 'portfolio-site',
    configResolved(config) {
      logger = config.logger;
      includeDrafts = config.command === 'serve' || process.env.NOTES_DRAFTS === '1';
      notes = readNotes(notesDir, includeDrafts);
    },
    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID;
      if (id === NOTES_ID) return RESOLVED_NOTES;
      return null;
    },
    async load(id) {
      if (id === RESOLVED_NOTES) return `export default ${JSON.stringify(notes)};`;
      if (id !== RESOLVED_ID) return null;
      return `export default ${JSON.stringify(await getStats())};`;
    },
    transformIndexHtml: {
      order: 'pre',
      handler: (html) => ({
        html: html.replaceAll('__SITE_URL__', options.siteUrl),
        // Advertise the feed only once there is something in it.
        tags: published().length
          ? [
              {
                tag: 'link',
                attrs: {
                  rel: 'alternate',
                  type: 'application/rss+xml',
                  title: options.feed.title,
                  href: '/rss.xml',
                },
                injectTo: 'head',
              },
            ]
          : [],
      }),
    },
    // Editing a note in dev reloads the page with the new text.
    configureServer(server) {
      server.watcher.add(notesDir);
      const refresh = (file: string) => {
        if (!resolve(file).startsWith(notesDir)) return;
        notes = readNotes(notesDir, includeDrafts);
        const module = server.moduleGraph.getModuleById(RESOLVED_NOTES);
        if (module) server.moduleGraph.invalidateModule(module);
        server.ws.send({ type: 'full-reload' });
      };
      server.watcher.on('add', refresh);
      server.watcher.on('change', refresh);
      server.watcher.on('unlink', refresh);
    },
    async generateBundle() {
      const { updated } = await getStats();
      const live = published();
      const routes = live.length
        ? [...options.routes, '/notes', ...live.map((note) => `/notes/${note.slug}`)]
        : options.routes;
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: sitemap(options.siteUrl, routes, updated),
      });
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\n\nSitemap: ${options.siteUrl}/sitemap.xml\n`,
      });
      if (live.length) {
        this.emitFile({
          type: 'asset',
          fileName: 'rss.xml',
          source: rssFeed(options.siteUrl, options.feed.title, options.feed.description, live),
        });
      }
    },
  };
}
