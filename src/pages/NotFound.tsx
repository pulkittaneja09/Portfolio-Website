import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@/components/icons';
import { projects } from '@/data/portfolio';

export function NotFound() {
  return (
    <main id="main">
      <section className="shell flex min-h-[80vh] flex-col justify-center py-32">
        <p className="label">Error 404</p>
        <h1 className="mt-4 text-display-lg">That page does not exist.</h1>
        <p className="mt-4 max-w-md text-body">
          The link may be stale. Everything on this site is reachable from the home page, or with ⌘K.
        </p>

        <Link
          to="/"
          className="group mt-8 inline-flex w-fit items-center gap-2 rounded-full border border-white/[0.14] px-5 py-2.5 text-sm transition-colors hover:bg-strong/[0.07]"
        >
          <ArrowLeftIcon className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to the start
        </Link>

        <div className="mt-14 border-t border-white/[0.07] pt-6">
          <p className="label">Or jump to a project</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {projects.map((project) => (
              <li key={project.slug}>
                <Link to={`/projects/${project.slug}`} className="chip hover:border-white/[0.14] hover:text-strong">
                  {project.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
