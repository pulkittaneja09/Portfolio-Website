import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AgentRun } from '@/components/AgentRun';
import { Identity } from '@/components/Identity';
import { MobileBar } from '@/components/MobileBar';
import { ProfileLinks } from '@/components/ProfileLinks';
import { SectionNav } from '@/components/SectionNav';
import { SiteFooter } from '@/components/SiteFooter';
import { nav } from '@/data/portfolio';
import { useActiveSection } from '@/hooks/useActiveSection';
import { scrollToTarget } from '@/hooks/useLenis';
import { About } from '@/sections/About';

import { Contact } from '@/sections/Contact';
import { Experience } from '@/sections/Experience';
import { Founder } from '@/sections/Founder';
import { Projects } from '@/sections/Projects';

const SECTION_IDS = nav.map((item) => item.id);

interface HomeProps {
  onOpenTerminal: () => void;
  onOpenPalette: () => void;
  onOpenAsk: () => void;
}

/**
 * The split layout. On desktop the left column is a sticky, full-height
 * identity rail (name, nav, the agent trace, links) and the right column
 * scrolls. Below 1024px the rail becomes an ordinary header and a thin bar
 * takes over navigation.
 */
export function Home({ onOpenTerminal, onOpenPalette, onOpenAsk }: HomeProps) {
  const active = useActiveSection(SECTION_IDS);
  const { hash } = useLocation();

  // Arriving from a case study at "/#projects": the section only exists once
  // this page has rendered, so the browser's own jump never happens.
  useEffect(() => {
    if (!hash) return;
    const frame = requestAnimationFrame(() => scrollToTarget(document.getElementById(hash.slice(1)), false));
    return () => cancelAnimationFrame(frame);
  }, [hash]);

  return (
    <>
      <MobileBar active={active} onOpenPalette={onOpenPalette} onOpenAsk={onOpenAsk} />

      <div className="mx-auto max-w-page px-5 sm:px-8 lg:px-12 xl:px-[clamp(4rem,6.6vw,6rem)]">
        {/* 48/52 between 1024 and 1279px so the one-liner still fits on two
            lines; the full 45/55 split and 96px gutters from 1280px up. */}
        <div className="lg:grid lg:grid-cols-[minmax(0,48fr)_minmax(0,52fr)] lg:gap-x-12 xl:grid-cols-[minmax(0,45fr)_minmax(0,55fr)] xl:gap-x-16">
          {/* ── Left: identity rail ─────────────────────────────────────── */}
          <header className="rail flex flex-col">
            <div>
              <Identity />
              <SectionNav active={active} className="rail-nav hidden lg:block" />
            </div>

            {/* Mobile order: header, links, then the card; desktop keeps
                identity → nav → card → links. */}
            <AgentRun className="rail-card order-3 mt-10 lg:order-none" />

            <ProfileLinks className="enter order-2 mt-8 lg:order-none lg:mt-0" />
          </header>

          {/* ── Right: the scrolling column ─────────────────────────────── */}
          <main id="main" className="pt-20 lg:pt-24">
            <About />

            <Experience />
            <Projects />
            <Founder />
            <Contact />
            <SiteFooter onOpenPalette={onOpenPalette} onOpenTerminal={onOpenTerminal} />
          </main>
        </div>
      </div>
    </>
  );
}
