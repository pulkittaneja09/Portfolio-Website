import { LocalClock } from '@/components/LocalClock';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ArrowUpRightIcon, MailIcon, socialIconMap } from '@/components/icons';
import { profile } from '@/data/portfolio';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { useMagnetic } from '@/hooks/useMagnetic';
import { cn } from '@/lib/cn';

const iconLink =
  'grid h-8 w-8 place-items-center rounded-md text-body transition-colors duration-300 hover:text-strong';

/** Profiles shown as icons, in this order. Email gets its own copy button. */
const ICON_PROFILES = ['github', 'linkedin', 'leetcode'] as const;

/**
 * Bottom of the left column: GitHub, LinkedIn, LeetCode, copy-email, the
 * theme toggle, the résumé, and the local time in Chennai. The email icon copies rather than
 * launching a mail client — the address is the useful thing, not the app.
 */
export function ProfileLinks({ className }: { className?: string }) {
  const copy = useCopyToClipboard();
  const resumeRef = useMagnetic<HTMLAnchorElement>();
  const links = ICON_PROFILES.flatMap((icon) => profile.socials.filter((social) => social.icon === icon));

  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-between gap-x-6 gap-y-3 lg:gap-x-4 xl:gap-x-6',
        className,
      )}
    >
      <ul className="-ml-1.5 flex items-center gap-2 lg:gap-1 xl:gap-2">
        {links.map((social) => {
          const Icon = socialIconMap[social.icon];
          return (
            <li key={social.label}>
              <a
                href={social.href}
                target="_blank"
                rel="noreferrer noopener"
                className={iconLink}
                aria-label={`${social.label} (opens in a new tab)`}
                title={social.label}
              >
                <Icon className="h-[18px] w-[18px]" />
              </a>
            </li>
          );
        })}
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
        {/* Phones get the toggle in the top bar instead. */}
        <li className="hidden lg:block">
          <ThemeToggle />
        </li>
        <li className="ml-3 lg:ml-1.5 xl:ml-2">
          <a
            ref={resumeRef}
            href={profile.resumePath}
            target="_blank"
            rel="noopener"
            className="cta cta-quiet"
          >
            Résumé
            <ArrowUpRightIcon className="cta-arrow h-3.5 w-3.5" aria-hidden />
            <span className="sr-only">(PDF, opens in a new tab)</span>
          </a>
        </li>
      </ul>

      <LocalClock className="meta" />
    </div>
  );
}
