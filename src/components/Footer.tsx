import { Link } from 'react-router-dom';
import { LocalClock } from '@/components/LocalClock';
import { socialIconMap } from '@/components/icons';
import { nav, profile } from '@/data/portfolio';

interface Props {
  onOpenPalette: () => void;
  onOpenTerminal: () => void;
}

export function Footer({ onOpenPalette, onOpenTerminal }: Props) {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-hairline">
      <div className="shell pb-6 pt-16 sm:pt-20">
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="col-span-2 lg:col-span-1">
            <Link to="/" className="text-[0.9375rem] font-medium tracking-[-0.01em]">
              {profile.name}
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">{profile.tagline}</p>
            <LocalClock className="label mt-6 block text-faint" />
          </div>

          <nav aria-label="Footer">
            <p className="label text-faint">Index</p>
            <ul className="mt-4 space-y-2.5">
              {nav.map((item, i) => (
                <li key={item.id}>
                  <a
                    href={`/#${item.id}`}
                    className="group inline-flex items-baseline gap-3 text-sm text-muted transition-colors duration-400 ease-quiet hover:text-text"
                  >
                    <span className="meta">{String(i + 1).padStart(2, '0')}</span>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="label text-faint">Elsewhere</p>
            <ul className="mt-4 space-y-2.5">
              {profile.socials.map((social) => {
                const Icon = socialIconMap[social.icon];
                return (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target={social.href.startsWith('mailto:') ? undefined : '_blank'}
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-2.5 text-sm text-muted transition-colors duration-400 ease-quiet hover:text-text"
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {social.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <p className="label text-faint">Shortcuts</p>
            <ul className="mt-4 space-y-2.5">
              <li>
                <button
                  type="button"
                  onClick={onOpenPalette}
                  className="inline-flex items-center gap-3 text-sm text-muted transition-colors duration-400 ease-quiet hover:text-text"
                >
                  <kbd className="min-w-[2.25rem] rounded border border-hairline px-1.5 py-0.5 text-center font-mono text-[0.625rem] text-faint">
                    ⌘K
                  </kbd>
                  Command palette
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenTerminal}
                  className="inline-flex items-center gap-3 text-sm text-muted transition-colors duration-400 ease-quiet hover:text-text"
                >
                  <kbd className="min-w-[2.25rem] rounded border border-hairline px-1.5 py-0.5 text-center font-mono text-[0.625rem] text-faint">
                    `
                  </kbd>
                  Terminal
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* The wordmark, set huge and dissolving into the ground. */}
        <p
          className="pointer-events-none mt-16 select-none whitespace-nowrap text-center text-[17vw] font-medium leading-[0.85] tracking-[-0.06em] lg:text-[11.5rem]"
          style={{
            backgroundImage: 'linear-gradient(to bottom, rgb(var(--text) / 0.14), rgb(var(--text) / 0))',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
          }}
          aria-hidden
        >
          {profile.name}
        </p>

        <div className="meta flex flex-col gap-2 border-t border-hairline pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {profile.name}
          </p>
          <p>React · TypeScript · Tailwind · Three.js — deployed on Vercel</p>
        </div>
      </div>
    </footer>
  );
}
