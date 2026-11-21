import { LocalClock } from '@/components/LocalClock';
import { ArrowUpRightIcon, GitHubIcon, LinkedInIcon, MailIcon } from '@/components/icons';
import { profile } from '@/data/portfolio';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { cn } from '@/lib/cn';

const iconLink =
  'grid h-8 w-8 place-items-center rounded-md text-body transition-colors duration-300 hover:text-strong';

/**
 * Bottom of the left column: GitHub, LinkedIn, copy-email, the résumé, and
 * the local time in Chennai. The email icon copies rather than launching a
 * mail client — the address is the useful thing, not the app.
 */
export function ProfileLinks({ className }: { className?: string }) {
  const copy = useCopyToClipboard();
  const github = profile.socials.find((social) => social.icon === 'github');
  const linkedin = profile.socials.find((social) => social.icon === 'linkedin');

  return (
    <div className={cn('flex flex-wrap items-center justify-between gap-x-6 gap-y-3', className)}>
      <ul className="-ml-1.5 flex items-center gap-2">
        {github && (
          <li>
            <a
              href={github.href}
              target="_blank"
              rel="noreferrer noopener"
              className={iconLink}
              aria-label="GitHub (opens in a new tab)"
              title="GitHub"
            >
              <GitHubIcon className="h-[18px] w-[18px]" />
            </a>
          </li>
        )}
        {linkedin && (
          <li>
            <a
              href={linkedin.href}
              target="_blank"
              rel="noreferrer noopener"
              className={iconLink}
              aria-label="LinkedIn (opens in a new tab)"
              title="LinkedIn"
            >
              <LinkedInIcon className="h-[18px] w-[18px]" />
            </a>
          </li>
        )}
        <li>
          <button
            type="button"
            onClick={() => void copy(profile.email, 'Email copied')}
            className={iconLink}
            aria-label={`Copy email address (${profile.email})`}
            title="Copy email"
          >
            <MailIcon className="h-[18px] w-[18px]" />
          </button>
        </li>
        <li className="ml-3">
          <a
            href={profile.resumePath}
            target="_blank"
            rel="noopener"
            className="group inline-flex items-center gap-1 text-sm font-medium text-strong"
          >
            <span className="link link-on-group">Résumé</span>
            <ArrowUpRightIcon
              className="h-3.5 w-3.5 text-body transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
              aria-hidden
            />
            <span className="sr-only">(PDF, opens in a new tab)</span>
          </a>
        </li>
      </ul>

      <LocalClock className="meta" />
    </div>
  );
}
