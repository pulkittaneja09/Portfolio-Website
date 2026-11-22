import { execSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import type { Logger, Plugin } from 'vite';

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
}

const VIRTUAL_ID = 'virtual:site-stats';
const RESOLVED_ID = `\0${VIRTUAL_ID}`;
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

  return {
    name: 'portfolio-site',
    configResolved(config) {
      logger = config.logger;
    },
    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID;
      return null;
    },
    async load(id) {
      if (id !== RESOLVED_ID) return null;
      return `export default ${JSON.stringify(await getStats())};`;
    },
    transformIndexHtml: {
      order: 'pre',
      handler: (html) => html.replaceAll('__SITE_URL__', options.siteUrl),
    },
    async generateBundle() {
      const { updated } = await getStats();
      const routes = options.routes;
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
    },
  };
}
