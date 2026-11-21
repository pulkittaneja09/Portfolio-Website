import { Footer } from '@/components/Footer';
import { Audaxity } from '@/sections/Audaxity';
import { Contact } from '@/sections/Contact';
import { Experience } from '@/sections/Experience';
import { Projects } from '@/sections/Projects';

interface HomeProps {
  onOpenTerminal: () => void;
  onOpenPalette: () => void;
}

export function Home({ onOpenTerminal, onOpenPalette }: HomeProps) {
  return (
    <>
      <Experience />
      <Projects />
      <Audaxity />
      <Contact />
      <Footer onOpenPalette={onOpenPalette} onOpenTerminal={onOpenTerminal} />
    </>
  );
}
