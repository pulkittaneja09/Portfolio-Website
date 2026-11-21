import { useCallback, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { CommandPalette } from '@/components/CommandPalette';
import { CustomCursor } from '@/components/CustomCursor';
import { Nav } from '@/components/Nav';
import { ScrollProgress } from '@/components/ScrollProgress';
import { TerminalOverlay } from '@/components/TerminalOverlay';
import { useGlobalShortcuts } from '@/hooks/useGlobalShortcuts';
import { Home } from '@/pages/Home';
import { NotFound } from '@/pages/NotFound';
import { ProjectDetail } from '@/pages/ProjectDetail';

type Overlay = 'palette' | 'terminal' | null;

export default function App() {
  const [overlay, setOverlay] = useState<Overlay>(null);
  const location = useLocation();

  const openPalette = useCallback(() => setOverlay('palette'), []);
  const openTerminal = useCallback(() => setOverlay('terminal'), []);
  const close = useCallback(() => setOverlay(null), []);

  useGlobalShortcuts({ onPalette: openPalette, onTerminal: openTerminal, onEscape: close });

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

      <CommandPalette open={overlay === 'palette'} onClose={close} onOpenTerminal={openTerminal} />
      <TerminalOverlay open={overlay === 'terminal'} onClose={close} />
    </>
  );
}
