import { Reveal } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';
import { ArrowUpRightIcon, ForkIcon, GitHubIcon, StarIcon } from '@/components/icons';
import { GITHUB_USERNAME } from '@/data/portfolio';
import { useTheme } from '@/hooks/useTheme';
import { formatRelativeDate, topRepos } from '@/lib/github';
import type { GitHubData } from '@/lib/github';

interface Props {
  state: {
    status: 'loading' | 'ready' | 'rate-limited' | 'error';
    data: GitHubData | null;
    error: string | null;
  };
}

/** Deterministic colour per language so the bar and the legend always agree. */
const LANGUAGE_COLORS: Record<string, string> = {
  Python: '#3572A5',
  Go: '#00ADD8',
  TypeScript: '#3178C6',
  JavaScript: '#F1E05A',
  'Jupyter Notebook': '#DA5B0B',
  'C++': '#F34B7D',
  C: '#555555',
  Java: '#B07219',
  HTML: '#E34C26',
  CSS: '#563D7C',
  Shell: '#89E051',
};

function colorFor(language: string): string {
  return LANGUAGE_COLORS[language] ?? 'rgb(var(--faint))';
}

function RepoRow({ repo }: { repo: GitHubData['repos'][number] }) {
  return (
    <li className="group bg-surface transition-colors hover:bg-elevated">
      <a
        href={repo.html_url}
        target="_blank"
        rel="noreferrer noopener"
        className="flex h-full flex-col p-4 sm:p-5"
      >
        <div className="flex items-start justify-between gap-3">
          <h4 className="truncate font-mono text-sm text-ink transition-colors group-hover:text-accent">
            {repo.name}
          </h4>
          <ArrowUpRightIcon className="h-4 w-4 shrink-0 text-faint transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" />
        </div>

        <p className="mt-2 line-clamp-2 flex-1 text-[0.8125rem] leading-relaxed text-muted">
          {repo.description ?? 'No description on the repo yet.'}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[0.6875rem] text-faint">
          {repo.language && (
            <span className="inline-flex items-center gap-1.5">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: colorFor(repo.language) }}
                aria-hidden
              />
              {repo.language}
            </span>
          )}
          {repo.stargazers_count > 0 && (
            <span className="inline-flex items-center gap-1">
              <StarIcon className="h-3.5 w-3.5" />
              {repo.stargazers_count}
            </span>
          )}
          {repo.forks_count > 0 && (
            <span className="inline-flex items-center gap-1">
              <ForkIcon className="h-3.5 w-3.5" />
              {repo.forks_count}
            </span>
          )}
          <span className="ml-auto">{formatRelativeDate(repo.updated_at)}</span>
        </div>
      </a>
    </li>
  );
}

