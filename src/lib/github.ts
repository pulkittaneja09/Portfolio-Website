import { GITHUB_USERNAME } from '@/data/portfolio';

/** Trimmed to the fields the UI actually renders. */
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
  fetchedAt: number;
}

const CACHE_KEY = 'pt-github-v2';
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

/**
 * Fetches the public profile (one request), falling back to a cached copy
 * first. Rate limits surface as a typed error so the UI can degrade quietly
 * to the repo count in `portfolio.ts`.
 */
export async function fetchGitHubData(signal?: AbortSignal): Promise<GitHubData> {
  const cached = readCache();
  if (cached) return cached;

  const user = await get<GitHubUser>(`/users/${GITHUB_USERNAME}`, signal);
  const data: GitHubData = { user, fetchedAt: Date.now() };

  writeCache(data);
  return data;
}

