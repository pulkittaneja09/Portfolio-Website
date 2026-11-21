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

/**
 * Languages are told apart by how much light they hold, not by hue: the most
 * used language is the brightest step, each one after it a little dimmer.
 */
const LIGHT_STEPS = [0.85, 0.6, 0.42, 0.3, 0.2, 0.14, 0.09];

function shadeFor(rank: number): string {
  return `rgb(var(--light) / ${LIGHT_STEPS[Math.min(rank, LIGHT_STEPS.length - 1)]})`;
}

function RepoRow({ repo, rank }: { repo: GitHubData['repos'][number]; rank: number }) {
  return (
    <li className="group bg-bg transition-colors duration-400 ease-quiet hover:bg-elevated">
      <a
        href={repo.html_url}
        target="_blank"
        rel="noreferrer noopener"
        className="flex h-full flex-col p-5 sm:p-6"
      >
        <div className="flex items-start justify-between gap-3">
          <h3 className="truncate font-mono text-[0.8125rem] text-text">{repo.name}</h3>
          <ArrowUpRightIcon className="h-4 w-4 shrink-0 text-faint transition-[color,transform] duration-400 ease-quiet group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-text" />
        </div>

        <p className="mt-2 line-clamp-2 flex-1 text-[0.8125rem] leading-relaxed text-muted">
          {repo.description ?? 'No description on the repo yet.'}
        </p>

        <div className="meta mt-5 flex flex-wrap items-center gap-x-4 gap-y-1">
          {repo.language && (
            <span className="inline-flex items-center gap-1.5">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: shadeFor(rank) }}
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
      <div
        className="flex h-1.5 w-full gap-[2px] overflow-hidden rounded-full"
        role="img"
        aria-label="Language breakdown across public repositories"
      >
        {shown.map((language, i) => (
          <span
            key={language.name}
            className="first:rounded-l-full last:rounded-r-full"
            style={{
              width: `${(language.count / total) * 100}%`,
              backgroundColor: shadeFor(i),
            }}
            title={`${language.name}: ${language.count} repos`}
          />
        ))}
      </div>

      <ul className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
        {shown.map((language, i) => (
          <li key={language.name} className="flex items-center gap-2.5 font-mono text-[0.75rem] text-muted">
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: shadeFor(i) }} aria-hidden />
            {language.name}
            <span className="ml-auto text-faint">{Math.round((language.count / total) * 100)}%</span>
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
   * ghchart bakes a light #eeeeee ground into the SVG and shades every level
   * from one base colour. A neutral near-black base gives a pure grey ramp.
   * In dark mode the image is inverted in CSS, so the ground lands on
   * near-black and the busiest days come out brightest. `grayscale` is a
   * belt-and-braces guarantee that no hue survives.
   */
  const chartColor = '161616';

  return (
    <section id="github" aria-labelledby="github-title" className="section-y scroll-mt-24">
      <div className="shell">
        <SectionHeading
          index="05"
          label="Activity"
          title={
            <span id="github-title">
              Live from GitHub, <span className="text-muted">not a screenshot.</span>
            </span>
          }
          lede="Pulled from the GitHub API when you load the page, then cached for the session — not a screenshot from six months ago."
          aside={
            <a
              href={`https://github.com/${GITHUB_USERNAME}`}
              target="_blank"
              rel="noreferrer noopener"
              className="label group inline-flex items-center gap-2 transition-colors duration-400 ease-quiet hover:text-text"
            >
              <GitHubIcon className="h-3.5 w-3.5" />@{GITHUB_USERNAME}
              <ArrowUpRightIcon className="h-3.5 w-3.5 transition-transform duration-400 ease-quiet group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          }
        />

        {/* ── Contribution graph ─────────────────────────────────────────── */}
        <Reveal>
          <div className="panel overflow-x-auto p-5 sm:p-8">
            <div className="flex items-center justify-between">
              <p className="label">Contributions, last year</p>
              <p className="meta flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-text/70" aria-hidden />
                live
              </p>
            </div>
            <img
              // Third-party image service; a failure here must not break the
              // section, so it simply hides itself.
              src={`https://ghchart.rshah.org/${chartColor}/${GITHUB_USERNAME}`}
              alt={`GitHub contribution graph for ${GITHUB_USERNAME} over the last year`}
              width={663}
              height={104}
              loading="lazy"
              decoding="async"
              style={{
                filter: dark ? 'grayscale(1) invert(1)' : 'grayscale(1)',
                mixBlendMode: dark ? 'screen' : 'multiply',
              }}
              className="mt-6 h-auto w-full min-w-[34rem] opacity-80"
              onError={(event) => {
                event.currentTarget.closest('div')?.classList.add('hidden');
              }}
            />
          </div>
        </Reveal>

        {/* ── Profile stats, languages, repos ────────────────────────────── */}
        {state.status === 'loading' && (
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="panel h-36 animate-pulse" />
            ))}
            <p className="sr-only">Loading GitHub activity…</p>
          </div>
        )}

        {(state.status === 'rate-limited' || state.status === 'error') && (
          <Reveal className="mt-3">
            <div className="panel p-6 sm:p-8">
              <p className="text-base">Live repository data is unavailable right now.</p>
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
                className="group mt-6 inline-flex h-10 items-center gap-2 rounded-lg border border-hairline px-4 text-sm transition-colors duration-400 ease-quiet hover:border-strong hover:bg-light/[0.03]"
              >
                Browse the repositories on GitHub
                <ArrowUpRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </Reveal>
        )}

        {state.status === 'ready' && state.data && (
          <>
            <Reveal className="mt-3">
              <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
                <div className="panel p-5 sm:p-8">
                  <p className="label">Profile</p>
                  <dl className="mt-6 grid grid-cols-2 gap-6">
                    <div>
                      <dt className="label text-faint">Public repos</dt>
                      <dd className="mt-3 text-[2rem] font-medium leading-none tracking-[-0.04em] text-text tabular-nums">
                        {state.data.user.public_repos}
                      </dd>
                    </div>
                    <div>
                      <dt className="label text-faint">Followers</dt>
                      <dd className="mt-3 text-[2rem] font-medium leading-none tracking-[-0.04em] text-text tabular-nums">
                        {state.data.user.followers}
                      </dd>
                    </div>
                    <div className="col-span-2">
                      <dt className="label text-faint">On GitHub since</dt>
                      <dd className="mt-2 text-sm text-muted">
                        {new Date(state.data.user.created_at).toLocaleDateString(undefined, {
                          month: 'long',
                          year: 'numeric',
                        })}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="panel p-5 sm:p-8">
                  <p className="label">Languages across {state.data.repos.length} repos</p>
                  <div className="mt-5">
                    <LanguageBar languages={state.data.languages} />
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal className="mt-3">
              <ul className="grid gap-px overflow-hidden rounded-panel border border-hairline bg-[var(--border)] sm:grid-cols-2 lg:grid-cols-3">
                {topRepos(state.data.repos, 6).map((repo) => (
                  <RepoRow
                    key={repo.id}
                    repo={repo}
                    rank={Math.max(0, state.data?.languages.findIndex((l) => l.name === repo.language) ?? 0)}
                  />
                ))}
              </ul>
            </Reveal>
          </>
        )}
      </div>
    </section>
  );
}
