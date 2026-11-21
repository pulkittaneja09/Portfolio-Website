import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArchitectureDiagram } from '@/components/ArchitectureDiagram';
import { MagneticButton } from '@/components/MagneticButton';
import { Reveal } from '@/components/Reveal';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
  GitHubIcon,
  PlayIcon,
  RocketIcon,
} from '@/components/icons';
import { profile, projects } from '@/data/portfolio';
import { previewSrcSet } from '@/lib/images';
import { NotFound } from '@/pages/NotFound';

/** Keeps the document title and description in step with the route. */
function useDocumentMeta(title: string, description: string, canonicalPath: string) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;

    const setMeta = (selector: string, attribute: string, value: string) => {
      const element = document.querySelector<HTMLMetaElement | HTMLLinkElement>(selector);
      const previous = element?.getAttribute(attribute) ?? null;
      element?.setAttribute(attribute, value);
      return () => {
        if (previous !== null) element?.setAttribute(attribute, previous);
      };
    };

    const restore = [
      setMeta('meta[name="description"]', 'content', description),
      setMeta('meta[property="og:title"]', 'content', title),
      setMeta('meta[property="og:description"]', 'content', description),
      setMeta('meta[property="og:url"]', 'content', `${profile.siteUrl}${canonicalPath}`),
      setMeta('link[rel="canonical"]', 'href', `${profile.siteUrl}${canonicalPath}`),
    ];

    return () => {
      document.title = previousTitle;
      restore.forEach((undo) => undo());
    };
  }, [title, description, canonicalPath]);
}

export function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const index = projects.findIndex((project) => project.slug === slug);
  const project = index >= 0 ? projects[index] : undefined;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [slug]);

  useDocumentMeta(
    project ? `${project.name} — Pulkit Taneja` : 'Project not found — Pulkit Taneja',
    project?.problem ?? 'Project not found.',
    `/projects/${slug ?? ''}`,
  );

  if (!project) return <NotFound />;

  const next = projects[(index + 1) % projects.length];

  return (
    <article className="pb-24 pt-28 sm:pt-32">
      <div className="shell">
        <Link
          to="/#work"
          className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-faint transition-colors hover:text-text"
        >
          <ArrowLeftIcon className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
          All work
        </Link>

        {/* ── Header ───────────────────────────────────────────────────────── */}
        <header className="mt-8 border-b border-hairline pb-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="chip border-strong text-text">{project.year}</span>
            {project.tags.map((tag) => (
              <span key={tag} className="chip">
                {tag}
              </span>
            ))}
          </div>

          <h1 className="mt-5 max-w-3xl text-display-lg">{project.name}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">{project.problem}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            {project.links.demo && (
              <MagneticButton
                href={project.links.demo}
                variant="solid"
                target="_blank"
                rel="noreferrer noopener"
              >
                <PlayIcon className="h-4 w-4" />
                Live demo
              </MagneticButton>
            )}
            {project.links.repo && (
              <MagneticButton
                href={project.links.repo}
                variant="outline"
                target="_blank"
                rel="noreferrer noopener"
              >
                <GitHubIcon className="h-4 w-4" />
                Source
              </MagneticButton>
            )}
            {project.links.api && (
              <MagneticButton
                href={project.links.api}
                variant="ghost"
                target="_blank"
                rel="noreferrer noopener"
              >
                <ArrowUpRightIcon className="h-4 w-4" />
                API
              </MagneticButton>
            )}
          </div>
        </header>

        <div className="grid gap-12 py-12 lg:grid-cols-[minmax(0,1fr)_17rem] lg:gap-16">
          {/* ── Body ───────────────────────────────────────────────────────── */}
          <div className="min-w-0">
            {project.preview && (
              <Reveal className="mb-12">
                <img
                  src={project.preview}
                  srcSet={previewSrcSet(project.preview)}
                  sizes="(min-width: 1024px) 60vw, 100vw"
                  alt={`${project.name} interface`}
                  width={1024}
                  height={492}
                  loading="eager"
                  decoding="async"
                  className="w-full rounded-panel border border-hairline"
                />
              </Reveal>
            )}

            <Reveal>
              <h2 className="label">Overview</h2>
              <div className="mt-4 space-y-4 text-[1.0625rem] leading-relaxed text-text/85">
                {project.detail.overview.map((paragraph) => (
                  <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                ))}
              </div>
            </Reveal>

            <Reveal className="mt-14">
              <h2 className="label">Architecture</h2>
              <div className="mt-4">
                <ArchitectureDiagram architecture={project.detail.architecture} />
              </div>
            </Reveal>

            <Reveal className="mt-14">
              <h2 className="label">What it does</h2>
              <ul className="mt-4 space-y-3">
                {project.detail.highlights.map((highlight) => (
                  <li
                    key={highlight.slice(0, 24)}
                    className="flex gap-3 text-[0.9375rem] leading-relaxed text-text/85"
                  >
                    <span className="mt-[0.45rem] h-1 w-3 shrink-0 bg-text" aria-hidden />
                    {highlight}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal className="mt-14">
              <h2 className="label">What was hard</h2>
              <div className="mt-4 space-y-5">
                {project.detail.challenges.map((challenge) => (
                  <div key={challenge.title} className="panel p-5">
                    <h3 className=" text-base">{challenge.title}</h3>
                    <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">{challenge.body}</p>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal className="mt-14">
              <h2 className="label">What I would do next</h2>
              <ul className="mt-4 space-y-2.5">
                {project.detail.next.map((item) => (
                  <li key={item.slice(0, 24)} className="flex gap-3 text-[0.9375rem] text-muted">
                    <RocketIcon className="mt-0.5 h-4 w-4 shrink-0 text-text" />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>

            {project.previewFrames && project.previewFrames.length > 0 && (
              <Reveal className="mt-14">
                <h2 className="label">More screens</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {project.previewFrames.map((frame) => (
                    <img
                      key={frame}
                      src={frame}
                      srcSet={previewSrcSet(frame)}
                      sizes="(min-width: 640px) 30vw, 100vw"
                      alt={`${project.name} — additional screen`}
                      width={1024}
                      height={480}
                      loading="lazy"
                      decoding="async"
                      className="w-full rounded-lg border border-hairline"
                    />
                  ))}
                </div>
              </Reveal>
            )}
          </div>

          {/* ── Sidebar ────────────────────────────────────────────────────── */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="panel p-5">
              <p className="label">Result</p>
              <p className="mt-2 text-2xl text-text">{project.metric.value}</p>
              <p className="mt-1 text-sm text-muted">{project.metric.label}</p>
            </div>

            <div className="mt-5 panel p-5">
              <p className="label">My role</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">{project.role}</p>
            </div>

            <div className="mt-5 panel p-5">
              <p className="label">Stack</p>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {project.stack.map((tech) => (
                  <li key={tech} className="chip">
                    {tech}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>

        {/* ── Next project ─────────────────────────────────────────────────── */}
        <Link
          to={`/projects/${next.slug}`}
          className="group flex flex-col gap-2 border-t border-hairline pt-8 transition-colors hover:border-strong sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p className="label">Next project</p>
            <p className="mt-1.5 text-xl transition-colors group-hover:text-text">
              {next.name}
            </p>
          </div>
          <ArrowRightIcon className="h-5 w-5 text-faint transition-all group-hover:translate-x-1.5 group-hover:text-text" />
        </Link>
      </div>
    </article>
  );
}
