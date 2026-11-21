import { profile } from '@/data/portfolio';
import { stagger } from '@/lib/stagger';

/**
 * Name, title, one-liner and availability: the top of the left column on
 * desktop and the page header on mobile.
 *
 * The name never wraps. It is sized in viewport units with a floor and a
 * ceiling, and `whitespace-nowrap` guarantees one line from 360px up.
 */
export function Identity() {
  return (
    <div>
      <h1 className="enter whitespace-nowrap text-[clamp(2.5rem,11vw,3.25rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-strong lg:text-[clamp(2.5rem,4.6vw,3.75rem)]">
        {profile.name}
      </h1>

      <p
        className="identity-gap-sm enter mt-3 text-xl font-medium leading-snug tracking-[-0.012em] text-title"
        style={stagger(1)}
      >
        {profile.title}
      </p>

      <p
        className="identity-gap-md enter mt-4 max-w-[27.5rem] text-body lg:text-[0.9375rem] xl:text-base"
        style={stagger(2)}
      >
        {profile.tagline}
      </p>

      <p
        className="identity-gap-lg enter mt-6 flex items-center gap-2.5 font-mono text-xs tracking-[0.02em] text-body"
        style={stagger(3)}
      >
        <span className="relative flex h-1.5 w-1.5 shrink-0" aria-hidden>
          <span className="pulse-soft absolute inset-0 rounded-full bg-accent" />
        </span>
        {profile.availability}
      </p>
    </div>
  );
}
