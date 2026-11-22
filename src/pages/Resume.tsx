import { useEffect } from 'react';
import { profile } from '@/data/portfolio';

/**
 * /resume is a clean, shareable URL for the PDF. Vercel redirects it before
 * the app loads (vercel.json); this route covers the dev server and any host
 * without that redirect.
 */
export function Resume() {
  useEffect(() => {
    window.location.replace(profile.resumePath);
  }, []);

  return (
    <main id="main" className="mx-auto max-w-[46rem] px-5 py-24 sm:px-8">
      <p className="meta">
        Opening the résumé…{' '}
        <a href={profile.resumePath} className="link text-strong">
          Open the PDF
        </a>
      </p>
    </main>
  );
}
