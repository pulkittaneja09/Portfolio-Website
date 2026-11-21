import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@/components/icons';
import { projects } from '@/data/portfolio';
import { stagger } from '@/lib/stagger';

/** Same reading column as a case study, with a way back and a way forward. */
export function NotFound() {
  return (
    <main
      id="main"
      className="mx-auto flex min-h-[85vh] max-w-[46rem] flex-col justify-center px-5 py-24 sm:px-8"
    >
      <p className="enter label text-faint">Error 404</p>
      <h1
        className="enter mt-4 text-[clamp(2rem,6vw,2.75rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-strong"
        style={stagger(1)}
      >
        That page does not <em className="serif">exist</em>.
      </h1>
      <p className="enter mt-4 max-w-prose text-body" style={stagger(2)}>
        The link may be stale. Everything on this site is reachable from the home page, or with ⌘K.
      </p>

      <Link
        to="/"
        className="enter group mt-8 inline-flex w-fit items-center gap-2 font-mono text-sm text-strong"
        style={stagger(3)}
      >
        <ArrowLeftIcon
          className="h-3.5 w-3.5 text-body transition-transform duration-300 group-hover:-translate-x-0.5 group-hover:text-accent"
          aria-hidden
        />
        <span className="link link-on-group">Back to the start</span>
      </Link>

      <div className="enter mt-14 border-t border-white/[0.07] pt-6" style={stagger(4)}>
        <p className="label text-faint">Or jump to a project</p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {projects.map((project) => (
            <li key={project.slug}>
              <Link
                to={`/projects/${project.slug}`}
                className="chip transition-colors duration-300 hover:border-white/[0.16] hover:text-strong"
              >
                {project.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
