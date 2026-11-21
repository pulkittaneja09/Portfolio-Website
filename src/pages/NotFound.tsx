import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@/components/icons';
import { projects } from '@/data/portfolio';

export function NotFound() {
  return (
    <section className="shell flex min-h-[80vh] flex-col justify-center py-32">
      <p className="eyebrow">Error 404</p>
      <h1 className="mt-4 font-display text-display-lg">That page does not exist.</h1>
      <p className="mt-4 max-w-md text-muted">
        The link may be stale. Everything on this site is reachable from the home page, or with ⌘K.
      </p>

      <Link
        to="/"
        className="group mt-8 inline-flex w-fit items-center gap-2 rounded-full border border-accent/55 px-5 py-2.5 text-sm transition-colors hover:bg-accent/[0.07]"
      >
        <ArrowLeftIcon className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Back to the start
      </Link>

      <div className="mt-14 border-t border-line pt-6">
        <p className="eyebrow">Or jump to a project</p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {projects.map((project) => (
            <li key={project.slug}>
              <Link to={`/projects/${project.slug}`} className="chip hover:border-accent/50 hover:text-ink">
                {project.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
