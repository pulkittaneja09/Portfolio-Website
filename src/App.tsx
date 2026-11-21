import { Suspense, lazy, useCallback, useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { CustomCursor } from '@/components/CustomCursor';
import { Nav } from '@/components/Nav';
import { ScrollProgress } from '@/components/ScrollProgress';
import { useGlobalShortcuts } from '@/hooks/useGlobalShortcuts';
import { whenIdle } from '@/lib/idle';
import { Home } from '@/pages/Home';
import { NotFound } from '@/pages/NotFound';
import { ProjectDetail } from '@/pages/ProjectDetail';

// Both overlays are opt-in surfaces, so they stay out of the initial bundle
// (cmdk alone is ~17KB gzipped) and load the first time one is opened.
const CommandPalette = lazy(() =>
  import('@/components/CommandPalette').then((m) => ({ default: m.CommandPalette })),
);
const TerminalOverlay = lazy(() =>
  import('@/components/TerminalOverlay').then((m) => ({ default: m.TerminalOverlay })),
);

type Overlay = 'palette' | 'terminal' | null;

export default function App() {
  const [overlay, setOverlay] = useState<Overlay>(null);
  // Once an overlay has been opened it stays mounted, so its exit animation
  // has something to animate out of.
  const [loaded, setLoaded] = useState({ palette: false, terminal: false });
  const location = useLocation();

  const openPalette = useCallback(() => {
    setLoaded((current) => ({ ...current, palette: true }));
    setOverlay('palette');
  }, []);

  const openTerminal = useCallback(() => {
    setLoaded((current) => ({ ...current, terminal: true }));
    setOverlay('terminal');
  }, []);

  const close = useCallback(() => setOverlay(null), []);

  useGlobalShortcuts({ onPalette: openPalette, onTerminal: openTerminal, onEscape: close });

  // Warm both chunks once the page is otherwise idle, so the first ⌘K is
  // instant without costing anything during load.
  useEffect(() => {
    const warm = () => {
      void import('@/components/CommandPalette');
      void import('@/components/TerminalOverlay');
    };
    return whenIdle(warm, 4000);
  }, []);

  return (
    <>
      <ScrollProgress />
      <CustomCursor />

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:border focus:border-accent focus:bg-surface focus:px-4 focus:py-2 focus:text-sm"
      >
        Skip to content
      </a>

      <Nav
        onOpenPalette={openPalette}
        onOpenTerminal={openTerminal}
        isHome={location.pathname === '/'}
      />

      <main id="main">
        <Routes>
          <Route path="/" element={<Home onOpenTerminal={openTerminal} onOpenPalette={openPalette} />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Suspense fallback={null}>
        {loaded.palette && (
          <CommandPalette open={overlay === 'palette'} onClose={close} onOpenTerminal={openTerminal} />
        )}
        {loaded.terminal && <TerminalOverlay open={overlay === 'terminal'} onClose={close} />}
      </Suspense>
    </>
  );
}