function LanguageBar({ languages }: { languages: GitHubData['languages'] }) {
  const total = languages.reduce((sum, item) => sum + item.count, 0);
  if (total === 0) return null;

  const shown = languages.slice(0, 7);

  return (
    <div>
      <div className="flex h-2 w-full overflow-hidden rounded-full bg-elevated" role="img" aria-label="Language breakdown across public repositories">
        {shown.map((language) => (
          <span
            key={language.name}
            style={{
              width: `${(language.count / total) * 100}%`,
              backgroundColor: colorFor(language.name),
            }}
            title={`${language.name}: ${language.count} repos`}
          />
        ))}
      </div>

      <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
        {shown.map((language) => (
          <li key={language.name} className="inline-flex items-center gap-2 font-mono text-xs text-muted">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: colorFor(language.name) }}
              aria-hidden
            />
            {language.name}
            <span className="text-faint">{Math.round((language.count / total) * 100)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function GitHubActivity({ state }: Props) {
  const { theme } = useTheme();
  const dark = theme === 'dark';
  /**
   * ghchart bakes a light #eeeeee ground into the SVG, which looks wrong on a
   * near-black page. So in dark mode we ask for the *inverse* of the accent
   * (invert(200,255,46) = 3700d1) and invert the whole image in CSS: the
   * ground lands on near-black and the filled cells come back out as lime.
   */
  const chartColor = dark ? '3700d1' : '4d7c0f';

  return (
    <section
      id="github"
      aria-labelledby="github-title"
      className="scroll-mt-24 border-t border-line py-24 sm:py-28"
    >
      <div className="shell">
        <SectionHeading
          index="05"
          eyebrow="Activity"
          title={<span id="github-title">Live from GitHub.</span>}
          lede="Pulled from the GitHub API when you load the page, then cached for the session — not a screenshot from six months ago."
          aside={
            <a
              href={`https://github.com/${GITHUB_USERNAME}`}
              target="_blank"
              rel="noreferrer noopener"
              className="group inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 font-mono text-xs text-muted transition-colors hover:border-accent/50 hover:text-ink"
            >
              <GitHubIcon className="h-4 w-4" />
              @{GITHUB_USERNAME}
              <ArrowUpRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          }
        />

        {/* ── Contribution graph ─────────────────────────────────────────── */}
        <Reveal>
          <div className="card overflow-x-auto p-5 sm:p-6">
            <p className="eyebrow">Contributions, last year</p>
            <img
              // Third-party image service; a failure here must not break the
              // section, so it simply hides itself.
              src={`https://ghchart.rshah.org/${chartColor}/${GITHUB_USERNAME}`}
              alt={`GitHub contribution graph for ${GITHUB_USERNAME} over the last year`}
              width={663}
              height={104}
              loading="lazy"
              decoding="async"
              style={dark ? { filter: 'invert(1)' } : undefined}
              className="mt-4 h-auto w-full min-w-[34rem] opacity-90"
              onError={(event) => {
                event.currentTarget.closest('div')?.classList.add('hidden');
              }}
            />
          </div>
        </Reveal>

        {/* ── Profile stats, languages, repos ────────────────────────────── */}
        {state.status === 'loading' && (
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="card h-36 animate-pulse bg-elevated/60" />
            ))}
            <p className="sr-only">Loading GitHub activity…</p>
          </div>
        )}

        {(state.status === 'rate-limited' || state.status === 'error') && (
          <Reveal className="mt-5">
            <div className="card p-6">
              <p className="font-display text-base">Live repository data is unavailable right now.</p>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
                {state.error}{' '}
                {state.status === 'rate-limited'
                  ? 'The contribution graph above is unaffected.'
                  : 'Everything else on this page is static and unaffected.'}
              </p>
              <a
                href={`https://github.com/${GITHUB_USERNAME}?tab=repositories`}
                target="_blank"
                rel="noreferrer noopener"
                className="group mt-5 inline-flex items-center gap-2 rounded-full border border-accent/55 px-4 py-2 text-sm transition-colors hover:bg-accent/10"
              >
                Browse the repositories on GitHub
                <ArrowUpRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </Reveal>
        )}

        {state.status === 'ready' && state.data && (
          <>
            <Reveal className="mt-5">
              <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
                <div className="card p-5 sm:p-6">
                  <p className="eyebrow">Profile</p>
                  <dl className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <dt className="font-mono text-[0.625rem] uppercase tracking-[0.12em] text-faint">
                        Public repos
                      </dt>
                      <dd className="mt-1 font-display text-2xl text-accent">
                        {state.data.user.public_repos}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-mono text-[0.625rem] uppercase tracking-[0.12em] text-faint">
                        Followers
                      </dt>
                      <dd className="mt-1 font-display text-2xl text-ink">
                        {state.data.user.followers}
                      </dd>
                    </div>
                    <div className="col-span-2">
                      <dt className="font-mono text-[0.625rem] uppercase tracking-[0.12em] text-faint">
                        On GitHub since
                      </dt>
                      <dd className="mt-1 font-mono text-sm text-muted">
                        {new Date(state.data.user.created_at).toLocaleDateString(undefined, {
                          month: 'long',
                          year: 'numeric',
                        })}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="card p-5 sm:p-6">
                  <p className="eyebrow">Languages across {state.data.repos.length} repos</p>
                  <div className="mt-5">
                    <LanguageBar languages={state.data.languages} />
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal className="mt-5">
              <ul className="grid gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
                {topRepos(state.data.repos, 6).map((repo) => (
                  <RepoRow key={repo.id} repo={repo} />
                ))}
              </ul>
            </Reveal>
          </>
        )}
      </div>
    </section>
  );
}
