import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { useParams } from 'react-router-dom';
import { ArchitectureDiagram } from '@/components/ArchitectureDiagram';
import { Reveal } from '@/components/Reveal';
import { TransitionLink } from '@/components/TransitionLink';
import { ArrowLeftIcon, ArrowRightIcon, ArrowUpRightIcon } from '@/components/icons';
import { profile, projects } from '@/data/portfolio';
import { previewSrcSet } from '@/lib/images';
import { stagger } from '@/lib/stagger';
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

/** A labelled block of the case study, with the same mono label as the home page. */
function Block({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Reveal as="section" className="mt-16">
      <h2 className="label mb-5 text-strong">{label}</h2>
      {children}
    </Reveal>
  );
}

function ExternalLink({ href, children }: { href: string; children: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="group inline-flex items-center gap-1.5 text-strong"
    >
      <span className="link link-on-group">{children}</span>
      <ArrowUpRightIcon
        className="h-3.5 w-3.5 text-body transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
        aria-hidden
      />
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}

/**
 * A project case study: one calm reading column. Facts first (result, role,
 * stack) in the same label-and-value rows as the home page, then overview,
 * architecture, highlights, the hard parts and what comes next.
 */
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
    <main id="main" className="mx-auto max-w-[46rem] px-5 pb-24 pt-12 sm:px-8 sm:pb-32 sm:pt-20">
      <TransitionLink
        to="/#projects"
        className="enter group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.1em] text-body transition-colors duration-300 hover:text-strong"
      >
        <ArrowLeftIcon
          className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-0.5"
          aria-hidden
        />
        {profile.name}
      </TransitionLink>

      <article className="mt-14 sm:mt-20">
        <header>
          <p className="enter label text-faint" style={stagger(1)}>
            {[project.year, ...project.tags].join(' · ')}
          </p>
          <h1
            className="enter mt-4 text-[clamp(2rem,6vw,2.75rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-strong"
            style={stagger(2)}
          >
            {project.name}
          </h1>
          <p className="enter mt-5 text-lg leading-relaxed text-body" style={stagger(3)}>
            {project.problem}
          </p>

          <div className="enter mt-7 flex flex-wrap gap-x-6 gap-y-2 font-mono text-sm" style={stagger(4)}>
            {project.links.demo && <ExternalLink href={project.links.demo}>Live demo</ExternalLink>}
            {project.links.repo && <ExternalLink href={project.links.repo}>Source</ExternalLink>}
            {project.links.api && <ExternalLink href={project.links.api}>API docs</ExternalLink>}
          </div>
        </header>

        {/* Facts, as label/value rows. */}
        <dl
          className="enter mt-12 divide-y divide-line/[0.06] border-y border-line/[0.06]"
          style={stagger(5)}
        >
          <div className="grid gap-1 py-4 sm:grid-cols-[27%_minmax(0,1fr)] sm:gap-6">
            <dt className="label pt-0.5 text-faint">Result</dt>
            <dd className="text-[0.9375rem] text-body">
              <span className="font-mono text-accent">{project.metric.value}</span>
              <span className="text-faint"> · </span>
              {project.metric.label}
            </dd>
          </div>
          <div className="grid gap-1 py-4 sm:grid-cols-[27%_minmax(0,1fr)] sm:gap-6">
            <dt className="label pt-0.5 text-faint">Role</dt>
            <dd className="text-[0.9375rem] leading-relaxed text-body">{project.role}</dd>
          </div>
          <div className="grid gap-2 py-4 sm:grid-cols-[27%_minmax(0,1fr)] sm:gap-6">
            <dt className="label pt-1 text-faint">Stack</dt>
            <dd>
              <ul className="flex flex-wrap gap-1.5">
                {project.stack.map((tech) => (
                  <li key={tech} className="chip">
                    {tech}
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        </dl>

        {project.preview && (
          <Reveal className="mt-12">
            <img
              src={project.preview}
              srcSet={previewSrcSet(project.preview)}
              sizes="(min-width: 768px) 736px, 100vw"
              alt={`${project.name} interface`}
              width={1024}
              height={640}
              loading="eager"
              decoding="async"
              className="vt-shot w-full rounded-xl border border-line/[0.08]"
            />
          </Reveal>
        )}

        <Block label="Overview">
          <div className="space-y-4 text-body">
            {project.detail.overview.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </div>
        </Block>

        <Block label="Architecture">
          <ArchitectureDiagram architecture={project.detail.architecture} />
        </Block>

        <Block label="What it does">
          <ul className="space-y-3">
            {project.detail.highlights.map((highlight) => (
              <li key={highlight.slice(0, 24)} className="flex gap-4 text-body">
                <span className="mt-[0.8rem] h-px w-3 shrink-0 bg-line/20" aria-hidden />
                {highlight}
              </li>
            ))}
          </ul>
        </Block>

        <Block label="What was hard">
          <ol className="divide-y divide-line/[0.06] border-y border-line/[0.06]">
            {project.detail.challenges.map((challenge, i) => (
              <li key={challenge.title} className="grid gap-1 py-5 sm:grid-cols-[27%_minmax(0,1fr)] sm:gap-6">
                <span className="font-mono text-xs text-faint">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3 className="font-medium text-strong">{challenge.title}</h3>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-body">{challenge.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </Block>

        <Block label="What I would do next">
          <ul className="space-y-2.5">
            {project.detail.next.map((item) => (
              <li key={item.slice(0, 24)} className="flex gap-4 text-body">
                <span className="font-mono text-xs leading-[1.65rem] text-faint" aria-hidden>
                  →
                </span>
                {item}
              </li>
            ))}
          </ul>
        </Block>

        {project.previewFrames && project.previewFrames.length > 0 && (
          <Block label="More screens">
            <div className="grid gap-4 sm:grid-cols-2">
              {project.previewFrames.map((frame) => (
                <img
                  key={frame}
                  src={frame}
                  srcSet={previewSrcSet(frame)}
                  sizes="(min-width: 640px) 360px, 100vw"
                  alt={`${project.name} — additional screen`}
                  width={1024}
                  height={480}
                  loading="lazy"
                  decoding="async"
                  className="w-full rounded-lg border border-line/[0.08]"
                />
              ))}
            </div>
          </Block>
        )}
      </article>

      {/* Next project */}
      <TransitionLink
        to={`/projects/${next.slug}`}
        className="group mt-24 flex items-end justify-between gap-6 border-t border-line/[0.07] pt-8"
      >
        <span>
          <span className="label block text-faint">Next project</span>
          <span className="mt-3 block text-2xl font-medium tracking-[-0.02em] text-strong transition-colors duration-300 group-hover:text-accent">
            {next.name}
          </span>
        </span>
        <ArrowRightIcon
          className="mb-1.5 h-5 w-5 shrink-0 text-body transition-[transform,color] duration-300 group-hover:translate-x-0.5 group-hover:text-accent"
          aria-hidden
        />
      </TransitionLink>
    </main>
  );
}
