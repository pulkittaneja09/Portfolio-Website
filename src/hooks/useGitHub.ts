import { useEffect, useState } from 'react';
import { RateLimitError, fetchGitHubData } from '@/lib/github';
import type { GitHubData } from '@/lib/github';

type State =
  | { status: 'loading'; data: null; error: null }
  | { status: 'ready'; data: GitHubData; error: null }
  | { status: 'rate-limited'; data: null; error: string }
  | { status: 'error'; data: null; error: string };

/**
 * Loads GitHub data once per session. A failure is a state, not an exception:
 * the section renders a graceful message instead of disappearing.
 */
export function useGitHub(): State {
  const [state, setState] = useState<State>({ status: 'loading', data: null, error: null });

  useEffect(() => {
    const controller = new AbortController();

    fetchGitHubData(controller.signal)
      .then((data) => setState({ status: 'ready', data, error: null }))
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;

        if (error instanceof RateLimitError) {
          const when = error.resetAt
            ? error.resetAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : null;
          setState({
            status: 'rate-limited',
            data: null,
            error: when
              ? `GitHub's API rate limit for this network is spent. It resets around ${when}.`
              : "GitHub's API rate limit for this network is spent.",
          });
          return;
        }

        setState({
          status: 'error',
          data: null,
          error: error instanceof Error ? error.message : 'Could not reach the GitHub API.',
        });
      });

    return () => controller.abort();
  }, []);

  return state;
}
