import { lazy } from 'react';
import { DeferredSection } from '@/components/DeferredSection';
import { Footer } from '@/components/Footer';
import { useGitHub } from '@/hooks/useGitHub';
import { Audaxity } from '@/sections/Audaxity';
import { Contact } from '@/sections/Contact';
import { Experience } from '@/sections/Experience';
import { GitHubActivity } from '@/sections/GitHubActivity';
import { Hero } from '@/sections/Hero';
import { ProofBar } from '@/sections/ProofBar';
import { Projects } from '@/sections/Projects';

// The stack grid inlines ~30 brand glyphs across five sub-grids. Mounting it
// during load cost more in style recalculation than in bytes, so it waits
// until the reader is heading toward it.
const Stack = lazy(() => import('@/sections/Stack'));

interface HomeProps {
  onOpenTerminal: () => void;
  onOpenPalette: () => void;
}

export function Home({ onOpenTerminal, onOpenPalette }: HomeProps) {
  // One fetch, shared by the proof bar and the GitHub section.
  const github = useGitHub();

  return (
    <>
      <Hero />
      <ProofBar publicRepos={github.data?.user.public_repos} />
      <Projects />
      <Experience />
      <Audaxity />

      <DeferredSection id="stack" minHeight="56rem">
        <Stack />
      </DeferredSection>

      <GitHubActivity state={github} />
      <Contact />
      <Footer onOpenPalette={onOpenPalette} onOpenTerminal={onOpenTerminal} />
    </>
  );
}
