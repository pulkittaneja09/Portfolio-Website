import { Hero } from '@/sections/Hero';
import { ProofBar } from '@/sections/ProofBar';
import { Projects } from '@/sections/Projects';
import { useGitHub } from '@/hooks/useGitHub';

interface HomeProps {
  onOpenTerminal: () => void;
  onOpenPalette: () => void;
}

export function Home(_props: HomeProps) {
  // One fetch, shared by the proof bar and the GitHub section.
  const github = useGitHub();

  return (
    <>
      <Hero />
      <ProofBar publicRepos={github.data?.user.public_repos} />
      <Projects />
    </>
  );
}
