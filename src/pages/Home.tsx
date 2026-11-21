import { Hero } from '@/sections/Hero';

interface HomeProps {
  onOpenTerminal: () => void;
  onOpenPalette: () => void;
}

export function Home(_props: HomeProps) {
  return (
    <>
      <Hero />
    </>
  );
}
