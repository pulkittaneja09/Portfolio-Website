import { GITHUB_USERNAME } from '@/data/portfolio';

/** Shapes trimmed to the fields the UI actually renders. */
export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  fork: boolean;
  archived: boolean;
  topics?: string[];
}

export interface GitHubUser {
  login: string;
  name: string | null;
  avatar_url: string;
  public_repos: number;
  followers: number;
  html_url: string;
  created_at: string;
}

export interface GitHubData {
  user: GitHubUser;
  repos: GitHubRepo[];
  /** Repo count per language, highest first. */
  languages: { name: string; count: number }[];
  fetchedAt: number;
}

const CACHE_KEY = 'pt-github-v1';
const CACHE_TTL_MS = 1000 * 60 * 60 * 6; // six hours: the data barely moves.
const API = 'https://api.github.com';

interface Cached {
  data: GitHubData;
  expiresAt: number;
}

function readCache(): GitHubData | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const cached = JSON.parse(raw) as Cached;
    if (cached.expiresAt < Date.now()) return null;
    return cached.data;
  } catch {
    // Private mode, quota, or a stale shape — just refetch.
    return null;
  }
}

function writeCache(data: GitHubData): void {
  try {
    sessionStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ data, expiresAt: Date.now() + CACHE_TTL_MS } satisfies Cached),
    );
  } catch {
    /* storage unavailable — the page works fine without the cache */
  }
}

function headers(): HeadersInit {
  const base: Record<string, string> = { Accept: 'application/vnd.github+json' };
  // Local-only convenience; never set this in a deployed environment.
  const token = import.meta.env.VITE_GITHUB_TOKEN;
  if (token) base.Authorization = `Bearer ${token}`;
  return base;
}

export class RateLimitError extends Error {
  constructor(public resetAt: Date | null) {
    super('GitHub API rate limit reached');
    this.name = 'RateLimitError';
  }
}

async function get<T>(path: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(`${API}${path}`, { headers: headers(), signal });

  if (response.status === 403 || response.status === 429) {
    const remaining = response.headers.get('x-ratelimit-remaining');
    if (remaining === '0') {
      const reset = response.headers.get('x-ratelimit-reset');
      throw new RateLimitError(reset ? new Date(Number(reset) * 1000) : null);
    }
  }

  if (!response.ok) {
    throw new Error(`GitHub API ${response.status} for ${path}`);
  }

  return (await response.json()) as T;
}

function summariseLanguages(repos: GitHubRepo[]): GitHubData['languages'] {
  const counts = new Map<string, number>();
  repos.forEach((repo) => {
    if (!repo.language) return;
    counts.set(repo.language, (counts.get(repo.language) ?? 0) + 1);
  });

  return [...counts.entries()].map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);
}

/**
 * Fetches the profile and repositories, falling back to a cached copy first.
 * Rate limits surface as a typed error so the UI can degrade rather than break.
 */
export async function fetchGitHubData(signal?: AbortSignal): Promise<GitHubData> {
  const cached = readCache();
  if (cached) return cached;

  const [user, repos] = await Promise.all([
    get<GitHubUser>(`/users/${GITHUB_USERNAME}`, signal),
    get<GitHubRepo[]>(`/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`, signal),
  ]);

  const visible = repos.filter((repo) => !repo.fork && !repo.archived);

  const data: GitHubData = {
    user,
    repos: visible,
    languages: summariseLanguages(visible),
    fetchedAt: Date.now(),
  };

  writeCache(data);
  return data;
}

