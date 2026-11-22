import { Command } from 'cmdk';
import { AnimatePresence, m } from 'framer-motion';
import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  ChatIcon,
  CopyIcon,
  DownloadIcon,
  MailIcon,
  SearchIcon,
  TerminalIcon,
  socialIconMap,
} from '@/components/icons';
import { nav, profile, projects } from '@/data/portfolio';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { scrollToTarget, scrollToTop } from '@/hooks/useLenis';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface Props {
  open: boolean;
  onClose: () => void;
  onOpenTerminal: () => void;
  onOpenAsk: () => void;
}

/** GitHub, LinkedIn, LeetCode — straight from the data, so URLs live in one place. */
const profiles = profile.socials.filter((social) => social.icon !== 'mail');

/**
 * ⌘K / Ctrl+K palette. cmdk handles filtering and roving focus; everything
 * here is wiring actions to it.
 */
export function CommandPalette({ open, onClose, onOpenTerminal, onOpenAsk }: Props) {
  const navigate = useNavigate();
  const copy = useCopyToClipboard();
  const reduced = useReducedMotion();

  // Lock the page behind the palette so the background cannot scroll away.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  const run = (action: () => void) => {
    onClose();
    // Let the overlay unmount before scrolling or navigating.
    window.setTimeout(action, 60);
  };

  const sections = useMemo(() => [{ id: 'top', label: 'Top' }, ...nav], []);

  return (
    <AnimatePresence>
      {open && (
        <m.div
          className="fixed inset-0 z-[70] flex items-start justify-center px-4 pt-[12vh] sm:pt-[16vh]"
          initial={reduced ? undefined : { opacity: 0 }}
          animate={reduced ? undefined : { opacity: 1 }}
          exit={reduced ? undefined : { opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <button
            type="button"
            className="absolute inset-0 cursor-default bg-bg/60 backdrop-blur-[2px]"
            onClick={onClose}
            aria-label="Close command palette"
            tabIndex={-1}
          />

          <m.div
            className="relative w-full max-w-xl"
            initial={reduced ? undefined : { opacity: 0, y: -8, scale: 0.985 }}
            animate={reduced ? undefined : { opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? undefined : { opacity: 0, y: -6, scale: 0.99 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <Command
              label="Command palette"
              loop
              className="glass-strong overflow-hidden rounded-xl shadow-[0_24px_64px_-24px_rgba(0,0,0,0.7)]"
            >
              <div className="flex items-center gap-3 border-b border-white/[0.07] px-4">
                <SearchIcon className="h-4 w-4 shrink-0 text-faint" />
                <Command.Input
                  autoFocus
                  placeholder="Type a command or search…"
                  className="h-14 w-full bg-transparent font-sans text-[0.9375rem] text-strong outline-none placeholder:text-faint"
                />
                <kbd className="hidden shrink-0 rounded border border-white/[0.07] px-1.5 py-0.5 font-mono text-[0.625rem] uppercase tracking-[0.06em] text-faint sm:block">
                  esc
                </kbd>
              </div>

              <Command.List
                data-lenis-prevent
                className="max-h-[min(24rem,52vh)] overflow-y-auto overscroll-contain p-2"
              >
                <Command.Empty className="px-3 py-10 text-center text-sm text-faint">
                  Nothing matches that. Try “projects” or “résumé”.
                </Command.Empty>

                <Command.Group heading="Sections" className="cmd-group">
                  {sections.map((section) => (
                    <Command.Item
                      key={section.id}
                      value={`go to ${section.label}`}
                      onSelect={() =>
                        run(() => {
                          navigate('/');
                          // A frame later, so the home route has mounted if we
                          // were navigating back to it.
                          requestAnimationFrame(() =>
                            section.id === 'top'
                              ? scrollToTop(!reduced)
                              : scrollToTarget(document.getElementById(section.id), !reduced),
                          );
                        })
                      }
                      className="cmd-item"
                    >
                      <ArrowRightIcon className="h-4 w-4 text-faint" />
                      {section.label}
                    </Command.Item>
                  ))}
                </Command.Group>

                <Command.Group heading="Projects" className="cmd-group">
                  {projects.map((project) => (
                    <Command.Item
                      key={project.slug}
                      value={`open ${project.name} ${project.tags.join(' ')}`}
                      onSelect={() => run(() => navigate(`/projects/${project.slug}`))}
                      className="cmd-item"
                    >
                      <ArrowUpRightIcon className="h-4 w-4 text-faint" />
                      <span className="truncate">{project.name}</span>
                      <span className="ml-auto hidden font-mono text-[0.625rem] text-faint sm:block">
                        {project.year}
                      </span>
                    </Command.Item>
                  ))}
                </Command.Group>

                <Command.Group heading="Actions" className="cmd-group">
                  <Command.Item
                    value="copy email address"
                    onSelect={() => run(() => void copy(profile.email, 'Email copied'))}
                    className="cmd-item"
                  >
                    <CopyIcon className="h-4 w-4 text-faint" />
                    Copy email
                    <span className="ml-auto hidden truncate font-mono text-[0.625rem] text-faint sm:block">
                      {profile.email}
                    </span>
                  </Command.Item>

                  <Command.Item
                    value="download resume cv"
                    onSelect={() =>
                      run(() => {
                        const link = document.createElement('a');
                        link.href = profile.resumePath;
                        link.download = 'Pulkit_Taneja_Resume.pdf';
                        link.click();
                      })
                    }
                    className="cmd-item"
                  >
                    <DownloadIcon className="h-4 w-4 text-faint" />
                    Download résumé
                  </Command.Item>

                  <Command.Item
                    value="ask about pulkit question chat"
                    onSelect={() => run(onOpenAsk)}
                    className="cmd-item"
                  >
                    <ChatIcon className="h-4 w-4 text-faint" />
                    Ask about Pulkit
                  </Command.Item>

                  <Command.Item
                    value="open terminal mode"
                    onSelect={() => run(onOpenTerminal)}
                    className="cmd-item"
                  >
                    <TerminalIcon className="h-4 w-4 text-faint" />
                    Open terminal
                    <kbd className="ml-auto rounded border border-white/[0.07] px-1.5 py-0.5 font-mono text-[0.625rem] text-faint">
                      `
                    </kbd>
                  </Command.Item>
                </Command.Group>

                <Command.Group heading="Elsewhere" className="cmd-group">
                  {profiles.map((social) => {
                    const Icon = socialIconMap[social.icon];
                    return (
                      <Command.Item
                        key={social.label}
                        value={`open ${social.label.toLowerCase()} profile`}
                        onSelect={() => run(() => window.open(social.href, '_blank', 'noopener'))}
                        className="cmd-item"
                      >
                        <Icon className="h-4 w-4 text-faint" />
                        {social.label}
                      </Command.Item>
                    );
                  })}
                  <Command.Item
                    value="send me an email"
                    onSelect={() =>
                      run(() => {
                        window.location.href = `mailto:${profile.email}`;
                      })
                    }
                    className="cmd-item"
                  >
                    <MailIcon className="h-4 w-4 text-faint" />
                    Send an email
                  </Command.Item>
                </Command.Group>
              </Command.List>
            </Command>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
