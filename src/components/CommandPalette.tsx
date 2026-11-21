import { Command } from 'cmdk';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowUpRightIcon,
  CopyIcon,
  DownloadIcon,
  GitHubIcon,
  LinkedInIcon,
  MailIcon,
  MoonIcon,
  PlayIcon,
  SunIcon,
  TerminalIcon,
} from '@/components/icons';
import { nav, profile, projects } from '@/data/portfolio';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useTheme } from '@/hooks/useTheme';

interface Props {
  open: boolean;
  onClose: () => void;
  onOpenTerminal: () => void;
}

/**
 * ⌘K / Ctrl+K palette. cmdk handles filtering and roving focus; everything
 * here is wiring actions to it.
 */
export function CommandPalette({ open, onClose, onOpenTerminal }: Props) {
  const navigate = useNavigate();
  const copy = useCopyToClipboard();
  const { theme, toggle } = useTheme();
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

  const sections = useMemo(
    () => [{ id: 'hero', label: 'Top' }, ...nav],
    [],
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-start justify-center px-4 pt-[12vh] sm:pt-[16vh]"
          initial={reduced ? undefined : { opacity: 0 }}
          animate={reduced ? undefined : { opacity: 1 }}
          exit={reduced ? undefined : { opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <button
            type="button"
            className="absolute inset-0 cursor-default bg-bg/75 backdrop-blur-md"
            onClick={onClose}
            aria-label="Close command palette"
            tabIndex={-1}
          />

          <motion.div
            className="relative w-full max-w-xl"
            initial={reduced ? undefined : { opacity: 0, y: -10, scale: 0.985 }}
            animate={reduced ? undefined : { opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? undefined : { opacity: 0, y: -8, scale: 0.99 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            <Command
              label="Command palette"
              loop
              className="overflow-hidden rounded-2xl border border-line bg-surface/95 shadow-lift backdrop-blur-xl"
            >
              <div className="flex items-center gap-3 border-b border-line px-4">
                <span className="font-mono text-sm text-accent" aria-hidden>
                  ❯
                </span>
                <Command.Input
                  autoFocus
                  placeholder="Jump to a section, open a project, copy my email…"
                  className="h-14 w-full bg-transparent font-sans text-[0.9375rem] text-ink outline-none placeholder:text-faint"
                />
                <kbd className="hidden shrink-0 rounded border border-line bg-elevated px-1.5 py-0.5 font-mono text-[0.625rem] text-faint sm:block">
                  esc
                </kbd>
              </div>

              <Command.List className="max-h-[min(24rem,52vh)] overflow-y-auto overscroll-contain p-2">
                <Command.Empty className="px-3 py-8 text-center font-mono text-xs text-faint">
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
                          document
                            .getElementById(section.id)
                            ?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
                        })
                      }
                      className="cmd-item"
                    >
                      <ArrowUpRightIcon className="h-4 w-4 text-faint" />
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
                      <PlayIcon className="h-4 w-4 text-faint" />
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
                    value="open terminal mode"
                    onSelect={() => run(onOpenTerminal)}
                    className="cmd-item"
                  >
                    <TerminalIcon className="h-4 w-4 text-faint" />
                    Open terminal
                    <kbd className="ml-auto rounded border border-line bg-elevated px-1.5 py-0.5 font-mono text-[0.625rem] text-faint">
                      `
                    </kbd>
                  </Command.Item>

                  <Command.Item
                    value={`toggle ${theme === 'dark' ? 'light' : 'dark'} theme`}
                    onSelect={() => run(toggle)}
                    className="cmd-item"
                  >
                    {theme === 'dark' ? (
                      <SunIcon className="h-4 w-4 text-faint" />
                    ) : (
                      <MoonIcon className="h-4 w-4 text-faint" />
                    )}
                    Switch to {theme === 'dark' ? 'light' : 'dark'} theme
                  </Command.Item>
                </Command.Group>

                <Command.Group heading="Elsewhere" className="cmd-group">
                  <Command.Item
                    value="open github profile"
                    onSelect={() => run(() => window.open(`https://github.com/pulkittaneja09`, '_blank', 'noopener'))}
                    className="cmd-item"
                  >
                    <GitHubIcon className="h-4 w-4 text-faint" />
                    GitHub
                  </Command.Item>
                  <Command.Item
                    value="open linkedin profile"
                    onSelect={() =>
                      run(() =>
                        window.open('https://linkedin.com/in/pulkit-taneja-627437366', '_blank', 'noopener'),
                      )
                    }
                    className="cmd-item"
                  >
                    <LinkedInIcon className="h-4 w-4 text-faint" />
                    LinkedIn
                  </Command.Item>
                  <Command.Item
                    value="send me an email"
                    onSelect={() => run(() => { window.location.href = `mailto:${profile.email}`; })}
                    className="cmd-item"
                  >
                    <MailIcon className="h-4 w-4 text-faint" />
                    Send an email
                  </Command.Item>
                </Command.Group>
              </Command.List>
            </Command>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
