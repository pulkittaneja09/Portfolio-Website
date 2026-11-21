import { Suspense, lazy } from 'react';
import { Footer } from '@/components/Footer';
import { useGitHub } from '@/hooks/useGitHub';
import { Audaxity } from '@/sections/Audaxity';
import { Contact } from '@/sections/Contact';
import { Experience } from '@/sections/Experience';
import { GitHubActivity } from '@/sections/GitHubActivity';
import { Hero } from '@/sections/Hero';
import { ProofBar } from '@/sections/ProofBar';
import { Projects } from '@/sections/Projects';

// The stack grid carries ~40KB of inlined brand paths. It sits well below the
// fold, so it loads on its own rather than in the initial bundle.
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

      {/* min-height matches the loaded section closely enough to avoid a jump. */}
      <Suspense fallback={<div className="min-h-[52rem]" aria-hidden />}>
        <Stack />
      </Suspense>

      <GitHubActivity state={github} />
      <Contact />
      <Footer onOpenPalette={onOpenPalette} onOpenTerminal={onOpenTerminal} />
    </>
  );
}
