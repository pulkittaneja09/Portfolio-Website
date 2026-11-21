import { Link } from 'react-router-dom';
import { CommandIcon, TerminalIcon, socialIconMap } from '@/components/icons';
import { nav, profile } from '@/data/portfolio';

interface Props {
  onOpenPalette: () => void;
  onOpenTerminal: () => void;
}

export function Footer({ onOpenPalette, onOpenTerminal }: Props) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-hairline bg-surface">
      <div className="shell py-12">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <Link to="/" className=" text-lg">
              {profile.name}
            </Link>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">{profile.tagline}</p>

            <ul className="mt-5 flex flex-wrap gap-2">
              {profile.socials.map((social) => {
                const Icon = socialIconMap[social.icon];
                return (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target={social.href.startsWith('mailto:') ? undefined : '_blank'}
                      rel="noreferrer noopener"
                      className="grid h-9 w-9 place-items-center rounded-full border border-hairline text-muted transition-colors hover:border-strong hover:text-text"
                      aria-label={social.label}
                      title={social.label}
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          <nav aria-label="Footer" className="lg:text-right">
            <ul className="flex flex-wrap gap-x-5 gap-y-2 lg:justify-end">
              {nav.map((item) => (
                <li key={item.id}>
                  <a href={`/#${item.id}`} className="text-sm text-muted transition-colors hover:text-text">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-5 flex flex-wrap gap-2 lg:justify-end">
              <button
                type="button"
                onClick={onOpenPalette}
                className="inline-flex items-center gap-2 rounded-full border border-hairline px-3 py-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-muted transition-colors hover:border-strong hover:text-text"
              >
                <CommandIcon className="h-3.5 w-3.5" />
                ⌘K palette
              </button>
              <button
                type="button"
                onClick={onOpenTerminal}
                className="inline-flex items-center gap-2 rounded-full border border-hairline px-3 py-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-muted transition-colors hover:border-strong hover:text-text"
              >
                <TerminalIcon className="h-3.5 w-3.5" />
                Terminal
              </button>
            </div>
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-hairline pt-6 font-mono text-[0.6875rem] text-faint sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {profile.name} · {profile.location}
          </p>
          <p>Built with React, TypeScript, Tailwind and Three.js. Deployed on Vercel.</p>
        </div>
      </div>
    </footer>
  );
}
