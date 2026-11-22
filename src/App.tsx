import { Suspense, lazy, useCallback, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { CursorSpotlight } from '@/components/CursorSpotlight';
import { useGlobalShortcuts } from '@/hooks/useGlobalShortcuts';
import { useLenis } from '@/hooks/useLenis';
import { whenIdle } from '@/lib/idle';
import { followSystemTheme } from '@/lib/theme';
import { Home } from '@/pages/Home';
import { NotFound } from '@/pages/NotFound';
import { Palette } from '@/pages/Palette';
import { ProjectDetail } from '@/pages/ProjectDetail';
import { Resume } from '@/pages/Resume';
import { Uses } from '@/pages/Uses';

// Both overlays are opt-in surfaces, so they stay out of the initial bundle
// (cmdk alone is ~17KB gzipped) and load the first time one is opened.
const CommandPalette = lazy(() =>
  import('@/components/CommandPalette').then((m) => ({ default: m.CommandPalette })),
);
const TerminalOverlay = lazy(() =>
  import('@/components/TerminalOverlay').then((m) => ({ default: m.TerminalOverlay })),
);
const AskWidget = lazy(() => import('@/components/AskWidget').then((m) => ({ default: m.AskWidget })));

type Overlay = 'palette' | 'terminal' | null;

export default function App() {
  const [overlay, setOverlay] = useState<Overlay>(null);
  const [widgetReady, setWidgetReady] = useState(false);
  const [askOpen, setAskOpen] = useState(false);
  // Once an overlay has been opened it stays mounted, so its exit animation
  // has something to animate out of.
  const [loaded, setLoaded] = useState({ palette: false, terminal: false });

  const openPalette = useCallback(() => {
    setLoaded((current) => ({ ...current, palette: true }));
    setOverlay('palette');
  }, []);

  const openTerminal = useCallback(() => {
    setLoaded((current) => ({ ...current, terminal: true }));
    setOverlay('terminal');
  }, []);

  const close = useCallback(() => setOverlay(null), []);

  // The Ask panel can be opened before its chunk has warmed (from the phone
  // top bar or the palette), so opening it also mounts it.
  const openAsk = useCallback(() => {
    setWidgetReady(true);
    setAskOpen(true);
  }, []);

  useLenis();
  // Until the visitor picks a theme, track the system setting live.
  useEffect(() => followSystemTheme(), []);
  useGlobalShortcuts({ onPalette: openPalette, onTerminal: openTerminal, onEscape: close });

  // Warm both chunks once the page is otherwise idle, so the first ⌘K is
  // instant without costing anything during load.
  useEffect(() => {
    const warm = () => {
      void import('@/components/CommandPalette');
      void import('@/components/TerminalOverlay');
      setWidgetReady(true);
    };
    return whenIdle(warm, 4000);
  }, []);

  return (
    <>
      <CursorSpotlight />

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:border focus:border-line/[0.14] focus:bg-bg focus:px-4 focus:py-2 focus:text-sm focus:text-strong"
      >
        Skip to content
      </a>

      {/* Each page renders its own <main id="main">: on the home page it is
          the right-hand column, beside the identity rail. */}
      <Routes>
        <Route
          path="/"
          element={<Home onOpenTerminal={openTerminal} onOpenPalette={openPalette} onOpenAsk={openAsk} />}
        />
        <Route path="/projects/:slug" element={<ProjectDetail />} />
        <Route path="/resume" element={<Resume />} />
        <Route path="/uses" element={<Uses />} />
        <Route path="/palette" element={<Palette />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Suspense fallback={null}>
        {widgetReady && <AskWidget open={askOpen} onOpenChange={setAskOpen} />}
      </Suspense>

      <Suspense fallback={null}>
        {loaded.palette && (
          <CommandPalette
            open={overlay === 'palette'}
            onClose={close}
            onOpenTerminal={openTerminal}
            onOpenAsk={openAsk}
          />
        )}
        {loaded.terminal && <TerminalOverlay open={overlay === 'terminal'} onClose={close} />}
      </Suspense>
    </>
  );
}
